$(function() {
    var prepage = 2;
    var page = 1;
    var pages = 0;
    var comments = [];

    //获取评论列表
    $.ajax({
        type: 'get',
        url: '/api/comment',
        data: {
            contentid: $('#contentId').val()
        },
        success: function (result) {
            if (result.code == 200) {
                comments = result.data.reverse();
                renderComment();
            }
        }
    });

    //上一页下一页
    $('.pager').delegate('a','click',function(){
        if($(this).parent().hasClass('previous')){
            page--;
        }else{
            if(page < pages){
                page++;
            }
        }
        renderComment();
    });

    //提交评论
    $('#messageBtn').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/comment/post',
            data: {
                contentid: $('#contentId').val(),
                content: $('#commitTextarea').val()
            },
            success: function (result) {
                if (result.code == 200) {
                    alert('评论成功！');
                    $('#commitTextarea').val('');
                    comments = result.data.comments.reverse();
                    renderComment();
                }
            }
        });
    });

    //渲染评论列表
    function renderComment() {
        //console.log(comments);

        //获取评论数
        $('#messageCount').html(comments.length);

        //实现分页
        pages = Math.max(Math.ceil(comments.length / prepage),1);
        var start = Math.max(0,(page-1) * prepage);
        var end = Math.min(start + prepage,comments.length);
        var $lis = $('.pager li');

        if(page <= 1){
            page = 1;
            $lis.eq(0).find('a').html('<i class="material-icons">没有上一页</i>');
        }else {
            $lis.eq(0).find('a').html('<i class="material-icons">上一页</i>');
        }

        if(page >= pages){
            page = pages;
            $lis.eq(2).find('a').html('<i class="material-icons">没有下一页</i>');
        }else{
            $lis.eq(2).find('a').html('<i class="material-icons">下一页</i>');
        }

        $lis.eq(1).find('a').html(page + '/' + pages);

        if(comments.length == 0){
            $('#messageList').html('<div class="messageBox"><div>还没有留言!</div></div>');
        }else{
            var html = '';
            for (var i = start; i < end; i++) {
                html += '<div class="messageBox">' +
                    '<p class="name clear">' +
                    '<span class="fl">' + comments[i].username + '</span>' +
                    '<span class="fl fr">' + formatDate(comments[i].postTime) + '</span>' +
                    '</p>' + comments[i].content + '<p>' +
                    '</div>'
            }
            //console.log('comments-----------');
            console.log(comments);
            $('#messageList').html(html);
        }
    }

    //时间转换格式
    function formatDate(d){
        var datel = new Date(d);
        return datel.getFullYear() + '年' + (datel.getMonth()+1) + '月' + datel.getDate() +'日 '+ datel.getHours()+':'+ datel.getMinutes() + ':'+ datel.getSeconds();
    }
});