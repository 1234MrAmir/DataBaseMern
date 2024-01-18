const jwt = require("jsonwebtoken");
const JWt_SECURE = "This is my angle";

// this is middleware
const fetchuser = (req, res, next) => {
  try {
    // by this be can find the authtoken from the header
    const token = req.header("auth-token");

    // if authtoken is not available in the header then send  this error.
    if (!token) {
      return res.status(401).json({ error: "Please provide valid authtoken" });
    }

    // if authtoken is available in the header than jwt verify with the help of JWT_SECURE, that provided authtoken is valid or not. 
    const data = jwt.verify(token, JWt_SECURE);

    // 1-The assumption is that within the decoded JWT payload, there is a property named user, and the value of that property is relevant user information (such as user ID, username, etc.).
    
   //2- The structure of the JWT payload can be customized based on your application's requirements. For example, if your JWT payload looks like 
   //{ user: 
   //{ id: '123',
    //username: 'john_doe' 
//} 
//}, then data.user would give you an object with id and username properties.
    req.user = data.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ error: "Please provide valid authtoken" });
  }
};
module.exports = fetchuser;
