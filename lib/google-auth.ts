import googleConfig from "../expense_tracker.json";

const GOOGLE_CLIENT_ID = googleConfig.web.client_id;
const GOOGLE_CLIENT_SECRET = googleConfig.web.client_secret;
const GOOGLE_AUTH_URL = googleConfig.web.auth_uri;
const GOOGLE_TOKEN_URL = googleConfig.web.token_uri;
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
const REDIRECT_URI = googleConfig.web.redirect_uris[0];

const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile"
].join(" ");

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export function generateGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: GOOGLE_SCOPES,
    state: state,
    access_type: "offline",
    prompt: "consent"
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_AUTH_URL,
  GOOGLE_TOKEN_URL,
  GOOGLE_USERINFO_URL,
  GOOGLE_SCOPES,
  REDIRECT_URI
};
