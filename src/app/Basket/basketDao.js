// 장바구니 조회(상품 정보만)
async function getBasketProductOnly(connection, userIdFromJWT) {
    const basketQuery = `
    select thumbnailImageUrl,
           detailCount,
           checkStatus,
           basketId,
           p.productId,
           p.status,
           p.productStatus,
           p.productName,
           format(p.price * detailCount, 0)                                as price,
           format(p.price * (1 - (p.discountRate / 100)) * detailCount, 0) as salePrice
      from Basket b
           left join User u on b.userId = u.userId
           left join Product p on b.productId = p.productId
     where b.userId = ?
       and b.status = 1;
    `;
    const [basketRows] = await connection.query(basketQuery, userIdFromJWT);
    return basketRows;
}

// 장바구니 조회(나머지 정보)
async function getBasketOther(connection, userIdFromJWT, userIdFromJWT, userIdFromJWT) {
    const basketQuery = `
    select ifnull(y.checkProductCount, 0)                               as checkProductCount,
           ifnull(x.productCount, 0)                               as productCount,
           format(ifnull(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * detailCount end), 0), 0)                           as totalPrice,
           format(ifnull(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) -
                  ifnull(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * detailCount end), 0), 0), 0)                       as salePrice,
           format(if(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) < 20000 and checkProductCount > 0,3000,0), 0)         as deliveryCost,
           format(ifnull(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) +
           if(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) < 20000 and checkProductCount > 0, 3000,0),0), 0)            as totalSalePrice,
           format(ifnull((sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) +
           if(sum(case when b.status = 1 and b.checkStatus = 1 then p.price * (1 - (p.discountRate / 100)) * detailCount end) < 20000 and checkProductCount > 0, 3000, 0)) * 0.05, 0), 0) as savingCost
      from Basket b
           join Product p on b.productId = p.productId
           left join (select count(b.basketId) as productCount, b.userId
                        from Basket b
                       where userId = ?
                         and status = 1) as x on b.userId = x.userId
           left join (select count(b.basketId) as checkProductCount, b.userId
                        from Basket b
                       where userId = ?
                         and status = 1
                         and checkStatus = 1) as y on b.userId = y.userId
     where b.userId = ?;
    `;
    const [basketRows] = await connection.query(basketQuery, [
        userIdFromJWT,
        userIdFromJWT,
        userIdFromJWT,
    ]);
    return basketRows;
}
// 장바구니에서 배송지 조회
async function getAddress(connection, userIdFromJWT) {
    const basketQuery = `
    select addressId, address, basicStatus
      from Address a
           join User u on a.userId = u.userId
     where u.userId = ?
       and checkStatus = 1;
    `;
    const [basketRows] = await connection.query(basketQuery, userIdFromJWT);
    return basketRows;
}

// 장바구니 상품 개수 변경
async function changeBasketCount(connection, userIdFromJWT, basketId, count) {
    const basketQuery = `
    update Basket
       set productCount = ?
     where userId = ?
       and basketId = ?
    `;
    const [basketRows] = await connection.query(basketQuery, [count, userIdFromJWT, basketId]);
    return basketRows;
}

// 장바구니 상품 삭제 하기
async function basketDelete(connection, userIdFromJWT, basketId) {
    const basketQuery = `
    update Basket
       set status = 2
     where userId = ?
       and basketId = ?;
    `;
    const [basketRows] = await connection.query(basketQuery, [userIdFromJWT, basketId]);
    return basketRows;
}

module.exports = {
    getBasketProductOnly,
    getBasketOther,
    getAddress,
    changeBasketCount,
    basketDelete,
};
