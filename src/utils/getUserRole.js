const jwt = require("jsonwebtoken");
function getRolefromToken(AuthToken) {
  if (!AuthToken) return null;
  const token = AuthToken.split(" ")[1];
  const decoded = jwt.decode(token);
  return decoded.user.role;
}
function getUserIdFromToken(AuthToken) {
  if (!AuthToken) return null;
  const token = AuthToken.split(" ")[1];
  const decoded = jwt.decode(token);
  console.log(decoded);
  return decoded.user._id;
}

module.exports = {
  getRolefromToken,
  getUserIdFromToken,
};
