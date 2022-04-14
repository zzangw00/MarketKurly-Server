const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const baseResponse = require('../../../config/baseResponseStatus');
const searchDao = require('./searchDao');
const { response, errResponse } = require('../../../config/response');

// 상품 검색
exports.getProduct = async function (searchName) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductsResult = await searchDao.getSearchProducts(connection, searchName);
        connection.release();
        return getProductsResult;
    } catch (err) {
        logger.error(`App - getProduct Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
