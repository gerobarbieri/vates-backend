const axios = require("axios");
const formData = require("form-data");

exports.getUserToken = async (code) => {
  return axios({
    method: "get",
    url: `https://graph.facebook.com/v10.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`,
  });
};

exports.getUserId = async (userToken) => {
  return axios({
    method: "get",
    url: `https://graph.facebook.com/debug_token?input_token=${userToken}&access_token=${userToken}`,
  });
};

exports.getPageId = async (userToken) => {
  const pageTokenResponse = await axios({
    method: "get",
    url: `https://graph.facebook.com/me/accounts?access_token=${userToken}`,
  });

  return pageTokenResponse.data.data.find((page) => {
    return page.name === "barbierigero_";
  });
};

exports.getInstagramId = async (pageId, pageToken) => {
  return axios({
    method: "get",
    url: `https://graph.facebook.com/v10.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`,
  });
};

exports.photoUpload = async (image, pageToken) => {
  const form_data = new formData();
  form_data.append("source", image);
  form_data.append("published", "false");
  const url = `https://graph.facebook.com/me/photos?access_token=${pageToken}`;
  const headersConfig = {
    headers: {
      "Content-Type":
        "multipart/form-data; boundary=" + form_data.getBoundary(),
    },
  };
  return axios.post(url, form_data, headersConfig);
};

exports.uploadPost = async (pageToken, text, photoId) => {
  return axios({
    method: "post",
    url: `https://graph.facebook.com/me/feed?access_token=${pageToken}`,
    data: {
      message: text,
      attached_media: [
        {
          media_fbid: photoId,
        },
      ],
    },
  });
};
exports.instagramPhotoUpload = async (imageUrl, pageToken, igId, text) => {
  return axios({
    method: "post",
    url: `https://graph.facebook.com/v10.0/${igId}/media?access_token=${pageToken}`,
    data: { image_url: imageUrl, caption: text },
  });
};

exports.uploadInstagramPost = async (igId, pageToken, mediaId) => {
  return axios({
    method: "post",
    url: `https://graph.facebook.com/v10.0/${igId}/media_publish?access_token=${pageToken}`,
    data: {
      creation_id: mediaId,
    },
  });
};
