const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use(methodOverride());

    app.use(cors());

    require('../src/app/User/userRoute')(app);
    require('../src/app/Product/productRoute')(app);
    require('../src/app/Address/addressRoute')(app);
    require('../src/app/Basket/basketRoute')(app);
    require('../src/app/Order/orderRoute')(app);
    require('../src/app/Search/searchRoute')(app);

    return app;
};
