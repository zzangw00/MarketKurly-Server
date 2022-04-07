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

    // 27. 상품 후기 상세 API
    app.get('/app/productReview/:productReviewId/review-detail', product.getProductReviewDetail);

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

    // 43. 상품 검색하기 API
    app.get('/app/products', product.getProducts);

    // 44. 자주 사는 상품 API
    app.get('/app/products/often', jwtMiddleware, product.getOftenProducts);

    // 상품 검색 API
    app.post('/app/product/product-search', product.serchProduct);
};
