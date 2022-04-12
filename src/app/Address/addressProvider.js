const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const baseResponse = require('../../../config/baseResponseStatus');
const userDao = require('./userDao');

// 배송지 조회
exports.getAddress = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const addressResult = await userDao.getLocation(connection, userIdFromJWT);
        connection.release();
        return addressResult;
    } catch (err) {
        logger.error(`App - Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 배송지 체크 조회
exports.getCheckLocation = async function (userIdFromJWT, addressId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const addressResult = await userDao.getCheckAddress(connection, userIdFromJWT, addressId);
        connection.release();
        return addressResult;
    } catch (err) {
        logger.error(`App - Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 배송지 체크 조회
exports.getCheckAddress = async function (userIdFromJWT, addressId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const addressResult = await userDao.getCheckAddress(connection, userIdFromJWT, addressId);
        connection.release();
        return addressResult;
    } catch (err) {
        logger.error(`App - Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
