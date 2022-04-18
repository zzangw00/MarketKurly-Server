const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const addressProvider = require('./addressProvider');
const addressDao = require('./addressDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

// 배송지 선택 하기
exports.checkAddress = async function (userIdFromJWT, addressId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            connection.beginTransaction(); // SRART TRANSACTION
            const checkAddress1 = await addressDao.checkAddress1(connection, userIdFromJWT);
            const checkAddress2 = await addressDao.checkAddress2(
                connection,
                userIdFromJWT,
                addressId,
            );
            await connection.commit(); // COMMIT
            connection.release();
            return checkAddress1, checkAddress2;
        } catch (err) {
            await connection.rollback(); // ROLLBACK
            connection.release();
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - checkAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 배송지 추가 하기1
exports.addAddress1 = async function (userIdFromJWT, address) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            connection.beginTransaction(); // SRART TRANSACTION
            const addAddress1 = await addressDao.addAddress1(connection, userIdFromJWT);
            const addAddress2 = await addressDao.addAddress2(connection, userIdFromJWT, address);
            await connection.commit(); // COMMIT
            connection.release();
            return addAddress1, addAddress2;
        } catch (err) {
            await connection.rollback(); // ROLLBACK
            connection.release();
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - addAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
