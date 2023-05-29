import RNFetchBlob from 'rn-fetch-blob';
import {BookingStatus, GET, Logger, POST, getAccessToken} from '../lib';
import {API_BASE_URL} from '@env';

const {fs} = RNFetchBlob;

const logger = new Logger({name: 'SoilApi'});

interface BookSoilBody {
  name: string;
  phone: string;
  villageName: string;
  pincode: number;
}

export interface SoilBooking {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  villageName: string;
  landmark: string;
  street: string;
  pincode: number;
  isBookingCompleted: boolean;
  bookingStatus: BookingStatus;
  isBookingAccepted: boolean;
  isSampleCollected: boolean;
  billAmount: number;
  isBookingRejected: boolean;
  notes: '';
  reportURL: string;
  paymentDetails: {
    paymentMode: string;
    amount: number;
    isPaymentReceived: boolean;
    _id: string;
  };
  employeeDetails: {
    name: string;
    phone: number;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  sampleCollectDate: string;
}

export const bookSoilTest = async (body: BookSoilBody) => {
  try {
    body.phone = `+91${body.phone}`; // Append country code to the phone number
    const response = await POST('/bookings/soil', body);
    logger.log('BookSoil submitted', response);
    return response.data;
  } catch (err) {
    logger.error('Error while booking soil test for data', body, err);
    throw err;
  }
};

export const fetchSoilBookingList = async (): Promise<SoilBooking[]> => {
  try {
    const response = await GET('/bookings/soil/user');
    logger.log('Fetched Soil bookings', response);
    return response.data.data;
  } catch (err) {
    logger.error('Error while fetching soilBookingList', err);
    throw err;
  }
};

export const downloadSoilBookingInvoice = async (bookingId: string) => {
  try {
    const DEFAULT_INVOICE_DOWNLOAD_PATH =
      fs.dirs.DownloadDir + '/' + `soil_invoice${new Date().getTime()}.pdf`;
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
        `${API_BASE_URL}/bookings/soil/${bookingId}/invoice`,
        headers,
      )
      .catch((err: any) => {
        logger.error('Error while downloading invoice pdf', err);
      });
    return true;
  } catch (err) {
    logger.error('Error while downloading soil booking invoice', err);
    throw err;
  }
};
