'use strict'
var path = require('path');
var util = require('./libs/util');
var wechat_file=path.join(__dirname,'config/wechat.txt')
var wechat_ticket_file=path.join(__dirname,'config/wechat_ticket.txt')
var config ={
    wechat:{
        appID:'wx64ad8152dfd7c0e7',
        appSecret:'703a9fd18c700ca77b9e7851fdec1750',
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