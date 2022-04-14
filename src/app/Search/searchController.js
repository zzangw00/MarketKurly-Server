const searchProvider = require('../../app/Search/searchProvider');
const searchService = require('../../app/Search/searchService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

/**
 * API No. 45
 * API Name : 상품 검색 API
 * [GET] /app/product/product-search
 */
exports.searchProduct = async function (req, res) {
    const { searchName } = req.query;
    const searchResult = await searchProvider.getProduct(searchName);
    const searchAdd = await searchService.addSearch(searchName);
    return res.send(response(baseResponse.SUCCESS, searchResult));
};
