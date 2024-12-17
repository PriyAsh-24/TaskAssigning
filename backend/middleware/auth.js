const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.body.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, "$uperm@n");
        // console.log(decoded);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
};

module.exports = { verifyToken };