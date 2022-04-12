const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const userProvider = require('./userProvider');
const userDao = require('./userDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connect } = require('http2');

exports.createUser = async function (Id, password, name, email, phoneNumber, location, birth, sex) {
    try {
        // 비밀번호 암호화
        const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');

        const insertUserInfoParams = [Id, hashedPassword, name, email, phoneNumber, birth, sex];
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            connection.beginTransaction(); // 트랜잭션 적용 시작
            const num = 1;
            const a = await userDao.insertUserInfo(connection, insertUserInfoParams);
            const b = await userDao.insertDeliveryLocation(
                connection,
                a[0].insertId,
                location,
                num,
            );
            await connection.commit(); // 커밋
            connection.release(); // conn 회수
            console.log(`추가된 회원 : ${a[0].insertId}`);
            connection.release();
            const result = {
                userId: a[0].insertId,
            };
            return response(baseResponse.SUCCESS, result);
        } catch (err) {
            await connection.rollback(); // 롤백
            connection.release(); // conn 회수
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 로그인 인증 방법 (JWT)
exports.postSignIn = async function (Id, password) {
    try {
        // 아이디 여부 확인
        const IdRows = await userProvider.IdCheck(Id);
        if (IdRows.length < 1) return errResponse(baseResponse.SIGNIN_WRONG);
        const selectId = IdRows[0].Id;

        // 비밀번호 확인
        const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
        const selectUserPasswordParams = [selectId, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        if (passwordRows[0].password != hashedPassword) {
            return errResponse(baseResponse.SIGNIN_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(Id);

        if (userInfoRows[0].status == 2) {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        }
        console.log(userInfoRows[0].userId); // DB의 userId
        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].userId,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: '365d',
                subject: 'userInfo',
            }, // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {
            userId: userInfoRows[0].userId,
            userName: userInfoRows[0].name,
            jwt: token,
        });
    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 장바구니 체크 하기
exports.checkUp = async function (basketId, userIdFromJWT) {
    const params = [basketId, userIdFromJWT];
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUp = await userDao.updateCheckUp(connection, params);

    connection.release();
    return checkUp;
};
// 장바구니 체크 취소 하기
exports.checkDown = async function (basketId, userIdFromJWT) {
    const params = [basketId, userIdFromJWT];
    const connection = await pool.getConnection(async (conn) => conn);
    const checkDown = await userDao.updateCheckDown(connection, params);

    connection.release();
    return checkDown;
};
// 전체 장바구니 체크 하기
exports.checkAllUp = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUp = await userDao.updateAllCheckUp(connection, userIdFromJWT);

    connection.release();
    return checkUp;
};
// 전체 장바구니 체크 취소 하기
exports.checkAllDown = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkDown = await userDao.updateAllCheckDown(connection, userIdFromJWT);

    connection.release();
    return checkDown;
};
// 장바구니 상품 개수 증가 시키기
exports.basketCountUp = async function (userIdFromJWT, basketId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const countUp = await userDao.basketCountUp(connection, userIdFromJWT, basketId);
    connection.release();
    return countUp;
};
// 장바구니 상품 개수 감소 시키기
exports.basketCountDown = async function (userIdFromJWT, basketId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const countDown = await userDao.basketCountDown(connection, userIdFromJWT, basketId);
    connection.release();
    return countDown;
};
// 장바구니 상품 삭제 하기
exports.basketDelete = async function (userIdFromJWT, basketId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const basketDelete = await userDao.basketDelete(connection, userIdFromJWT, basketId);
    connection.release();
    return basketDelete;
};
// 장바구니 상품 선택 삭제 하기
exports.checkBasketDelete = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkBasketDelete = await userDao.checkBasketDelete(connection, userIdFromJWT);
    connection.release();
    return checkBasketDelete;
};
// 주문하기
exports.orders = async function (
    userIdFromJWT,
    toUserName,
    toUserPhone,
    getPlace,
    accessMethod,
    message,
    couponId,
    payMethod,
    payPrice,
) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction(); //트랜잭션 적용 시작
        const orderResult = await userDao.order(
            connection,
            userIdFromJWT,
            toUserName,
            toUserPhone,
            getPlace,
            accessMethod,
            message,
            couponId,
            payMethod,
            payPrice,
        );
        const updateBasket1Result = await userDao.updateBasket1(connection, userIdFromJWT);
        await connection.commit(); // 커밋
        connection.release(); // conn 회수
    } catch (err) {
        await connection.rollback(); // 롤백
        connection.release(); // conn 회수
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 주문하고 장바구니 삭제
exports.updateBasket2 = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const updateBasket2 = await userDao.updateBasket2(connection, userIdFromJWT);
    connection.release();
    return updateBasket2;
};
// 주문하고 적립금, 결제금액 넣기
exports.inputPay = async function (payPrice, payPrice, userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const inputPay = await userDao.inputPay(connection, payPrice, payPrice, userIdFromJWT);
    connection.release();
    return inputPay;
};
