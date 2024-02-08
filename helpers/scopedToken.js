const jwt = require("jsonwebtoken");

class ScopedTokenGenerator {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  generateToken(scopes, expiresIn = "1h", username) {
    const payload = {
      username: username,
      scopes: scopes,
      // Add any other data you want to include in the token payload
    };

    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded;
    } catch (error) {
      // Token verification failed
      return null;
    }
  }

  validatePermission(token, requiredPermissions) {
    const decodedToken = this.verifyToken(token);
    if (!decodedToken) {
      return false; // Token is invalid
    }
    // Check if all required permissions are present in the token scopes
    return requiredPermissions.every((permission) =>
      decodedToken.scopes.includes(permission)
    );
  }
}

module.exports = ScopedTokenGenerator;
