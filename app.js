'use strict'
var getUserInfo = require('./user').getUserInfo;
var getOpenID = require('./user').getOpenID;
var sendmessage = require('./sendmessage');
var Koa = require('koa');
var path = require('path');
var g = require('./gwechat/g');
var weixin = require('./wx/reply');
var util = require('./libs/util');
var wechat_file=path.join(__dirname,'config/wechat.txt')
var config = require('./config');
var app = new Koa();
var ejs = require('ejs');
var heredoc = require('heredoc');
var crypto = require('crypto');
var Wechat = require('./gwechat/wechat');
var express = require('express');
var con = require('./config/config.js');
var URL = require('url');
var querystring = require('querystring');
var searchid = require('./mysql/sql_id');
var fetch_order = require('./mysql/fetch_order');
var tpl = heredoc(function(){/*
     <!DOCTYPE html>
     <html lang="en">
     <head>
     <meta charset="UTF-8">
     <meta name ="viewport" content = "initial-scale=1,maximum-scale=1,minimum-scale=1">
     <title>帮取页面</title>
     <link rel="stylesheet" href="https://weui.io/weui.css"/>
     <link rel="stylesheet" href="https://weui.io/example.css"/>
     </head>
     <body>
     <div class="container" id="container"><div class="cell">
     <div class="hd">
     <h1 class="page_title">快递帮帮取</h1>
     </div>
     <div class="bd">
     <div class="weui_cells">
     <div class="weui_cell">
     <div class="weui_cell_hd"><img src="<%= img%>" alt="" style="width:20px;margin-right:5px;display:block"></div>
     <div class="weui_cell_bd weui_cell_primary">
     <p><%= usrname%>的<%= company%>快递,手机号是<%= telephone%> </p>
     </div>

     <div class="weui_cell_ft"><%= address%></div>
     </div>

     </div>
     </div>
     <div class="weui_cells weui_cells_form">
     <div class="weui_cell">
     <div class="weui_cell_hd"><label class="weui_label">手机号</label></div>
     <div class="weui_cell_bd weui_cell_primary">

     <input class="weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号" id = "telephone"/>

     </div>
     </div>
     </div>
     <div class="weui_btn_area">
     <a class="weui_btn weui_btn_primary" href="javascript:void(0);"  onclick="showDialog('dialog<%= id%>')"  id="showTooltips">确定</a>

     <div class="weui_dialog_confirm" id="dialog<%= id%>" style="display: none;">
     <div class="weui_mask"></div>
     <div class="weui_dialog">
     <div class="weui_dialog_hd">
     <strong class="weui_dialog_title">请求确认</strong>
     </div>


     <div class="weui_dialog_bd">
     <%= address %> <%= company %> <%= usrname %> <%= telephone %>
     </div>



     <div class="weui_dialog_ft">
     <a href="javascript:void(0);" onclick="javascript:hideDialog('dialog<%= id%>');" class="weui_btn_dialog default">取消</a>
     <a href="javascript:check(<%= id%>)" onclick="javascript:hideDialog('dialog<%= id%>');" class="weui_btn_dialog primary">确定</a>

     </div>
     </div>
     </div>

     </div>
     </div>
     </div>
     </div></div>

     <script type="text/javascript">
     function showDialog(id) {
     document.getElementById(id).style.display="block";
     }
     function hideDialog(id) {
     document.getElementById(id).style.display="none";
     }
     function check(id) {
     var mobile = document.getElementById("telephone").value;
     console.log('hahahhahha'+mobile+'***********');
     if(mobile.length==0)
     {
     alert('请输入手机号码！');
     document.telephone.focus();
     return false;
     }
     else if(mobile.length!=11)
     {
     alert('请输入有效的手机号码！');
     document.telephone.focus();
     return false;
     }
     else{
        window.location.href = '/receive/id=<%=id%>&resid=<%=res_ID %>&tel='+mobile;

     }

     }
     </script>
     </body>
     </html>

 */})

//写个路由信息
var render = require('./libs/render');
var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');


// route middleware
//点击领取跳转的路由信息
app.use(route.get('/receive/:id', order_res));
app.use(route.post('/receive/:id', create));

function *order_res(id) {
    //这里写领取请求的业务
    console.log('id***************');
    console.log(id);
    var info = querystring.parse(id);
    console.log('info***************');
    console.log(info);
    var result = yield fetch_order(info.id,info.tel,info.resid);
    var res_sendmessage=yield searchid(info.id);
    console.log('res_sendmessage**************');
    console.log(res_sendmessage[0]);
    //这里需要改一下
    var res =yield sendmessage(res_sendmessage[0]);
this.body = yield render('order_res', { res: res });
}
function *create() {

    this.redirect('/');
}


var createNonce = function(){
    return Math.random().toString(36).substr(2,15);
}
var createTimestamp = function(){
    return parseInt(new Date().getTime()/1000,10)+'';
}
var _sign = function(noncestr,ticket,timestamp,url){
    var params = [
        'noncestr='+noncestr,
        'jsapi_ticket='+ticket,
        'timestamp='+timestamp,
        'url='+url
    ]
    var str = params.sort().join('&');
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
}
function sign(ticket,url){
    var noncestr = createNonce();
    var timestamp = createTimestamp();
    var signature = _sign(noncestr,ticket,timestamp,url);
    return{
        noncestr:noncestr,
        timestamp:timestamp,
        signature:signature
    }
}


app.use(function *(next){
    if(this.url.indexOf('/list')> -1){
        var wechatApi = new Wechat(config.wechat);
        var testUrl =  this.url.replace("/list?","");
        var params = querystring.parse(testUrl);
        var searchresult = yield searchid(params.id);
        console.log(searchresult);
        params.nickname = searchresult[0].nickname;
        params.usrname = searchresult[0].usrname;
        params.address = searchresult[0].address;
        params.company = searchresult[0].company;
        params.telephone = searchresult[0].telephone;
        params.img = searchresult[0].img;
        params.time = searchresult[0].time;
        console.log(params)
        this.body = ejs.render(tpl,params);
        return next;
    }
    yield next;
});
app.use(g(config.wechat,weixin.reply));

app.listen(1234);
console.log('Listening:1234');