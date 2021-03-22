const jwtMiddleware = require('../../../config/jwtMiddleware');
const productProvider = require('../../app/Product/productProvider');
const productService = require('../../app/Product/productService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');
const { emit } = require('nodemon');

/**
 * API No. 4
 * API Name : 베스트 상품 조회 API
 * [GET] /app/product
 */
exports.getBestProduct = async function (req, res) {
    const value = req.query.value;

    if (value == 'rawPrice') {
        const getBestProductResult = await productProvider.rawPriceProduct(value);
        return res.send(response(baseResponse.SUCCESS, getBestProductResult));
    } else if (value == 'highPrice') {
        const getBestProductResult = await productProvider.HighPriceProduct(value);
        return res.send(response(baseResponse.SUCCESS, getBestProductResult));
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
