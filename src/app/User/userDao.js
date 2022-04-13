// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
      INSERT INTO User(Id,
        password,
        name,
        email,
        phoneNumber,
        birth,
        sex)
      VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
    const insertUserInfoRow = await connection.query(insertUserInfoQuery, insertUserInfoParams);
    return insertUserInfoRow;
}
// 기본 배송지 입력
async function insertDeliveryLocation(connection, userId, location, num) {
    const insertDeliveryLocationQuery = `
    INSERT INTO DeliveryLocation(userId,
      location,
      basicstatus)
    VALUES (?, ?, ?);
`;
    const insertDeliveryLocationRow = await connection.query(insertDeliveryLocationQuery, [
        userId,
        location,
        num,
    ]);
}

async function selectId(connection, Id) {
    const selectIdQuery = `
            SELECT Id 
            FROM User
            WHERE Id = ?;
            `;
    const [emailRows] = await connection.query(selectIdQuery, Id);
    return emailRows;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
    const selectUserPasswordQuery = `
        SELECT Id, name, password
        FROM User
        WHERE Id = ?;`;
    const selectUserPasswordRow = await connection.query(
        selectUserPasswordQuery,
        selectUserPasswordParams,
    );
    return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, Id) {
    const selectUserAccountQuery = `
        SELECT status, userId, name
        FROM User 
        WHERE Id = ?;`;
    const selectUserAccountRow = await connection.query(selectUserAccountQuery, Id);
    return selectUserAccountRow[0];
}

// 주문서 조회하기(장바구니 상품)
async function getBasket(connection, userIdFromJWT) {
    const orderQuery = `
    select basketId,
       productName,
       format(ifnull(p.price * detailCount, 0), 0)                                as totalPrice,
       format(ifnull(p.price * (1 - (p.discountRate / 100)) * detailCount, 0), 0) as totalSalePrice,
       detailCount
from Basket b
         join Product p on b.productId = p.productId
where b.status = 1
  and userId = ?
  and checkStatus = 1
    `;
    const [orderRows] = await connection.query(orderQuery, userIdFromJWT);
    return orderRows;
}
// 주문서 조회하기(유저 정보)
async function getUserInfo(connection, userIdFromJWT) {
    const orderQuery = `
    select u.userId, name, phoneNumber, email, savings, location
from User u
join DeliveryLocation dl on u.userId = dl.userId
where u.userId = ?
and checkStatus = 1
and dl.status = 1
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
and status = 1
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
value (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    insertUserInfo,
    insertDeliveryLocation,
    selectId,
    selectUserPassword,
    selectUserAccount,
    getBasket,
    getUserInfo,
    getCoupon,
    order,
    updateBasket1,
    updateBasket2,
    inputPay,
};
