const jwtMiddleware = require('../../../config/jwtMiddleware');
const userProvider = require('../../app/User/userProvider');
const userService = require('../../app/User/userService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');
const { emit } = require('nodemon');
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
 * API No. 5
 * API Name : 장바구니 조회 API
 * [GET] /app/users/:userId/basket
 */
exports.getBasketOnlyProduct = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    if (userId != userIdFromJWT) {
        return res.send(response(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const basketProductResponse = await userProvider.getBasketProduct(userId);
        return res.send(basketProductResponse);
    }
};
