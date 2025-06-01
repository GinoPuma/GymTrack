const jwt = require("jsonwebtoken");

const generateToken = (id, role, trainerId = null) => {
  
  return jwt.sign(
    { id, role, trainerId }, 
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

module.exports = generateToken;
