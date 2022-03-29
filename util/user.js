exports.validateAllUserTokens = (userTokens) => {
  let isValid = true;
  userTokens.forEach((tokenExpirationDate) => {
    if (!tokenExpirationDate || tokenExpirationDate < new Date()) {
      isValid = false;
    }
  });

  return isValid;
};
