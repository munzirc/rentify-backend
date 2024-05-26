import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const { authorization } = req.headers;

  console.log(authorization);

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(authorization, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized", err });
    }

    req.userId = user.id;
    next();
  });
};
