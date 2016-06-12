'use strict'
var path = require('path');
var util = require('./libs/util');
var wechat_file=path.join(__dirname,'config/wechat.txt')
var wechat_ticket_file=path.join(__dirname,'config/wechat_ticket.txt')
var config ={
    wechat:{
        appID:'wxf8af1ad692e84dbc',
        appSecret:'36a8947ca101ca4f6af7e92f658693b6',
        token:'pkusunny',
        //获取票据
        getAccessToken:function(){
            return util.readFileAsync(wechat_file)
        },
        //更新票据
        saveAccessToken:function(data){
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file,data);
        },
        getTicket:function(){
            return util.readFileAsync(wechat_ticket_file)
        },
        //更新票据
        saveTicket:function(data){
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_ticket_file,data);
        }
    }
};
module.exports = config;