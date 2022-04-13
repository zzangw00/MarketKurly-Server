// 주문서 조회하기(장바구니 상품)
async function getBasket(connection, userIdFromJWT) {
    const orderQuery = `
    select basketId,
           productName,
           format(ifnull(p.price * productCount, 0), 0)                                  as totalPrice,
           format(ifnull(p.price * (1 - (p.discountRate / 100)) * b.productCount, 0), 0) as totalSalePrice,
           productCount
      from Basket b
           join Product p on b.productId = p.productId
     where b.status = 1
       and userId = ?
       and checkStatus = 1;
    `;
    const [orderRows] = await connection.query(orderQuery, userIdFromJWT);
    return orderRows;
}
// 주문서 조회하기(유저 정보)
async function getUserInfo(connection, userIdFromJWT) {
    const orderQuery = `
    select u.userId, name, phoneNumber, email, savings, address
      from User u
           join Address a on u.userId = a.userId
     where u.userId = ?
       and checkStatus = 1
       and a.status = 1;
    `;
    const [orderRows] = await connection.query(orderQuery, userIdFromJWT);
    return orderRows;
}
// 쿠폰 조회
async function getCoupon(connection, userIdFromJWT) {
    const orderQuery = `
    select couponId, content, discountRate
      from Coupon
     where userId = ?
       and status = 1;
    `;
    const [orderRows] = await connection.query(orderQuery, userIdFromJWT);
    return orderRows;
}
// 주문하기
async function order(
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
) {
    const orderQuery = `
    insert into Orders (userId, toUserName, toUserPhone, getPlace, accessMethod, message, couponId, payMethod, payPrice)
                 value (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [orderRows] = await connection.query(orderQuery, [
        userIdFromJWT,
        toUserName,
        toUserPhone,
        getPlace,
        accessMethod,
        message,
        couponId,
        payMethod,
        payPrice,
    ]);
    return orderRows;
}
async function updateBasket1(connection, userIdFromJWT) {
    const orderQuery = `
    update Basket
       set buyCount = buyCount + 1
     where checkStatus = 1
       and userId = ?
       and status = 1;
    `;
    const [orderRows] = await connection.query(orderQuery, userIdFromJWT);
    return orderRows;
}
async function updateBasket2(connection, userIdFromJWT) {
    const orderQuery = `
    Update Basket
       set status = 2
     where userId = ?
       and checkStatus = 1
    `;
    const [orderRows] = await connection.query(orderQuery, userIdFromJWT);
    return orderRows;
}
async function inputPay(connection, payPrice, payPrice, userIdFromJWT) {
    const orderQuery = `
    Update User
       set savings = savings + (? * 0.05), payPrice = payPrice + ?
     where userId = ?
    `;
    const [orderRows] = await connection.query(orderQuery, [payPrice, payPrice, userIdFromJWT]);
    return orderRows;
}

module.exports = {
    getBasket,
    getUserInfo,
    getCoupon,
    order,
    updateBasket1,
    updateBasket2,
    inputPay,
};
