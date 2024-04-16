const testUserSchema = require("../../models/User.model");
const bcrypt = require("bcryptjs");
const tokenUserModel = require("../../models/Token.model");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userObject = await testUserSchema.findOne({ email });
  if (userObject) {
    return res.status(404).json({
      statusCode: 404,
      message: "This email address is already registered.",
    });
  }
  let userCreate = new testUserSchema({
    email,
    name,
  });
  await userCreate.save();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let tokenModel = new tokenUserModel({
    _userId: userCreate._id,
    password: hashedPassword,
  });
  await tokenModel.save();
  return res.status(200).json({
    statusCode: 200,
    message: "success",
  });
};

module.exports = registerUser;
