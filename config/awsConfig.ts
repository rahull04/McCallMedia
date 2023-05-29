import {
  AMPLIFY_AUTH_REGION,
  AMPLIFY_AUTH_USER_POOL_ID,
  AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID,
} from '@env';

export const awsConfig = {
  region: AMPLIFY_AUTH_REGION,
  userPoolId: AMPLIFY_AUTH_USER_POOL_ID,
  userPoolWebClientId: AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID,
  authenticationFlowType: 'USER_SRP_AUTH',
};
