const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const orderProvider = require('./orderProvider');
const orderDao = require('./orderDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

// 주문하기
exports.orders = async function (
    userIdFromJWT,
    toUserName,
    toUserPhone,
    getPlace,
    accessMethod,
    message,
    couponId,
    payMethod,
    payPrice,
) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            connection.beginTransaction(); // SRART TRANSACTION
            const orderResult = await orderDao.order(
                connection,
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
            const updateBasket1Result = await orderDao.updateBasket1(connection, userIdFromJWT);
            const updateBasket2Result = await orderDao.updateBasket2(connection, userIdFromJWT);
            const inputPayResult = await orderDao.inputPay(
                connection,
                payPrice,
                payPrice,
                userIdFromJWT,
            );
            await connection.commit(); // COMMIT
            connection.release();
            return orderResult, updateBasket1Result, updateBasket2Result, inputPayResult;
        } catch (err) {
            await connection.rollback(); // ROLLBACK
            connection.release();
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - orders Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
