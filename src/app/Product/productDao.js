// best 상품 조회(raw_price)paging
async function getRawPriceProductPaging(connection, pages) {
    const rowPriceQuery = `
    select productId,
           thumbnailImageUrl,
           productName,
           format(p.price, 0)                              as price,
           discountRate,
           format(p.price * (1 - (discountRate / 100)), 0) as salePrice
      from Product p
     order by price * 1
     limit ?, 4;
    `;
    const [productRows] = await connection.query(rowPriceQuery, pages);
    return productRows;
}

// best 상품 조회(high_price)paging
async function getHighPriceProductPaging(connection, pages) {
    const highPriceQuery = `
    select productId,
           thumbnailImageUrl,
           productName,
           format(p.price, 0)                              as price,
           discountRate,
           format(p.price * (1 - (discountRate / 100)), 0) as salePrice
      from Product p
     order by price * 1 desc
     limit ?, 4;
    `;
    const [productRows] = await connection.query(highPriceQuery, pages);
    return productRows;
}
// best 상품 조회(raw_price)
async function getRawPriceProduct(connection) {
    const rowPriceQuery = `
    select productId,
           thumbnailImageUrl,
           productName,
           format(p.price, 0)                              as price,
           discountRate,
           format(p.price * (1 - (discountRate / 100)), 0) as salePrice
      from Product p
     order by price * 1;
    `;
    const [productRows] = await connection.query(rowPriceQuery);
    return productRows;
}

// best 상품 조회(high_price)
async function getHighPriceProduct(connection) {
    const highPriceQuery = `
    select productId,
           thumbnailImageUrl,
           productName,
           format(p.price, 0)                              as price,
           discountRate,
           format(p.price * (1 - (discountRate / 100)), 0) as salePrice
      from Product p
     order by price * 1 desc;
    `;
    const [productRows] = await connection.query(highPriceQuery);
    return productRows;
}
// 상품설명
async function getProductInfo(connection, productId) {
    const productQuery = `
    select productId,
           thumbnailImageUrl,
           productName,
           productNote,
           format(price, 0) as price,
           discountRate,
           format(price * (1 - (discountRate / 100)), 0)        as salePrice,
           format(price * (1 - (discountRate / 100)) * 0.05, 0) as savingPrice,
           unitOfSale,
           weight,
           deliveryClass,
           packageType,
           allergy,
           expirationDate,
           notice,
           status
      from Product
     where productId = ?;
    `;
    const [productRows] = await connection.query(productQuery, productId);
    return productRows;
}
// 상품 상세설명
async function getProductDetail(connection, productId) {
    const productQuery = `
    select productId,
           content
      from ProductDetails
     where productId = ?
       and status = 1;
    `;
    const [productRows] = await connection.query(productQuery, productId);
    return productRows;
}
// 후기 전반적인 화면
async function getProductReview(connection, productId) {
    const productQuery = `
    select productReviewId, 
           pr.userId, 
           name, 
           grade, 
           title, 
           date_format(pr.createdAt, '%Y.%m.%d') as createdAt
      from ProductReviews pr
           join User u on pr.userId = u.userId
     where productId = ?
       and pr.status = 1
     order by pr.createdAt desc
     limit 5;
    `;
    const [productRows] = await connection.query(productQuery, productId);
    return productRows;
}
// 후기 개수
async function getProductReviewCount(connection, productId) {
    const productQuery = `
    select z.productId, 
           ifnull(z.reviewCount, 0) as reviewCount
      from (select productReviewId, 
                   count(productReviewId) as reviewCount,
                   productId
              from ProductReviews
             where productId = ?
               and status = 1
             group by productId) as z
     where z.productId = ?;
    `;
    params = [productId, productId];
    const [productRows] = await connection.query(productQuery, params);
    return productRows;
}
// 후기 전체보기
async function getProductReviewAll(connection, productId) {
    const productQuery = `
    select productReviewId, 
           pr.userId, 
           name, 
           grade, 
           title, 
           date_format(pr.createdAt, '%Y.%m.%d') as createdAt
      from ProductReviews pr
           join User u on pr.userId = u.userId
     where productId = ?
       and pr.status = 1
     order by pr.createdAt desc;
    `;
    const [productRows] = await connection.query(productQuery, productId);
    return productRows;
}
// 후기 상세 보기
async function getProductReviewDetail(connection, productReviewId) {
    const productQuery = `
    select productReviewId,
           pr.productId,
           productName,
           imageUrl,
           title,
           pr.content,
           date_format(pr.createdAt, '%Y.%m.%d') as createdAt
      from ProductReviews pr
           join Product p on pr.productId = p.productId
     where productReviewId = ?
       and pr.status = 1;
    `;
    const [productRows] = await connection.query(productQuery, productReviewId);
    return productRows;
}
// 장바구니 추가 시키기
async function inputBasket(connection, userIdFromJWT, productId, productCount) {
    const basketQuery = `
    insert into Basket (userId, productId, productCount)
                values (?, ?, ?)
    `;
    const [productRows] = await connection.query(basketQuery, [
        userIdFromJWT,
        productId,
        productCount,
    ]);
    return productRows;
}
// 장바구니 있는지 체크
async function checkBasket(connection, userIdFromJWT, productId) {
    const basketQuery = `
    select exists(select basketId
                    from Basket
                   where userId = ?
                     and productId= ?) as exist
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, productId]);
    return productRows;
}
// 장바구니 상태 체크
async function checkBasketStatus(connection, userIdFromJWT, productId) {
    const basketQuery = `
    select status
      from Basket
     where userId = ?
       and productId =?
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, productId]);
    return productRows;
}
// 장바구니 상태 변경 시키기
async function changeBasket(connection, userIdFromJWT, productId, productCount) {
    const basketQuery = `
    update Basket
       set status       = 1,
           productCount = ?
     where userId = ?
       and productId = ?;
    `;
    const [productRows] = await connection.query(basketQuery, [
        productCount,
        userIdFromJWT,
        productId,
    ]);
    return productRows;
}
// 장바구니 상품 개수 추가 시키기
async function updateBasket(connection, userIdFromJWT, productId, productCount) {
    const basketQuery = `
    update Basket
       set productCount = productCount + ?
     where userId = ?
       and productId = ?;
    `;
    const [productRows] = await connection.query(basketQuery, [
        productCount,
        userIdFromJWT,
        productId,
    ]);
    return productRows;
}
// 문의 전반적인 화면
async function getProductInquire(connection, productId) {
    const productQuery = `
    select productId,
           productInquireId,
           title,
           pi.userId,
           name,
           answerStatus,
           secretStatus,
           date_format(pi.createdAt, '%Y.%m.%d') as createdAt
      from ProductInquire pi
           join User u on pi.userId = u.userId
     where productId = ?
       and pi.status = 1
     order by pi.createdAt desc
     limit 5;
    `;
    const [productRows] = await connection.query(productQuery, productId);
    return productRows;
}
// 문의 전체보기
async function getProductInquireAll(connection, productId) {
    const productQuery = `
    select productId,
           productInquireId,
           title,
           pi.userId,
           name,
           answerStatus,
           secretStatus,
           date_format(pi.createdAt, '%Y.%m.%d') as createdAt
      from ProductInquire pi
           join User u on pi.userId = u.userId
     where productId = ?
       and pi.status = 1
     order by pi.createdAt desc;
    `;
    const [productRows] = await connection.query(productQuery, productId);
    return productRows;
}
// 문의 상세 보기
async function getProductInquireDetail(connection, productInquireId) {
    const productQuery = `
    select pi.productInquireId,
           title,
           pi.content,
           pi.userId,
           name,
           date_format(pi.createdAt, '%Y.%m.%d') as createdAt,
           inquireAnswerId,
           ia.content as answerContent
      from ProductInquire pi
           join User u on pi.userId = u.userId
           left join InquireAnswer ia on pi.productInquireId = ia.productInquireId
     where pi.productInquireId = ?
    `;
    const [productRows] = await connection.query(productQuery, productInquireId);
    return productRows;
}
// 상품 문의 하기
async function postProductInquire(
    connection,
    userIdFromJWT,
    productId,
    title,
    content,
    secretStatus,
) {
    const productQuery = `
    insert into ProductInquire (userId, productId, title, content, secretStatus)
                        values (?, ?, ?, ?, ?);
    `;
    const [productRows] = await connection.query(productQuery, [
        userIdFromJWT,
        productId,
        title,
        content,
        secretStatus,
    ]);
    return productRows;
}
// 상품 문의하기 화면
async function postProductInquireInfo(connection, productId) {
    const productQuery = `
    select productName
      from Product
     where productId = ?;
    `;
    const [productRows] = await connection.query(productQuery, productId);
    return productRows;
}
// 상위 카테고리 조회
async function getProductCategory(connection) {
    const productQuery = `
    select productCategoryId, 
           categoryName
      from ProductCategory
     where status = 1
    `;
    const [productRows] = await connection.query(productQuery);
    return productRows;
}
// 하위 카테고리 조회
async function getProductCategoryDetail(connection, productCategoryId) {
    const productQuery = `
    select detailCategoryId, 
           detailCategoryName
      from DetailCategory
     where status = 1
       and productCategoryId = ?
    `;
    const [productRows] = await connection.query(productQuery, productCategoryId);
    return productRows;
}
// 상세 카테고리 조회
async function getDetailCategory(connection, detailCategoryId) {
    const productQuery = `
    select p.productCategoryId, 
           categoryName, 
           p.detailCategoryId, 
           detailCategoryName
      from Product p
           left join ProductCategory pc on p.productCategoryId = pc.productCategoryId
           left join DetailCategory dc on p.detailCategoryId = dc.detailCategoryId
     where p.detailCategoryId = ?
       and p.status = 1
     group by p.productCategoryId;
    `;
    const [productRows] = await connection.query(productQuery, detailCategoryId);
    return productRows;
}
// 카테고리 별 상품 조회
async function getProductByDetailCategoryId(connection, detailCategoryId) {
    const productQuery = `
    select productId, 
           productName, 
           thumbnailImageUrl, 
           format(p.price, 0) as price, 
           discountRate, 
           format(price * (1 - (discountRate / 100)), 0) as salePrice
      from Product p
     where p.detailCategoryId = ?
       and p.status = 1;
    `;
    const [productRows] = await connection.query(productQuery, detailCategoryId);
    return productRows;
}
// 카테고리 조회
async function getCategory(connection, productCategoryId) {
    const productQuery = `
    select p.productCategoryId, 
           categoryName
      from Product p
           left join ProductCategory pc on p.productCategoryId = pc.productCategoryId
     where p.productCategoryId = ?
       and p.status = 1
     group by p.productCategoryId;
    `;
    const [productRows] = await connection.query(productQuery, productCategoryId);
    return productRows;
}
// 카테고리 별 상품 전체 조회
async function getProductByCategoryId(connection, productCategoryId) {
    const productQuery = `
    select productId, 
           productName, 
           thumbnailImageUrl, 
           format(p.price, 0), discountRate, 
           format(price * (1 - (discountRate / 100)), 0) as salePrice
      from Product p
     where p.productCategoryId = ?
       and p.status = 1;
    `;
    const [productRows] = await connection.query(productQuery, productCategoryId);
    return productRows;
}
// 신상품 조회
async function getNewProduct(connection) {
    const productQuery = `
    select productId, 
           thumbnailImageUrl, 
           productName, 
           format(p.price, 0) as price, 
           discountRate, 
           format(p.price * (1-(discountRate / 100)), 0) as salePrice
      from Product p
     where createdAt between substr(date_add(now(), interval -7 day), 1, 10) and substr(now(), 1, 10)
       and status = 1
     order by createdAt desc;
    `;
    const [productRows] = await connection.query(productQuery);
    return productRows;
}
// 알뜰상품 조회
async function getSalesProduct(connection) {
    const productQuery = `
    select productId, 
           thumbnailImageUrl, 
           productName, 
           format(p.price, 0) as price, 
           discountRate, 
           format(p.price * (1-(discountRate / 100)), 0) as salePrice
      from Product p
     where discountRate >= 20
       and status = 1
     order by discountRate desc;
    `;
    const [productRows] = await connection.query(productQuery);
    return productRows;
}
// 금주혜택 조회
async function getBenefits(connection) {
    const productQuery = `
    select benefitsId, 
           content
      from Benefits
     where status = 1;
    `;
    const [productRows] = await connection.query(productQuery);
    return productRows;
}
// 금주혜택 상품 조회
async function getBenefitsProducts(connection, benefitsId) {
    const productQuery = `
    select productId, 
           thumbnailImageUrl, 
           productName, 
           format(p.price, 0) as price, 
           discountRate, 
           format(p.price * (1-(discountRate / 100)), 0) as salePrice
      from Product p
     where benefitsId = ?
       and status = 1;
    `;
    const [productRows] = await connection.query(productQuery, benefitsId);
    return productRows;
}
// 금주혜택 이름 조회
async function getBenefitsName(connection, benefitsId) {
    const productQuery = `
    select benefitsId, 
           title
      from Benefits
     where benefitsId = ?
       and status = 1;
    `;
    const [productRows] = await connection.query(productQuery, benefitsId);
    return productRows;
}
// 상품 산적이 있는지 검색
async function checkBuy(connection, userIdFromJWT) {
    const productQuery = `
    select exists(select basketId
      from Basket
     where userId = ?
       and buyCount > 0) as exist;
    `;
    const [productRows] = await connection.query(productQuery, userIdFromJWT);
    return productRows;
}
// 자주 사는 상품 조회
async function getOftenProducts(connection, userIdFromJWT) {
    const productQuery = `
    select p.productId,
           thumbnailImageUrl,
           productName,
           format(p.price, 0)                              as price,
           discountRate,
           format(p.price * (1 - (discountRate / 100)), 0) as salePrice
      from Product p
           join Basket b on p.productId = b.productId
     where b.buyCount > 0
       and userId = ?
       and p.status = 1
    `;
    const [productRows] = await connection.query(productQuery, userIdFromJWT);
    return productRows;
}
// 실시간 인기 검색어 조회
async function getPopularProducts(connection, start, end) {
    const productQuery = `
    select a.searchName
     from (select searchName, 
                  count(searchName)
             from Search
            where updatedAt between ? and ?
            group by searchName
            order by count(searchName) desc) as a;
    `;
    const [productRows] = await connection.query(productQuery, [start, end]);
    return productRows;
}
// 찜 목록에 있는지 체크
async function checkWish(connection, userIdFromJWT, productId) {
    const productQuery = `
    select exists(select wishId
                    from Wish
                   where userId = ?
                     and productId= ?) as exist
    `;
    const [productRows] = await connection.query(productQuery, [userIdFromJWT, productId]);
    return productRows;
}
// 찜 상태 체크
async function checkWishStatus(connection, userIdFromJWT, productId) {
    const productQuery = `
    select status
      from Wish
     where userId = ?
       and productId = ?
    `;
    const [productRows] = await connection.query(productQuery, [userIdFromJWT, productId]);
    return productRows;
}
// 찜하기
async function inputWish(connection, userIdFromJWT, productId) {
    const productQuery = `
    insert into Wish (userId, productId)
              values (?, ?)
    `;
    const [productRows] = await connection.query(productQuery, [userIdFromJWT, productId]);
    return productRows;
}
// 다시 찜하기
async function changeWish(connection, userIdFromJWT, productId) {
    const productQuery = `
    update Wish
       set status = 1
     where userId = ?
       and productId = ?;
    `;
    const [productRows] = await connection.query(productQuery, [userIdFromJWT, productId]);
    return productRows;
}
// 찜 취소하기
async function deleteWish(connection, userIdFromJWT, productId) {
    const productQuery = `
    update Wish
       set status = 2
     where userId = ?
       and productId = ?;
    `;
    const [productRows] = await connection.query(productQuery, [userIdFromJWT, productId]);
    return productRows;
}
module.exports = {
    getRawPriceProductPaging,
    getHighPriceProductPaging,
    getRawPriceProduct,
    getHighPriceProduct,
    inputBasket,
    checkBasket,
    checkBasketStatus,
    changeBasket,
    updateBasket,
    getProductInfo,
    getProductDetail,
    getProductReview,
    getProductReviewCount,
    getProductReviewAll,
    getProductReviewDetail,
    getProductInquire,
    getProductInquireAll,
    getProductInquireDetail,
    postProductInquire,
    postProductInquireInfo,
    getProductCategory,
    getProductCategoryDetail,
    getDetailCategory,
    getProductByDetailCategoryId,
    getCategory,
    getProductByCategoryId,
    getNewProduct,
    getSalesProduct,
    getBenefits,
    getBenefitsProducts,
    getBenefitsName,
    checkBuy,
    getOftenProducts,
    getPopularProducts,
    checkWish,
    checkWishStatus,
    inputWish,
    changeWish,
    deleteWish,
};
