const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const productProvider = require('./productProvider');
const productDao = require('./productDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connect } = require('http2');

// Service: Create, Update, Delete 비즈니스 로직 처리

// 예비 장바구니 상품 개수 증가 시키기
exports.basketCountUp = async function (userIdFromJWT, preBasketId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const countUp = await productDao.basketCountUp(connection, userIdFromJWT, preBasketId);
    connection.release();
    return countUp;
};
// 예비 장바구니 상품 개수 감소 시키기
exports.basketCountDown = async function (userIdFromJWT, preBasketId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const countDown = await productDao.basketCountDown(connection, userIdFromJWT, preBasketId);
    connection.release();
    return countDown;
};
// 예비 장바구니 추가 시키기
exports.inputPreBasket = async function (userIdFromJWT, productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const countDown = await productDao.inputPreBasket(connection, userIdFromJWT, productId);
    connection.release();
    return countDown;
};
// 예비 장바구니 초기화 시키기
exports.preBasketReset = async function (userIdFromJWT, productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const countReset = await productDao.resetPreBasket(connection, userIdFromJWT, productId);
    connection.release();
    return countReset;
};
