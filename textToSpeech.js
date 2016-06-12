var https = require('https');
//var express  = require('express');
//var app = express();

//var server = require('http').Server(app);
var tmpl = require("tmpl");
var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var token="";
//var xmlBodyParser = require('express-xml-parser');


function getAudio(text,callback)
{
  if (token=="") return;

  var post_data = {
      tex: text,
      lan: "zh",
      tok: token,
      ctp: 1,
      cuid:"10086"
    };//这是需要提交的数据

  var content = qs.stringify(post_data);
  var options = {
      hostname: 'tsn.baidu.com',
      port: 80,
      path: '/text2audio',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Content-Length': content.length
      }
  };

  var req = http.request(options, function (res) {
      console.log('Audio STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));
      var data="";
      res.setEncoding('binary');
      res.on('data', function (chunk) {
          //console.log('BODY: ' + chunk);
          data+=chunk;
      });
      res.on('end', function (chunk) {
          //console.log('BODY: ' + data);
          file="./2.mp3"
          options = { encoding: 'binary', mode: 438 /*=0666*/, flag: 'w' };
          fs.writeFileSync(file, data,options);
	  callback();
      });
  });

  req.on('error', function (e) {
      console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write(content);
  req.end();
}




function getToken(text,callback)
{

  url="https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id={APIKEY}&client_secret={SECRETKEY}&";
  APPID="8164564";
  APIKEY="jx4SoVA6QZ46P45Qlslv3QLF";
  SECRETKEY="5803e729ec39fa8bb7f2332be0127be1";
  url=tmpl(url,{
    APIKEY:APIKEY,
    SECRETKEY:SECRETKEY
  });
  //console.log(url);
  https.get(url, function(res) {
    //console.log("Got response: " + res.statusCode);
    chunk="";
    res.on('data',function(data){
      chunk+=data;
    });

    res.on('end',function(data){
      //console.log(chunk);
      var result = JSON.parse(chunk);
      console.log("key:"+result.access_token);
      token=result.access_token;
      getAudio(text,callback);
    });

  });

  //setTimeout(getToken,7200*1000);
}


module.exports=function(text,callback)
{
  getToken(text,callback);
}
