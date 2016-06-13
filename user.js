/**
 * Created by sunny on 16/6/13.
 */
var config = require('./config');
var appID = config.wechat.appID
var appSecret = config.wechat.appSecret
var getToken = config.wechat.token;
var request = require('request');

function getOpenID(code) {

    return getToken(appID, appSecret).then(function(res){
        var token = res.access_token;

        return new Promise(function(resolve, reject){
            console.log('https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appID+'&secret='+appSecret+'&code='+code+'&grant_type=authorization_code');
            request('https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appID+'&secret='+appSecret+'&code='+code+'&grant_type=authorization_code', function(err, res, data){
                resolve(JSON.parse(data).openid);
            });
        });
    }).catch(function(err){
        console.log(err);
    });
}

function getUserInfo(openID){
    return getToken(appID, appSecret).then(function(res){
        var token = res.access_token;

        return new Promise(function(resolve, reject){

            console.log('https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token+'&openid='+openID+'&lang=zh_CN');
            request('https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token+'&openid='+openID+'&lang=zh_CN', function(err, res, data){
                resolve(JSON.parse(data));
            });
        });
    }).catch(function(err){
        console.log(err);
    });
}

module.exports = {
    getUserInfo: getUserInfo,
    getOpenID:getOpenID
};