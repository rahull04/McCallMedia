import RNFetchBlob from 'rn-fetch-blob';
import {BookingStatus, GET, Logger, POST, getAccessToken} from '../lib';
import {API_BASE_URL} from '@env';

const logger = new Logger({name: 'SprayApi'});
const {fs} = RNFetchBlob;

interface BookSprayBody {
  name: string;
  phone: string;
  numOfAcres: number;
  villageName: string;
  tentativeDate: string;
}

export interface SprayBooking {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  numOfAcres: number;
  villageName: string;
  landmark: string;
  street: string;
  pincode: string;
  tentativeDate: string;
  isBookingCompleted: boolean;
  bookingStatus: BookingStatus;
  isHighTension: boolean;
  isRoadAvailable: boolean;
  isBookingAccepted: boolean;
  billAmount: number;
  isBookingRejected: boolean;
  notes: string;
  surveyDetails: {
    userId: string;
    isReadyForSurvey: boolean;
    surveyDate: string;
    surveyNotes: string;
    isRejectedAtSurvey: boolean;
    isSurveyComplete: boolean;
    acresSurveyed: number;
    attachments: Array<any>;
    _id: string;
  };
  sprayDetails: {
    userId: string;
    isReadyForSpray: boolean;
    sprayDate: string;
    sprayNotes: string;
    isRejectedAtSpray: boolean;
    isSprayComplete: boolean;
    acresSprayed: number;
    _id: string;
    preFlightChecklist: {
      areBatteriesCharged: boolean;
      isRemoteControllerCharged: boolean;
      isDroneCleaned: boolean;
      areFourExtraBatteriesKept: boolean;
      isToolkitKeptInVehicle: boolean;
      vehicleExpense: number;
      _id: string;
    };
    postFlightChecklist: {
      areBatteriesCharged: number;
      isRemoteControllerCharged: number;
      isDroneCleaned: number;
      areFourExtraBatteriesKept: number;
      isToolkitKeptInVehicle: number;
      vehicleExpense: number;
      _id: string;
    };
  };
  paymentDetails: {
    paymentMode: string;
    amount: number;
    isPaymentReceived: boolean;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const bookSpray = async (body: BookSprayBody) => {
  try {
    body.phone = `+91${body.phone}`; // Append country code to the phone number
    const response = await POST('/bookings/spray', body);
    logger.log('BookSpray submitted', response);
    return response.data;
  } catch (err) {
    logger.error('Error while booking spray for data', body, err);
    throw err;
  }
};

export const fetchSprayBookingList = async (): Promise<SprayBooking[]> => {
  try {
    const response = await GET('/bookings/spray/user');
    logger.log('Fetched Spray bookings', response);
    return response.data.data;
  } catch (err) {
    logger.error('Error while fetching sprayBookingList', err);
    throw err;
  }
};

export const downloadSprayBookingInvoice = async (bookingId: string) => {
  try {
    const DEFAULT_INVOICE_DOWNLOAD_PATH =
      fs.dirs.DownloadDir + '/' + `spray_invoice${new Date().getTime()}.pdf`;
    const token = await getAccessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    RNFetchBlob.config({
      fileCache: true,
      path: DEFAULT_INVOICE_DOWNLOAD_PATH,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: DEFAULT_INVOICE_DOWNLOAD_PATH,
        mime: 'application/pdf',
      },
    })
      .fetch(
        'GET',
        `${API_BASE_URL}/bookings/spray/${bookingId}/invoice`,
        headers,
      )
      .catch((err: any) => {
        logger.error('Error while downloading invoice pdf', err);
      });
    return true;
  } catch (err) {
    logger.error('Error while downloading spray booking invoice', err);
    throw err;
  }
};
