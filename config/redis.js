const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);
const redisClient = redis.createClient(6379);

const setCache = async (key, value) => {
    await redisClient.setAsync(key, JSON.stringify(value));
};

const deleteCache = async (key) => {
    await redisClient.delAsync(key);
};

const getSearchCache = async (req, res, next) => {
    let key = 'search/' + req.query.searchName;
    try {
        const data = JSON.parse(await redisClient.getAsync(key));
        if (data) {
            res.status(200).json({
                data: data,
            });
        } else next();
    } catch (err) {
        res.status(400).json({
            ok: false,
            message: err,
        });
    }
};

const getProductIdCache = async (req, res, next) => {
    let key = 'productId/' + req.params.productId;
    try {
        const data = JSON.parse(await redisClient.getAsync(key));
        if (data) {
            res.status(200).json({
                data: data,
            });
        } else next();
    } catch (err) {
        res.status(400).json({
            ok: false,
            message: err,
        });
    }
};
module.exports = {
    setCache,
    getSearchCache,
    getProductIdCache,
    deleteCache,
};
