export interface AppleAuthorization {
  id_token: string;
  code?: string;
  state?: string;
}

export interface AppleUserName {
  firstName?: string;
  lastName?: string;
}

export interface AppleSignInResponse {
  authorization: AppleAuthorization;
  user?: {
    email?: string;
    name?: AppleUserName;
  };
}

export interface AppleAuthInitConfig {
  clientId: string;
  scope: string;
  redirectURI: string;
  state?: string;
  usePopup: boolean;
}

export interface AppleAuthApi {
  init: (config: AppleAuthInitConfig) => void;
  signIn: () => Promise<AppleSignInResponse>;
}

declare global {
  interface Window {
    AppleID?: {
      auth: AppleAuthApi;
    };
  }
}

export {};
