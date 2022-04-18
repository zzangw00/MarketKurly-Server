const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const baseResponse = require('../../../config/baseResponseStatus');
const userDao = require('./userDao');
const { response, errResponse } = require('../../../config/response');

// id가 있는지 체크
exports.IdCheck = async function (Id) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const IdCheckResult = await userDao.selectId(connection, Id);
        connection.release();
        return IdCheckResult;
    } catch (err) {
        logger.error(`App - IdCheck Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 계정상태 체크
exports.accountCheck = async function (Id) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const userAccountResult = await userDao.selectUserAccount(connection, Id);
        connection.release();
        return userAccountResult;
    } catch (err) {
        logger.error(`App - accountCheck Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 비밀번호가 맞는지 체크
exports.passwordCheck = async function (selectUserPasswordParams) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const passwordCheckResult = await userDao.selectUserPassword(
            connection,
            selectUserPasswordParams,
        );
        connection.release();
        return passwordCheckResult[0];
    } catch (err) {
        logger.error(
            `App - passwordCheck Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
