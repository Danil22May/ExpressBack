import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret");
      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "No access",
      });
    }
  } else {
    return res.status(401).json({
      message: "Token not provided",
    });
  }
};
