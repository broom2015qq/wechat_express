/**
 * Created by sunny on 16/6/13.
 */
/**
 * Created by sunny on 16/6/12.
 */
var config = require('./config');
var appID = config.wechat.appID
var appSecret = config.wechat.appSecret
var getToken = require('./token');
var getUserInfo = require('./user').getUserInfo;
var request = require('request');
var fs = require('fs');
var path = require('path');
var wechat_file=path.join(__dirname,'config/wechat.txt')
function sendmessage(msg) {
    var reply = '';
    var token;
    var promise = new Promise(function (resolve, reject) {
        if(fs.existsSync(wechat_file)){
            console.log('有缓存吗');
            token = JSON.parse(fs.readFileSync(wechat_file));
        }
        if(!token || token.timeout < Date.now()){
            request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appID+'&secret=' + appSecret, function(err, res, data){
                if(err){
                    reply = err;
                    reject(reply);
                }
                else{
                    console.log('data************');
                    console.log(data);
                    reply = JSON.parse(data);
                    reply.timeout = Date.now() + 7000000;
                    //更新token并缓存
                    //因为access_token的有效期是7200秒，每天可以取2000次
                    //所以差不多缓存7000秒左右肯定是够了
                    fs.writeFileSync(wechat_file, JSON.stringify(reply));
                    console.log('reply************');
                    console.log(reply);
                    resolve(reply);
                }
            });
        }
        else{
            console.log('else**********');
            console.log(token);
            resolve(token);
        }


    });
    promise.then(function(reply) {
        console.log('两个id************');
        console.log('请求人************');
        console.log(msg.req_ID);
        console.log('接单人************');

        console.log(msg.res_ID);



        console.log('下一阶段的reply************');
        console.log(reply);
        console.log('https://api.weixin.qq.com/cgi-bin/user/info?access_token='+reply.access_token+'&openid='+msg.res_ID+'&lang=zh_CN');
        //这里是获得res用户信息
        request('https://api.weixin.qq.com/cgi-bin/user/info?access_token='+reply.access_token+'&openid='+msg.res_ID+'&lang=zh_CN', function(err, res, data){
            var name = JSON.parse(data).nickname;
            console.log(data);
            //发送消息给求取者
            request({url:'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+reply.access_token,
                method: 'POST',
                json:true,
                body: {
                    "touser": msg.req_ID,
                    "msgtype": "text",
                    "text": {
                        "content":name+""+msg.res_tele+"接受了你的的请求,即将把快递送到你手上~"
                    }
                }}, function(err,httpResponse,body){
                if (err) {
                    return console.error('Send failed:', err);
                }
                console.log('Server responded with:', body);
            });

            //发送消息给帮取者
            request({url:'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+reply.access_token,
                method: 'POST',
                json:true,
                body: {
                    "touser": msg.res_ID,
                    "msgtype": "text",
                    "text": {
                        "content":"你接受了"+msg.nickname+"的请求,快帮ta把快递安全送到吧~\n"+"快递信息:"+msg.usrname+" "+msg.address+" "+msg.company+" "+msg.telephone
                    }
                }}, function(err,httpResponse,body){
                if (err) {
                    return console.error('Send failed:', err);
                }
                console.log('Server responded with:', body);
            });

        });
    });
    return promise;
}
module.exports = sendmessage;

