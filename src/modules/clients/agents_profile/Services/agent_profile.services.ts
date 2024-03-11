import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { idType } from '../../../../common/types/common.types';
import CreateAgentProfile from './narrowServices/createAgentProfile.services';
import DeleteAgentProfile from './narrowServices/deleteAgentProfile.services';
import EditAgnetProfile from './narrowServices/editAgentProfile.services';
import IncentiveIncomeAgentProfile from './narrowServices/incentiveIncomeAgentProfile.services';
import fetch from 'node-fetch';

class AgentProfileServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * update agent activity status
   */
  public updateAgentsStatus = async (req: Request) => {
    const agent_id = req.params.agent_id as string;
    const { status, created_by } = req.body as {
      status: 'active' | 'inactive';
      created_by: number;
    };

    const conn = this.models.agentProfileModel(req);

    const data = await conn.updateAgentsStatus(agent_id, status);

    const message = 'Agent has been updated';
    await this.insertAudit(req, 'update', message, created_by, 'ACCOUNTS');

    return {
      success: true,
      data,
      message: 'Agent status updated successfully!',
    };
  };

  public getAllAgent = async (req: Request) => {
    const conn = this.models.agentProfileModel(req);

    const data = await conn.getAllAgent();

    return { success: true, data };
  };

  public viewAllAgents = async (req: Request) => {
    const { search } = req.query;

    const conn = this.models.agentProfileModel(req);

    const data = await conn.viewAllAgents(search as string);

    return { success: true, data };
  };

  public getAgentById = async (req: Request) => {
    const { id } = req.params as { id: idType };

    const conn = this.models.agentProfileModel(req);

    const data = await conn.getAllAgentById(id);

    return { success: true, data };
  };

  public viewAgents = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };
    const conn = this.models.agentProfileModel(req);

    const data = await conn.viewAgents(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  public getAgentIncentive = async (req: Request) => {
    const { trash, page, size } = req.query;

    const conn = this.models.agentProfileModel(req);

    const data = await conn.getAgentIncentive(
      Number(page) || 1,
      Number(size) || 20
    );

    return {
      success: true,
      ...data,
    };
  };

  public getAgentIncentiveById = async (req: Request) => {
    const { incentive_id } = req.params;

    const conn = this.models.agentProfileModel(req);

    const data = await conn.getAgentIncentiveById(incentive_id);

    return {
      success: true,
      data,
    };
  };

  public getLocation = async (req: Request) => {
    const fetch_data = await fetch(`https://ipapi.co/${req.ip}/json/`);

    return fetch_data.body;
  };

  public createAgentProfiles = new CreateAgentProfile().createAgentProfile;
  public editAgentProfiles = new EditAgnetProfile().editAgentProfile;
  public deleteAgentProfiles = new DeleteAgentProfile().deleteAgentProfile;

  public createAgentIncentiveIncome = new IncentiveIncomeAgentProfile().create;
  public editAgentIncentive = new IncentiveIncomeAgentProfile()
    .editAgentIncentive;
  public deleteIncentiveIncome = new IncentiveIncomeAgentProfile()
    .deleteIncentiveIncome;
}
export default AgentProfileServices;
