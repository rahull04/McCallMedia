import axios from 'axios';
import {Logger, getAccessToken} from '../utils';
import {API_BASE_URL} from '@env';

const logger = new Logger({name: 'HttpService'});

const blackList = ['/signup'];

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Append TOKEN to all the API requests
api.interceptors.request.use(
  async req => {
    try {
      if (blackList.filter(item => req.url?.includes(item)).length > 0) {
        logger.log('Url blacklisted hence not appending the token');
        return Promise.resolve(req);
      }
      const token = await getAccessToken();
      req.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      logger.log(
        'Error while appending bearer token to the axios request',
        req.url,
        err,
      );
    } finally {
      return Promise.resolve(req);
    }
  },
  error => {
    return Promise.reject(error);
  },
);

export const GET = async (
  apiURL: string,
  params?: Record<string, string>,
  headers?: Record<string, string>,
): Promise<Record<string, any>> => {
  try {
    const response = await api.get(apiURL, {params, headers});
    return response;
  } catch (error) {
    logger.error('Error in GET api call: ', error);
    throw error;
  }
};

export const POST = async (
  apiURL: string,
  data?: Record<string, any>,
  headers?: Record<string, string>,
) => {
  try {
    const response = await api.post(apiURL, data, headers);
    return response;
  } catch (error) {
    logger.error('Error in POST api call: ', error);
    throw error;
  }
};

export const PATCH = async (
  apiURL: string,
  data?: Record<string, any>,
  headers?: Record<string, string>,
) => {
  try {
    const response = await api.patch(apiURL, data, headers);
    return response;
  } catch (error) {
    logger.error('Error in PATCH api call: ', error);
    throw error;
  }
};

export const PUT = async (
  apiURL: string,
  data?: Record<string, any>,
  headers?: Record<string, string>,
) => {
  try {
    const response = await api.put(apiURL, data, headers);
    return response;
  } catch (error) {
    logger.error('Error in POST api call: ', error);
    throw error;
  }
};
