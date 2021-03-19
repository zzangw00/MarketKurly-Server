const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const productDao = require('./productDao');

// best 상품 조회(낮은 가격 순)
exports.rawPriceProduct = async function (value) {
    const connection = await pool.getConnection(async (conn) => conn);

    const bestProductResult = await productDao.getRawPriceProduct(connection, value);
    connection.release();

    return bestProductResult;
};
// best 상품 조회(높은 가격 순)
exports.HighPriceProduct = async function (value) {
    const connection = await pool.getConnection(async (conn) => conn);

    const bestProductResult = await productDao.getHighPriceProduct(connection, value);
    connection.release();

    return bestProductResult;
};
// 예비 장바구니 조회
exports.getPreBasketInfo = async function (userIdFromJWT, productId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const getPreBasketInfoResult = await productDao.getPreBasketInfo(
        connection,
        userIdFromJWT,
        productId,
    );
    connection.release();

    return getPreBasketInfoResult;
};
// 예비 장바구니 상품 상세 개수 조회
exports.getCountResult = async function (userIdFromJWT, preBasketId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const countResult = await productDao.getCountResult(connection, userIdFromJWT, preBasketId);
    connection.release();
    return countResult;
};
// 예비 장바구니 상태 체크
exports.checkPreBasket = async function (userIdFromJWT, productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkResult = await productDao.checkPreBasket(connection, userIdFromJWT, productId);
    connection.release();
    return checkResult;
};
