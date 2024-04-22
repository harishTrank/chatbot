const formidable = require("formidable");
const uploadFiles = require("../services/upload-files");

const uploadImage = async (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    console.log(files);
    if (err) {
      res.status(400).send(err);
      return;
    }

    try {
      const filesArray = Object.values(files);
      const uploadedImageUrl = await Promise.all(
        filesArray.map(async (item) => {
          let location = item[0].filepath;
          const originalFileName = item[0].originalFilename;
          const fileType = item[0].mimetype;
          const data = await uploadFiles.upload(
            location,
            originalFileName,
            `messages/${Math.floor(Math.random() * 99999)}`,
            null
          );
          return {
            url: data.Location,
            type: fileType,
          };
        })
      );

      res.status(200).json({
        success: true,
        data: uploadedImageUrl[0].url,
      });
    } catch (error) {
      next(error);
    }
  });
};

module.exports = uploadImage;
