const mysql = require('mysql2/promise');
const { logger } = require('./winston');
let pool;
if (process.env.NODE_ENV == 'development') {
    pool = mysql.createPool({
        host: 'mywebserver.cvifdvvqbxad.ap-northeast-2.rds.amazonaws.com',
        user: 'user',
        port: '3306',
        password: 'ckddn40852!',
        database: 'Kurly-dev',
    });
} else if (process.env.NODE_ENV == 'production') {
    pool = mysql.createPool({
        host: 'mywebserver.cvifdvvqbxad.ap-northeast-2.rds.amazonaws.com',
        user: 'user',
        port: '3306',
        password: 'ckddn40852!',
        database: 'Kurly-prod',
    });
}

module.exports = {
    pool: pool,
};
