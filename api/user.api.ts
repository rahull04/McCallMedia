import {Logger, POST} from '../lib';

const logger = new Logger({name: 'UserApi'});

interface SignInBody {
  email: string;
  password: string;
}

export const login = async (body: SignInBody) => {
  try {
    const response = await POST('/login', body);
    logger.log('Login submitted', response);
    return response.data?.token;
  } catch (err) {
    logger.error('Error while logging in user', body, err);
    throw err;
  }
};

export const logOut = async () => {
  try {
    const response = await POST('/logout');
    logger.log('Logout submitted', response);
    return response.data?.token;
  } catch (err) {
    logger.error('Error while logging out user', err);
    throw err;
  }
};
