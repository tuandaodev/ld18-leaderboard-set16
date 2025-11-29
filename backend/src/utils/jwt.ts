const jwt = require("jsonwebtoken");
export const genAC = (payload: Object) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "4h",
  });
};

export const genRF = (payload: Object) => {
  return jwt.sign(payload, process.env.RF_PRIVATE_KEY, {
    expiresIn: "14d",
  });
};
