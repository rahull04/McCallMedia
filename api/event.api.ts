import {GET, Logger, POST} from '../lib';

const logger = new Logger({name: 'EventApi'});

interface EventDetailsBody {
  name: string;
  company: string;
  position: string;
  location: string;
}

interface AddVoiceBody {
  recordTime: string;
  base64: string;
}

export const addVoice = async (body: AddVoiceBody) => {
  try {
    const resp = await POST('event/add-voice', body);
    logger.log('Voice added successfully', resp);
  } catch (err) {
    logger.error('Error while adding voice for recording', body, err);
    throw err;
  }
};

export const addPhoto = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'test.mp3',
    type: 'audio/mp3',
  });
  try {
    const resp = await POST('event/add-photo', formData, {
      'Content-Type': 'multipart/form-data',
    });
    logger.log('Photo added successfully', resp);
  } catch (err) {
    logger.error('Error while adding Photo for recording', imageUri, err);
    throw err;
  }
};

export const addDetails = async (body: EventDetailsBody) => {
  try {
    const response = await POST('/event/add-details', body);
    logger.log('Event details submitted', response);
    return response.data;
  } catch (err) {
    logger.error('Error while adding event details', body, err);
    throw err;
  }
};

export const getEventList = async (body: EventDetailsBody) => {
  try {
    const response = await GET('/event/event-list');
    logger.log('Event details submitted', response);
    return response.data;
  } catch (err) {
    logger.error('Error while adding event details', body, err);
    throw err;
  }
};
