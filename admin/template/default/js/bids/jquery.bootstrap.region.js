;
// bootstrap region select 
$.fn.brs = function(options) {

    var opts = $.extend({
        'gateway'       : '',
        'max'           : 2,
        'multi'         : false,
        'zIndex'        : 1,
        'data'          : [],
        'succ'          : $.noop
    }, options);
    opts.onajax = false;

    // 完成
    var complete = function () {
        $('#rgx-bsr-result').html('');
        $('#rgx-bsr').hide();
    };

    // 添加结果至已选列表
    var add_region = function (obj) {
        var id = 'rgx-brs-result-btn-' + obj.id;
        if ($('#' + id).length == 0) {
            var text = obj.text,
                cls_id = 'rgx-brs-p-' + obj.value.split(',')[0];
            // 选择了全部, 则移除已选的子区域
            if (obj.text == '全部') {
                text = obj.label.split(',')[0];
                $('.' + cls_id).remove();
            }
            // 指定了地区, 则需要移除全部选项
            else {
                $('#' + 'rgx-brs-result-btn-' + obj.value.split(',')[0]).remove();
            }

            var append = $([
                    '<a href="javascript:;" id="' + id + '" class="btn btn-xs btn-white brs-result-btn text-center ', cls_id,
                        '" data-value="',
                        obj.value,
                        '" data-label="',
                        obj.label,
                    '">',
                        text,
                    '</a>'
                ].join(''));

            $('#rgx-bsr-result').append(append);
            $('#rgx-bsr-result .brs-result-btn').css({
                'font-size'         : '12px',
                'margin'            : '0 5px 10px 0px',
                'width'             : '70px',
                'overflow'          : 'hidden',
                'word-break'        : 'keep-all',
                'white-space'       : 'nowrap',
                'text-overflow'     : 'ellipsis',
                'padding'           : '1px 2px'
            });
        }
    };

    // 初始化
    if ($('#rgx-bsr').length == 0) {
        var html = [
            '<div id="rgx-bsr">',
                '<div class="row">',
                    '<div class="col-md-12">',
                        '<h3><i class="fa fa-map-marker"></i> 地区选择',
                            '<i class="fa fa-times-circle pull-right" id="rgx-brs-close" style="font-size:16px;cursor:pointer"></i>',
                        '</h3>',
                        '<div id="rgx-bsr-list">',
                            '<div id="rgx-bsr-sub">',
                                '<span id="rgx-bsr-sub-title" class="text-center"></span>',
                                '<div  id="rgx-bsr-sub-list"><p class="text-center">加载中 ...</p></div>',
                            '</div>',
                            '<p class="text-center">加载中 ...</p>',
                        '</div>',
                        '<div id="rgx-bsr-multi" style="display: none">',
                            '<h4><i class="fa fa-map-marker"></i> 已选地区',
                                '<a href="javascript:;" id="rgx-bsr-ok" class="btn btn-xs btn-primary pull-right">确认</a>',
                            '</h4>',
                            '<div id="rgx-bsr-result"></div>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('');
        html = $(html);
        html.css({
            'position'          : 'fixed',
            'margin'            : 'auto',
            'padding'           : '10px 20px 10px 20px',
            'left'              : 0,
            'right'             : 0,
            'top'               : '7%',
            'width'             : '720px',
            'height'            : '360px',
            'background-clip'   : 'padding-box',
            'background-color'  : '#fff',
            'border'            : '1px solid rgba(0,0,0,0)',
            'border-radius'     : '4px',
            'box-shadow'        : '0 1px 3px rgba(0,0,0,.3)',
            'outline'           : '0 none'
        });
        html.find('h3,h4').css({
            'font-size'     : '14px',
            'padding-bottom': '15px',
            'border-bottom' : '1px solid #d8d8d8'
        });
        html.on('mouseleave', function () {
            //$(this).hide();
        });
        var olist = html.find('#rgx-bsr-list');
        olist.css({
            'padding'   : '10px 0',
            'position'  : 'relative'
        });
        olist.find('#rgx-bsr-sub').css({
            'position'          : 'absolute',
            'display'           : 'none',
            'width'             : '100%',
            'margin'            : 'auto',
            'left'              : 0,
            'right'             : 0,
            'background-color'  : '#fff',
            'height'            : '48px'
        });
        olist.find('#rgx-bsr-sub-title').css({
            'display'           : 'block',
            'font-size'         : '13px',
            'width'             : '70px',
            'border-left'       : '1px solid #dedede',
            'border-right'      : '1px solid #dedede',
            'border-top'        : '1px solid #dedede',
            'border-bottom'     : '1px solid #f7f7f7',
            'border-radius'     : '2px',
            'position'          : 'absolute',
            'background-color'  : '#f7f7f7',
            'height'            : '20px',
        });
        olist.find('#rgx-bsr-sub-list').css({
            'font-size'         : '13px',
            'border'            : '1px solid #dedede',
            'border-radius'     : '2px',
            'position'          : 'absolute',
            'height'            : '120px',
            'background-color'  : '#f7f7f7',
            'width'             : '100%',
            'padding'           : '15px 20px 10px 20px',
        });

        var init = function (d) {
            $('#rgx-bsr-list p').hide();
            d.unshift({
                'id'    : 0,
                'name'  : '全部'
            });
            for (var i = 0, row; row = d[i]; i ++) {
                var append = $([
                        '<a href="javascript:;" class="btn btn-xs btn-white brs-btn text-center" data-id="',
                        row.id,
                        '">',
                            row.name,
                        '</a>'
                    ].join(''));
                $('#rgx-bsr-list').append(append);
            }
            $('#rgx-bsr-list .brs-btn').css({
                'font-size'         : '13px',
                'margin'            : '0 5px 5px 0px',
                'width'             : '70px',
                'padding'           : '1px 5px'
            });
        };

        // 获取省市数据
        $.getJSON(opts.gateway, function (d) {
            if (d.code == '0') {
                init(d.data);
            }
        });

        // 获取下属城市信息
        var init_sub = function (p, d) {
            if (p.attr('data-id') == '0') {
                return;
            }
            $('#rgx-bsr-sub-list').html('');
            d.unshift({
                'id'    : p.attr('data-id'),
                'name'  : '全部'
            });
            for (var i = 0, row; row = d[i]; i ++) {
                var value  = p.attr('data-id') + ',' + row.id,
                    label  = p.text() + ',' + row.name;
                var append = $([
                        '<a href="javascript:;" class="btn btn-xs btn-white brs-sub-btn text-center" data-value="',
                        value,
                        '" data-label="',
                        label,
                        '" data-id="',
                        row.id,
                        '">',
                            row.name,
                        '</a>'
                    ].join(''));
                $('#rgx-bsr-sub-list').append(append);
            }
            $('#rgx-bsr-list .brs-sub-btn').css({
                'font-size'         : '12px',
                'margin'            : '0 5px 10px 0px',
                'width'             : '70px',
                'overflow'          : 'hidden',
                'word-break'        : 'keep-all',
                'white-space'       : 'nowrap',
                'text-overflow'     : 'ellipsis',
                'padding'           : '1px 2px'
            });

            var is_down = p.position().top <= ($('#rgx-bsr-list').height() / 2);

            if (is_down) {
                $('#rgx-bsr-sub-list').css({
                    'top'       : '19px',
                    'bottom'    : '',
                    'z-index'   : opts['zIndex'] + 2
                });
                $('#rgx-bsr-sub-title').css({
                    'top'       : 0,
                    'bottom'    : '',
                    'padding-top' : '2px',
                    'padding-bottom' : '0',
                    'border-top': '1px solid #dedede',
                    'border-bottom': '1px solid #f7f7f7',
                    'left'      : p.position().left,
                    'z-index'   : opts['z-index'] + 3
                }).html(p.text());
                $('#rgx-bsr-sub').css({
                    'top'       : p.position().top,
                    'bottom'    : '',
                    'z-index'   : opts['zIndex'] + 1,
                }).show();
            }
            else {
                $('#rgx-bsr-sub-list').css({
                    'top'       : '',
                    'bottom'    : '19px',
                    'z-index'   : opts['z-index'] + 2
                });
                $('#rgx-bsr-sub-title').css({
                    'left'      : p.position().left,
                    'border-top': '1px solid #f7f7f7',
                    'border-bottom': '1px solid #dedede',
                    'top'       : '',
                    'bottom'    : 0,
                    'padding-top' : '0px',
                    'padding-bottom' : '3px',
                    'z-index'   : opts['z-index'] + 3
                }).html(p.text());
                $('#rgx-bsr-sub').css({
                    'top'       : '',
                    'bottom'    : $('#rgx-bsr-list').height() - p.position().top - 3,
                    'z-index'   : opts['z-index'] + 1
                }).show();
            }
            $('#rgx-bsr-sub-list').one('mouseleave', function () {
                $(this).parent().hide();
            });
        };


        $('body').append(html);

        if (opts.multi) {
            $('#rgx-bsr-multi').show();
            $('#rgx-bsr').css('height', '360px');
        }
        else {
            $('#rgx-bsr-multi').hide();
            $('#rgx-bsr').css('height', '240px');
        }

        // 点击选择 省市
        $('#rgx-bsr-list').on('click', '.brs-btn', function () {
            if ($(this).attr('data-id') == '0') {
                if (!opts.multi) {
                    opts.succ({
                        value : 0,
                        label : '全部'
                    });
                }
                else {
                    opts.succ([{
                        value   : 0,
                        label   : '全部'
                    }]);
                }
                complete();
            } 
            else {
                var that = $(this),
                    id = $(this).attr('data-id');
                // 获取省市数据
                $.getJSON(opts.gateway + id, function (d) {
                    if (d.code == '0') {
                        init_sub(that, d.data);
                    }
                });
            }
        });

        // 点击城市
        $('#rgx-bsr-list').on('click', '.brs-sub-btn', function () {
            var data = {
                id      : $(this).attr('data-id'),
                label   : $(this).attr('data-label'),
                value   : $(this).attr('data-value'),
                text    : $(this).text()
            };
            if (opts.multi) {
                add_region(data);
            }
            else {
                opts.succ(data);
                complete();
            }
        });

        // 删除已选 
        $('#rgx-bsr').on('click', '.brs-result-btn', function () {
            $(this).remove();
        });

        // 提交按钮
        $('#rgx-bsr-ok').on('click', function () {
            var data = [],
                nodes = $('.brs-result-btn');
            for (var i = 0, node; node = nodes[i]; i ++) {
                data.push($(node).data());
            }
            opts.succ(data);
            complete();
        });

        // 关闭按钮
        $('#rgx-brs-close').on('click', function () {
            complete();
        });
    }

    // 设置 z-index
    var z_index = 0,
        parents = $(this).parents();
    for (var i = 0; i < parents.length; i ++) {
        var val = parseInt($(parents[i]).css('z-index'));
        if (!isNaN(val) && val > z_index) {
            z_index = val;
        }
    }
    opts['z-index'] = z_index + 1;

    $('#rgx-bsr').css({
        'z-index'           : z_index + 1 + opts['zIndex'],
        'display'           : 'block'
    });

    if (opts.data.length > 0) {
        for (var i = 0, d; d = opts.data[i]; i ++) {
            add_region(d);
        }
    }

};