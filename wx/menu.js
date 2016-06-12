/**
 * Created by sunny on 16/5/26.
 */
'use strict'
var openid = '123456'
module.exports= {
    'button':[{
        'name':'求取',
        'type':'pic_sysphoto',
        'key':'camera'
    }, {
        "name": "帮取",
        "sub_button": [
            {
                "type": "pic_sysphoto",
                "name": "系统拍照发图",
                "key": "camera"
            },
            {
                "type": "view",
                "name": "跳转url",
                "url": "https://movie.douban.com/?openid="+openid
            },
            {
                "type": "pic_photo_or_album",
                "name": "拍照或者相册发图",
                "key": "rselfmenu_1_1"
            },
            {
                "type": "pic_weixin",
                "name": "微信相册发图",
                "key": "rselfmenu_1_2"
            }
        ]
    },{
        'name':'我',
        'type':'pic_sysphoto',
        'key':'camera'
    }]
}