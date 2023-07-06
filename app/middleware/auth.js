const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  try {
    //   get the token from the authorization header
    const token = await request.headers.authorization.split(" ")[1];
    // Check if no token
    if (!token) {
      response
        .status(401)
        .json({ status: "error", message: "No token, authorization denied" });
    }

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || "SECRET-TOKEN";
    try {
      jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) {
          response.status(401).json({
            status: "error",
            message: "Token is not valid",
          });
        } else {
          req.user = decoded.user;
          next();
        }
      });
    } catch (err) {
      console.error("something wrong with auth middleware");
      response.status(500)
        .json({ status: "error", message: "Server Error" });
    }
  } catch (error) {
    response
      .status(500)
      .json({ status: "error", message: "Unauthorized Request" });
  }
};
