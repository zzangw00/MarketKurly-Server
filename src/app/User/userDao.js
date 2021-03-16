// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
    console.log(insertUserInfoParams);
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
module.exports = {
    insertUserInfo,
    insertDeliveryLocation,
    selectId,
    selectUserPassword,
    selectUserAccount,
};
