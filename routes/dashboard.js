// routes/dashboard.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwt');

router.get('/dashboard', (req, res) => {
    
        try {
          // Check if a token is provided
          const token = req.headers.authorization || req.query.token || req.body.token;

      
          if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
          }
      
          // Verify the token
          jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
              return res.status(403).json({ message: 'Failed to authenticate token.',err });
            }
      
            // Token is valid, send a success message
            res.json({ message: 'Login Successful' });
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error.' });
        }
      
      
});

module.exports = router;
