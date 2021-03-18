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
async function getPreBasketInfo(connection, productId) {
    const preBasketQuery = `
    select productName,
       pb.productId,
       detailCount,
       p.price,
       p.price * (1 - (p.discountRate / 100)) as salePrice,
       p.price * (1 - (p.discountRate / 100)) * 0.05 as savingPrice
from Product p
         join PreBasket pb on p.productId = pb.productId
where p.productId = ?
    `;
    const [productRows] = await connection.query(preBasketQuery, productId);
    return productRows;
}
// 예비 장바구니 상품 개수 증가 시키기
async function basketCountUp(connection, preBasketId) {
    const preBasketQuery = `
    update PreBasket
    set detailCount = detailCount + 1
    where status = 1 
    and preBasketId = ?;
    `;
    const [productRows] = await connection.query(preBasketQuery, preBasketId);
    return productRows;
}
// 예비 장바구니 상품 개수 감소 시키기
async function basketCountDown(connection, preBasketId) {
    const preBasketQuery = `
    update PreBasket
    set detailCount = detailCount - 1
    where status = 1 
    and preBasketId = ?;
    `;
    const [productRows] = await connection.query(preBasketQuery, preBasketId);
    return productRows;
}
// 상품 상세 개수 조회
async function getCountResult(connection, preBasketId) {
    const basketQuery = `
    select preBasketId, productId, detailCount
    from PreBasket
    where status = 1
    and preBasketId = ?;
    `;
    const [productRows] = await connection.query(basketQuery, preBasketId);
    return productRows;
}
module.exports = {
    getRawPriceProduct,
    getHighPriceProduct,
    getPreBasketInfo,
    basketCountUp,
    basketCountDown,
    getCountResult,
};
