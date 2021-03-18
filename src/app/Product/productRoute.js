module.exports = function (app) {
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 4. 베스트 상품 조회 API
    app.get('/app/product/best', product.getBestProduct);

    // 11. 예비 장바구니 조회 API
    app.get('/app/product/:productId/pre-basket', product.getPreBasket);
};
