const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const baseResponse = require('../../../config/baseResponseStatus');
const basketDao = require('./basketDao');

// 장바구니 조회(상품 정보만)
exports.getBasketProduct = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);

    const basketProductResult = await basketDao.getBasketProductOnly(connection, userIdFromJWT);
    connection.release();

    return basketProductResult;
};

// 장바구니 조회(나머지 정보)
exports.getBasketOthers = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);

    const basketOthersResult = await basketDao.getBasketOther(
        connection,
        userIdFromJWT,
        userIdFromJWT,
        userIdFromJWT,
    );
    connection.release();

    return basketOthersResult;
};

// 배송지 조회
exports.getAddress = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);

    const addresssResult = await basketDao.getAddress(connection, userIdFromJWT);
    connection.release();

    return addresssResult;
};
