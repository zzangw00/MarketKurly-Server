const productProvider = require('../../app/Product/productProvider');
const productService = require('../../app/Product/productService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

/**
 * API No. 4
 * API Name : 베스트 상품 조회 API
 * [GET] /app/product
 */
exports.getBestProduct = async function (req, res) {
    const { value, page } = req.query;
    if (!page) {
        if (value == 'rawPrice') {
            const getBestProductResult = await productProvider.rawPriceProduct();
            return res.send(response(baseResponse.SUCCESS, getBestProductResult));
        } else if (value == 'highPrice') {
            const getBestProductResult = await productProvider.HighPriceProduct();
            return res.send(response(baseResponse.SUCCESS, getBestProductResult));
        }
    } else {
        if (value == 'rawPrice') {
            const getBestProductResult = await productProvider.rawPriceProductPaging(page);
            return res.send(response(baseResponse.SUCCESS, getBestProductResult));
        } else if (value == 'highPrice') {
            const getBestProductResult = await productProvider.HighPriceProductPaging(page);
            return res.send(response(baseResponse.SUCCESS, getBestProductResult));
        }
    }
};

/**
 * API No. 11
 * API Name : 예비 장바구니 조회 API
 * [GET] /app/product/:productId/pre-basket
 */
exports.getPreBasket = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const productId = req.params.productId;
    const preBasketCheck = await productProvider.checkPreBasket(userIdFromJWT, productId);
    if (preBasketCheck[0].exist == 0) {
        const preBasketInput = await productService.inputPreBasket(userIdFromJWT, productId);
        const preBasketResponse = await productProvider.getPreBasketInfo(userIdFromJWT, productId);
        return res.send(response(baseResponse.SUCCESS, preBasketResponse[0]));
    } else {
        const preBasketResponse = await productProvider.getPreBasketInfo(userIdFromJWT, productId);
        return res.send(response(baseResponse.SUCCESS, preBasketResponse[0]));
    }
};

/**
 * API No. 12
 * API Name : 예비 장바구니 상품 개수 증가 시키기 API
 * [PATCH] /app/product/preBasket/:preBasketId/count-up
 */ exports.updateProductCountUp = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const preBasketId = req.params.preBasketId;
    const preBasketCountUpResult = await productService.basketCountUp(userIdFromJWT, preBasketId);
    const countResult = await productProvider.getCountResult(userIdFromJWT, preBasketId);
    const result = {
        countResult: countResult[0],
        comment: '상품 개수를 증가 시켰습니다.',
    };
    return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 13
 * API Name : 예비 장바구니 상품 개수 감소 시키기 API
 * [PATCH] /app/product/preBasket/:preBasketId/count-down
 */ exports.updateProductCountDown = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const preBasketId = req.params.preBasketId;
    const preBasketCountUpResult = await productService.basketCountDown(userIdFromJWT, preBasketId);
    const countResult = await productProvider.getCountResult(userIdFromJWT, preBasketId);
    const result = {
        countResult: countResult[0],
        comment: '상품 개수를 감소 시켰습니다.',
    };
    return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 14
 * API Name : 예비 장바구니 닫기 API
 * [PATCH] /app/preBasket/:preBasketId/reset
 */ exports.resetPreBasket = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const preBasketId = req.params.preBasketId;
    const resetPreBasketResult = await productService.preBasketReset(userIdFromJWT, preBasketId);
    const countResult = await productProvider.getCountResult(userIdFromJWT, preBasketId);
    const result = {
        countResult: countResult[0],
        comment: '상품 개수를 초기화 시켰습니다.',
    };
    return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 15
 * API Name : 장바구니 추가 API 체크 했는데 없으면 추가, 있는데 현재 장바구니에 없으면 status = 1로 변경, 있는데 현재 장바구니에 있으면 detailCount +
 * [POST] /app/product/:productId/basket
 */ exports.inputBasket = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const productId = req.params.productId;
    const basketCheck = await productProvider.checkBasket(userIdFromJWT, productId);
    const basketStatus = await productProvider.checkBasketStatus(userIdFromJWT, productId);
    if (basketCheck[0].exist == 0) {
        const inputBasket = await productService.inputBasket(userIdFromJWT, productId);
        const inputBasketResult = await productProvider.inputBasketResult(userIdFromJWT, productId);
        const result = {
            countResult: inputBasketResult[0],
            comment: '장바구니에 상품을 담았습니다.',
        };
        return res.send(response(baseResponse.SUCCESS, result));
    } else {
        if (basketStatus[0].status == 2) {
            const changeBasket = await productService.changeBasket(
                userIdFromJWT,
                productId,
                userIdFromJWT,
                productId,
            );
            const inputBasketResult = await productProvider.inputBasketResult(
                userIdFromJWT,
                productId,
            );
            const result = {
                countResult: inputBasketResult[0],
                comment: '장바구니에 상품을 담았습니다.',
            };
            return res.send(response(baseResponse.SUCCESS, result));
        } else {
            const updateBasket = await productService.updateBasket(
                userIdFromJWT,
                productId,
                userIdFromJWT,
                productId,
            );
            const inputBasketResult = await productProvider.inputBasketResult(
                userIdFromJWT,
                productId,
            );
            const result = {
                countResult: inputBasketResult[0],
                comment: '이미 장바구니에 있어 상품을 추가로 담았습니다.',
            };
            return res.send(response(baseResponse.SUCCESS, result));
        }
    }
};
/**
 * API No. 21
 * API Name : 상품설명 API
 * [GET] /app/product/:productId/info
 */ exports.getProductInfo = async function (req, res) {
    const productId = req.params.productId;
    const getProductInfoResult = await productProvider.getProductInfo(productId);

    return res.send(response(baseResponse.SUCCESS, getProductInfoResult));
};
/**
 * API No. 22
 * API Name : 상품이미지 API
 * [GET] /app/product/:productId/image
 */ exports.getProductImage = async function (req, res) {
    const productId = req.params.productId;
    const getProductImageResult = await productProvider.getProductImage(productId);

    return res.send(response(baseResponse.SUCCESS, getProductImageResult));
};
/**
 * API No. 23
 * API Name : 상품 상세설명 API
 * [GET] /app/product/:productId/detail
 */ exports.getProductDetail = async function (req, res) {
    const productId = req.params.productId;
    const getProductDetailResult = await productProvider.getProductDetail(productId);

    return res.send(response(baseResponse.SUCCESS, getProductDetailResult));
};
/**
 * API No. 24
 * API Name : 후기 전반적인 화면 API
 * [GET] /app/product/:productId/review
 */ exports.getProductReview = async function (req, res) {
    const productId = req.params.productId;
    const getProductReviewResult = await productProvider.getProductReview(productId);

    return res.send(response(baseResponse.SUCCESS, getProductReviewResult));
};
/**
 * API No. 25
 * API Name : 후기 개수 API
 * [GET] /app/product/:productId/review-count
 */ exports.getProductReviewCount = async function (req, res) {
    const productId = req.params.productId;
    const getProductReviewCountResult = await productProvider.getProductReviewCount(productId);

    return res.send(response(baseResponse.SUCCESS, getProductReviewCountResult));
};
/**
 * API No. 26
 * API Name : 후기 전체보기 API
 * [GET] /app/product/:productId/review-all
 */ exports.getProductReviewAll = async function (req, res) {
    const productId = req.params.productId;
    const getProductReviewAllResult = await productProvider.getProductReviewAll(productId);

    return res.send(response(baseResponse.SUCCESS, getProductReviewAllResult));
};
/**
 * API No. 27
 * API Name : 상품 후기 상세 API
 * [GET] /app/productReview/:productReviewId/review-detail
 */ exports.getProductReviewDetail = async function (req, res) {
    const productReviewId = req.params.productReviewId;
    const getProductReviewDetailResult = await productProvider.getProductReviewDetail(
        productReviewId,
    );

    return res.send(response(baseResponse.SUCCESS, getProductReviewDetailResult));
};
/**
 * API No. 28
 * API Name : 상품 문의 전반적인 화면 API
 * [GET] /app/product/:productId/inquire
 */ exports.getProductInquire = async function (req, res) {
    const productId = req.params.productId;
    const getProductInquireResult = await productProvider.getProductInquire(productId);

    return res.send(response(baseResponse.SUCCESS, getProductInquireResult));
};
/**
 * API No. 29
 * API Name : 문의 전체보기 API
 * [GET] /app/product/:productId/inquire-all
 */ exports.getProductInquireAll = async function (req, res) {
    const productId = req.params.productId;
    const getProductInquireAllResult = await productProvider.getProductInquireAll(productId);

    return res.send(response(baseResponse.SUCCESS, getProductInquireAllResult));
};
/**
 * API No. 30
 * API Name : 문의 상세보기 API
 * [GET] /app/productInquire/:productInquireId/inquire-detail
 */ exports.getProductInquireDetail = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const productInquireId = req.params.productInquireId;
    const getProductInquireDetailCheck = await productProvider.getProductInquireDetail(
        productInquireId,
    );
    if (getProductInquireDetailCheck[0].userId == userIdFromJWT) {
        return res.send(response(baseResponse.SUCCESS, getProductInquireDetailCheck));
    } else {
        return res.send(response(baseResponse.USER_ID_NOT_MATCHED));
    }
};
/**
 * API No. 31
 * API Name : 상품 문의하기 API
 * [POST] /app/users/product/:productId/inquire
 */ exports.postProductInquire = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const productId = req.params.productId;
    const { title, content, secretStatus } = req.body;
    const postProductInquireResult = await productService.postProductInquire(
        userIdFromJWT,
        productId,
        title,
        content,
        secretStatus,
    );
    result = {
        comment: '문의가 완료되었습니다.',
    };
    return res.send(response(baseResponse.SUCCESS, result));
};
/**
 * API No. 32
 * API Name : 상품 문의하기 화면 API
 * [GET] /app/users/product/:productId/inquire-info
 */ exports.postProductInquireInfo = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const productId = req.params.productId;
    const postProductInquireInfoResult = await productProvider.postProductInquireInfo(productId);
    return res.send(response(baseResponse.SUCCESS, postProductInquireInfoResult[0]));
};
/**
 * API No. 33
 * API Name : 상위 카테고리 조회 API
 * [GET] /app/product/productCategory
 */ exports.getProductCategory = async function (req, res) {
    const productCategoryResult = await productProvider.getProductCategory();
    return res.send(response(baseResponse.SUCCESS, productCategoryResult));
};
/**
 * API No. 34
 * API Name : 하위 카테고리 조회 API
 * [GET] /app/product/productCategory/:productCategoryId/detail
 */ exports.getProductCategoryDetail = async function (req, res) {
    const productCategoryId = req.params.productCategoryId;
    const productCategoryDetailResult = await productProvider.getProductCategoryDetail(
        productCategoryId,
    );
    return res.send(response(baseResponse.SUCCESS, productCategoryDetailResult));
};
/**
 * API No. 35
 * API Name : 카테고리 별 상품 조회 API
 * [GET] /app/product/DetailCategory/:detailCategoryId/info
 */ exports.getProductByDetailCategoryId = async function (req, res) {
    const detailCategoryId = req.params.detailCategoryId;
    const getCategory = await productProvider.getDetailCategory(detailCategoryId);
    const getProductByByDetailCategoryIdResult = await productProvider.getProductByDetailCategoryId(
        detailCategoryId,
    );

    const result = {
        category: getCategory[0],
        productInfo: getProductByByDetailCategoryIdResult,
    };
    return res.send(response(baseResponse.SUCCESS, result));
};
/**
 * API No. 36
 * API Name : 상위 카테고리 전체 상품 조회 API
 * [GET] /app/product/productCategory/:productCategoryId/info
 */ exports.getProductByCategoryId = async function (req, res) {
    const productCategoryId = req.params.productCategoryId;
    const getCategory = await productProvider.getCategory(productCategoryId);
    const getProductByCategoryIdResult = await productProvider.getProductByCategoryId(
        productCategoryId,
    );

    const result = {
        category: getCategory[0],
        productInfo: getProductByCategoryIdResult,
    };
    return res.send(response(baseResponse.SUCCESS, result));
};
/**
 * API No. 37
 * API Name : 신상품 조회 API
 * [GET] /app/product/new
 */
exports.getNewProduct = async function (req, res) {
    const getNewProductResult = await productProvider.getNewProduct();
    return res.send(response(baseResponse.SUCCESS, getNewProductResult));
};
/**
 * API No. 38
 * API Name : 알뜰상품 조회 API
 * [GET] /app/product/sales
 */
exports.getSalesProduct = async function (req, res) {
    const getSalesProductResult = await productProvider.getSalesProduct();
    return res.send(response(baseResponse.SUCCESS, getSalesProductResult));
};
/**
 * API No. 39
 * API Name : 금주혜택 조회 API
 * [GET] /app/product/benefits
 */
exports.getBenefits = async function (req, res) {
    const getBenefitsResult = await productProvider.getBenefits();
    return res.send(response(baseResponse.SUCCESS, getBenefitsResult));
};
/**
 * API No. 40
 * API Name : 금주혜택 상품 조회 API
 * [GET] /app/product/benefits/:benefitsId/info
 */
exports.getBenefitsProduct = async function (req, res) {
    const benefitsId = req.params.benefitsId;
    const getBenefitsName = await productProvider.getBenefitsName(benefitsId);
    const getBenefitsProductResult = await productProvider.getBenefitsProducts(benefitsId);
    const result = {
        benefitsTitle: getBenefitsName[0],
        benefitsProduct: getBenefitsProductResult,
    };
    return res.send(response(baseResponse.SUCCESS, result));
};
/**
 * API No. 43
 * API Name : 상품 검색 API
 * [GET] /app/products
 */
exports.getProducts = async function (req, res) {
    const { productName } = req.query;
    if (!productName) {
        return res.send(response(baseResponse.PRODUCT_NAME_EMPTY));
    } else {
        const productListByProductName = await productProvider.getProducts(productName);
        return res.send(response(baseResponse.SUCCESS, productListByProductName));
    }
};
/**
 * API No. 44
 * API Name : 자주 사는 상품 API
 * [GET] /app/products/often
 */
exports.getOftenProducts = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const checkBuy = await productProvider.checkBuy(userIdFromJWT);
    if (checkBuy[0].exist == 0) {
        return res.send(response(baseResponse.PRODUCT_BUY_EMPTY));
    } else {
        const getOftenProductsResult = await productProvider.getOftenProducts(userIdFromJWT);
        return res.send(response(baseResponse.SUCCESS, getOftenProductsResult));
    }
};

/**
 * API No. 45
 * API Name : 상품 검색 API
 * [GET] /app/product/product-search
 */
exports.serchProduct = async function (req, res) {
    const { searchName } = req.query;
    const searchResult = await productProvider.getProduct(searchName);
    const searchAdd = await productService.addSearch(searchName);
    return res.send(response(baseResponse.SUCCESS, searchResult));
};

/**
 * API No. 45
 * API Name : 상품 검색 API
 * [GET] /app/products/popular
 */
exports.getPopularProducts = async function (req, res) {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let hours = today.getHours();
    if (month < 10) {
        month = '0' + month;
    }
    let startHours = year + '-' + month + '-' + date + ' ' + (hours - 1) + ':00:00';
    let endHours = year + '-' + month + '-' + date + ' ' + (hours - 1) + ':59:59';
    const popularResult = await productProvider.getPopularProduct(startHours, endHours);
    return res.send(response(baseResponse.SUCCESS, popularResult));
};
