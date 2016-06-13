/**
 * Created by sunny on 16/5/26.
 */
'use strict'
var openid = '123456'
module.exports= {
    'button':[{
        "type": "view",
        "name": "求取",
        "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx64ad8152dfd7c0e7&redirect_uri=http://120.27.123.90:3001/post&response_type=code&scope=snsapi_userinfo&connect_redirect=1#wechat_redirect"
    }, {
        "name": "帮取",
        "sub_button": [
            {
                "type": "view",
                "name": "帮取",
                "url": "http://120.27.123.90:3001/list?openid=xxx"
            },
            {
                "type": "pic_photo_or_album",
                "name": "拍照或者相册发图",
                "key": "rselfmenu_1_1"
            }
        ]
    },{
        "type": "view",
        "name": "我",
        "url": "http://120.27.123.90:3001/my?openid=xxx"
    }]
}