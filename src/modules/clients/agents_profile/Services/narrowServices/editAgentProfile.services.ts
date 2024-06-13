import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { IAgentProfileReqBody } from '../../Type/agent_profile.interfaces';

class EditAgnetProfile extends AbstractServices {
  constructor() {
    super();
  }

  public editAgentProfile = async (req: Request) => {
    const agentId = req.params.id as string;
    const body = req.body as IAgentProfileReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.agentProfileModel(req, trx);

      const files = req.files as Express.Multer.File[] | [];

      const { agent_image_copy, agent_nid_back, agent_nid_front } =
        await conn.getPrevImages(agentId);

      if (files && files.length) {
        files.map(async (item) => {
          if (item.fieldname === 'agent_image_copy') {
            body.agent_image_copy = item.filename;

            agent_image_copy &&
              (await this.manageFile.deleteFromCloud([agent_image_copy]));
          }
          if (item.fieldname === 'agent_nid_front') {
            body.agent_nid_front = item.filename;
            agent_nid_front &&
              (await this.manageFile.deleteFromCloud([agent_nid_front]));
          }
          if (item.fieldname === 'agent_nid_back') {
            body.agent_nid_back = item.filename;
            agent_nid_back &&
              (await this.manageFile.deleteFromCloud([agent_nid_back]));
          }
        });
      }

      await conn.editAgentProfile(agentId, body);

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
