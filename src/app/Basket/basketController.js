const jwtMiddleware = require('../../../config/jwtMiddleware');
const basketProvider = require('../../app/Basket/basketProvider');
const basketService = require('../../app/Basket/basketService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

/**
 * API No. 5
 * API Name : 장바구니 조회 API
 * [GET] /app/basket
 */
exports.getBasket = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;

    const basketProductResult = await basketProvider.getBasketProduct(userIdFromJWT);
    const basketOtherResult = await basketProvider.getBasketOthers(userIdFromJWT);
    const addressResult = await basketProvider.getAddress(userIdFromJWT);
    const result = {
        addressInfo: addressResult,
        productInfo: basketProductResult,
        otherInfo: basketOtherResult,
    };

    return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 10
 * API Name : 장바구니 상품 개수 변경 API
 * [PATCH] /app/basket/:basketId/count
 */
exports.updateProductCount = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const { basketId, count } = req.body;
    const basketCountResult = await basketService.changeBasketCount(userIdFromJWT, basketId, count);

    return res.send(response(baseResponse.SUCCESS, result, '상품 개수를 변경 하였습니다.'));
};

/**
 * API No. 16
 * API Name : 장바구니 상품 삭제 API(선택삭제 추가)
 * [PATCH] /app/basket/delete
 */
exports.deleteBasket = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const basketId = req.params.basketId;
    const basketDeleteResult = await basketService.basketDelete(userIdFromJWT, basketId);

    return res.send(response(baseResponse.SUCCESS, '상품을 삭제 하였습니다.'));
};
