/**
 * Created by sunny on 16/6/13.
 */
var ejs = require('ejs');
var heredoc = require('heredoc');
//传进来的是content
var tpl = heredoc(function(){/*
 <!DOCTYPE html>
 <html>
 <head>
 <title>详细请求页面!!!!!!!!</title>
 <meta name ="viewport" content = "initial-scale=1,maximum-scale=1,minimum-scale=1">
 </head>
 <body>
 <p id = "title"></p>
 <div id = "pic"></div>
 <script src = "http://zeptojs.com/zepto-docs.min.js"></script>
 这里是详细请求
 </body>
 </html>
 */})