import {GET, Logger} from '../lib';

const logger = new Logger({name: 'BookSprayApi'});

export const getCompanyDetail = async (body: {accessToken: string}) => {
  try {
    const response = await GET('/info', body);
    logger.log('Get company detail', response);
    return response.data;
  } catch (err) {
    logger.error('Error while logging in user', body, err);
    throw err;
  }
};
