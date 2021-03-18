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
exports.basketCountUp = async function (preBasketId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const countUp = await productDao.basketCountUp(connection, preBasketId);
    connection.release();
    return countUp;
};
