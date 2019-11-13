var 
    house_rules = {},
    house_cert_rules = {},
    house_update_index = -1,

    // 初始化modal
    init_house_modal = function (val) {
        for (var i = 0, v; v = val[i]; i ++) {
            // 证书规则
            if (v.indexOf('#') >= 0) {
                var item    = v.split('#'),
                    type_id = item[0].split('-')[1].split(',')[0],
                    ps      = item[1],
                    cat     = item[0].split('-')[1].split(',')[1] || 0,
                    ele     = $('#require_house_ctype'),
                    tags    = item[2].split(',');
                ele.find('option').each(function () {
                    var val = type_id + ',' + cat;
                    if ($(this).val().split('#')[0] == val) {
                        var 
                            r = {
                                id      : type_id,
                                cat     : cat,
                                label   : [ps, $(this).attr('data-label') || $(this).text()],
                                tags    : {}
                            },
                            val = ($(this).val().split('#')[1] || "").split(',');

                        for (var i = 0, tag; tag = tags[i]; i ++) {
                            r.label.push(tag.split(':')[1]);
                            r.tags[tag.split(':')[0]] = {
                                label   : val[i],
                                text    : tag.split(':')[1],
                                value   : tag.split(':')[1]
                            };
                        }
                        r.label = r.label.join(' - ');
                        house_cert_rules[type_id] = r;
                        render_house_rule();
                    }
                });
            }
            // 普通规则
            else {
                var item = v.split('='),
                    ele  = $('#require_house_' + item[0]);
                if (ele[0].tagName.toLowerCase() == 'input') {
                    ele.val(item[1]);
                    ele.trigger('keyup');
                }
                else {
                    ele.find('option[value="' + item[1] + '"]').attr('selected', true);
                    ele.trigger('change');
                }

            }
        }
    },

    // 初始化车辆筛选扩展属性
    init_house_select = function (items) {
        $('#house_require_options').html('');
        var tpl = [
            '<div class="col-sm-6 require_house" style="margin-top:10px;">',
                '<div class="form-group">',
                    '<label class="col-sm-3 control-label text-center">筛选</label>',
                    '<div class="col-sm-9">',
                        '<select class="form-control require_house_tag" data-item="">',
                            '<option value="nul">不限</option>',
                        '</select>',
                    '</div>',
                '</div>',
            '</div>'
        ];

        for (var i = 0, tag; tag = items[i]; i ++) {
            var node = $(tpl.join(''));
            node.find('.control-label').html(tag);
            node.find('.require_house_tag').attr('data-item', tag);
            $('#house_require_options').append(node);
        }

    },

    /**
     * 获取规则筛选结果
     * @return {[type]} [description]
     */
    house_rules_result = function () {
        var require_emp = [];
        $('#filter_house_rules li').each(function () {
            require_emp.push({
                index   : $(this).index(),
                value   : $(this).attr('data-value')
            });
        });
        if (require_emp.length > 0) {
            RGX.ajaxpost({
                url     : RGXLIB.url('document-stat_house'),
                data    : {
                    req : JSON.stringify(require_emp)
                },
                succ    : function (d) {
                    if (d.code == '0' && d.data.length > 0) {
                        for (var i = 0, v; v = d.data[i]; i ++) {
                            $('#filter_house_rules li:eq(' + v.index + ')').find('span.badge').html(v.numbers);
                        }
                    }
                }
            });
        }
    },
    
    /**
     * 显示车辆规格信息
     * @return {[type]} [description]
     */
    render_house_rule = function () {
        var format = [
                'type', 'nums', 'via', 'location', 'location_label'
            ], 
            text = [];

        // 人员基本条件
        for (var i = 0, f; f = format[i]; i ++) {
            if (house_rules.hasOwnProperty(f) && house_rules[f]) {
                text.push(
                    '<a href="javascript:;" data-key="' + f + '" class="btn btn-xs btn-warning house_tag">' + 
                        '<small>' + 
                            house_rules[f].label + 
                        '</small> - ' + 
                        (house_rules[f].text ==  house_rules[f].label ?  house_rules[f].value :  house_rules[f].text) + 
                    '</a>');
            }
        }

        // 证书条件
        for (var k in house_cert_rules) {
            if (house_cert_rules.hasOwnProperty(k) && house_cert_rules[k]) {
                text.push(
                    '<a href="javascript:;" data-key="' + house_cert_rules[k].id + '" class="btn btn-xs btn-primary house_rule_tag">' + 
                        house_cert_rules[k].label +  
                    '</a>');
            }
        }
        $('#filter_house_rule').html(text.join(' '));
    }
;

$(function () {

    // 初始化
    $('#filter-house-modal').on('show.bs.modal', function () {
        $('#add_resource_house_form')[0].reset();
        $('#filter_house_rule').html('');
        house_rules = {};
        house_cert_rules = {};
    });

    // 显示车辆筛选层
    $('#add_house_rules_btn').on('click', function () {
        $('#filter-house-modal').modal();
        house_cert_rules = {};
        $('.require_house_options').trigger('change');
    });

    // 添加筛选规则
    $('#add_house_rule_btn').on('click', function () {
        if ($('#require_house_ctype').val() == 'nul') {
            RGX.msg('请选择证书类型');
        }
        else {
            var row = {
                    id      : $('#require_house_ctype').val().split('#')[0].split(',')[0],
                    cat     : $('#require_house_ctype').val().split('#')[0].split(',')[1] || 0,
                    label   : $('#require_house_ctype option:selected').text(),
                    tags    : {}
                },
                labels = [
                    $('#require_house_ctype option:selected').attr('data-label'),
                ]
            ;
            $('.require_house_tag').each(function () {
                if ($(this).val() != 'nul') {
                    labels.push($(this).val());
                    row.tags[$(this).attr('data-item')] = {
                        label   : $(this).attr('data-item'),
                        value   : $(this).val(),
                        text    : $(this).val()
                    };
                }
            });
            row.label = labels.join(' - ');
            house_cert_rules[row.id] = row;
            render_house_rule();
        }
    });

    /**
     * 资质证件类型选择
     */
    $('#require_house_ctype').on('change', function () {
        var val  = $(this).val() || "",
            id   = val.split('#')[0],
            tags = val.split('#').length > 1 ? (val.split('#')[1].split(',')) : [];
        init_house_select(tags);
        $('.require_cert_tag').each(function () {
            $(this).html('<option value="nul">不限</option>');
        });

        var url = RGXLIB.url('document-house_options-id-' + id);
        RGX.get_json(url, function (d) {
            if (d.code == '0') {
                for (var k in d.data) {
                    if (d.data.hasOwnProperty(k)) {
                        var t = $('.require_house_tag[data-item="' + k + '"]'),
                            opts = d.data[k];
                        if (opts.length > 0) {
                            for (var i = 0, v; v = opts[i]; i ++) {
                                t.append('<option value="' + v + '">' + v + '</option>');
                            }
                        }
                    }
                }
            }
        });
    });

    // 删除已设置的条件
    $('body').on('click', '.house_rule_tag', function () {
        $(this).remove();
        house_cert_rules[$(this).attr('data-key')] = undefined;
    });

    $('body').on('click', '.house_rule_mod_btn', function () {
        house_update_index = $(this).parent().parent().index();
        $('#filter-house-modal').modal();
        init_house_modal($(this).parent().parent().attr('data-value').split(';'));
    });

    $('body').on('click', '.house_rule_del_btn', function () {
        $(this).parent().parent().remove();
    });

    // 车辆 选择条件
    $('.require_house_options').on('change', function () {
        house_rules[$(this).attr('data-key')] = {
            label : $(this).attr('data-label'),
            value : $(this).val(),
            text  : $(this).find('option:selected').text()
        };
        render_house_rule();
    });

    // 车辆 输入条件
    $('.require_house_input').on('keyup', function () {
        if ($(this).val() != '') {
            house_rules[$(this).attr('data-key')] = {
                label : $(this).attr('data-label'),
                value : $(this).val(),
                text  : $(this).attr('data-text') || $(this).attr('data-label')
            };
        }
        render_house_rule();
    });

    // 地区筛选
    $('#require_house_location').on('click', function () {
        var that = $(this);
        $(this).brs({
            multi      : false,
            gateway    : $(this).attr('data-url'),
            data       : (function (node) {
                var regions = [],
                    values  = (node.attr('data-value') || "").split(';'),
                    labels  = node.val().split(' , ');
                for (var i = 0, val; val = values[i]; i ++) {
                    var v = val.split(',');
                    regions.push({
                        id      : v[1],
                        label   : labels[i].replace('-', ','),
                        value   : val,
                        text    : labels[i].split('-')[v[0] == v[1] ? 0 : 1]
                    });
                }
                return regions;
            })($(this)),
            succ       : function (d) {
                if (!Array.isArray(d)) {
                    d = [d];
                }
                var values = [],
                    labels = [];
                for (var i = 0, region; region = d[i]; i ++) {
                    values.push(region.value);
                    labels.push(region.label.replace(',', '-'));
                }
                that.attr('data-value', values.join(';'));
                that.val(labels.join(' , '));
                
                house_rules['location'] = {
                    id    : 'location',
                    label : '所在位置',
                    value : values.join('#'),
                    text  : labels.join(' , ')
                };
                $('#require_house_location_value').val(values.join('#'));
                $('#require_house_location_value').attr('data-text', labels.join(','));
                $('#require_house_location_value').trigger('keyup');
            }
        });
    });

    // 确认添加筛选条件
    $('#house-modal-ok').on('click', function () {
        var rule = [], _label = [];
        // 基本规则
        for (var k in house_rules) {
            if (house_rules.hasOwnProperty(k) && house_rules[k]) {
                rule.push(k + '=' + house_rules[k].value);
                _label.push(house_rules[k].label + '=' + (house_rules[k].text ==  house_rules[k].label ?  house_rules[k].value :  house_rules[k].text));
            }
        }
        // 证书要求规则
        for (var k in house_cert_rules) {
            if (house_cert_rules.hasOwnProperty(k) && house_cert_rules[k]) {
                var _info = 'cert-' + k + ',' +  house_cert_rules[k].cat + '#0#',
                    _rule = house_cert_rules[k],
                    _tags = [];
                for (var j in _rule.tags) {
                    if (_rule.tags.hasOwnProperty(j)) {
                        _tags.push(j + ':' + _rule.tags[j].value);
                    }
                }
                _label.push(_rule.label);
                rule.push(_info + _tags.join(','));
            }
        }

        if (rule.length > 0) {
            if (house_update_index >= 0) {
                $('#filter_house_rules li:eq(' + house_update_index + ')').attr('data-value', rule.join(';')).html([
                        '<span class="badge badge-info badge-stat">0</span>',
                        _label.join('&nbsp;&nbsp;'),
                        '<span class="pull-right text-right">',
                            '<a href="javascript:;" class="btn btn-xs btn-info house_rule_mod_btn"><i class="fa fa-pencil"></i></a>&nbsp;&nbsp;',
                            '<a href="javascript:;" class="btn btn-xs btn-danger house_rule_del_btn"><i class="fa fa-trash-o"></i></a>&nbsp;&nbsp;',
                        '</span>',
                        '<div class="clearfix"></div>'].join(''));
                house_update_index = -1;
            }
            else {
                var append = [
                    '<li data-value="' + rule.join(';') + '">',
                        '<span class="badge badge-info badge-stat">0</span>',
                        _label.join('&nbsp;&nbsp;'),
                        '<span class="pull-right text-right">',
                            '<a href="javascript:;" class="btn btn-xs btn-info house_rule_mod_btn"><i class="fa fa-pencil"></i></a>&nbsp;&nbsp;',
                            '<a href="javascript:;" class="btn btn-xs btn-danger house_rule_del_btn"><i class="fa fa-trash-o"></i></a>&nbsp;&nbsp;',
                        '</span>',
                        '<div class="clearfix"></div>',
                    '</li>'
                ].join('');
                $('#filter_house_rules').append(append);
            }
        }

        $('#filter-house-modal').modal('hide');
        $('#add_resource_house_form')[0].reset();
        house_rules_result();
    });

});