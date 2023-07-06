import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  try {
    // Get the token from the request headers or query parameters
    let token = req.headers.authorization?.split(' ')[1] || req.query.token;

    if (!token) {
      return res.status(401).json({ success:0, message: 'Access denied. No token provided.' });
    }

    // Verify the token
    jwt.verify(token, 'secretKey', (err, decoded) => {
      if (err) {
        return res.status(401).json({ success:0,message: 'Invalid token.' });
      }

      // Token is valid, attach the decoded user ID to the request object
      req.userId = decoded.userId;

      // Proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
