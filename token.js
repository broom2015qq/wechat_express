/**
 * Created by sunny on 16/6/13.
 */

var request = require('request');
var fs = require('fs');

function getToken(appID, appSecret){
    console.log('appID**********');
    console.log(appID);
    console.log(appSecret);
    var promise = new Promise(function (resolve, reject){
        var token;
        //先看是否有token缓存，这里选择用文件缓存，可以用其他的持久存储作为缓存
        if(fs.existsSync('./config/wechat.txt')){
            console('有缓存吗')
            token = JSON.parse(fs.readFileSync('./config/wechat.txt'));
        }
        //如果没有缓存或者过期
        if(!token || token.timeout < Date.now()){
            console('没有缓存或者过期')
            request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appID+'&secret=' + appSecret, function(err, res, data){
                var result = JSON.parse(data);
                result.timeout = Date.now() + 7000000;
                //更新token并缓存
                //因为access_token的有效期是7200秒，每天可以取2000次
                //所以差不多缓存7000秒左右肯定是够了
                fs.writeFileSync('./config/wechat.txt', JSON.stringify(result));
                resolve(result);
            });
        }else{
            console.log('else**********');
            console.log(token);
            resolve(token);
        }
    });
    return promise;
}

module.exports = getToken;