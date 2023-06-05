import {Logger, POST} from '../lib';

const logger = new Logger({name: 'BookSprayApi'});

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

export const logOut = async (body: {accessToken: string}) => {
  try {
    const response = await POST('/logout', body);
    logger.log('Logout submitted', response);
    return response.data?.token;
  } catch (err) {
    logger.error('Error while logging out user', body, err);
    throw err;
  }
};
