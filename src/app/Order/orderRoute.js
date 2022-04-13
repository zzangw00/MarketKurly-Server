module.exports = function (app) {
    const order = require('./orderController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    // 41. 주문서 조회하기 API
    app.get('/app/order/info', jwtMiddleware, order.orderInfo);

    // 42. 주문하기 API
    app.post('/app/order', jwtMiddleware, order.addOrder);
};
