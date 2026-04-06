const jwt = require('jsonwebtoken');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId;

    if(userId){
        req.userId = userId;
        next();
    }
    else{
        return res.status(403).json({
            message: "Token was malformed"
        })
    }
}

module.exports = {
    authMiddleware: authMiddleware
}