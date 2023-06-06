import {GET, Logger} from '../lib';

const logger = new Logger({name: 'CompanyApi'});

export const getCompanyDetails = async () => {
  try {
    const response = await GET('/info');
    logger.log('Get company details response', response);
    return response.data;
  } catch (err) {
    logger.error('Error while fetching company details', err);
    throw err;
  }
};
