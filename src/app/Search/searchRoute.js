module.exports = function (app) {
    const search = require('./searchController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const { apiLimiter } = require('../../../config/limiter');
    const { getCache } = require('../../../config/redis');
    // 상품 검색 API
    app.post('/app/search/product-search', apiLimiter, getCache, search.searchProduct);
};
