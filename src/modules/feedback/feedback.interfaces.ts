export interface IFeedback {
  fd_agency_name: string;
  fd_subject: string;
  fd_message: string;
  fd_user_experience:
    | 'good'
    | 'poor'
    | 'below average'
    | 'average'
    | 'excellent';
  fd_customer_support:
    | 'good'
    | 'poor'
    | 'below average'
    | 'average'
    | 'excellent';
  fd_software_update:
    | 'good'
    | 'poor'
    | 'below average'
    | 'average'
    | 'excellent';
  fd_refer_other: '1' | '2' | '3' | '4' | '5';
  fd_most_useful_features: string;
}
