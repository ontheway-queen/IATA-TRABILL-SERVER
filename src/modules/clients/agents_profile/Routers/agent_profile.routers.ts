import multer from 'multer';
import AbstractRouter from '../../../../abstracts/abstract.routers';

import AgentProfileControllers from '../Controllers/agent_profile.controllers';
import { uploadImageToAzure_rec } from '../../../../common/helpers/ImageUploadToAzure_rec';

const storage = multer.memoryStorage();
const upload = multer({ storage });
class AgentProfileRoutes extends AbstractRouter {
  private controllers = new AgentProfileControllers();

  constructor() {
    super();

    this.callRouter();
  }
  private callRouter() {
    this.routers.patch(
      '/activity/:agent_id',
      this.controllers.updateAgentsStatus
    );

    this.routers.post(
      '/create',
      upload.fields([
        { name: 'agent_image_copy', maxCount: 1 },
        { name: 'agent_nid_front', maxCount: 1 },
        { name: 'agent_nid_back', maxCount: 1 },
      ]),
      uploadImageToAzure_rec,

      this.controllers.createAgentProfile
    );

    this.routers.get('/agents', this.controllers.getAllAgents);

    this.routers
      .route('/agent/:id')
      .get(this.controllers.getAgentById)
      .patch(
        upload.fields([
          { name: 'agent_image_copy', maxCount: 1 },
          { name: 'agent_nid_front', maxCount: 1 },
          { name: 'agent_nid_back', maxCount: 1 },
        ]),
        uploadImageToAzure_rec,
        this.controllers.editEgentProfile
      )
      .delete(this.controllers.deleteAgentProfiles);

    this.routers.get('/get-all', this.controllers.viewAgents);
    this.routers.get('/view_all', this.controllers.viewAllAgents);

    // Incetive Income Agent
    this.routers
      .route('/incentive')
      .post(this.controllers.createAgentIncentiveIncome)
      .get(this.controllers.getAgentIncentive);

    this.routers
      .route('/incentive/:incentive_id')
      .patch(this.controllers.editAgentIncentive)
      .get(this.controllers.getAgentIncentiveById)
      .delete(this.controllers.deleteIncentiveIncome);

    this.routers.post('/check-location', this.controllers.getLocation);
  }
}
export default AgentProfileRoutes;
