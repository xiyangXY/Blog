/**
 * Created by xiyang on 2018/7/4 0004.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');
//统一返回格式
var responseData;

router.use(function(req,res,next){
    responseData = {
        code:0,
        message:''
    };
    next();
});

//用户注册
//注册逻辑
//1. 用户名不能为空
//2. 两次输入密码必须一致
//3. 棉麻补鞥呢为空

//数据库
//1. 用户是否已经被注册
router.post('/user/register',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //判断用户名是否为空
    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    //判断密码是否为空
    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    //两次输入的密码必须一致
    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码必须一致';
        res.json(responseData);
        return;
    }

    //用户名是否已经注册，如果数据库中已经存在和我们要注册的用户名的数据，表示用户名已经被注册
    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
        //    表示数据库有该记录
            console.log(userInfo);
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }

        // 保存用户注册的信息到数据库
        var user = new User({
            username : username,
            password:password
        });
        return user.save();
    }).then(function(newUserInfo){
        //注册成功
        console.log(newUserInfo);
        responseData.code = 200;
        responseData.message = '注册成功';
        res.json(responseData);
    });
});

//登录
router.post('/user/login',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;

    //判断用户名是否为空
    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }

   //查询数据库中相同用户名和密码的记录是否存在，存在就登录成功
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
    //    验证成功
        responseData.code = 200;
        responseData.message = '登陆成功';
        responseData.userInfo = {
            _id:userInfo._id,
            username:userInfo.username
        };
        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }));
        res.json(responseData);
        return;
    })
});

//退出登陆
router.get('/user/logout',function(req,res,next){
    req.cookies.set('userInfo',null);
    responseData.code = 200;
    responseData.message = '退出登录成功';
    res.json(responseData);
    return;
});

//评论提交
router.post('/comment/post',function(req,res,next){
    //内容id
    var contentId = req.body.contentid ||  '';
    var postData = {
        username: req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    };
    //    查询当前内容的信息
    Content.findOne({
        _id:contentId
    }).then(function(content){
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent){
        responseData.code = 200;
        responseData.data = newContent;
        responseData.message = '评论成功';
        res.json(responseData);
        return;
    });
});

//获取指定文章的所有评论
router.get('/comment',function(req,res,next){
    var contentId = req.query.contentid ||  '';
    Content.findOne({
        _id:contentId
    }).then(function(content){
        responseData.data = content.comments;
        responseData.code = 200;
        res.json(responseData);
    });
});

module.exports = router;