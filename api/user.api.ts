import {Logger, POST} from '../lib';

const logger = new Logger({name: 'BookSprayApi'});

interface SignUpBody {
  name: string;
  phone: string;
  villageName: string;
  pincode: string;
  userId: string;
}

export const signUp = async (body: SignUpBody) => {
  try {
    const response = await POST('/signup', body);
    logger.log('Signup submitted', response);
    return response.data;
  } catch (err) {
    logger.error('Error while submitting signup for data', body, err);
    throw err;
  }
};
