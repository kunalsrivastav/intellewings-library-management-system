const checkToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        req.token = token;
        next();
    } else {
        res.status(403).send({ error: "Missing Authorization token!" });
    }
}

module.exports = checkToken;