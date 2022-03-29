const axios = require("axios");
const qs = require("qs");

exports.getToken = async (code) => {
  return axios({
    method: "post",
    url: "https://www.linkedin.com/oauth/v2/accessToken",
    data: qs.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
exports.getUserId = async (accessToken) => {
  return axios({
    method: "get",
    url: "https://api.linkedin.com/v2/me",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "cache-control": "no-cache",
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });
};

exports.assetRegister = async (token, id) => {
  return axios({
    method: "post",
    url: "https://api.linkedin.com/v2/assets?action=registerUpload",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      registerUploadRequest: {
        owner: `urn:li:person:${id}`,
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        serviceRelationships: [
          {
            identifier: "urn:li:userGeneratedContent",
            relationshipType: "OWNER",
          },
        ],
        supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
      },
    }),
  });
};

exports.assetUpload = async (url, image, token, file) => {
  return axios.put(url, image, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": `${file.mimetype}`,
    },
  });
};

exports.uploadPost = async (token, id, text, asset) => {
  return axios({
    method: "post",
    url: "https://api.linkedin.com/v2/shares",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      owner: `urn:li:person:${id}`,
      subject: "Test Share Subject",
      text: {
        text: `${text}`,
      },
      content: {
        contentEntities: [
          {
            entity: `${asset}`,
          },
        ],
        shareMediaCategory: "IMAGE",
      },
    }),
  });
};
