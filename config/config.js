/**
 * Created by sunny on 16/5/27.
 */
var mysql = require('mysql');

function connectServer(){
    var pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'myNote',
        password: '123',
        database: 'myNote'
    });
    return pool;
}
exports.connect = connectServer;