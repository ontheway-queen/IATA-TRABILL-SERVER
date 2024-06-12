import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { IAgentProfileReqBody } from '../../Type/agent_profile.interfaces';

class CreateAgentProfile extends AbstractServices {
  constructor() {
    super();
  }

  public createAgentProfile = async (req: Request) => {
    const data = req.body as IAgentProfileReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.agentProfileModel(req, trx);

      const files = req.files as Express.Multer.File[] | [];

      if (files && files.length) {
        files.map((item) => {
          if (item.fieldname === 'agent_image_copy') {
            data.agent_image_copy = item.filename;
          }
          if (item.fieldname === 'agent_nid_front') {
            data.agent_nid_front = item.filename;
          }
          if (item.fieldname === 'agent_nid_back') {
            data.agent_nid_back = item.filename;
          }
        });
      }

      const agent_id = await conn.createAgentProfile(data);

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
