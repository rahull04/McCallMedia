import {Logger, POST} from '../lib';

const logger = new Logger({name: 'BookSprayApi'});

interface SignInBody {
  username: string;
  password: string;
}

export const signUp = async (body: SignInBody) => {
  try {
    const response = await POST('/signin', body);
    logger.log('Signin submitted', response);
    return response.data;
  } catch (err) {
    logger.error('Error while submitting signup for data', body, err);
    throw err;
  }
};
