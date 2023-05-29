export interface UserProfile {
  username: string;
  pool: {
    userPoolId: string;
    clientId: string;
    client: {
      endpoint: string;
      fetchOptions: object;
    };
    advancedSecurityDataCollectionFlag: boolean;
    storage: {
      domain: string;
      path: string;
      expires: number;
      secure: true;
      sameSite: string;
    };
  };
  Session: string;
  client: {
    endpoint: string;
    fetchOptions: object;
  };
  signInUserSession: object;
  authenticationFlowType: string;
  storage: {
    domain: string;
    path: string;
    expires: number;
    secure: boolean;
    sameSite: string;
  };
  keyPrefix: string;
  userDataKey: string;
  challengeName: string;
  challengeParam: {
    CODE_DELIVERY_DESTINATION: string;
    CODE_DELIVERY_DELIVERY_MEDIUM: string;
  };
}

export interface UserState {
  isAuthenticated: boolean;
  profile?: UserProfile;
}

export interface LoginPayload {
  email: string;
  password: string;
}
