function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Thiếu token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, role }
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token không hợp lệ" });
    }
}

module.exports = verifyToken;
