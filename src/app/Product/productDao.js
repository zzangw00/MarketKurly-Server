// best 상품 조회(raw_price)paging
async function getRawPriceProductPaging(connection, pages) {
    const rowPriceQuery = `
    select productId, thumbnailImageUrl, productName, format(p.price, 0) as price, discountRate, format(p.price * (1-(discountRate / 100)), 0) as salePrice, tag
from Product p
order by price*1 limit ?, 4;
    `;
    const [productRows] = await connection.query(rowPriceQuery, pages);
    return productRows;
}

// best 상품 조회(high_price)paging
async function getHighPriceProductPaging(connection, pages) {
    const highPriceQuery = `
    select productId, thumbnailImageUrl, productName, format(p.price, 0) as price, discountRate, format(p.price * (1-(discountRate / 100)), 0) as salePrice, tag
    from Product p
    order by price*1 desc limit ?, 4;
    `;
    const [productRows] = await connection.query(highPriceQuery, pages);
    return productRows;
}
// best 상품 조회(raw_price)
async function getRawPriceProduct(connection) {
    const rowPriceQuery = `
    select productId, thumbnailImageUrl, productName, format(p.price, 0) as price, discountRate, format(p.price * (1-(discountRate / 100)), 0) as salePrice, tag
from Product p
order by price*1;
    `;
    const [productRows] = await connection.query(rowPriceQuery);
    return productRows;
}

// best 상품 조회(high_price)
async function getHighPriceProduct(connection) {
    const highPriceQuery = `
    select productId, thumbnailImageUrl, productName, format(p.price, 0) as price, discountRate, format(p.price * (1-(discountRate / 100)), 0) as salePrice, tag
    from Product p
    order by price*1;
    `;
    const [productRows] = await connection.query(highPriceQuery);
    return productRows;
}
// 예비 장바구니 조회
async function getPreBasketInfo(connection, userIdFromJWT, productId) {
    const preBasketQuery = `
    select preBasketId, productName,
    pb.productId,
    detailCount,
    format(p.price, 0) as price,
    format(p.price * (1 - (p.discountRate / 100)), 0) as salePrice,
    format(p.price * (1 - (p.discountRate / 100)) * detailCount * 0.05, 0) as savingPrice,
    format(p.price * (1 - (p.discountRate / 100)) * detailCount, 0) as totalPrice
from Product p
      join PreBasket pb on p.productId = pb.productId
where userId = ?
and p.productId = ?;
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
// 예비 장바구니 상품 상세 개수 조회
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
// 예비 장바구니 초기화 시키기
async function resetPreBasket(connection, userIdFromJWT, productId) {
    const basketQuery = `
    update PreBasket
set detailCount = 1
where userId = ?
and preBasketId = ?;
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, productId]);
    return productRows;
}
// 장바구니 추가 시키기
async function inputBasket(connection, userIdFromJWT, productId) {
    const basketQuery = `
    insert into Basket (userId, productId, detailCount)
    select p.userId, p.productId, p.detailCount
    from PreBasket p
    where p.userId = ?
    and p.productId = ?;
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, productId]);
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
// 장바구니 추가 정보 가져오기
async function getBasketInfo(connection, userIdFromJWT, productId) {
    const basketQuery = `
    select userId, productId, basketId
from Basket
where userId = ?
and productId = ?
and status = 1
    `;
    const [productRows] = await connection.query(basketQuery, [userIdFromJWT, productId]);
    return productRows;
}
// 장바구니 상태 변경 시키기
async function changeBasket(connection, userIdFromJWT, productId, userIdFromJWT, productId) {
    const basketQuery = `
    update Basket
    set status = 1, detailCount = (select detailCount from PreBasket where userId = ? and productId = ?)
    where userId = ?
    and productId = ?;
    `;
    const [productRows] = await connection.query(basketQuery, [
        userIdFromJWT,
        productId,
        userIdFromJWT,
        productId,
    ]);
    return productRows;
}
// 장바구니 상품 개수 추가 시키기
async function updateBasket(connection, userIdFromJWT, productId, userIdFromJWT, productId) {
    const basketQuery = `
    update Basket
    set detailCount = detailCount + (select detailCount from PreBasket where userId = ? and productId = ?)
    where userId = ?
      and productId = ?;
    `;
    const [productRows] = await connection.query(basketQuery, [
        userIdFromJWT,
        productId,
        userIdFromJWT,
        productId,
    ]);
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
       format(price * (1 - (discountRate / 100)), 0) as salePrice,
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
// 상품설명
async function getProductImage(connection, productId) {
    const productQuery = `
    select productId, content
from ProductImage
where productId = ?
and status = 1;
    `;
    const [productRows] = await connection.query(productQuery, productId);
    return productRows;
}
// 상품 상세설명
async function getProductDetail(connection, productId) {
    const productQuery = `
    select productId, content
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
    select productReviewId, pr.userId, name, grade, title, date_format(pr.createdAt, '%Y.%m.%d') as createdAt
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
    select z.productId, ifnull(z.reviewCount, 0) as reviewCount
from (select productReviewId, count(productReviewId) as reviewCount, productId
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
    select productReviewId, pr.userId, name, grade, title, date_format(pr.createdAt, '%Y.%m.%d') as createdAt
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
    select productCategoryId, categoryName
from ProductCategory
where status = 1
    `;
    const [productRows] = await connection.query(productQuery);
    return productRows;
}
// 하위 카테고리 조회
async function getProductCategoryDetail(connection, productCategoryId) {
    const productQuery = `
    select detailCategoryId, detailCategoryName
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
    select p.productCategoryId, categoryName, p.detailCategoryId, detailCategoryName
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
    select productId, productName, thumbnailImageUrl, format(p.price, 0) as price, discountRate, format(price * (1 - (discountRate / 100)), 0) as salePrice, tag
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
    select p.productCategoryId, categoryName
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
    select productId, productName, thumbnailImageUrl, format(p.price, 0), discountRate, format(price * (1 - (discountRate / 100)), 0) as salePrice, tag
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
    select productId, thumbnailImageUrl, productName, format(p.price, 0) as price, discountRate, format(p.price * (1-(discountRate / 100)), 0) as salePrice, tag
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
    select productId, thumbnailImageUrl, productName, format(p.price, 0) as price, discountRate, format(p.price * (1-(discountRate / 100)), 0) as salePrice, tag
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
    select benefitsId, content
from Benefits
where status = 1;
    `;
    const [productRows] = await connection.query(productQuery);
    return productRows;
}
// 금주혜택 상품 조회
async function getBenefitsProducts(connection, benefitsId) {
    const productQuery = `
    select productId, thumbnailImageUrl, productName, format(p.price, 0) as price, discountRate, format(p.price * (1-(discountRate / 100)), 0) as salePrice, tag
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
    select benefitsId, title
from Benefits
where benefitsId = ?
and status = 1;
    `;
    const [productRows] = await connection.query(productQuery, benefitsId);
    return productRows;
}
// 상품 검색
async function getProducts(connection, productName) {
    const productQuery = `
    select productId,
       thumbnailImageUrl,
       productName,
       format(p.price, 0)                              as price,
       discountRate,
       format(p.price * (1 - (discountRate / 100)), 0) as salePrice,
       tag
from Product p
where productName like ?;
    `;
    const [productRows] = await connection.query(productQuery, productName);
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
       format(p.price * (1 - (discountRate / 100)), 0) as salePrice,
       tag
from Product p
         join Basket b on p.productId = b.productId
where b.buyCount > 0
  and userId = ?
  and p.status = 1
    `;
    const [productRows] = await connection.query(productQuery, userIdFromJWT);
    return productRows;
}
module.exports = {
    getRawPriceProductPaging,
    getHighPriceProductPaging,
    getRawPriceProduct,
    getHighPriceProduct,
    getPreBasketInfo,
    basketCountUp,
    basketCountDown,
    getCountResult,
    checkPreBasket,
    inputPreBasket,
    resetPreBasket,
    inputBasket,
    checkBasket,
    getBasketInfo,
    checkBasketStatus,
    changeBasket,
    updateBasket,
    getProductInfo,
    getProductImage,
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
    getProducts,
    checkBuy,
    getOftenProducts,
};
