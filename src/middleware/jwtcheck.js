import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
     const token = req.cookies.access_token;
     
     if (!token) {
        return res.status(401).json({error: "Unauthorized"});
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({error: "Unauthorized"});
        }
        
        req.userId = user.id;
        next();
      });
}