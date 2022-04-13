const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const basketProvider = require('./basketProvider');
const basketDao = require('./basketDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

// 장바구니 상품 개수 변경
exports.changeBasketCount = async function (userIdFromJWT, basketId, count) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const changeResult = await basketDao.changeBasketCount(
            connection,
            userIdFromJWT,
            basketId,
            count,
        );
        connection.release();
        return changeResult;
    } catch (err) {
        logger.error(`App - changBasketCount Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 장바구니 상품 삭제 하기
exports.basketDelete = async function (userIdFromJWT, basketId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const basketDelete = await basketDao.basketDelete(connection, userIdFromJWT, basketId);
        connection.release();
        return basketDelete;
    } catch (err) {
        logger.error(`App - basketDelete Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
