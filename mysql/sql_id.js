/**
 * Created by sunny on 16/6/13.
 */
/**
 * Created by sunny on 16/6/12.
 */
var con = require('../config/config.js');
var mysql= require('mysql');
function sql_id(content) {
    var promise = new Promise(function (resolve, reject) {
        var reply;
        //操作数据库
        con.connect().getConnection(function (err, connection) {
            var state = 1;
            //var post = {company: content,state:state};
            //console.log(sql);
            var query = connection.query('SELECT * FROM list WHERE id =? and state= ?', [content,state], function (err, result) {
                if (err) {
                    reply = err;
                    reject(reply);
                }
                else {
                    //console.log('********result*********');
                    //console.log(result);
                    console.log(query.sql);
                    resolve(result);
                }
            });

        });
    });
    return promise;
}
module.exports = sql_id;

