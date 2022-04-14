// 상품 검색
async function getSearchProducts(connection, searchName) {
    const productQuery = `
    select productId,
           thumbnailImageUrl,
           productName,
           format(p.price, 0)                              as price,
           discountRate,
           format(p.price * (1 - (discountRate / 100)), 0) as salePrice
      from Product p
     where productName like concat(concat('%', ?), '%');
    `;
    const [productRows] = await connection.query(productQuery, searchName);
    return productRows;
}
// 검색어 추가
async function addSearch(connection, searchName) {
    const productQuery = `
    insert into Search (searchName)
                values (?);
    `;
    const [productRows] = await connection.query(productQuery, searchName);
    return productRows;
}

module.exports = {
    getSearchProducts,
    addSearch,
};
