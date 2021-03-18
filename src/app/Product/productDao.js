// best 상품 조회(raw_price)
async function getRawPriceProduct(connection, value) {
    const rowPriceQuery = `
    select thumbnailImageUrl, productName, price, discountRate, price * (1-(discountRate / 100)) as salePrice, tag
from Product
order by price
    `;
    const [productRows] = await connection.query(rowPriceQuery, value);
    return productRows;
}

// best 상품 조회(high_price)
async function getHighPriceProduct(connection, value) {
    const highPriceQuery = `
    select productId, thumbnailImageUrl, productName, price, discountRate, price * (1-(discountRate / 100)) as salePrice, tag
from Product
order by price desc
    `;
    const [productRows] = await connection.query(highPriceQuery, value);
    return productRows;
}
// 예비 장바구니 조회
async function getPreBasketInfo(connection, userIdFromJWT, productId) {
    const preBasketQuery = `
    select productName,
    pb.productId,
    detailCount,
    p.price,
    p.price * (1 - (p.discountRate / 100)) as salePrice,
    p.price * (1 - (p.discountRate / 100)) * detailCount * 0.05 as savingPrice,
    p.price * (1 - (p.discountRate / 100)) * detailCount as totalPrice
from Product p
      join PreBasket pb on p.productId = pb.productId
where userId = ? and p.productId = ?
    `;
    const [productRows] = await connection.query(preBasketQuery, [userIdFromJWT, productId]);
    return productRows;
}
// 예비 장바구니 상품 개수 증가 시키기
async function basketCountUp(connection, userIdFromJWT, preBasketId) {
    const preBasketQuery = `
    update PreBasket
    set detailCount = detailCount + 1
    where status = 1
    and userId = ?
    and preBasketId = ?;
    `;
    const [productRows] = await connection.query(preBasketQuery, [userIdFromJWT, preBasketId]);
    return productRows;
}
// 예비 장바구니 상품 개수 감소 시키기
async function basketCountDown(connection, userIdFromJWT, preBasketId) {
    const preBasketQuery = `
    update PreBasket
    set detailCount = detailCount - 1
    where status = 1
    and userId = ?
    and preBasketId = ?;
    `;
    const [productRows] = await connection.query(preBasketQuery, [userIdFromJWT, preBasketId]);
    return productRows;
}
// 상품 상세 개수 조회
async function getCountResult(connection, userIdFromJWT, preBasketId) {
    const basketQuery = `
    select preBasketId, productId, detailCount
    from PreBasket
    where status = 1
    and userId = ?
    and preBasketId = ?;
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, preBasketId]);
    return productRows;
}
// 예비 장바구니 있는지 체크
async function checkPreBasket(connection, userIdFromJWT, productId) {
    const basketQuery = `
    select exists(select preBasketId
        from PreBasket
    where userId = ?
    and productId= ?) as exist
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, productId]);
    return productRows;
}
// 예비 장바구니 추가 시키기
async function inputPreBasket(connection, userIdFromJWT, productId) {
    const basketQuery = `
    insert into PreBasket (userId, productId)
    values (?, ?);
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, productId]);
    return productRows;
}
module.exports = {
    getRawPriceProduct,
    getHighPriceProduct,
    getPreBasketInfo,
    basketCountUp,
    basketCountDown,
    getCountResult,
    checkPreBasket,
    inputPreBasket,
};
