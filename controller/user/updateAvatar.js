const formidable = require("formidable");
const jwt = require("jsonwebtoken");
const { accessSecret } = require("../../config/keys").jwt;

const uploadFiles = require("../../services/upload-files");
const UserModel = require("../../models/User.model");

const updateAvatar = async (req, res, next) => {
  try {
    let bearerToken, token;
    const { userId } = req.query;
    bearerToken = req.headers["authorization"];
    token =
      bearerToken.split(" ")[0] === "Bearer"
        ? bearerToken.split(" ")[1]
        : bearerToken;
    payload = jwt.verify(token, accessSecret);

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      console.log(files);
      if (err) {
        res.status(400).send(err);
        return;
      }

      try {
        const filesArray = Object.values(files);
        const allFileUploadedArray = await Promise.all(
          filesArray.map(async (item) => {
            let location = item[0].filepath;
            const originalFileName = item[0].originalFilename;
            const fileType = item[0].mimetype;
            const data = await uploadFiles.upload(
              location,
              originalFileName,
              `users/${userId}/posts`,
              null
            );
            return {
              url: data.Location,
              type: fileType,
            };
          })
        );
        const uploadAvatarPhoto = await UserModel.findOneAndUpdate(
          { _id: userId },
          { avatar_url: allFileUploadedArray[0].url },
          { new: true }
        );

        res.status(200).json({
          success: true,
          data: uploadAvatarPhoto,
        });
      } catch (error) {
        console.error("Error in creating post: ", error);
        res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      }
    });
  } catch (error) {
    console.log("Error: ", error);
    next(error);
  }
};

module.exports = updateAvatar;
