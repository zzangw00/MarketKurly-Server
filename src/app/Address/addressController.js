const addressProvider = require('../../app/Address/addressProvider');
const addressService = require('../../app/Address/addressService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

/**
 * API No. 18
 * API Name : 배송지 조회 API
 * [GET] /app/address
 */ exports.getAddress = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const getAddressResult = await addressProvider.getAddress(userIdFromJWT);

    return res.send(response(baseResponse.SUCCESS, getAddressResult));
};

/**
 * API No. 19
 * API Name : 배송지 선택 API
 * [PATCH] /app/address/:addressId/check
 */ exports.checkAddress = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const addressId = req.params.addressId;
    const checkAddressResult = await addressService.checkAddress(userIdFromJWT, addressId);
    const getCheckAddressResult = await addressProvider.getCheckAddress(userIdFromJWT, addressId);
    const result = {
        countResult: getCheckAddressResult[0],
        comment: '배송지로 선택 되었습니다.',
    };
    return res.send(response(baseResponse.SUCCESS, result));
};
/**
 * API No. 20
 * API Name : 배송지 추가 API
 * [POST] /app/address
 */ exports.addAddress = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const { Address } = req.body;
    const addAddressResult = await addressService.addAddress(userIdFromJWT, Address);
    const result = {
        AddressnId: addAddressResult.insertId,
        Address: Address,
        comment: '배송지가 추가 되었습니다.',
    };

    return res.send(response(baseResponse.SUCCESS, result));
};
