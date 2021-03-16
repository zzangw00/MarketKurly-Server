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

module.exports = {
    getRawPriceProduct,
    getHighPriceProduct,
};
