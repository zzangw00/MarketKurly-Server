const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const productProvider = require('./productProvider');
const productDao = require('./productDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

// 장바구니 추가 시키기
exports.inputBasket = async function (userIdFromJWT, productId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const inputBasket = await productDao.inputBasket(connection, userIdFromJWT, productId);
        connection.release();
        return inputBasket;
    } catch (err) {
        logger.error(`App - inputBasket Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 장바구니 상태 변경 시키기
exports.changeBasket = async function (userIdFromJWT, productId, productCount) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const changeBasket = await productDao.changeBasket(
            connection,
            userIdFromJWT,
            productId,
            productCount,
        );
        connection.release();
        return changeBasket;
    } catch (err) {
        logger.error(`App - changeBasket Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 장바구니 상품 개수 변경
exports.updateBasket = async function (userIdFromJWT, productId, userIdFromJWT, productId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const updateBasket = await productDao.updateBasket(
            connection,
            userIdFromJWT,
            productId,
            productCount,
        );
        connection.release();
        return updateBasket;
    } catch (err) {
        logger.error(`App - updateBasket Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 상품 문의 추가
exports.postProductInquire = async function (
    userIdFromJWT,
    productId,
    title,
    content,
    secretStatus,
) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postProductInquire = await productDao.postProductInquire(
            connection,
            userIdFromJWT,
            productId,
            title,
            content,
            secretStatus,
        );
        connection.release();
        return postProductInquire;
    } catch (err) {
        logger.error(
            `App - postProductInquire Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
