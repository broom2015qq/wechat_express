'use strict'
var config = require('./../config');
var Wechat = require('./../gwechat/wechat');
var menu = require('./menu');
var path = require('path');
var Promise = require('bluebird');
var faceapi = require('../faceapi');
//数据库有关
//var con = require('../config/config.js');
var mysql= require('mysql');
//var models = require('../models/model');
//var User = models.User;

//config.wechat是票据
var wechatApi = new Wechat(config.wechat);
wechatApi.deleteMenu().then(function(){
	return wechatApi.createMenu(menu);
}).then(function(msg){
	console.log(msg);
})
//生成期函数
exports.reply = function* (next){
	var that = this;
	console.log('this'+this);
	var message = this.weixin;
	//关注,取关,点击,发送位置等事件
	if (message.MsgType ==='event') {
		console.log(message.Event);
		if (message.Event ==='subscribe') {
			if (message.EventKey) {
				console.log('扫二维码进来');
			}
			//this.body = '我的青春啊，全来学习nodejs了\r\n';
			//console.log('我的青春啊，全来学习nodejs了');
			reply = [{
				title:'拍照',
				description:'拍照',
				picUrl:'http://static.open-open.com/news/uploadImg/20140123/20140123090127_450.png',
				url:'http://www.cnblogs.com/thingk/archive/2013/11/25/3434032.html'
			}]
			this.body = reply;
		}
		else if (message.Event==='unsubscribe') {
			this.body='无情取关';
			console.log('无情取关');
		}
		else if (message.Event==='LOCATION') {
			this.body='您上报的位置是 '+ message.Latitude+ '/'+ message.Longitude +'-'+message.Precision;
		}
		else if (message.Event==='CLICK') {
			this.body='您点击了菜单 '+ message.EventKey;
		}
		else if (message.Event==='SCAN') {
			console.log('关注后扫二维码'+message.EventKey +''+message.Ticket);
			this.body='你扫了二维码哦 ';
		}
		else if (message.Event==='VIEW') {
			this.body='你点击了菜单中的链接 '+ message.EventKey;
		}
		else if (message.Event==='pic_sysphoto') {
			console.log(message.SendPicsInfo.PicList);
			this.body='你点击了菜单中 '+ message.EventKey;
		}
		else if (message.Event==='pic_photo_or_album') {
			console.log(message.SendPicsInfo.PicList);
			this.body='你点击了菜单中 '+ message.EventKey;
		}
		else if (message.Event==='pic_weixin') {
			console.log(message.SendPicsInfo.PicList);
			this.body='你点击了菜单中 '+ message.EventKey;
		}

	}
	//用户发的text
	else if (message.MsgType==='text') {
		var content = message.Content;
		if(content === '1'){
			var user = yield wechatApi.fetchUsers(message.FromUserName,'zh-CN');
			//console.log('******user**********');
			//console.log(user);
			var openIds = [
				{
					openid:message.FromUserName,
					lang:'en'
				}
			]
			var users = yield wechatApi.fetchUsers(openIds);
			console.log('******users**********');
			console.log(users);
			reply = JSON.stringify(user);
		}
		else if (content==='2') {
			reply = '第二项';
		}
		else if (content==='3') {
			reply = '第三项';
		}
		else if (content==='4') {
			reply = [{
				title:'nodeJs学习过程之一个图片上传显示的例子',
				description:'学习笔记',
				picUrl:'http://static.open-open.com/news/uploadImg/20140123/20140123090127_450.png',
				url:'http://www.cnblogs.com/thingk/archive/2013/11/25/3434032.html'
			},{
				title:'nodeJs学习过程之一个图片上传显示的例子',
				description:'学习笔记',
				picUrl:'http://static.open-open.com/news/uploadImg/20140123/20140123090127_450.png',
				url:'http://www.cnblogs.com/thingk/archive/2013/11/25/3434032.html'
			},{
				title:'nodeJs学习过程之一个图片上传显示的例子',
				description:'学习笔记',
				picUrl:'http://static.open-open.com/news/uploadImg/20140123/20140123090127_450.png',
				url:'http://www.cnblogs.com/thingk/archive/2013/11/25/3434032.html'
			},{
				title:'nodeJs学习过程之一个图片上传显示的例子',
				description:'学习笔记',
				picUrl:'http://static.open-open.com/news/uploadImg/20140123/20140123090127_450.png',
				url:'http://www.cnblogs.com/thingk/archive/2013/11/25/3434032.html'
			},{
				title:'nodeJs学习过程之一个图片上传显示的例子',
				description:'学习笔记',
				picUrl:'http://static.open-open.com/news/uploadImg/20140123/20140123090127_450.png',
				url:'http://www.cnblogs.com/thingk/archive/2013/11/25/3434032.html'
			},{
				title:'nodeJs学习过程之一个图片上传显示的例子',
				description:'学习笔记',
				picUrl:'http://static.open-open.com/news/uploadImg/20140123/20140123090127_450.png',
				url:'http://www.cnblogs.com/thingk/archive/2013/11/25/3434032.html'
			},{
				title:'nodeJs学习过程之一个图片上传显示的例子',
				description:'学习笔记',
				picUrl:'http://static.open-open.com/news/uploadImg/20140123/20140123090127_450.png',
				url:'http://www.cnblogs.com/thingk/archive/2013/11/25/3434032.html'
			},{
				title:'nodeJs学习过程之一个图片上传显示的例子',
				description:'学习笔记',
				picUrl:'http://static.open-open.com/news/uploadImg/20140123/20140123090127_450.png',
				url:'http://www.cnblogs.com/thingk/archive/2013/11/25/3434032.html'
			},{
				title:'nodeJs学习过程之一个图片上传显示的例子',
				description:'学习笔记',
				picUrl:'http://static.open-open.com/news/uploadImg/20140123/20140123090127_450.png',
				url:'http://www.cnblogs.com/thingk/archive/2013/11/25/3434032.html'
			}]
		}
		else if (content==='5') {
			var data =yield wechatApi.uploadMaterial('image',path.join(__dirname,'../2.jpg'));
			reply = {
				type:'image',
				mediaId:data.media_id
			}
		}
		else if (content==='6') {
			var data =yield wechatApi.uploadMaterial('video',path.join(__dirname,'../2.mp4'));
			//这个怎么跑不出来
			reply = {
				type: 'video',
				title: '回复视频内容',
				description: '发送6,返回视频',
				mediaId: data.media_id
			}
		}

		this.body = reply;

	}
	else if (message.MsgType==='image') {
		//var reply = yield faceapi(message.PicUrl,message.FromUserName);
		var reply =' 当前图片'+message.PicUrl;



		////操作数据库
		//con.connect().getConnection(function (err, connection) {
		//	var post  = {wname: message.FromUserName, wpic: message.PicUrl};
		//	var query = connection.query('INSERT INTO myfriends SET ?', post, function(err, result) {
		//		if (err){
		//			throw err;
		//		}
		//		else{
		//			console.log('加入成功');
        //
		//		}
		//	});
		//	console.log(query.sql);
		//});
		//reply = {
		//	pic:message.PicUrl,
		//	user:message.FromUserName
		//}
		//发送请求123.206.74.28:8080/servlet/facehandle&url=hsjwjdjdka.jpg

        //
		////回复语音消息
		//var data =yield wechatApi.uploadMaterial('voice',path.join(__dirname,'../2.mp3'));
		//reply = {
		//	type:'voice',
		//	mediaId:data.media_id
		//}
		this.body = reply;

	}

	yield next;
}