'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line new-cap
const router = express.Router();

const user = {
  id: 0,
  username: 'jrosecow',
  password: '$2a$10$uIZCjHPIgOVvo4QJnPUxkO9ClPy.5YmT8I9nSVcounWpUPyIokqmO'
};

const secretKey = 'tipsycow';

// Hashes my password
// router.get('/', async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     user.password = hashedPassword;
//     res.status(200).send(user.password);
//   } catch(err) {
//     res.status(500).send(err.message);
//   }
// });

// Protected route
router.get('/', authenticateToken, (req, res) => {
  // Access the authenticated user ID through req.userId
  res.json({ message: 'Protected route accessed successfully' });
  console.log('req.userId:', req.userId);
});

router.post('/', async (req, res) => {
  try {
    if(await bcrypt.compare(req.body.password, user.password) && user.username === req.body.username) {
      res.send('Success');
      // User authenticated, generate JWT token
      const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
      // Return the token
      res.json({ token });
    } else {
      res.send('Not Allowed');
    }
  } catch (err){
    res.status(500).send(err.message);
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) {
    return res.status(401).send('no token found'); // No token found
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      console.log(err);
      return res.status(403).send('invalid or expired token'); // Invalid or expired token
    }

    // Token is valid, proceed to the next middleware or route handler
    req.userId = decodedToken.userId;
    next();
  });
}

module.exports = router;
