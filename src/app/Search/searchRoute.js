module.exports = function (app) {
    const search = require('./searchController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    // 상품 검색 API
    app.post('/app/search/product-search', search.searchProduct);
};
