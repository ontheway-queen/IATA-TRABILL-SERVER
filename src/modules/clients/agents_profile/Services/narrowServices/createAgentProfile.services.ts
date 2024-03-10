import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { IAgentProfileReqBody } from '../../Type/agent_profile.interfaces';

class CreateAgentProfile extends AbstractServices {
  constructor() {
    super();
  }

  public createAgentProfile = async (req: Request) => {
    const data = req.body as IAgentProfileReqBody;

    const imageList = req.imgUrl as string[];

    const { agent_image_copy, agent_nid_front, agent_nid_back, ...othersInfo } =
      data;

    const mergedImageObject = imageList.reduce(
      (acc, image) => Object.assign(acc, image),
      {}
    );

    const agentInfo = { ...othersInfo, ...mergedImageObject };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.agentProfileModel(req, trx);

      const agent_id = await conn.createAgentProfile(agentInfo);

      // insert audit

      const message = `Agent profile -${data.agent_name}- has been created`;
      await this.insertAudit(
        req,
        'create',
        message,
        data.agent_created_by as number,
        'ACCOUNTS'
      );
      return {
        success: true,
        message: 'Create agent profile successfully',
        data: agent_id[0],
      };
    });
  };
}
export default CreateAgentProfile;
