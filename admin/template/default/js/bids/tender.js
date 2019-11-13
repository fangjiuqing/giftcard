;
$(function () {
    // 关注 取关
    $('.follow_btn').on('click', function () {
        var url = $(this).attr('data-url'),
            that = $(this);
        if ($(this).hasClass('active')) {
            RGX.confirm({
                msg     : '确认取消关注该项目 ?',
                ok      : function () {
                    RGX.get_json(url, function (d) {
                        if (d.code == '0') {
                            that.removeClass('active');
                        }
                    });
                }
            });
        }
        else {
            RGX.confirm({
                msg     : '确定关注该项目 ?',
                ok      : function () {
                    RGX.get_json(url, function (d) {
                        if (d.code == '0') {
                            that.addClass('active');
                        }
                        else {
                            RGX.msg(d.msg);
                        }
                    });
                }
            });
        }
    });
});
