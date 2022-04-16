const orderProvider = require('../../app/Order/orderProvider');
const orderService = require('../../app/Order/orderService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

/**
 * API No. 41
 * API Name : 주문서 조회 하기 API
 * [GET] /app/users/order-info
 */ exports.orderInfo = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const getBasket = await orderProvider.getBasket(userIdFromJWT);
    const getUserInfo = await orderProvider.getUserInfo(userIdFromJWT);
    const getCoupon = await orderProvider.getCoupon(userIdFromJWT);
    const result = {
        productInfo: getBasket,
        userInfo: getUserInfo[0],
        coupon: getCoupon,
    };
    return res.send(response(baseResponse.SUCCESS, result));
};
/**
 * API No. 42
 * API Name : 주문하기 API
 * [POST] /app/users/order
 */ exports.addOrder = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const {
        toUserName,
        toUserPhone,
        getPlace,
        accessMethod,
        message,
        couponId,
        payMethod,
        payPrice,
    } = req.body;

    const order = await orderService.orders(
        userIdFromJWT,
        toUserName,
        toUserPhone,
        getPlace,
        accessMethod,
        message,
        couponId,
        payMethod,
        payPrice,
    );

    return res.send(response(baseResponse.SUCCESS, '주문이 완료 되었습니다.'));
};
