/**
 * Created by sunny on 16/5/31.
 */
var request = require('request');
//var tts=require("./textToSpeech.js");
function faceapi(PicUrl,FromUserName){
    var reply = '';
    var reqUrl = 'http://123.206.74.28:8080/Feng/DetectFace?imgURL='+PicUrl+'&user='+FromUserName;
    console.log('***reqUrl'+reqUrl);
    var promise = new Promise(function(resolve, reject) {
        request({uri:reqUrl}, function(err, response) {
            if (!err && response.statusCode == 200) {
                reply=response.body;
                console.log('***reply'+reply);
                resolve(reply);
            }
            else{
                reply = err;
                reject(reply);
            }
        });
    });

    promise.then(function(reply) {
        // success
        function cb()
        {
            console.log("Finished");
        }

        if ('null'==reply)
        {
            reply="你的好友里面没有这个人";
        }
        else if ('empty'==reply)
        {
            reply="你的好友为空";
        }
        tts(reply,cb);

    }, function(reply) {
        // failure
        console.log("Text resolve failed");
    });
    return promise;
}
module.exports = faceapi;