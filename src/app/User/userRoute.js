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
    app.get('/app/users/auto-login', jwtMiddleware, user.check);

    // 7. 장바구니 체크하기 API
    app.patch('/app/users/basket/:basketId/check', jwtMiddleware, user.basketCheck);

    // 8. 장바구니 전체 체크하기 API
    app.patch('/app/users/basket/check-all', jwtMiddleware, user.basketCheckAll);

    // 9. 장바구니 상품 개수 증가 시키기 API
    app.patch('/app/users/basket/:basketId/count-up', jwtMiddleware, user.updateProductCount);
};
