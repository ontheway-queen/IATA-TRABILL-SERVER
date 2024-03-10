import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import AgentProfileServices from '../Services/agent_profile.services';
import AgentProfileValidator from '../Validators/agent_profile.validators';

class AgentProfileControllers extends AbstractController {
  private services = new AgentProfileServices();
  private validator = new AgentProfileValidator();

  constructor() {
    super();
  }

  public updateAgentsStatus = this.assyncWrapper.wrap(
    this.validator.updateAgentStatus,
    async (req: Request, res: Response) => {
      const data = await this.services.updateAgentsStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('update agent status...');
      }
    }
  );

  public createAgentProfile = this.assyncWrapper.wrap(
    this.validator.createAgentProfile,

    async (req: Request, res: Response) => {
      const data = await this.services.createAgentProfiles(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Create agent profile...');
      }
    }
  );

  public getAllAgents = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getAllAgent(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get all agents...');
      }
    }
  );
  public viewAllAgents = this.assyncWrapper.wrap(
    this.validator.readAllAgents,
    async (req: Request, res: Response) => {
      const data = await this.services.viewAllAgents(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get all agents...');
      }
    }
  );

  public getAgentById = this.assyncWrapper.wrap(
    this.validator.readAllAgents,
    async (req: Request, res: Response) => {
      const data = await this.services.getAgentById(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get agent by Id...');
      }
    }
  );

  public editEgentProfile = this.assyncWrapper.wrap(
    this.validator.updateAgentProfile,
    async (req: Request, res: Response) => {
      const data = await this.services.editAgentProfiles(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Edit agent profile...');
      }
    }
  );

  public deleteAgentProfiles = this.assyncWrapper.wrap(
    this.validator.deleteAgentProfile,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteAgentProfiles(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete agent profile...');
      }
    }
  );

  public viewAgents = this.assyncWrapper.wrap(
    this.validator.readAllAgents,
    async (req: Request, res: Response) => {
      const data = await this.services.viewAgents(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public createAgentIncentiveIncome = this.assyncWrapper.wrap(
    this.validator.createAgentIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.createAgentIncentiveIncome(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public editAgentIncentive = this.assyncWrapper.wrap(
    this.validator.editAgentIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.editAgentIncentive(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getAgentIncentive = this.assyncWrapper.wrap(
    this.validator.readAgentIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.getAgentIncentive(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getAgentIncentiveById = this.assyncWrapper.wrap(
    this.validator.readAgentIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.getAgentIncentiveById(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public deleteIncentiveIncome = this.assyncWrapper.wrap(
    this.validator.deleteAgentIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteIncentiveIncome(req);

      if (data.success) {
        res.status(200).send(data);
      } else {
        this.error('');
      }
    }
  );

  public getLocation = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getLocation(req);

      res.status(200).json(data);
    }
  );
}
export default AgentProfileControllers;
