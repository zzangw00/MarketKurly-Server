module.exports = function (app) {
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const { apiLimiter } = require('../../../config/limiter');
    const { getProductIdCache } = require('../../../config/redis');

    // 4. 베스트 상품 조회 API
    app.get('/app/product/best', product.getBestProduct);

    // 21. 상품설명 API
    app.get('/app/product/:productId', getProductIdCache, product.getProductInfo);

    // 23. 상품 상세정보 API
    app.get('/app/product/:productId/detail', product.getProductDetail);

    // 24. 후기 전반적인 화면 API
    app.get('/app/product/:productId/review', product.getProductReview);

    // 26. 후기 전체보기 API
    app.get('/app/product/:productId/review-all', product.getProductReviewAll);

    // 27. 상품 후기 상세 API
    app.get('/app/productReview/:productReviewId/review-detail', product.getProductReviewDetail);

    // 15. 장바구니 추가 API
    app.post('/app/product/input-basket', jwtMiddleware, product.inputBasket);

    // 28. 상품 문의 전반적인 화면 API
    app.get('/app/product/:productId/inquire', product.getProductInquire);

    // 29. 상품 문의 전체 조회 API
    app.get('/app/product/:productId/inquire-all', product.getProductInquireAll);

    // 30. 상품 문의 상세 조회 API
    app.get(
        '/app/productInquire/:productInquireId/inquire-detail',
        jwtMiddleware,
        product.getProductInquireDetail,
    );
    // 31. 상품 문의하기 API
    app.post('/app/users/product/:productId/inquire', jwtMiddleware, product.postProductInquire);

    // 32. 상품 문의하기 화면 API
    app.get(
        '/app/users/product/:productId/inquire-info',
        jwtMiddleware,
        product.postProductInquireInfo,
    );

    // 33. 상위 카테고리 조회 API
    app.get('/app/product/productCategory', product.getProductCategory);

    // 34. 하위 카테고리 조회 API
    app.get(
        '/app/product/productCategory/:productCategoryId/detail',
        product.getProductCategoryDetail,
    );

    // 35. 카테고리 별 상품 조회 API
    app.get(
        '/app/product/DetailCategory/:detailCategoryId/info',
        product.getProductByDetailCategoryId,
    );

    // 36. 상위 카테고리 전체 상품 조회 API
    app.get('/app/product/productCategory/:productCategoryId/info', product.getProductByCategoryId);

    // 37. 신상품 조회 API
    app.get('/app/product/new', product.getNewProduct);

    // 38. 알뜰상품 조회 API
    app.get('/app/product/sales', product.getSalesProduct);

    // 39. 금주혜택 조회 API
    app.get('/app/product/benefits', product.getBenefits);

    // 40. 금주혜택 상품 조회 API
    app.get('/app/product/benefits/:benefitsId/info', product.getBenefitsProduct);

    // 44. 자주 사는 상품 API
    app.get('/app/products/often', jwtMiddleware, product.getOftenProducts);

    // 실시간 인기 검색어 조회 API
    app.get('/app/products/popular', product.getPopularProducts);

    // 찜하기 API
    app.post('/app/product/wish-product', jwtMiddleware, product.wishProduct);

    // 상품 삭제 API
    app.patch('/app/product/:productId/delete', product.deleteProduct);
};
