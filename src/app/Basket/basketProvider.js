const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const baseResponse = require('../../../config/baseResponseStatus');
const basketDao = require('./basketDao');
const { response, errResponse } = require('../../../config/response');

// 장바구니 조회(상품 정보만)
exports.getBasketProduct = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const basketProductResult = await basketDao.getBasketProductOnly(connection, userIdFromJWT);
        connection.release();

        return basketProductResult;
    } catch (err) {
        logger.error(
            `App - getBasketProduct Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 장바구니 조회(나머지 정보)
exports.getBasketOthers = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const basketOthersResult = await basketDao.getBasketOther(
            connection,
            userIdFromJWT,
            userIdFromJWT,
            userIdFromJWT,
        );
        connection.release();

        return basketOthersResult;
    } catch (err) {
        logger.error(
            `App - getBasketOthers Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 배송지 조회
exports.getAddress = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const addresssResult = await basketDao.getAddress(connection, userIdFromJWT);
        connection.release();

        return addresssResult;
    } catch (err) {
        logger.error(`App - getAddress Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
