/**
 * Created by xiyang on 2018/7/4 0004.
 */
var mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema({
    //用户名
    username: String,
    //密码
    password: String,
    //是否是管理员
    isAdmin: {
        type: Boolean,
        default:false
    }
});