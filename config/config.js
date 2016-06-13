/**
 * Created by sunny on 16/5/27.
 */
var mysql = require('mysql');

function connectServer(){
    var pool = mysql.createPool({
        connectionLimit: 10,
        host: '120.27.123.90',
        user: 'sunqing',
        password: 'sunqing',
        database: 'express'
    });
    return pool;
}
exports.connect = connectServer;