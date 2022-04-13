module.exports = function (app) {
    const basket = require('./basketController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 4. 장바구니 조회 API
    app.get('/app/basket', jwtMiddleware, basket.getBasket);

    // 9. 장바구니 상품 개수 변경 API
    app.patch('/app/basket/:basketId/count', jwtMiddleware, basket.updateProductCount);

    // 16. 장바구니 상품 삭제 API
    app.patch('/app/basket/delete', jwtMiddleware, basket.deleteBasket);
};
