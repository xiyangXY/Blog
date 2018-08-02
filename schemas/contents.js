/**
 * Created by xiyang on 2018/7/6 0006.
 */
var mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema({
    //关联字段
    category:{
        // 类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Category'
    },
    //内容标题
    title:String,
    //关键字
    user:{
        // 类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'User'
    },
    //时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //阅读数
    views:{
        type:Number,
        default:0
    },
    //简介
    desciption:{
        type:String,
        defalut:''
    },
    //内容
    content:{
        type:String,
        defalut:''
    },
    // 评论
    comments:{
        type:Array,
        default:[]
    }
});