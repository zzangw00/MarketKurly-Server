module.exports = function (app) {
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 4. 베스트 상품 조회 API
    app.get('/app/product/best', product.getBestProduct);

    // 11. 예비 장바구니 조회 API
    app.get('/app/product/:productId/pre-basket', jwtMiddleware, product.getPreBasket);

    // 12. 예비 장바구니 상품 개수 증가 시키기 API
    app.patch('/app/preBasket/:preBasketId/count-up', jwtMiddleware, product.updateProductCountUp);

    // 13. 예비 장바구니 상품 개수 감소 시키기 API
    app.patch(
        '/app/preBasket/:preBasketId/count-down',
        jwtMiddleware,
        product.updateProductCountDown,
    );
    // 14. 예비 장바구니 닫기 API
    app.patch('/app/preBasket/:preBasketId/reset', jwtMiddleware, product.resetPreBasket);

    // 15. 장바구니 추가 API
    app.post('/app/product/:productId/basket', jwtMiddleware, product.inputBasket);

    // 21. 상품설명 API
    app.get('/app/product/:productId/info', product.getProductInfo);

    // 22. 상품이미지 API
    app.get('/app/product/:productId/image', product.getProductImage);

    // 23. 상품 상세정보 API
    app.get('/app/product/:productId/detail', product.getProductDetail);

    // 24. 후기 전반적인 화면 API
    app.get('/app/product/:productId/review', product.getProductReview);

    // 25. 후기 개수 API
    app.get('/app/product/:productId/review-count', product.getProductReviewCount);

    // 26. 후기 전체보기 API
    app.get('/app/product/:productId/review-all', product.getProductReviewAll);
};
