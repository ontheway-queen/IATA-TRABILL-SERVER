import { idType } from './src/common/types/common.types';

interface CustomMatchers<R = unknown> {
  nullOrAny(classType: any): R;
}

declare global {
  namespace Express {
    interface Request {
      user: string;
      role_id: number;
      agency_id: number;
      user_id: number;
      upFolder: string;
      imgUrl: string[];
      upFiles: string[];
      image_files: {
        [fieldname: string]: string;
      };
    }
  }

  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}
