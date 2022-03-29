const axios = require("axios");
const qs = require("qs");

exports.getUserToken = async (code) => {
  return axios({
    method: "post",
    url: `https://login.microsoftonline.com/consumers/oauth2/v2.0/token`,
    data: qs.stringify({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      scope: "user.read mail.read",
      code: code,
      redirect_uri: process.env.MICROSOFT_REDIRECT_URI,
      grant_type: "authorization_code",
      client_secret: process.env.MICROSOFT_CLIENT_SECRET,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

exports.getUserData = async (accessToken) => {
  return axios({
    method: "get",
    url: `https://graph.microsoft.com/v1.0/me`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
