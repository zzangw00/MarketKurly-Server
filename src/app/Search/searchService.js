const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const searchProvider = require('./searchProvider');
const searchDao = require('./searchDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

// 검색어 추가
exports.addSearch = async function (searchName) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const addSearch = await searchDao.addSearch(connection, searchName);
        connection.release();
        return addSearch;
    } catch (err) {
        logger.error(`App - addSearch Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
