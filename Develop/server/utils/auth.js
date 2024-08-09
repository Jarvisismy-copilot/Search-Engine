const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

// Function to verify the token and attach user info to the context
const authenticate = async (req) => {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trimLeft();
  }

  if (!token) {
    return {}; // Return an empty context if no token is provided
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    return { user: data }; // Attach user info to context
  } catch (err) {
    console.log('Invalid token', err);
    return {}; // Return an empty context if token is invalid
  }
};

// Function to generate a token
const signToken = function ({ username, email, _id }) {
  const payload = { username, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = { authenticate, signToken };
