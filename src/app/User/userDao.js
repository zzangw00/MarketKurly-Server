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
    select basketId, b.userId, p.productStatus, p.productName, p.price, p.price * (1 - (p.discountRate / 100)) as salePrice, p.tag
from Basket b
         left join User u on b.userId = u.userId
         left join Product p on b.productId = p.productId
where b.userId = ?
and b.status = 1
    `;
    const [productRows] = await connection.query(basketQuery, userIdFromJWT);
    return productRows;
}
module.exports = {
    insertUserInfo,
    insertDeliveryLocation,
    selectId,
    selectUserPassword,
    selectUserAccount,
    getBasketProductOnly,
};
