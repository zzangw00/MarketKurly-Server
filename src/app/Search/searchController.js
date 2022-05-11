const searchProvider = require('../../app/Search/searchProvider');
const searchService = require('../../app/Search/searchService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');
const { setCache } = require('../../../config/redis');

/**
 * API No. 45
 * API Name : 상품 검색 API
 * [GET] /app/product/product-search
 */
exports.searchProduct = async function (req, res) {
    const { searchName } = req.query;
    const searchResult = await searchProvider.getProduct(searchName);
    if (searchResult.length) {
        setCache('search/' + searchName, searchResult);
        res.status(200).send({
            ok: true,
            data: searchResult,
        });
    } else {
        res.status(400).send({
            ok: false,
            message: 'No more pages',
        });
    }
    //const searchAdd = await searchService.addSearch(searchName);
    //return res.send(response(baseResponse.SUCCESS, searchResult));
};
