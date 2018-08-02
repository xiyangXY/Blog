/**
 * Created by xiyang on 2018/7/4 0004.
 */
var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

var data;
//处理通用信息
router.use(function(req,res,next){
    data = {
        userInfo: req.userInfo,
        categorys:[],
        //单个内容
        content:''
    };
    Category.find().then(function(categorys){
        //console.log('categorys------------');
        //console.log(categorys);
        data.categorys = categorys;
        next();
    });
});

router.get('/',function(req,res,next){
    //console.log(req.userInfo);
    //console.log(req.query.category);
    //分类id
    data.cata=req.query.category || '',
    data.count=0,
    data.page = Number(req.query.page || 1),
    data.limit=5,
    data.pages=0,
    data.pageUrl='/',
    // 内容列表
    data.contents=[];


    //判定cata是否存在
    var where = {};
    if(data.cata){
        where.category = data.cata;
    }

    //获取分类信息
    //.sort({_id:-1})
    Content.where(where).count().then(function(count){
        data.count = count;
        //计算总页数
        if(Math.ceil(data.count/data.limit) == 0){
            data.pages = 1;
        }else{
            data.pages = Math.ceil(data.count/data.limit);
        }
        //取值不能超过pages
        data.page =Math.min(data.page,data.pages);
        //取值不能小于1
        data.page =Math.max(data.page,1);
        //设置忽略的条数
        var skip = (data.page-1)*data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
            addTime:-1
        });

    }).then(function(contents){
        data.contents = contents;
        //console.log(contents);
        res.render('main/index',data);
    });
});

//查看全文
router.get('/view',function(req,res,next){
    var contentId = req.query.contentId || '';
    console.log(contentId);
    Content.findOne({
        _id:contentId
    }).then(function(content){
        //console.log(content);
        //console.log(data);
        data.content = content;

        //阅读数
        content.views++;
        content.save();

        res.render('main/view',data);
    })
});

module.exports = router;