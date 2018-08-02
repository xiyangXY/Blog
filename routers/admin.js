/**
 * Created by xiyang on 2018/7/4 0004.
 */
var express = require('express');
var router = express.Router();

//添加User表
var User = require('../models/User');
//添加Category表
var Category = require('../models/Category');
//添加Content表
var Content = require('../models/Content');

//权限
router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send('对不起，只有管理员才能进入后台管理');
        return;
    }
    next();
});

//管理首页
router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo: req.userInfo
    });
});

//用户管理
router.get('/user',function(req,res,next){

    //从数据库中读取所有的用户信息

    //limit(number) 限制获取的数据条数

    //skip() 忽略数据的条数
    //每页显示2条
    //1: 1-2 skip:0
    //2: 3-4 skip:2

    //page 当前页
    var page = Number(req.query.page || 1);
    //限制每页的条数
    var limit = 5;
    //总页数
    var pages = 0;

    //获取User用户数量
    User.count().then(function(count){
        //count 用户总条数
        //console.log(count);

        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page =Math.min(page,pages);
        //取值不能小于1
        page =Math.max(page,1);
        //设置忽略的条数
        var skip = (page-1)*limit;

        //从数据库中读取所有的用户信息
        User.find().sort({_id:-1}).limit(limit).skip(skip).then(function(users){
            //console.log(users);

            res.render('admin/user_index',{
                userInfo: req.userInfo,
                users:users,
                page:page,
                pages:pages,
                pageUrl:'/admin/user'
            });
        });

    });



});

//分类首页
router.get('/category',function(req,res,next){

    var page = Number(req.query.page || 1);
    //限制每页的条数
    var limit = 5;
    //总页数
    var pages = 0;

    //获取Category用户数量
    Category.count().then(function(count){
        //count 用户总条数
        //console.log(count);

        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page =Math.min(page,pages);
        //取值不能小于1
        page =Math.max(page,1);
        //设置忽略的条数
        var skip = (page-1)*limit;

        //从数据库中读取所有的用户信息
        //sort()  1:升序 -1:降序

        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categorys){
            //console.log(categorys);

            res.render('admin/category_index',{
                userInfo: req.userInfo,
                categorys:categorys,
                page:page,
                pages:pages,
                pageUrl:'/admin/category'
            });
        });

    });
});

//添加分类
router.get('/category/add',function(req,res,next){

    //从数据库中读取所有的分管管理列表
    res.render('admin/category_add',{
        userInfo: req.userInfo
    });
});

//分类的保存
router.post('/category/add',function(req,res,next){
    console.log(req.body);
    var name = req.body.name || '';

    if(name == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类名称不能为空'
        });
        return;
    }

    //数据库中是否存在同类名称
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'该分类名称已经存在'
            });
            return Promise.reject();
        }else{
        //数据库中不存在该分类，可以保存
            return new Category({
                name:name
            }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'添加分类成功',
            url:'/admin/category'
        });
    })
});

//分类修改
router.get('/category/edit',function(req,res,next){
    var id = req.query.id || '';
    //console.log(id);

    //获取要修改的信息
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        } else {
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    })
});

//分类修改保存
router.post('/category/edit',function(req,res,next){
    //要修改的id
    var id = req.query.id || '';
    //post提交过来的数据
    var name = req.body.name ||'';

    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        } else {
            // 要修改的分类名称是否已经在数据库中存在
            if(name == category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'修改成功',
                    url:'/admin/category/edit?id='+ id
                });
                return Promise.reject();
            }else {
                //要修改的分类名称数据库存在
                return Category.findOne({
                    _id:{$ne:id},
                    name: name
                });
            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库已经存在同名分类'
            });
            return Promise.reject();
        }else {
            return Category.update({
                _id:id
            },{
                name:name
            })
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category/edit?id='+ id
        });
        return Promise.reject();
    })
});

//分类删除
router.get('/category/delete',function(req,res,next){
    var id = req.query.id || '';
    //console.log(id);

    Category.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/category'
        });
    });
});

//内容首页
router.get('/content',function(req,res,next){

    var page = Number(req.query.page || 1);
    //限制每页的条数
    var limit = 5;
    //总页数
    var pages = 0;

    //获取User用户数量
    Content.count().then(function(count){
        //count 用户总条数
        //console.log(count);

        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page =Math.min(page,pages);
        //取值不能小于1
        page =Math.max(page,1);
        //设置忽略的条数
        var skip = (page-1)*limit;

        //从数据库中读取所有的用户信息
        //sort()  1:升序 -1:降序

        //populate('category') 查询关联表的信息
        Content.find().sort({addTime:-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
            console.log(contents);

            res.render('admin/content_index',{
                userInfo: req.userInfo,
                contents:contents,
                page:page,
                pages:pages,
                pageUrl:'/admin/content'
            });
        });

    });

});

//内容添加
router.get('/content/add',function(req,res,next){
    //查询到Category表中所有的分类
    Category.find().sort({_id:-1}).then(function(category){
        //console.log(category);
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            category:category
        });
    });

});

//内容保存
router.post('/content/add',function(req,res,next){
    console.log(req.body);
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
        return;
    }

    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
        return;
    }

    // 存储到数据库
    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        desciption:req.body.desciption,
        content:req.body.content
    }).save().then(function(rs){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content'
        });
    });

});

//内容修改
router.get('/content/edit',function(req,res,next){
    var id = req.query.id || '';
    var categories =[];

    //获取分类
    Category.find().sort({_id:-1}).then(function(category){
        //console.log(category);

        //获取要修改的信息
        return Content.findOne({
            _id:id
        }).populate('category').then(function(contents){
            console.log(contents);
            if(!contents){
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'内容信息不存在'
                });
                return Promise.reject();
            } else {
                res.render('admin/content_edit',{
                    userInfo:req.userInfo,
                    categories:category,
                    contents:contents
                });
            }
        })
    });



});

//内容修改保存
router.post('/content/edit',function(req,res,next){
    //要修改的id
    var id = req.query.id || '';
    //post提交过来的数据
    var body = req.body ||'';

    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容分类不能为空'
        });
        return;
    }

    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
        return;
    }

    // 保存数据库
    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        desciption:req.body.desciption,
        content:req.body.content
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content/edit?id='+ id
        });
    });

});

//内容删除
router.get('/content/delete',function(req,res,next){
    //要修改的id
    var id = req.query.id || '';
    console.log(id);
    Content.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/content'
        });
    });
});

//评论管理
router.get('/comment',function(req,res,next){
    //populate('category') 查询关联表的信息
    Content.find().sort({addTime:-1}).populate(['category','user']).then(function(contents){
        console.log(contents);

        res.render('admin/comment_index',{
            userInfo: req.userInfo,
            contents:contents,
            pageUrl:'/admin/comment'
        });
    });

});

router.get('/ueditor/getImg',function(req,res,next){
    console.log(456456465);
    //客户端上传文件设置
    //var imgDir = '/ueditor/';
    //var ActionType = req.query.action;
    //if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
    //    var file_url = imgDir;//默认图片上传地址
    //    /*其他上传格式的地址*/
    //    if (ActionType === 'uploadfile') {
    //        file_url = '/file/ueditor/'; //附件
    //    }
    //    if (ActionType === 'uploadvideo') {
    //        file_url = '/video/ueditor/'; //视频
    //    }
    //    res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    //    res.setHeader('Content-Type', 'text/html');
    //}
    ////  客户端发起图片列表请求
    //else if (req.query.action === 'listimage') {
    //    var dir_url = imgDir;
    //    res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    //}
    //// 客户端发起其它请求
    //else {
    //    // console.log('config.json')
    //    res.setHeader('Content-Type', 'application/json');
    //    res.redirect('/ueditor/nodejs/config.json');
    //}
});

module.exports = router;