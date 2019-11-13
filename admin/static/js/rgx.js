Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i ++) {
        if (this[i] != this[dx]) {
            this[n ++] = this[i];
        }
    }
    this.length -= 1;
};
'use strict';

(function($, _W) {
    _W.RGX = {

        // is on ajax
        'isajax': false,

        // thumb image url
        'thumb': function(url, format) {
            if (url != '') {
                if (url.match(/^pre.+$/i) != null) {
                    return url;
                }
                var i = url.lastIndexOf('.');
                return i >= 0 ? (url.substr(0, i) + (format == undefined ? '_thumb' : ('.' + format)) + url.substr(i)) : url;
            }
        },

        'strtotime': function(str) {
            var arr = str.replace(/:/g, '-').replace(/ /g, '-').split("-");
            return parseInt((new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]))).getTime() / 1000);
        },

        'date': function(timestamp) {
            return (new Date(parseInt(timestamp) * 1000)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        },

        'shake'   : function (id) {
            $('#' + id).addClass('heart');
            setTimeout(function () {
                $('#' + id).removeClass('heart');
            }, 2500);
        },

        'checkall': function() {},

        // post form
        'ajaxpost': function(request) {
            if (RGX.isajax) {
                if (typeof(request['lock']) == 'undefined') {
                    setTimeout(function () {
                        RGX.ajaxpost(request);
                    }, 100);
                }
                else {
                    setTimeout(function () {
                        RGX.msg('请求处理中!');
                    }, 50);
                }
                return false;
            } else {
                RGX.isajax = true;
                if (typeof(request.data) == 'string') {
                    request.data += "&isajax=1";
                }
                else {
                    request.data.isajax = 1;
                }
                $.ajax({
                    type        : "POST",
                    url         : request.url,
                    data        : request.data,
                    processData : typeof(request.data) == 'string' ? false : true,
                    dataType    : 'json',
                    success     : function(data) {
                        RGX.isajax = false;
                        if (request.succ != undefined) {
                            request.succ(data);
                        }
                    },
                    error       : function(data) {
                        RGX.isajax = false;
                        if (request.fail != undefined) {
                            request.fail(data)
                        }
                    }
                });
            }
        },

        show_error : function (err) {
            for (var key in err) {
                if (err.hasOwnProperty(key)) {
                    var node_id = "#" + key;
                    if ($(node_id).length > 0) {
                        RGX.tips(err[key], node_id);
                    }
                    else {
                        RGX.msg(err[key]);
                    }
                    break;
                }
            }
        },

        // post form
        'formpost': function(id, succ, fail) {
            if (RGX.isajax) {
                RGX.msg('请求处理中!');
                return false;
            }
            else {
                RGX.isajax = true;
                $.ajax({
                    type        : "POST",
                    url         : $(id).attr('action'),
                    data        : $(id).serialize() + '&isajax=1',
                    processData : false,
                    dataType    : 'json',
                    success     : function(data) {
                        RGX.isajax = false;
                        if (succ != undefined) {
                            succ(data);
                        }
                    },
                    error       : function(data) {
                        RGX.isajax = false;
                        if (fail != undefined) {
                            fail(data)
                        }
                    }
                });
            }
        },

        'loading': function (msg, callback) {
            return $.dialog.tips(msg, 999999, 'loading.gif', function() {
                if (typeof(callback) == 'function') {
                    callback();
                }
            });
        },

        'tips': function(msg, target, ttl) {
            if (typeof(target) == 'string') {
                target = $(target);
            }
            if (target.css('display') == 'none' || target.attr('type') == 'hidden') {
                if (target.attr('data-target') != undefined) {
                    target = $(target.attr('data-target'));
                } else {
                    target = target.parent();
                }
            }
            if (target.offset().top < $(window).scrollTop() || target.offset().top > ($(window).scrollTop() + $(window).height())) {
                $('html,body').animate({
                    scrollTop: target.offset().top - $(window).height() / 3
                }, 400);
            }

            $.dialog.tips(msg, ttl == undefined ? 1 : parseInt(ttl), '32X32/hits.png', function() {
                target.focus();
                target.addClass('input-error');
                setTimeout(function() {
                    target.removeClass('input-error');
                }, 1200);
            });
        },

        'msg': function(msg, callback, icon, ttl) {
            icon = icon == undefined ? 'hits' : icon;
            if (icon == 'loading') {
                icon = 'loading.gif';
            } else {
                icon += '.png';
            }
            $.dialog.setting.zIndex = 99999;
            return $.dialog.tips(msg, ttl == undefined ? 1.2 : parseInt(ttl), '32X32/' + icon, function() {
                if (typeof(callback) == 'function') {
                    callback();
                }
            $.dialog.setting.zIndex = 1977;
            });
        },

        'suc': function(msg, callback) {
            $.dialog.tips(msg, 1, '32X32/succ.png', function() {
                if (typeof(callback) == 'function') {
                    callback();
                }
            });
        },

        'del': function(tag) {
            if (RGX.isajax == false) {
                RGX.isajax = true;
                $.ajax({
                    type        : "GET",
                    url         : tag.attr('data-url') == undefined ? tag.attr('href') : tag.attr('data-url'),
                    processData : false,
                    dataType    : 'json',
                    success     : function(d) {
                        RGX.isajax = false;
                        if (d.code != '0') {
                            RGX.msg(d.msg);
                        }
                        else {
                            if (tag.attr('data-target') != undefined) {
                                $(tag.attr('data-target')).slideUp('fast', function() {
                                    $(this).remove();
                                });
                            }
                        }
                    },
                    error       : function(d) {
                        RGX.isajax = false;
                        RGX.msg('删除失败了');
                    }
                });
            }
            else {
                RGX.msg('请求处理中...');
            }
            return false;
        },

        'exec_post': function(id, pre, before, after) {
            RGX.formpost(id, function(d) {
                if (d.code == '4') {
                    RGX.msg(d.msg);
                }
                else if (d.code != '0') {
                    if (d.error != undefined) {
                        for (var key in d.error) {
                            var node_id = "#" + (pre == undefined ? key : ([pre, key].join('-')));
                            if ($(node_id).length > 0) {
                                RGX.tips(d.error[key], node_id);
                            }
                            else {
                                RGX.msg(d.error[key]);
                            }
                            break;
                        }
                    } else {
                        RGX.msg(d.msg || '操作成功');
                    }
                }
                else {
                    RGX.suc(d.msg || '操作成功', function() {
                        if (typeof(after) != 'function' && d.url != undefined) {
                            setTimeout(function () {
                                location.href = d.url;
                            }, 100);
                        }
                        else if (typeof(after) == 'function') {
                            after();
                        }
                    });
                }
            }, function(d) {
                RGX.msg('服务端异常');
            });
            return false;
        },

        'post': function(id, pre, before, after) {
            $(id).on('submit', function() {
                if (before != undefined) {
                    before();
                }
                RGX.formpost(id, function(d) {
                    if (d.code == '4') {
                        RGX.msg(d.msg);
                    }
                    else if (d.code != '0') {
                        if (d.error != undefined) {
                            for (var key in d.error) {
                                var node_id = "#" + (pre == undefined ? key : ([pre, key].join('-')));
                                if ($(node_id).length > 0) {
                                    RGX.tips(d.error[key], node_id);
                                }
                                else {
                                    RGX.msg(d.error[key]);
                                }
                                break;
                            }
                        } else {
                            RGX.msg(d.msg || '操作失败了');
                        }
                    }
                    else {
                        RGX.suc(d.msg || '操作成功', function() {
                            if (typeof(after) != 'function' && d.url != undefined) {
                                setTimeout(function () {
                                    location.href = d.url;
                                }, 100);
                            } else if (typeof(after) == 'function') {
                                after();
                            }
                        });
                    }
                }, function(d) {
                    RGX.msg('服务端异常');
                });
                return false;
            });
        },

        // Get Json
        'get_json': function(url, succ, fail, lock) {
            if (RGX.onajax) {
                if (typeof(lock) == 'undefined') {
                    setTimeout(function () {
                        RGX.get_json(url, succ, fail);
                    }, 100);
                }
                return false;
            } else {
                RGX.onajax = true;
                $.ajax({
                    type: "GET",
                    url: url,
                    processData: false,
                    dataType: 'json',
                    success: function(data) {
                        RGX.onajax = false;
                        if (succ != undefined) {
                            succ(data);
                        }
                    },
                    error: function(data) {
                        RGX.onajax = false;
                        if (fail != undefined && typeof(fail) == 'function') {
                            fail(data)
                        } else {
                            RGX.msg('服务器繁忙, 请稍后再试!', null, 'fail');
                        }
                    }
                });
            }
        },

        // Get Response
        'get': function(url, succ, fail, lock) {
            if (RGX.onajax) {
                if (typeof(lock) == 'undefined') {
                    setTimeout(function () {
                        RGX.get(url, succ, fail);
                    }, 100);
                }
                return false;
            } else {
                RGX.onajax = true;
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function(data) {
                        RGX.onajax = false;
                        if (succ != undefined && typeof(succ) == 'function') {
                            succ(data);
                        }
                    },
                    error: function(data) {
                        RGX.onajax = false;
                        if (fail != undefined && typeof(fail) == 'function') {
                            fail(data)
                        } else {
                            RGX.msg('服务器繁忙, 请稍后再试!', null, 'fail');
                        }
                    }
                });
            }
        },

        /**
         * 确认
         * @param  {[type]} msg    [description]
         * @param  {[type]} ok     [description]
         * @param  {[type]} cancel [description]
         * @return {[type]}        [description]
         */
        'confirm': function (config) {
            return $.dialog($.extend({
                id      : 'RGX-confirm-dialog',
                icon    : 'confirm.gif',
                content : config.msg,
                lock    : true,
                title   : '操作确认',
                zindex  : 99999,
                fixed   : true,
                drag    : false,
                resize  : false,
                skin    : 'ui_confirm',
                parent  : null,
                ok      : function () {
                    return (config.ok || $.noop)();
                },
                cancel  : function () {
                    return (config.cancel || $.noop)();
                }
            }, config));
        },

        /**
         * 支付确认确认
         * @param  {[type]} msg    [description]
         * @param  {[type]} ok     [description]
         * @param  {[type]} cancel [description]
         * @return {[type]}        [description]
         */
        'confirm_pay': function (config) {
            //$('#pay-confirm-modal .modal-title').html(config.msg);
            $('#pay-confirm-modal').modal();
            $('#pay-confirm-modal #user_pay_passwd').val('');
            $('#pay-confirm-modal .btn-success').off().on('click', function () {
                config.ok();
            });
        },

        'adm': {

            'max': function() {
                $(window.parent.document.getElementsByTagName("frameset")[0]).attr('cols', '0,*');
                $('#left-nav-show', window.parent.frames["rightframe"].document).show();
            },
            'min': function() {
                $(window.parent.document.getElementsByTagName("frameset")[0]).attr('cols', '200,*');
                $('#left-nav-show', window.parent.frames["rightframe"].document).hide();
                $('#left-nav-hide', window.parent.frames["leftframe"].document).show();
                //
            },
            // 左侧快速定位条
            'sidebar': function(selector, text) {
                var node = $('<ul class="sidebar"></ul>');
                $(selector).each(function(i) {
                    node.append('<li class="sidebar-li">' + (i + 1) + '. <a class="sidebar-a" href="javascript:;" data-top="' +
                        ($(this).offset().top - ($(this).outerHeight() - $(this).height() + 25)) +
                        '">' + $(this).find(text).html().replace(/<[^>]+>.*<\/[^>]+>/, '') + '</a></li>');
                });
                $('body').append(node);

                $('.sidebar-li').eq(0).addClass('sidebar-active');
                $('.sidebar-a').on('click', function() {
                    var top = $(this).attr('data-top');
                    $('.sidebar-li').removeClass('sidebar-active');
                    $('html,body').animate({
                        scrollTop: top
                    }, 400);
                    $(this).parent().addClass('sidebar-active');
                });
            },

            'init': function() {

                // 隐藏 left frame
                $('#left-nav-hide').on('click', function() {
                    $(window.parent.document.getElementsByTagName("frameset")[0]).attr('cols', '0,*');
                    $('#left-nav-show', window.parent.frames["rightframe"].document).show();
                });

                // 显示 left frame
                $('#left-nav-show').on('click', function() {
                    $(window.parent.document.getElementsByTagName("frameset")[0]).attr('cols', '200,*');
                    $(this).hide();
                });

                $('.list-tr').on('mouseenter', function() {
                    $('.list-tr').removeClass('tr-hover');
                    $(this).addClass('tr-hover');
                });

                // AJAX 设置状态
                $('.status-select').on('change', function() {
                    $.getJSON($(this).attr('data-ajax') + $(this).val());
                });

                if ($(window.parent.document.getElementsByTagName("frameset")[0]).attr('cols') == '0,*') {
                    $('#left-nav-show', window.parent.frames["rightframe"].document).show();
                }

                $('body').on('click', '.btn-ajaxgetsave', function () {
                    var val = $.trim($($(this).attr('data-target')).val());
                    if (val == '') {
                        $($(this).attr('data-target')).focus();
                    }
                    else {
                        var callback = $(this).attr('data-success');
                        $.getJSON($(this).attr('data-url') + encodeURIComponent(val), function (d) {
                            if (d.code == '1' && typeof(d['msg']) == 'undefined') {
                                for (var key in d.error) {
                                    d.msg = d.error[key];
                                    break;
                                }
                            }
                            RGX.msg(d.msg, function () {
                                if (d.code == '0') {
                                    if (d.refresh) {
                                        location.href = location.href;
                                    }
                                    else if (window[callback]) {
                                        window[callback](d);
                                    }
                                }
                            });
                        });
                    }
                });

                $('body').on('click', '.btn-ajaxdel', function () {
                    var target = $($(this).attr('data-target'));
                    $.getJSON($(this).attr('data-url'), function (d) {
                        RGX.msg(d.msg || (d.code == '0' ? '删除成功' : '删除失败了'), function () {
                            if (d.code == '0' && target.length > 0) {
                                $(target).slideUp('fast', function () {
                                    $(this).remove();
                                });
                            }
                        });
                    });
                });

            },
            'left': function() {

                // 菜单点击效果
                $('.nav-a').on('click', function() {
                    var subul = $(this).parent().find('.nav-sub-ul');
                    if (subul.length > 0) {
                        if (subul.css('display') == 'block') {
                            subul.slideUp('fast');
                        } else {
                            $('.nav-sub-ul').slideUp(50);
                            subul.slideDown('fast');
                        }
                    }
                });

                if ($(window.parent.document.getElementsByTagName("frameset")[0]).attr('cols') == '0,*') {
                    $(window.parent.document.getElementsByTagName("frameset")[0]).attr('cols', '200,*');
                    $('#left-nav-show', window.parent.frames["rightframe"].document).hide();
                }

            }, // end

            'common': function() {

                $('.checkall,#checkall').on('click', function() {
                    var check = false,
                        parent = $('body');

                    if ($(this).attr('data-parent') != undefined) {
                        parent = $($(this).attr('data-parent'));
                    }
                    if ($(this)[0].tagName.toLowerCase() == 'input' && $(this)[0].type.toLowerCase() == 'checkbox') {
                        if (this.checked) {
                            parent.find('input:checkbox').each(function () {
                                this.checked = true;
                            });
                        }
                        else {
                            parent.find('input:checkbox').each(function () {
                                this.checked = false;
                            });
                        }
                    }
                    else {
                        if ($(this).attr('data-checked') == undefined) {
                            $(this).attr('data-checked', '1');
                            parent.find('input:checkbox').attr('checked', true);
                            check = true;
                        }
                        else {
                            parent.find('input:checkbox').attr('checked', false);
                            $(this).removeAttr('data-checked');
                        }
                    }

                    parent.find('input:checkbox').each(function(i) {
                        if (check) {
                            if ($(this)[0].tagName.toLowerCase() == 'checkbox') {
                                $(this).attr('checked', true);
                            } else {
                                $(this).attr('data-checked', '1');
                            }
                        } else {
                            if ($(this)[0].tagName.toLowerCase() == 'checkbox') {
                                $(this).removeAttr('checked');
                            } else {
                                $(this).removeAttr('data-checked');
                            }

                        }
                    });
                });

                $('.menu-opts').on('change', function() {
                    var url = $(this).attr('data-url');
                    window._filter[$(this).attr('data-key')] = $(this).val();
                    var i = 0;
                    for (x in _filter) {
                        if (_filter[x] != "") {
                            if (i == 0) {
                                url += "/" + x + "=" + _filter[x];
                                i = 1;
                            } else {
                                url += "/" + x + "=" + _filter[x];
                            }
                        }
                    }
                    location.href = url;
                });

                $('body').on('click', '.btn-delete', function() {
                    var _this = $(this);
                    RGX.confirm({
                        msg     : _this.attr('data-confirm') == undefined ? '确认删除?' : _this.attr('data-confirm'),
                        ok      : function() {
                            RGX.del(_this);
                        }
                    });
                    return false;
                });

                // ajax post
                $('.ajax-blur').on('blur', function() {
                    var val = $(this).val(),
                        refresh = $(this).attr('data-refresh');
                    if (val != $(this).attr('data-default')) {
                        $.getJSON($(this).attr('data-ajax') + val, function(d) {
                            if (d.code == '0') {
                                if (refresh == '1') {
                                    location.href = location.href;
                                }
                            } else {
                                RGX.msg(d.msg);
                            }
                        });
                    }
                });

                $('.ajax-get').on('click', function() {
                    var _target = [];
                    if ($(this).attr('data-target').indexOf(',') > -1) {
                        var lst = $(this).attr('data-target').split(',');
                        for (var ele in lst) {
                            _target.push($(lst[ele]));
                        }
                    } else {
                        _target.push($($(this).attr('data-target')));
                    }

                    var _source = encodeURIComponent($($(this).attr('data-source')).val());
                    if (!RGX.isajax) {
                        RGX.isajax = true;
                        $.getJSON($(this).attr('data-url') + _source, function(d) {
                            for (var i in _target) {
                                _target[i].val(d.msg);
                            }
                            setTimeout(function() {
                                RGX.isajax = false;
                            }, 500);
                        });
                    } else {
                        RGX.msg('请求处理中, 请稍候再试!');
                    }
                });

                $('.dialog').on('click', function() {
                    var obj = this,
                        w = $;
                    if (typeof(W) != 'undefined') {
                        w = W.$;
                    }
                    var before = $(this).attr('data-before');
                    if (undefined != before || null != before) {
                        window[before](this);
                    }
                    w.dialog({
                        drag        : false,
                        cache       : false,
                        min         : false,
                        max         : false,
                        parent      : typeof(api) == 'undefined' ? window.top : api,
                        id          : $(obj).attr('data-id'),
                        title       : $(obj).attr('data-title'),
                        lock        : $(obj).attr('data-lock')  == undefined ? false : true,
                        'fixed'     : $(obj).attr('data-fixed') == undefined ? false : true,
                        padding     : $(obj).attr('data-padding') == undefined ? 0 : $(obj).attr('data-padding'),
                        width       : $(obj).attr('data-width') == undefined ? 'auto' : $(obj).attr('data-width'),
                        height      : $(obj).attr('data-height') == undefined ? 'auto' : $(obj).attr('data-height'),
                        content     : $(obj).attr('data-content') == undefined ? ('url:' + $(obj).attr('data-url')) : $(obj).attr('data-content'),
                        skin        : $(obj).attr('data-skin') == undefined ? 'discuz' : $(obj).attr('data-skin')
                    });
                });

            }, // end


            // 图集 上传 callback
            'albumcallback': function(data) {
                var append = $(
                    '<li class="alb-li">' +
                    '<div class="alb-div-left">' +
                    '<img src="' + DATA_URL + 'attachment/' + data.thumb + '" />' +
                    '<p><a href="javascript:;" class="alb-set" data-source="' + data.file + '" >设为封面</a>&nbsp;' +
                    '<a href="javascript:;" class="alb-del" data-source="' + data.file + '">删除图片</a></p>' +
                    '</div>' +
                    '<div class="alb-div-right">' +
                    '<p>' +
                    '排序 : <input type="text" class="input" name="images[sort][]" value="0" />' +
                    '</p>' +
                    '<p>' +
                    '简介 : <textarea  class="input" name="images[desc][]" maxlength="80"></textarea>' +
                    '</p>' +
                    '<input type="hidden" name="images[image][]" value="' + data.file + '" />' +
                    '</div>' +
                    '<div class="clear"></div>' +
                    '</li>'
                );
                $('#alb-ol li.clear').before(append);

                // 设置默认封面
                if ($('.alb-li').length == 1) {
                    $('.alb-li').eq(0).find('.alb-set').trigger('click');
                }
            },

            'album': function() {
                // 删除按钮
                $('#alb-ol').on('click', '.alb-del', function() {
                    var sfile = $(this).attr('data-source');
                    if ($('#album-cover').val() == sfile) {
                        $('#album-cover').val('');
                    }
                    $(this).parent().parent().parent().slideUp(200, function() {
                        RGX.adm.upload_del('album', sfile);
                        $(this).remove();
                    });
                });

                // 设置封面
                $('#alb-ol').on('click', '.alb-set', function() {
                    $('#album-cover').val($(this).attr('data-source'));
                    $('.alb-li').removeClass('alb-cover');
                    $(this).parent().parent().parent().addClass('alb-cover');
                });

            },

            'upload_del': function(key, file) {
                RGX.ajaxpost({
                    'url': UPLOAD_API,
                    'data': 'op=delete&key=' + key + '&file=' + encodeURIComponent(file),
                    'fails': function() {
                        RGX.msg('删除失败了');
                    }
                });
            },

            // block
            'block': function() {

                $('#block-module').on('change', function() {
                    if ($(this).val() == 'nul') {
                        $('#block-opts').html('');
                    } else {
                        $('#block-opts').load($(this).attr('data-url') + $(this).val());
                    }
                });

                $('#block-opts').on('change', '#block-ctype', function() {
                    if ($(this).val() == 'nul') {
                        $('#block-config').html('');
                    } else {
                        $('#block-config').load($(this).attr('data-url') + $(this).val());
                    }
                });

            },

            'category': function() {

                $('.icon-plus').on('click', function() {
                    if ($(this).hasClass('icon-minus')) {
                        $("." + $(this).attr('data-node')).hide();
                        $(this).removeClass('icon-minus');
                    } else {
                        $("." + $(this).attr('data-node')).show();
                        $("." + $(this).attr('data-node')).find(".icon-plus").addClass('icon-minus');
                        $(this).addClass('icon-minus');
                    }
                });
            }
        }
    };
})($, window);

$(function() {
    RGX.adm.init();
    RGX.adm.common();
});
