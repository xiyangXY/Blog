/**
 * Created by xiyang on 2018/7/4 0004.
 */
$(function(){
    var $loginBox = $('#loginBox');
    var $registerBox = $('#registerBox');
    var $userInfo = $('#userInfo');

    //切换到注册面板
    $loginBox.find('a.colMint').on('click',function(){
        $registerBox.show();
        $loginBox.hide();
    });

    //切换登录面板
    $registerBox.find('a.colMint').on('click',function(){
        $loginBox.show();
        $registerBox.hide();
    });

    //注册
    $registerBox.find('input[type=button]').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username: $registerBox.find('[name="username"]').val(),
                password:$registerBox.find('[name="password"]').val(),
                repassword:$registerBox.find('[name="repassword"]').val()
            },
            success:function(result){
                console.log(result);
                $('#registerBox').find('.colWarning').html(result.message);

                //注册成功
                if(result.code == 200){
                    setTimeout(function(){
                        $loginBox.show();
                        $registerBox.hide();
                    },1000);
                }
            }
        })
    });

    //登录
    $loginBox.find('input[type=button]').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username: $loginBox.find('[name="username"]').val(),
                password:$loginBox.find('[name="password"]').val(),
                repassword:$loginBox.find('[name="repassword"]').val()
            },
            success:function(result){
                console.log(result);
                $('#loginBox').find('.colWarning').html(result.message);

                //登录成功
                if(result.code == 200){
                    //重载页面
                    window.location.reload();
                }
            }
        })
    });

    //退出登陆
    $('#loginOut').on('click',function(){
        $.ajax({
            type:'get',
            url:'/api/user/logout',
            success:function(result){
                if(result.code == 200){
                    //重载页面
                    window.location.reload();
                }
            }
        })
    });


});