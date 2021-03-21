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
 * API No. 21
 * API Name : 상품이미지 API
 * [GET] /app/product/:productId/image
 */ exports.getProductImage = async function (req, res) {
    const productId = req.params.productId;
    const getProductImageResult = await productProvider.getProductImage(productId);

    return res.send(response(baseResponse.SUCCESS, getProductImageResult));
};
