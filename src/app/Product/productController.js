const productProvider = require('../../app/Product/productProvider');
const productService = require('../../app/Product/productService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');
const { setCache, deleteCache } = require('../../../config/redis');

/**
 * API No. 4
 * API Name : 베스트 상품 조회 API
 * [GET] /app/product
 */
exports.getBestProduct = async function (req, res) {
    const { value, page } = req.query;
    if (!page) {
        if (value == 'rawPrice') {
            const getBestProductResult = await productProvider.rawPriceProduct();
            return res.send(response(baseResponse.SUCCESS, getBestProductResult));
        } else if (value == 'highPrice') {
            const getBestProductResult = await productProvider.HighPriceProduct();
            return res.send(response(baseResponse.SUCCESS, getBestProductResult));
        }
    } else {
        if (value == 'rawPrice') {
            const getBestProductResult = await productProvider.rawPriceProductPaging(page);
            return res.send(response(baseResponse.SUCCESS, getBestProductResult));
        } else if (value == 'highPrice') {
            const getBestProductResult = await productProvider.HighPriceProductPaging(page);
            return res.send(response(baseResponse.SUCCESS, getBestProductResult));
        }
    }
};
/**
 * API No. 21
 * API Name : 상품설명 API
 * [GET] /app/product/:productId/info
 */ exports.getProductInfo = async function (req, res) {
    const productId = req.params.productId;
    const getProductInfoResult = await productProvider.getProductInfo(productId);
    if (getProductInfoResult.length) {
        setCache('productId/' + req.params.productId, getProductInfoResult);
        res.status(200).send({
            ok: true,
            data: getProductInfoResult,
        });
    } else {
        res.status(400).send({
            ok: false,
            message: 'No more pages',
        });
    }
    //return res.send(response(baseResponse.SUCCESS, getProductInfoResult));
};
/**
 * API No. 23
 * API Name : 상품 상세설명 API
 * [GET] /app/product/:productId/detail
 */ exports.getProductDetail = async function (req, res) {
    const productId = req.params.productId;
    const getProductDetailResult = await productProvider.getProductDetail(productId);

    return res.send(response(baseResponse.SUCCESS, getProductDetailResult));
};
/**
 * API No. 24
 * API Name : 후기 전반적인 화면 API
 * [GET] /app/product/:productId/review
 */ exports.getProductReview = async function (req, res) {
    const productId = req.params.productId;
    const getProductReviewResult = await productProvider.getProductReview(productId);

    return res.send(response(baseResponse.SUCCESS, getProductReviewResult));
};

/**
 * API No. 26
 * API Name : 후기 전체보기 API
 * [GET] /app/product/:productId/review-all
 */ exports.getProductReviewAll = async function (req, res) {
    const productId = req.params.productId;
    const getProductReviewAllResult = await productProvider.getProductReviewAll(productId);

    return res.send(response(baseResponse.SUCCESS, getProductReviewAllResult));
};
/**
 * API No. 27
 * API Name : 상품 후기 상세 API
 * [GET] /app/productReview/:productReviewId/review-detail
 */ exports.getProductReviewDetail = async function (req, res) {
    const productReviewId = req.params.productReviewId;
    const getProductReviewDetailResult = await productProvider.getProductReviewDetail(
        productReviewId,
    );

    return res.send(response(baseResponse.SUCCESS, getProductReviewDetailResult));
};
/**
 * API No. 15
 * API Name : 장바구니 추가 API 체크 했는데 없으면 추가, 있는데 현재 장바구니에 없으면 status = 1로 변경, 있는데 현재 장바구니에 있으면 productCount +
 * [POST] /app/product/input-basket
 */ exports.inputBasket = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const { productId, productCount } = req.body;
    const basketCheck = await productProvider.checkBasket(userIdFromJWT, productId);
    const basketStatus = await productProvider.checkBasketStatus(userIdFromJWT, productId);
    if (basketCheck[0].exist == 0) {
        const inputBasket = await productService.inputBasket(
            userIdFromJWT,
            productId,
            productCount,
        );
        return res.send(response(baseResponse.SUCCESS, '장바구니에 상품을 담았습니다.'));
    } else {
        if (basketStatus[0].status == 2) {
            const changeBasket = await productService.changeBasket(
                userIdFromJWT,
                productId,
                productCount,
            );
            return res.send(response(baseResponse.SUCCESS, '장바구니에 상품을 담았습니다.'));
        } else {
            const updateBasket = await productService.updateBasket(
                userIdFromJWT,
                productId,
                productCount,
            );
            return res.send(
                response(baseResponse.SUCCESS, '이미 장바구니에 있어 상품을 추가로 담았습니다.'),
            );
        }
    }
};

/**
 * API No. 28
 * API Name : 상품 문의 전반적인 화면 API
 * [GET] /app/product/:productId/inquire
 */ exports.getProductInquire = async function (req, res) {
    const productId = req.params.productId;
    const getProductInquireResult = await productProvider.getProductInquire(productId);

    return res.send(response(baseResponse.SUCCESS, getProductInquireResult));
};
/**
 * API No. 29
 * API Name : 문의 전체보기 API
 * [GET] /app/product/:productId/inquire-all
 */ exports.getProductInquireAll = async function (req, res) {
    const productId = req.params.productId;
    const getProductInquireAllResult = await productProvider.getProductInquireAll(productId);

    return res.send(response(baseResponse.SUCCESS, getProductInquireAllResult));
};
/**
 * API No. 30
 * API Name : 문의 상세보기 API
 * [GET] /app/productInquire/:productInquireId/inquire-detail
 */ exports.getProductInquireDetail = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const productInquireId = req.params.productInquireId;
    const getProductInquireDetailCheck = await productProvider.getProductInquireDetail(
        productInquireId,
    );
    if (getProductInquireDetailCheck[0].userId == userIdFromJWT) {
        return res.send(response(baseResponse.SUCCESS, getProductInquireDetailCheck));
    } else {
        return res.send(response(baseResponse.USER_ID_NOT_MATCHED));
    }
};
/**
 * API No. 31
 * API Name : 상품 문의하기 API
 * [POST] /app/users/product/:productId/inquire
 */ exports.postProductInquire = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const productId = req.params.productId;
    const { title, content, secretStatus } = req.body;
    const postProductInquireResult = await productService.postProductInquire(
        userIdFromJWT,
        productId,
        title,
        content,
        secretStatus,
    );
    result = {
        comment: '문의가 완료되었습니다.',
    };
    return res.send(response(baseResponse.SUCCESS, result));
};
/**
 * API No. 32
 * API Name : 상품 문의하기 화면 API
 * [GET] /app/users/product/:productId/inquire-info
 */ exports.postProductInquireInfo = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const productId = req.params.productId;
    const postProductInquireInfoResult = await productProvider.postProductInquireInfo(productId);
    return res.send(response(baseResponse.SUCCESS, postProductInquireInfoResult[0]));
};
/**
 * API No. 33
 * API Name : 상위 카테고리 조회 API
 * [GET] /app/product/productCategory
 */ exports.getProductCategory = async function (req, res) {
    const productCategoryResult = await productProvider.getProductCategory();
    return res.send(response(baseResponse.SUCCESS, productCategoryResult));
};
/**
 * API No. 34
 * API Name : 하위 카테고리 조회 API
 * [GET] /app/product/productCategory/:productCategoryId/detail
 */ exports.getProductCategoryDetail = async function (req, res) {
    const productCategoryId = req.params.productCategoryId;
    const productCategoryDetailResult = await productProvider.getProductCategoryDetail(
        productCategoryId,
    );
    return res.send(response(baseResponse.SUCCESS, productCategoryDetailResult));
};
/**
 * API No. 35
 * API Name : 카테고리 별 상품 조회 API
 * [GET] /app/product/DetailCategory/:detailCategoryId/info
 */ exports.getProductByDetailCategoryId = async function (req, res) {
    const detailCategoryId = req.params.detailCategoryId;
    const getCategory = await productProvider.getDetailCategory(detailCategoryId);
    const getProductByByDetailCategoryIdResult = await productProvider.getProductByDetailCategoryId(
        detailCategoryId,
    );

    const result = {
        category: getCategory[0],
        productInfo: getProductByByDetailCategoryIdResult,
    };
    return res.send(response(baseResponse.SUCCESS, result));
};
/**
 * API No. 36
 * API Name : 상위 카테고리 전체 상품 조회 API
 * [GET] /app/product/productCategory/:productCategoryId/info
 */ exports.getProductByCategoryId = async function (req, res) {
    const productCategoryId = req.params.productCategoryId;
    const getCategory = await productProvider.getCategory(productCategoryId);
    const getProductByCategoryIdResult = await productProvider.getProductByCategoryId(
        productCategoryId,
    );

    const result = {
        category: getCategory[0],
        productInfo: getProductByCategoryIdResult,
    };
    return res.send(response(baseResponse.SUCCESS, result));
};
/**
 * API No. 37
 * API Name : 신상품 조회 API
 * [GET] /app/product/new
 */
exports.getNewProduct = async function (req, res) {
    const getNewProductResult = await productProvider.getNewProduct();
    return res.send(response(baseResponse.SUCCESS, getNewProductResult));
};
/**
 * API No. 38
 * API Name : 알뜰상품 조회 API
 * [GET] /app/product/sales
 */
exports.getSalesProduct = async function (req, res) {
    const getSalesProductResult = await productProvider.getSalesProduct();
    return res.send(response(baseResponse.SUCCESS, getSalesProductResult));
};
/**
 * API No. 39
 * API Name : 금주혜택 조회 API
 * [GET] /app/product/benefits
 */
exports.getBenefits = async function (req, res) {
    const getBenefitsResult = await productProvider.getBenefits();
    return res.send(response(baseResponse.SUCCESS, getBenefitsResult));
};
/**
 * API No. 40
 * API Name : 금주혜택 상품 조회 API
 * [GET] /app/product/benefits/:benefitsId/info
 */
exports.getBenefitsProduct = async function (req, res) {
    const benefitsId = req.params.benefitsId;
    const getBenefitsName = await productProvider.getBenefitsName(benefitsId);
    const getBenefitsProductResult = await productProvider.getBenefitsProducts(benefitsId);
    const result = {
        benefitsTitle: getBenefitsName[0],
        benefitsProduct: getBenefitsProductResult,
    };
    return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 44
 * API Name : 자주 사는 상품 API
 * [GET] /app/products/often
 */
exports.getOftenProducts = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const checkBuy = await productProvider.checkBuy(userIdFromJWT);
    if (checkBuy[0].exist == 0) {
        return res.send(response(baseResponse.PRODUCT_BUY_EMPTY));
    } else {
        const getOftenProductsResult = await productProvider.getOftenProducts(userIdFromJWT);
        return res.send(response(baseResponse.SUCCESS, getOftenProductsResult));
    }
};

/**
 * API No. 45
 * API Name : 실시간 인기 상품 조회 API
 * [GET] /app/products/popular
 */
exports.getPopularProducts = async function (req, res) {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let hours = today.getHours();
    if (month < 10) {
        month = '0' + month;
    }
    let startHours = year + '-' + month + '-' + date + ' ' + (hours - 1) + ':00:00';
    let endHours = year + '-' + month + '-' + date + ' ' + (hours - 1) + ':59:59';
    const popularResult = await productProvider.getPopularProduct(startHours, endHours);
    return res.send(response(baseResponse.SUCCESS, popularResult));
};

/**
 * API No. 15
 * API Name : 찜하기
 * [POST] /app/product/wish-product
 */ exports.wishProduct = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const { productId } = req.body;
    const wishCheck = await productProvider.checkWish(userIdFromJWT, productId);
    const wishStatus = await productProvider.checkWishStatus(userIdFromJWT, productId);
    if (wishCheck[0].exist == 0) {
        const inputWish = await productService.inputWish(userIdFromJWT, productId);
        return res.send(response(baseResponse.SUCCESS, '해당 상품을 찜 했습니다.'));
    } else {
        if (wishStatus[0].status == 2) {
            const changeWish = await productService.changeWish(userIdFromJWT, productId);
            return res.send(response(baseResponse.SUCCESS, '해당 상품을 찜 했습니다.'));
        } else {
            const deleteBasket = await productService.deleteWish(userIdFromJWT, productId);
            return res.send(response(baseResponse.SUCCESS, '해당 상품 찜을 취소했습니다.'));
        }
    }
};

/**
 * API No. 15
 * API Name : 상품 삭제 API
 * [PATCH] /app/product/:productId/delete
 */ exports.deleteProduct = async function (req, res) {
    const productId = req.params.productId;
    deleteCache('productId/' + productId);
    return res.send(response(baseResponse.SUCCESS, '키를 삭제했습니다.'));
};
