const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('authorization');
    if(!token) {
        return res.status(401).json({success: 'failed', message: 'No token found'});
    } else {
        jwt.verify(token, process.env.JWTSECRET, function(err, decoded) {
            if (err) {
                return res.status(401).json({ success: 'failed', message: 'Token not valid' });
            } else {
                req.userauth = decoded;
                next();
            }
        });
    }
};