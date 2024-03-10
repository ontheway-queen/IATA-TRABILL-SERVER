import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';

class DeleteAgentProfile extends AbstractServices {
  constructor() {
    super();
  }

  public deleteAgentProfile = async (req: Request) => {
    const { agent_deleted_by } = req.body as { agent_deleted_by: number };
    const agentId = req.params.id as string;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.agentProfileModel(req, trx);

      // const agnetTransactions = await conn.getAgentTransactions(agentId);

/*       if (agnetTransactions[0]) {
        throw new CustomError(
          "Agent have some transactions you can't delete the agent",
          400,
          'Bad Request'
        );
      } */

      await conn.deleteAgentProfile(agentId, agent_deleted_by);

      const message = `Agent profile has been deleted`;
      await this.insertAudit(
        req,
        'delete',
        message,
        agent_deleted_by,
        'ACCOUNTS'
      );

      return {
        success: true,
        message: 'Delete agent profile successfully',
      };
    });
  };
}
export default DeleteAgentProfile;
