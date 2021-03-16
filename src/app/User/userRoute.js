module.exports = function (app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 2. Id 중복검사 API
    app.post('/app/users/Id', user.chekId);

    // 3. 로그인 API (JWT 생성)
    app.post('/app/users/login', user.login);

    // 4. 장바구니 조회 API
    app.get('/app/users/basket', jwtMiddleware, user.getBasketOnlyProduct);

    // 6. 자동 로그인 API
    app.get('/app/auto-login', jwtMiddleware, user.check);
};
