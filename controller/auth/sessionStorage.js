const sessionStorage = async (req, res, next) => {
  try {
    sessionStorage.setItem("accessToken", req.body.accessToken);
    sessionStorage.setItem("userData", JSON.stringify(req.body.userData));
    return res.status(200).json({
      message: "Session storage save successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = sessionStorage;
