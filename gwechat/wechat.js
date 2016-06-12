/**
 * Created by sunny on 16/4/30.
 */
'use strict'
var Promise = require('bluebird');
var tpl = require('./tpl');
var util = require('./util');
var fs = require('fs');
//request的then方法,是request promise化之后得到的
var request = Promise.promisify(require('request'));
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api ={
    accessToken:prefix+'token?grant_type=client_credential',
    upload:prefix+'media/upload?',
    ticket:{
        get:prefix+'ticket/getticket?'
    },
    menu:{
        create:prefix+'menu/create?',
        get:prefix+'menu/get?',
        del:prefix+'menu/delete?',
        current:prefix+'get_current_selfmenu_info?'

    },
    currentuser:{
        get:prefix+'user/info?'
    }
}
//构造函数,传入参数是票据
function Wechat(opts){
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.getTicket = opts.getTicket;
    this.saveTicket = opts.saveTicket;
    this.fetchAccessToken();

}
Wechat.prototype.fetchAccessToken = function(data){
    var that = this;
    return this.getAccessToken()
        .then(function(data){
            try{
                data = JSON.parse(data);
            }
                //获取不到,更新票据信息
            catch(e){
                return that.updateAccessToken();
            }
            if(that.isValidAccessToken(data)){
                //把data传下去
                return Promise.resolve(data);
            }
            else{
                //如果票据过期
                return that.updateAccessToken();
            }
        })
        //拿到票据结果
        .then(function(data){
            //微信返回json数据包给公众号{"access_token":"ACCESS_TOKEN","expires_in":7200}
            that.saveAccessToken(data);
            return Promise.resolve(data);
        })
}
Wechat.prototype.fetchTicket = function(access_token){
    var that = this;

    return this.getTicket()
        .then(function(data){
            try{
                data = JSON.parse(data);
            }
                //获取不到,更新票据信息
            catch(e){
                //console.log('!!!!!access_token'+access_token)
                return that.updateTicket(access_token);
            }
            if(that.isValidTicket(data)){
                //把data传下去
                return Promise.resolve(data);
            }
            else{
                //如果票据过期
                return that.updateTicket(access_token);
            }
        })
        //拿到票据结果
        .then(function(data){
            //微信返回json数据包给公众号{"access_token":"ACCESS_TOKEN","expires_in":7200}
            that.saveTicket(data);
            return Promise.resolve(data);
        })
}
Wechat.prototype.uploadMaterial = function(type,filepath){
    var that = this;
    var form ={
        media:fs.createReadStream(filepath)
    }
    var appID = that.appID;

    //发出请求
    return new Promise(function(resolve,reject){
        that
            .fetchAccessToken()
            .then(function(data){
                var url = api.upload + 'access_token=' +data.access_token + '&type='+ type;
                
                //request发起请求,请求方法post
                request({method:'POST',url:url, formData:form,json: true}).then(function(response) {
                    var _data = response.body;
                    if(_data){
                        resolve(_data);
                    }
                    else{
                        throw new Error('upload error')
                    }
                }).catch(function(err){
                    reject(err);
                })
            });
    });

}
//从Wechat的原型链上增加一个方法:判断票据是否有效
Wechat.prototype.isValidAccessToken = function(data){
    if(!data || !data.access_token || !data.expires_in){
        return false;
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = (new Date().getTime());

    if(now<expires_in){
        //没过期
        return true;
    }
    else{
        return false;
    }
}
Wechat.prototype.isValidTicket = function(data){
    if(!data || !data.ticket || !data.expires_in){
        return false;
    }
    var ticket = data.ticket;
    var expires_in = data.expires_in;
    var now = (new Date().getTime());

    if(ticket && now<expires_in){
        //没过期
        return true;
    }
    else{
        return false;
    }
}
Wechat.prototype.updateAccessToken = function(){
    var appID = this.appID;
    var appSecret = this.appSecret;
    var url =api.accessToken+'&appid='+appID+'&secret='+appSecret;
    //发出请求

    return new Promise(function(resolve,reject){
        request({url :url, json: true}).then(function(response) {
            var data = response.body;
            var now = (new Date().getTime());
            // 提前20秒刷新,考虑网络延迟
            var expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;
            resolve(data);
        });
    });

}
Wechat.prototype.updateTicket = function(access_token){
    var url =api.ticket.get+'&access_token='+access_token+'&type=jsapi';
    //发出请求

    return new Promise(function(resolve,reject){
        request({url :url, json: true}).then(function(response) {
            var data = response.body;
            var now = (new Date().getTime());
            // 提前20秒刷新,考虑网络延迟
            var expires_in = now + (data.expires_in - 20) * 1000;

            data.expires_in = expires_in;
            resolve(data);
        });
    });

}
//上下文已经改变,
Wechat.prototype.reply = function(){
    //拿到回复的内容
    var content = this.body;
    //拿到weixin
    var message = this.weixin;
    //根据content:用户回复的1,2,3...和message:根据123反馈给用户的信息.组合生成xml
    var xml = util.tpl(content,message);
    this.status = 200;
    this.type = 'application/xml';
    this.body = xml;
}
Wechat.prototype.createMenu = function(menu){
    var that = this;
    return new Promise(function(resolve,reject){
        that
            .fetchAccessToken()
            .then(function(data){
                var url = api.menu.create +'access_token='+data.access_token;
                request({method:'POST',url :url,body:menu, json: true}).then(function(response) {
                    var _data = response.body;
                    if(_data){
                        resolve(_data);
                    }
                    else{
                        throw new Error('create menu fails');
                    }

                }).catch(function(err){
                    reject(err);
                })
            })
    });

}
Wechat.prototype.getMenu = function(menu){
    var that = this;
    return new Promise(function(resolve,reject){
        that
            .fetchAccessToken()
            .then(function(data){
                var url = api.menu.get +'access_token='+data.access_token;
                request({url :url, json: true}).then(function(response) {
                    var _data = response.body;
                    if(_data){
                        resolve(_data);
                    }
                    else{
                        throw new Error('get menu fails');
                    }

                }).catch(function(err){
                    reject(err);
                })
            })
    });

}
Wechat.prototype.deleteMenu = function(){
    var that = this;
    return new Promise(function(resolve,reject){
        that
            .fetchAccessToken()
            .then(function(data){
                var url = api.menu.del +'access_token='+data.access_token;
                request({url :url, json: true}).then(function(response) {
                    var _data = response.body;
                    if(_data){
                        resolve(_data);
                    }
                    else{
                        throw new Error('delete menu fails');
                    }

                }).catch(function(err){
                    reject(err);
                })
            })
    });

}
Wechat.prototype.getCurrentMenu = function(){
    var that = this;
    return new Promise(function(resolve,reject){
        that
            .fetchAccessToken()
            .then(function(data){
                var url = api.menu.current +'access_token='+data.access_token;
                request({url :url, json: true}).then(function(response) {
                    var _data = response.body;
                    if(_data){
                        resolve(_data);
                    }
                    else{
                        throw new Error('getCurrent Menu fails');
                    }

                }).catch(function(err){
                    reject(err);
                })
            })
    });

}
Wechat.prototype.fetchuser = function(access_token){
    var that = this;

    return this.getTicket()
        .then(function(data){
            try{
                data = JSON.parse(data);
            }
                //获取不到,更新票据信息
            catch(e){
                //console.log('!!!!!access_token'+access_token)
                return that.updateTicket(access_token);
            }
            if(that.isValidTicket(data)){
                //把data传下去
                return Promise.resolve(data);
            }
            else{
                //如果票据过期
                return that.updateTicket(access_token);
            }
        })
        //拿到票据结果
        .then(function(data){
            //微信返回json数据包给公众号{"access_token":"ACCESS_TOKEN","expires_in":7200}
            that.saveTicket(data);
            return Promise.resolve(data);
        })
}
module.exports = Wechat;