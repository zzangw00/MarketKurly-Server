// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
    insert into User (Id, password, name, email, phoneNumber, birth, sex)
              values (?, ?, ?, ?, ?, ?, ?);
  `;
    const insertUserInfoRow = await connection.query(insertUserInfoQuery, insertUserInfoParams);
    return insertUserInfoRow;
}
// 기본 배송지 입력
async function insertAddress(connection, userId, address, num) {
    const insertAddressQuery = `
    insert into Address (userId, address, basicstatus)
                 values (?, ?, ?);
`;
    const insertAddressRow = await connection.query(insertAddressQuery, [userId, address, num]);
    return insertAddressRow;
}

async function selectId(connection, Id) {
    const selectIdQuery = `
    select Id
      from User
     where Id = ?;
            `;
    const [emailRows] = await connection.query(selectIdQuery, Id);
    return emailRows;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
    const selectUserPasswordQuery = `
    select Id, name, password
      from User
     where Id = ?;`;
    const selectUserPasswordRow = await connection.query(
        selectUserPasswordQuery,
        selectUserPasswordParams,
    );
    return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, Id) {
    const selectUserAccountQuery = `
    select status, userId, name
      from User 
     where Id = ?;`;
    const selectUserAccountRow = await connection.query(selectUserAccountQuery, Id);
    return selectUserAccountRow[0];
}

module.exports = {
    insertUserInfo,
    insertAddress,
    selectId,
    selectUserPassword,
    selectUserAccount,
};
