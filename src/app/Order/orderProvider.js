const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const baseResponse = require('../../../config/baseResponseStatus');
const orderDao = require('./orderDao');
const { response, errResponse } = require('../../../config/response');

// 주문서 조회하기(장바구니 상품)
exports.getBasket = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getBasket = await orderDao.getBasket(connection, userIdFromJWT);
        connection.release();
        return getBasket;
    } catch (err) {
        logger.error(`App - getBasket Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 주문서 조회하기(유저 정보)
exports.getUserInfo = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getUserInfo = await orderDao.getUserInfo(connection, userIdFromJWT);
        connection.release();
        return getUserInfo;
    } catch (err) {
        logger.error(`App - getUserInfo Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 쿠폰 조회
exports.getCoupon = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getCoupon = await orderDao.getCoupon(connection, userIdFromJWT);
        connection.release();
        return getCoupon;
    } catch (err) {
        logger.error(`App - getCoupon Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
