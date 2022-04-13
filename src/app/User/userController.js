const jwtMiddleware = require('../../../config/jwtMiddleware');
const userProvider = require('../../app/User/userProvider');
const userService = require('../../app/User/userService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');
const regexEmail = require('regex-email');
const IdRegExp = /^.*(?=.{6,16})(?=.*[0-9])(?=.*[a-zA-Z]).*$/; // 6~16 자 이내 숫자 + 영문

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {
    /**
     * Body: Id, password, email
     */
    const { Id, password, name, email, phoneNumber, location, birth, sex } = req.body;
    var num = password.search(/[0-9]/g);
    var eng = password.search(/[a-z]/gi);
    var spe = password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    // 형식 체크 (by 정규표현식)
    if (!IdRegExp.test(Id)) return res.send(response(baseResponse.SIGNUP_ID_ERROR_TYPE));
    if (password.length < 10) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE_LENGTH));
    } else if (
        password.search(/\s/) != -1 ||
        (num < 0 && eng < 0) ||
        (eng < 0 && spe < 0) ||
        (spe < 0 && num < 0)
    ) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE_VAL));
    } else if (/(\w)\1\1/.test(password)) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE_CONTINUOUS));
    }
    if (!regexEmail.test(email)) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    }
    if (!Id) {
        return res.send(response(baseResponse.SIGNUP_ID_ERROR_EMPTY));
    }
    if (!password) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_EMPTY));
    }
    if (!name) {
        return res.send(response(baseResponse.SIGNUP_NAME_ERROR_EMPTY));
    }
    if (!email) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_EMPTY));
    }
    if (!phoneNumber) {
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_ERROR_EMPTY));
    }
    if (!location) {
        return res.send(response(baseResponse.SIGNUP_LOCATION_ERROR_EMPTY));
    }

    const signUpResponse = await userService.createUser(
        Id,
        password,
        name,
        email,
        phoneNumber,
        location,
        birth,
        sex,
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : ID 중복검사 API
 * [POST] /app/users/Id
 * body : Id
 */
exports.chekId = async function (req, res) {
    const { Id } = req.body;

    if (!Id) {
        return res.send(response(baseResponse.SIGNUP_ID_ERROR_EMPTY));
    }
    if (!IdRegExp.test(Id)) return res.send(response(baseResponse.SIGNUP_ID_ERROR_TYPE));

    const IdRows = await userProvider.IdCheck(Id);
    if (IdRows.length > 0) {
        return res.send(response(baseResponse.SIGNUP_REDUNDANT_ID));
    } else {
        return res.send(response(baseResponse.SUCCESS, '사용가능한 아이디 입니다.'));
    }
};

/**
 * API No. 3
 * API Name : 로그인 API
 * [POST] /app/users/login
 * body : Id, passsword
 */
exports.login = async function (req, res) {
    const { Id, password } = req.body;

    if (!Id) {
        return res.send(response(baseResponse.SIGNUP_ID_ERROR_EMPTY));
    } else if (!password) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_EMPTY));
    }

    const signInResponse = await userService.postSignIn(Id, password);

    return res.send(signInResponse);
};

/**
 * API No. 6
 * API Name : 자동 로그인 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    console.log(userIdFromJWT);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

/**
 * API No. 41
 * API Name : 주문서 조회 하기 API
 * [GET] /app/users/order-info
 */ exports.orderInfo = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const getBasket = await userProvider.getBasket(userIdFromJWT);
    const getUserInfo = await userProvider.getUserInfo(userIdFromJWT);
    const getCoupon = await userProvider.getCoupon(userIdFromJWT);
    const result = {
        productInfo: getBasket,
        userInfo: getUserInfo[0],
        coupon: getCoupon,
    };
    return res.send(response(baseResponse.SUCCESS, result));
};
/**
 * API No. 42
 * API Name : 주문하기 API
 * [POST] /app/users/order
 */ exports.order = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const {
        toUserName,
        toUserPhone,
        getPlace,
        accessMethod,
        message,
        couponId,
        payMethod,
        payPrice,
    } = req.body;

    const order = await userService.orders(
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
    const updateBasket2 = await userService.updateBasket2(userIdFromJWT);
    const inputPay = await userService.inputPay(payPrice, payPrice, userIdFromJWT);

    return res.send(response(baseResponse.SUCCESS, '주문이 완료 되었습니다.'));
};
