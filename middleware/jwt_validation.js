const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const Blacklist = require("../models/TokenBlackList");
const { accessSecret, refreshSecret, accessTokenLife, refreshTokenLife } =
  require("../config/keys").jwt;
const Token = require("../models/Token.model");
const { ObjectId } = require("mongoose").Types;

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/generate_token");
const User = require("../models/User.model");

const validateAccessToken = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized("Please login first"));
  }
  const bearerToken = req.headers["authorization"];

  const token =
    bearerToken.split(" ")[0] === "Bearer"
      ? bearerToken.split(" ")[1]
      : bearerToken;
  let find;
  jwt.verify(token, accessSecret, async (err, decoded) => {
    find = await User.findOne({
      _id: ObjectId(decoded?.data?._id),
    });
    if (find?.isSuspended) {
      return next(createError.Unauthorized("Your account has been suspended."));
    }
  });
  jwt.verify(token, accessSecret, async (err, decoded) => {
    find = await Blacklist.findOne({
      userId: ObjectId(decoded?.data?._id),
    });
    if (find) {
      return next(createError.Unauthorized("jwt expired"));
    }
  });
  jwt.verify(token, accessSecret, async (err, decoded) => {
    if (err) {
      if (err.message === "jwt expired") {
        if (req.cookies?.auth) {
          const { auth } = req.cookies;

          try {
            const payload = jwt.verify(auth, refreshSecret);
            if (!payload)
              throw createError.Unauthorized(
                "Session expired. Please login again."
              );

            const resultQuery = await Token.findOne({
              // _userId: payload.data._id,
              token: auth,
            });

            if (!resultQuery)
              return next(createError.Unauthorized("Please login again"));

            const jwtPayload = {
              data: payload.data,
              type: payload.type,
            };

            const accessToken = generateAccessToken(
              jwtPayload,
              accessTokenLife
            );
            const refreshToken = generateRefreshToken(
              jwtPayload,
              refreshTokenLife
            );
            if (accessToken && refreshToken) {
              resultQuery.overwrite(
                new Token({
                  _userId: payload.data._id,
                  token: refreshToken,
                })
              );

              await resultQuery.save();
              res.cookie("auth", refreshToken, {
                secure: true,
                sameSite: "none",
              });
              const json_ = res.json; // capture the default resp.json implementation

              res.json = function (object) {
                object["accessToken"] = accessToken;

                json_.call(res, object);
              };
              req.user = { data: payload.data };
              return next();
            }
          } catch (error) {
            if (error.message === "jwt expired")
              return next(createError.Unauthorized("Please login again"));
            return next(createError.InternalServerError());
          }
        }
        return next(createError.Unauthorized("Please login again"));
      } else {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
    }
    req.user = decoded;
    next();
  });
};

module.exports = validateAccessToken;
