import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import {
  AgentImagesTypes,
  IAgentProfileReqBody,
} from '../../Type/agent_profile.interfaces';

class EditAgnetProfile extends AbstractServices {
  constructor() {
    super();
  }
  private RecruitContainer: string = 'recruitmentcon';

  public editAgentProfile = async (req: Request) => {
    const body = req.body as IAgentProfileReqBody;

    const imageList = req.imgUrl as string[];

    const agentId = req.params.id as string;

    const initialMergedImageObject = {
      agent_image_copy: '',
      agent_nid_front: '',
      agent_nid_back: '',
    };

    const { agent_image_copy, agent_nid_front, agent_nid_back, ...othersInfo } =
      body;

    const mergedImageObject: AgentImagesTypes = imageList.reduce(
      (acc, image) => Object.assign(acc, image),
      initialMergedImageObject
    );

    const updatedDataFromBody = {
      agent_image_copy: mergedImageObject.agent_image_copy || agent_image_copy,
      agent_nid_front: mergedImageObject.agent_nid_front || agent_nid_front,
      agent_nid_back: mergedImageObject.agent_nid_back || agent_nid_back,
    };

    const AgentDataWithImage = {
      ...othersInfo,
      ...updatedDataFromBody,
    };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.agentProfileModel(req, trx);

      if (mergedImageObject?.agent_image_copy) {
        const ImgURL = await conn.getPreviousImage(agentId, 'agent_image_copy');

        if (ImgURL) {
          await this.deleteFile.delete_image(
            ImgURL as string,
            this.RecruitContainer
          );
        }
      }

      if (mergedImageObject?.agent_nid_front) {
        const ImgURL = await conn.getPreviousImage(agentId, 'agent_nid_front');
        if (ImgURL) {
          await this.deleteFile.delete_image(
            ImgURL as string,
            this.RecruitContainer
          );
        }
      }

      if (mergedImageObject?.agent_nid_back) {
        const ImgURL = await conn.getPreviousImage(agentId, 'agent_nid_back');
        if (ImgURL) {
          await this.deleteFile.delete_image(
            ImgURL as string,
            this.RecruitContainer
          );
        }
      }

      await conn.editAgentProfile(agentId, AgentDataWithImage);

      const message = `Agent profile -${body.agent_name}- has been updated`;
      await this.insertAudit(
        req,
        'update',
        message,
        body.agent_updated_by as number,
        'ACCOUNTS'
      );
      return {
        success: true,
        message: 'Agent profile updated successfully',
      };
    });
  };
}
export default EditAgnetProfile;
