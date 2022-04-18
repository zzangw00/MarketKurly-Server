const limiter = require('express-rate-limit');

exports.apiLimiter = limiter({
    windowMs: 6000,
    max: 10,
    delayMs: 0,
    handler(req, res) {
        res.status(this.statusCode).json({
            code: this.statusCode,
            message: '1분에 10번 요청가능',
        });
    },
});
