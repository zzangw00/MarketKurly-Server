// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
      INSERT INTO User(Id,
        password,
        name,
        email,
        phoneNumber,
        location,
        birth,
        sex)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
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
        SELECT status, userId
        FROM User 
        WHERE Id = ?;`;
    const selectUserAccountRow = await connection.query(selectUserAccountQuery, Id);
    return selectUserAccountRow[0];
}

// 장바구니 조회(상품 정보만)
async function getBasketProductOnly(connection, userIdFromJWT) {
    const basketQuery = `
    select thumbnailImageUrl, detailCount, checkStatus, basketId, p.productId, p.status, p.productStatus, p.productName, format(p.price, 0) as price, format(p.price * (1 - (p.discountRate / 100)), 0) as salePrice, p.tag
from Basket b
         left join User u on b.userId = u.userId
         left join Product p on b.productId = p.productId
where b.userId = ?
and b.status = 1
    `;
    const [productRows] = await connection.query(basketQuery, userIdFromJWT);
    return productRows;
}

// 장바구니 조회(나머지 정보)
async function getBasketOther(connection, userIdFromJWT) {
    const basketQuery = `
    select ifnull(y.checkProductCount, 0)                               as checkProductCount,
    ifnull(x.productCount, 0)                               as productCount,
    format(ifnull(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * detailCount end), 0), 0) as totalPrice,
    format(ifnull(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) -
           ifnull(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * detailCount end), 0),
           0), 0)                                               as salePrice,
    format(if(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) < 20000 and checkProductCount > 0,
       3000,
       0), 0)                                                   as deliveryCost,
    format(ifnull(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) +
           if(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) < 20000 and
              checkProductCount > 0, 3000,
              0),
           0), 0)                                               as totalSalePrice,
    format(ifnull((sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) +
            if(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) < 20000 and
               checkProductCount > 0, 3000,
               0)) * 0.05,
           0), 0)                                               as savingCost
from Basket b
      join Product p on b.productId = p.productId
      left join (select count(b.basketId) as productCount, b.userId
                 from Basket b
                 where userId = 15
                   and status = 1) as x on b.userId = x.userId
      left join (select count(b.basketId) as checkProductCount, b.userId
                 from Basket b
                 where userId = 15
                   and status = 1
                   and checkStatus = 1) as y on b.userId = y.userId
where b.userId = ?;
    `;
    const params = [userIdFromJWT, userIdFromJWT, userIdFromJWT];
    const [productRows] = await connection.query(basketQuery, params);
    return productRows;
}
// 장바구니에서 배송지 조회
async function getDeliveryLocation(connection, userIdFromJWT) {
    const basketQuery = `
    select locationId, location, basicStatus
from DeliveryLocation dl
         join User u on dl.userId = u.userId
where u.userId = ?
  and checkStatus = 1;
    `;
    const [productRows] = await connection.query(basketQuery, userIdFromJWT);
    return productRows;
}
// 장바구니 체크 상태 조회
async function getBasketCheck(connection, basketId, userIdFromJWT) {
    const basketQuery = `
    select checkStatus, basketId
from Basket
where basketId = ?
and userId = ?
and status = 1
    `;
    const [productRows] = await connection.query(basketQuery, [basketId, userIdFromJWT]);
    return productRows;
}
// 장바구니 체크
async function updateCheckUp(connection, params) {
    const basketQuery = `
    update Basket
    set checkStatus = 1
    where basketId = ?
      and userId = ?
      and status = 1;
    `;
    const [productRows] = await connection.query(basketQuery, params);
    return productRows;
}
// 장바구니 체크 해제
async function updateCheckDown(connection, params) {
    const basketQuery = `
    update Basket
    set checkStatus = 2
    where basketId = ?
      and userId = ?
      and status = 1;
    `;
    const [productRows] = await connection.query(basketQuery, params);
    return productRows;
}
// 장바구니 전체 체크 상태 조회
async function getBasketAllCheck(connection, userIdFromJWT) {
    const basketQuery = `
    select checkStatus, basketId
    from Basket
    where userId = ?
    and status = 1;
    `;
    const [productRows] = await connection.query(basketQuery, userIdFromJWT);
    return productRows;
}
// 장바구니 전체 체크
async function updateAllCheckUp(connection, params) {
    const basketQuery = `
    update Basket
    set checkStatus = 1
    where userId = ?
      and status = 1;
    `;
    const [productRows] = await connection.query(basketQuery, params);
    return productRows;
}
// 장바구니 전체 체크 해제
async function updateAllCheckDown(connection, params) {
    const basketQuery = `
    update Basket
    set checkStatus = 2
    where userId = ?
      and status = 1;
    `;
    const [productRows] = await connection.query(basketQuery, params);
    return productRows;
}
// 장바구니 상품 개수 증가 시키기
async function basketCountUp(connection, userIdFromJWT, basketId) {
    const basketQuery = `
    update Basket
    set detailCount = detailCount + 1
    where userId = ?
    and basketId = ?
    and status = 1;
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, basketId]);
    return productRows;
}
// 장바구니 상품 개수 감소 시키기
async function basketCountDown(connection, userIdFromJWT, basketId) {
    const basketQuery = `
    update Basket
    set detailCount = detailCount - 1
    where userId = ?
    and basketId = ?
    and status = 1;
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, basketId]);
    return productRows;
}
// 장바구니 상품 상세 개수 조회
async function getCountResult(connection, userIdFromJWT, basketId) {
    const basketQuery = `
    select basketId, productId, detailCount
    from Basket
    where userId = ?
    and basketId = ?
    and status = 1
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, basketId]);
    return productRows;
}
// 장바구니 상품 삭제 하기
async function basketDelete(connection, userIdFromJWT, basketId) {
    const basketQuery = `
    update Basket
set status = 2, detailCount = 1
where userId = ?
and basketId = ?
and status = 1
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, basketId]);
    return productRows;
}
// 장바구니 상품 선택 삭제 하기
async function checkBasketDelete(connection, userIdFromJWT) {
    const basketQuery = `
    update Basket
set status = 2, detailCount = 1
where userId = ?
and checkStatus = 1
and status = 1
    `;
    const [productRows] = await connection.query(basketQuery, userIdFromJWT);
    return productRows;
}
// 배송지 조회
async function getLocation(connection, userIdFromJWT) {
    const locationQuery = `
    select locationId, location, checkStatus, basicStatus, name, phoneNumber
from DeliveryLocation dl
         join User u on dl.userId = u.userId
where u.userId = ?
  and dl.status = 1;
    `;
    const [productRows] = await connection.query(locationQuery, userIdFromJWT);
    return productRows;
}
// 배송지 선택1
async function checkLocation1(connection, userIdFromJWT) {
    const locationQuery = `
    update DeliveryLocation
set checkStatus = 2
where userId = ?
and checkStatus = 1;
    `;
    const [productRows] = await connection.query(locationQuery, userIdFromJWT);
    return productRows;
}
// 배송지 선택2
async function checkLocation2(connection, userIdFromJWT, locationId) {
    const locationQuery = `
    update DeliveryLocation
set checkStatus = 1
where userId = ?
and locationId = ?;
    `;
    const [productRows] = await connection.query(locationQuery, [userIdFromJWT, locationId]);
    return productRows;
}
// 배송지 체크 조회
async function getCheckLocation(connection, userIdFromJWT, locationId) {
    const locationQuery = `
    select locationId, location, checkStatus
from DeliveryLocation
where userId = ?
and locationId = ?
    `;
    const [productRows] = await connection.query(locationQuery, [userIdFromJWT, locationId]);
    return productRows;
}
module.exports = {
    insertUserInfo,
    insertDeliveryLocation,
    selectId,
    selectUserPassword,
    selectUserAccount,
    getBasketProductOnly,
    getBasketOther,
    getDeliveryLocation,
    getBasketCheck,
    updateCheckDown,
    updateCheckUp,
    getBasketAllCheck,
    updateAllCheckUp,
    updateAllCheckDown,
    basketCountUp,
    basketCountDown,
    getCountResult,
    basketDelete,
    checkBasketDelete,
    getLocation,
    checkLocation1,
    checkLocation2,
    getCheckLocation,
};
