import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
     const token = req.cookies.access_token;
     
     if (!token) {
        return res.status(401).json({error: "Unauthorized, no token"});
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({error: "Unauthorized, error in token", err});
        }
        
        req.userId = user.id;
        next();
      });
}