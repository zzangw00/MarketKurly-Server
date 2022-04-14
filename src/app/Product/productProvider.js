const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const baseResponse = require('../../../config/baseResponseStatus');
const productDao = require('./productDao');
const { response, errResponse } = require('../../../config/response');

// best 상품 조회(낮은 가격 순)paging
exports.rawPriceProductPaging = async function (page) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const pages = 4 * (page - 1);
        const bestProductResult = await productDao.getRawPriceProductPaging(connection, pages);
        connection.release();
        return bestProductResult;
    } catch (err) {
        logger.error(
            `App - rawPriceProductPaging Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// best 상품 조회(높은 가격 순)paging
exports.HighPriceProductPaging = async function (page) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const pages = 4 * (page - 1);
        const bestProductResult = await productDao.getHighPriceProductPaging(connection, pages);
        connection.release();
        return bestProductResult;
    } catch (err) {
        logger.error(
            `App - HighPriceProductPaging Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// best 상품 조회(낮은 가격 순)
exports.rawPriceProduct = async function () {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const bestProductResult = await productDao.getRawPriceProduct(connection);
        connection.release();
        return bestProductResult;
    } catch (err) {
        logger.error(
            `App - rawPriceProduct Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// best 상품 조회(높은 가격 순)
exports.HighPriceProduct = async function () {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const bestProductResult = await productDao.getHighPriceProduct(connection);
        connection.release();
        return bestProductResult;
    } catch (err) {
        logger.error(
            `App - HighPriceProduct Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 상품설명
exports.getProductInfo = async function (productId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductInfo = await productDao.getProductInfo(connection, productId);
        connection.release();
        return getProductInfo;
    } catch (err) {
        logger.error(
            `App - getProductInfo Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 상품 상세설명
exports.getProductDetail = async function (productId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductDetail = await productDao.getProductDetail(connection, productId);
        connection.release();
        return getProductDetail;
    } catch (err) {
        logger.error(
            `App - getProductDetail Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 후기 전반적인 화면
exports.getProductReview = async function (productId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductReview = await productDao.getProductReview(connection, productId);
        connection.release();
        return getProductReview;
    } catch (err) {
        logger.error(
            `App - getProductReview Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 후기 전체보기 화면
exports.getProductReviewAll = async function (productId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductReviewAll = await productDao.getProductReviewAll(connection, productId);
        connection.release();
        return getProductReviewAll;
    } catch (err) {
        logger.error(
            `App - getProductReviewAll Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 상품 후기 상세
exports.getProductReviewDetail = async function (productReviewId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductReviewDetail = await productDao.getProductReviewDetail(
            connection,
            productReviewId,
        );
        connection.release();
        return getProductReviewDetail;
    } catch (err) {
        logger.error(
            `App - getProductReviewDetail Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 장바구니 있는지 체크
exports.checkBasket = async function (userIdFromJWT, productId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const checkResult = await productDao.checkBasket(connection, userIdFromJWT, productId);
        connection.release();
        return checkResult;
    } catch (err) {
        logger.error(`App - checkBasket Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 장바구니 상태 체크
exports.checkBasketStatus = async function (userIdFromJWT, productId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const checkResult = await productDao.checkBasketStatus(
            connection,
            userIdFromJWT,
            productId,
        );
        connection.release();
        return checkResult;
    } catch (err) {
        logger.error(
            `App - checkBasketStatus Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 상품 문의 전반적인 화면
exports.getProductInquire = async function (productId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductInquire = await productDao.getProductInquire(connection, productId);
        connection.release();
        return getProductInquire;
    } catch (err) {
        logger.error(
            `App - getProductInquire Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 문의 전체보기 화면
exports.getProductInquireAll = async function (productId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductInquireAll = await productDao.getProductInquireAll(connection, productId);
        connection.release();
        return getProductInquireAll;
    } catch (err) {
        logger.error(
            `App - getProductInquireAll Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 문의 상세보기 화면
exports.getProductInquireDetail = async function (productInquireId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductInquireDetail = await productDao.getProductInquireDetail(
            connection,
            productInquireId,
        );
        connection.release();
        return getProductInquireDetail;
    } catch (err) {
        logger.error(
            `App - getProductInquire Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 상품 문의하기 화면
exports.postProductInquireInfo = async function (productId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postProductInquireInfo = await productDao.postProductInquireInfo(
            connection,
            productId,
        );
        connection.release();
        return postProductInquireInfo;
    } catch (err) {
        logger.error(
            `App - postProductInquireInfo Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 상위 카테고리 조회
exports.getProductCategory = async function () {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductCategory = await productDao.getProductCategory(connection);
        connection.release();
        return getProductCategory;
    } catch (err) {
        logger.error(
            `App - getProductCategory Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 하위 카테고리 조회
exports.getProductCategoryDetail = async function (productCategoryId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductCategoryDetail = await productDao.getProductCategoryDetail(
            connection,
            productCategoryId,
        );
        connection.release();
        return getProductCategoryDetail;
    } catch (err) {
        logger.error(
            `App - getProductCategory Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 상세 카테고리 조회
exports.getDetailCategory = async function (detailCategoryId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getDetailCategory = await productDao.getDetailCategory(connection, detailCategoryId);
        connection.release();
        return getDetailCategory;
    } catch (err) {
        logger.error(
            `App - getDetailCategory Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 카테고리 별 상품 조회
exports.getProductByDetailCategoryId = async function (detailCategoryId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductByDetailCategoryId = await productDao.getProductByDetailCategoryId(
            connection,
            detailCategoryId,
        );
        connection.release();
        return getProductByDetailCategoryId;
    } catch (err) {
        logger.error(
            `App - getDetailCategory Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 카테고리 조회
exports.getCategory = async function (productCategoryId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getCategory = await productDao.getCategory(connection, productCategoryId);
        connection.release();
        return getCategory;
    } catch (err) {
        logger.error(`App - getCategory Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 카테고리 별 상품 전체 조회
exports.getProductByCategoryId = async function (productCategoryId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getProductByCategoryId = await productDao.getProductByCategoryId(
            connection,
            productCategoryId,
        );
        connection.release();
        return getProductByCategoryId;
    } catch (err) {
        logger.error(`App - getProduct Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 신상품 조회
exports.getNewProduct = async function () {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getNewProductResult = await productDao.getNewProduct(connection);
        connection.release();
        return getNewProductResult;
    } catch (err) {
        logger.error(
            `App - getNewProduct Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 알뜰상품 조회
exports.getSalesProduct = async function () {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getSalesProductResult = await productDao.getSalesProduct(connection);
        connection.release();
        return getSalesProductResult;
    } catch (err) {
        logger.error(
            `App - getSalesProduct Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 금주혜택 조회
exports.getBenefits = async function () {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getBenefitsResult = await productDao.getBenefits(connection);
        connection.release();
        return getBenefitsResult;
    } catch (err) {
        logger.error(`App - getBenefits Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 금주혜택 상품 조회
exports.getBenefitsProducts = async function (benefitsId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getBenefitsProductsResult = await productDao.getBenefitsProducts(
            connection,
            benefitsId,
        );
        connection.release();
        return getBenefitsProductsResult;
    } catch (err) {
        logger.error(`App - getBenefits Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 금주혜택 이름 조회
exports.getBenefitsName = async function (benefitsId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getBenefitsNameResult = await productDao.getBenefitsName(connection, benefitsId);
        connection.release();
        return getBenefitsNameResult;
    } catch (err) {
        logger.error(
            `App - getBenefitsName Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 상품 산적이 있는지 검색
exports.checkBuy = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const checkBuyResult = await productDao.checkBuy(connection, userIdFromJWT);
        connection.release();
        return checkBuyResult;
    } catch (err) {
        logger.error(`App - checkBuy Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 자주 사는 상품 조회
exports.getOftenProducts = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getOftenProductsResult = await productDao.getOftenProducts(connection, userIdFromJWT);
        connection.release();
        return getOftenProductsResult;
    } catch (err) {
        logger.error(
            `App - getOftenProducts Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 실시간 인기 검색어 조회
exports.getPopularProduct = async function (start, end) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getPopularProductsResult = await productDao.getPopularProducts(
            connection,
            start,
            end,
        );
        connection.release();
        return getPopularProductsResult;
    } catch (err) {
        logger.error(
            `App - getPopularProduct Service error\n: ${err.message} \n${JSON.stringify(err)}`,
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};
