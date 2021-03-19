const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const userDao = require('./userDao');

// Provider: Read 비즈니스 로직 처리
exports.IdCheck = async function (Id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const IdCheckResult = await userDao.selectId(connection, Id);
    connection.release();

    return IdCheckResult;
};

// 계정상태 체크
exports.accountCheck = async function (Id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userAccountResult = await userDao.selectUserAccount(connection, Id);
    connection.release();

    return userAccountResult;
};

// 비밀번호가 맞는지 체크
exports.passwordCheck = async function (selectUserPasswordParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const passwordCheckResult = await userDao.selectUserPassword(
        connection,
        selectUserPasswordParams,
    );
    connection.release();
    return passwordCheckResult[0];
};

// 장바구니 조회(상품 정보만)
exports.getBasketProduct = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);

    const basketProductResult = await userDao.getBasketProductOnly(connection, userIdFromJWT);
    connection.release();

    return basketProductResult;
};

// 장바구니 조회(나머지 정보)
exports.getBasketOthers = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);

    const basketOthersResult = await userDao.getBasketOther(connection, userIdFromJWT);
    connection.release();

    return basketOthersResult;
};

// 배송지 조회
exports.getDeliveryLocation = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);

    const deliveryLocationResult = await userDao.getDeliveryLocation(connection, userIdFromJWT);
    connection.release();

    return deliveryLocationResult;
};

// 장바구니 체크 상태 조회
exports.getCheckStatus = async function (basketId, userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkResult = await userDao.getBasketCheck(connection, basketId, userIdFromJWT);
    connection.release();
    return checkResult;
};

// 장바구니 체크 상태 조회
exports.getCheckAllStatus = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkResult = await userDao.getBasketAllCheck(connection, userIdFromJWT);
    connection.release();
    return checkResult;
};

// 장바구니 상품 상세 개수 조회
exports.getCountResult = async function (userIdFromJWT, basketId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const countResult = await userDao.getCountResult(connection, userIdFromJWT, basketId);
    connection.release();
    return countResult;
};
