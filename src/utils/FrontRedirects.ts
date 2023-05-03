import Constants from "../utils/Constants";

const base_url = Constants.default.app_front_url;

export const FrontRedirects = {
  VERIFY_ACCOUNT: `${base_url}/auth/verify-account`,
  RESET_PASSWORD: `${base_url}/auth/reset-password`,
};
