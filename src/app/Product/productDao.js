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
module.exports = {
    getRawPriceProduct,
    getHighPriceProduct,
    getPreBasketInfo,
};
