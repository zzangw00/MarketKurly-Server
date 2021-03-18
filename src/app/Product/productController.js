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
    const productId = req.params.productId;

    const preBasketResponse = await productProvider.getPreBasketInfo(productId);

    return res.send(response(baseResponse.SUCCESS, preBasketResponse[0]));
};
