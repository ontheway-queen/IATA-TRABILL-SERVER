import AbstractModels from '../../abstracts/abstract.models';
import { IFeedback } from './feedback.interfaces';

class FeedbackModel extends AbstractModels {
  createFeedback = async (body: IFeedback) => {
    const [feedback] = await this.query()
      .insert({ ...body, fd_agency_id: this.org_agency })
      .into('trabill_agency_feedback');

    return feedback;
  };

  getFeedbacks = async (page: number, size: number, search: string) => {
    const offset = (page - 1) * size;

    const data = await this.query()
      .select(
        'fd_id',
        'fd_created_date',
        'orgInfo.org_name as agency_name',
        'orgInfo.org_owner_email as agency_email',
        'orgInfo.org_address1 as agency_address',
        'orgInfo.org_mobile_number as agency_mobile_no',
        'fd_agency_name',
        'fd_subject',
        'fd_message',
        'fd_user_experience',
        'fd_customer_support',
        'fd_software_update',
        'fd_satisfied',
        'fd_refer_other',
        'fd_most_useful_features'
      )
      .from('trabill_agency_feedback')
      .modify((value) => {
        if (search) {
          value.where('orgInfo.org_name', 'like', `%${search}%`);
        }
      })
      .leftJoin('trabill_agency_organization_information as orgInfo', {
        org_id: 'fd_agency_id',
      })
      .limit(size)
      .offset(offset)
      .orderBy('fd_id', 'desc');

    const [{ row_count }] = await this.query()
      .select(this.db.raw('count(*) as row_count'))
      .from('trabill_agency_feedback')
      .leftJoin('trabill_agency_organization_information as orgInfo', {
        org_id: 'fd_agency_id',
      })
      .modify((value) => {
        if (search) {
          value.where('orgInfo.org_name', 'like', `%${search}%`);
        }
      });

    return { count: row_count, data };
  };
}

export default FeedbackModel;
