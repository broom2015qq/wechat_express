var con = require('../config/config.js');
var mysql= require('mysql');
function fetch_order(id,tel,resid) {
    var promise = new Promise(function (resolve, reject) {
        var reply;
        //操作数据库
        con.connect().getConnection(function (err, connection) {
            var state = 2;
            //var post = {company: content,state:state};
            //console.log(sql);
            var query = connection.query("UPDATE list SET res_tele =?,state=? ,res_ID=? where id=? and state =?" ,[tel,1,resid,id,state], function (err, result) {
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
module.exports = fetch_order;

