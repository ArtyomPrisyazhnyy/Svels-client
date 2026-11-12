export interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

export interface GoogleIdentityConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  use_fedcm_for_prompt?: boolean;
}

export interface GoogleRenderButtonConfig {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  width?: number;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
}

export interface GoogleAccountsId {
  initialize: (config: GoogleIdentityConfig) => void;
  renderButton: (parent: HTMLElement, options: GoogleRenderButtonConfig) => void;
  prompt: (momentListener?: (notification: unknown) => void) => void;
  disableAutoSelect: () => void;
}

export interface GoogleAccounts {
  id: GoogleAccountsId;
}

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts;
    };
  }
}

export {};
