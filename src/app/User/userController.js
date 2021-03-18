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
 * [GET] /app/users/basket
 */
exports.getBasketOnlyProduct = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;

    const basketProductResponse = await userProvider.getBasketProduct(userIdFromJWT);
    const basketOtherResponse = await userProvider.getBasketOthers(userIdFromJWT);
    const deliveryResponse = await userProvider.getDeliveryLocation(userIdFromJWT);
    const result = {
        deliveryInfo: deliveryResponse,
        productInfo: basketProductResponse,
        otherInfo: basketOtherResponse,
    };

    return res.send(response(baseResponse.SUCCESS, result));
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

//체크 되어있는지 확인 먼저 체크 되어있으면 해제, 안되어 있으면 체크
/**
 * API No. 7
 * API Name : 장바구니 체크하기 API
 * [PATCH] /app/users/basket/:basketId/check
 */ exports.basketCheck = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const basketId = req.params.basketId;
    const basketCheckStatus = await userProvider.getCheckStatus(+basketId, userIdFromJWT);
    if (basketCheckStatus[0].checkStatus == 1) {
        const unCheck = await userService.checkDown(+basketId, userIdFromJWT);
        return res.send(response(baseResponse.SUCCESS, '체크 해제 하였습니다.'));
    } else {
        const check = await userService.checkUp(+basketId, userIdFromJWT);
        return res.send(response(baseResponse.SUCCESS, '체크 하였습니다.'));
    }
};
/**
 * API No. 8
 * API Name : 장바구니 전체 체크하기 API
 * [PATCH] /app/users/basket/check-all
 */ exports.basketCheckAll = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const basketCheckStatus = await userProvider.getCheckAllStatus(userIdFromJWT);
    let count = 0;
    for (let i = 0; i < basketCheckStatus.length; i++) {
        if (basketCheckStatus[i].checkStatus == 2) {
            count++;
        }
    }
    if (count > 0) {
        const check = await userService.checkAllUp(userIdFromJWT);
        return res.send(response(baseResponse.SUCCESS, '전체 체크 하였습니다.'));
    } else {
        const unCheck = await userService.checkAllDown(userIdFromJWT);
        return res.send(response(baseResponse.SUCCESS, '전체 체크 해제 하였습니다.'));
    }
};

/**
 * API No. 9
 * API Name : 장바구니 상품 개수 증가 시키기 API
 * [PATCH] /app/users/basket/:basketId/count-up
 */ exports.updateProductCountUp = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const basketId = req.params.basketId;
    const basketCountUpResult = await userService.basketCountUp(userIdFromJWT, basketId);

    return res.send(response(baseResponse.SUCCESS, '상품 개수를 증가 시켰습니다.'));
};

/**
 * API No. 10
 * API Name : 장바구니 상품 개수 감소 시키기 API
 * [PATCH] /app/users/basket/:basketId/count-down
 */ exports.updateProductCountDown = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const basketId = req.params.basketId;
    const basketCountDownResult = await userService.basketCountDown(userIdFromJWT, basketId);

    return res.send(response(baseResponse.SUCCESS, '상품 개수를 감소 시켰습니다.'));
};
