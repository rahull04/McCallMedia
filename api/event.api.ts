import {Logger, POST} from '../lib';

const logger = new Logger({name: 'BookSprayApi'});

export const addVoice = async (recording: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: recording,
    name: 'test.mp3',
    type: 'audio/mp3',
  });
  try {
    const resp = await POST('event/add-voice', formData, {
      'Content-Type': 'multipart/form-data',
    });
    logger.log('Voice added successfully', resp);
  } catch (err) {
    logger.error('Error while adding voice for recording', recording, err);
    throw err;
  }
};
