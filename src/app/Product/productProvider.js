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
// 장바구니 있는지 체크
exports.checkBasket = async function (userIdFromJWT, productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkResult = await productDao.checkBasket(connection, userIdFromJWT, productId);
    connection.release();
    return checkResult;
};
// 장바구니 상태 체크
exports.checkBasketStatus = async function (userIdFromJWT, productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkResult = await productDao.checkBasketStatus(connection, userIdFromJWT, productId);
    connection.release();
    return checkResult;
};
// 장바구니 조회
exports.inputBasketResult = async function (userIdFromJWT, productId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const getBasketInfoResult = await productDao.getBasketInfo(
        connection,
        userIdFromJWT,
        productId,
    );
    connection.release();

    return getBasketInfoResult;
};
// 상품설명
exports.getProductInfo = async function (productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getProductInfo = await productDao.getProductInfo(connection, productId);
    connection.release();
    return getProductInfo;
};
// 상품이미지
exports.getProductImage = async function (productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getProductImage = await productDao.getProductImage(connection, productId);
    connection.release();
    return getProductImage;
};
// 상품 상세설명
exports.getProductDetail = async function (productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getProductDetail = await productDao.getProductDetail(connection, productId);
    connection.release();
    return getProductDetail;
};
// 후기 전반적인 화면
exports.getProductReview = async function (productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getProductReview = await productDao.getProductReview(connection, productId);
    connection.release();
    return getProductReview;
};
// 후기 개수
exports.getProductReviewCount = async function (productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getProductReviewCount = await productDao.getProductReviewCount(connection, productId);
    connection.release();
    return getProductReviewCount;
};
// 후기 전체보기 화면
exports.getProductReviewAll = async function (productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getProductReviewAll = await productDao.getProductReviewAll(connection, productId);
    connection.release();
    return getProductReviewAll;
};
// 상품 후기 상세
exports.getProductReviewDetail = async function (productReviewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getProductReviewDetail = await productDao.getProductReviewDetail(
        connection,
        productReviewId,
    );
    connection.release();
    return getProductReviewDetail;
};
// 상품 문의 전반적인 화면
exports.getProductInquire = async function (productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getProductInquire = await productDao.getProductInquire(connection, productId);
    connection.release();
    return getProductInquire;
};
// 문의 전체보기 화면
exports.getProductInquireAll = async function (productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getProductInquireAll = await productDao.getProductInquireAll(connection, productId);
    connection.release();
    return getProductInquireAll;
};
