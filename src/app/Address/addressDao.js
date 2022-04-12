// 배송지 조회
async function getAddress(connection, userIdFromJWT) {
    const addressQuery = `
    select addressId, address, checkStatus, basicStatus, name, phoneNumber
    from Address a
             join User u on a.userId = u.userId
    where u.userId = ?
      and a.status = 1;
    `;
    const [productRows] = await connection.query(addressQuery, userIdFromJWT);
    return productRows;
}
// 배송지 선택1
async function checkAddress1(connection, userIdFromJWT) {
    const addressQuery = `
    update Address
    set checkStatus = 2
    where userId = ?
      and checkStatus = 1;
    `;
    const [productRows] = await connection.query(addressQuery, userIdFromJWT);
    return productRows;
}
// 배송지 선택2
async function checkAddress2(connection, userIdFromJWT, addressId) {
    const addressQuery = `
    update Address
    set checkStatus = 1
    where userId = ?
      and addressId = ?;
    `;
    const [productRows] = await connection.query(addressQuery, [userIdFromJWT, addressId]);
    return productRows;
}
// 배송지 체크 조회
async function getCheckAddress(connection, userIdFromJWT, addressId) {
    const addressQuery = `
    select addressId, address, checkStatus
    from Address
    where userId = ?
      and addressId = ?;
    `;
    const [productRows] = await connection.query(addressQuery, [userIdFromJWT, addressId]);
    return productRows;
}
// 배송지 추가1
async function addAddress1(connection, userIdFromJWT) {
    const addressQuery = `
    update Address
    set checkStatus = 2
    where userId = ?
      and checkStatus = 1;
    `;
    const [productRows] = await connection.query(addressQuery, userIdFromJWT);
    return productRows;
}
// 배송지 추가2
async function addAddress2(connection, userIdFromJWT, address) {
    const addressQuery = `
    insert into Address (userId, address)
    values (?, ?);
    `;
    const [productRows] = await connection.query(addressQuery, [userIdFromJWT, address]);
    return productRows;
}

module.exports = {
    getAddress,
    checkAddress1,
    checkAddress2,
    getCheckAddress,
    addAddress1,
    addAddress2,
};
