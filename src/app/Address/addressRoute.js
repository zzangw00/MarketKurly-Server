module.exports = function (app) {
    const address = require('./addressController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    // 배송지 조회 API
    app.get('/app/address', jwtMiddleware, address.getAddress);

    // 배송지 선택 API
    app.patch('/app/address/:addressId/check', jwtMiddleware, address.checkAddress);

    // 배송지 추가 API
    app.post('/app/address', jwtMiddleware, address.addAddress);
};
