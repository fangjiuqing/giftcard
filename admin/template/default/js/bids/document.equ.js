var 
    equ_rules = {},
    equ_cert_rules = {},
    equ_update_index = -1,

    // 初始化modal
    init_equ_modal = function (val) {
        for (var i = 0, v; v = val[i]; i ++) {
            // 证书规则
            if (v.indexOf('#') >= 0) {
                var item    = v.split('#'),
                    type_id = item[0].split('-')[1].split(',')[0],
                    ps      = item[1],
                    cat     = item[0].split('-')[1].split(',')[1] || 0,
                    ele     = $('#require_equ_ctype'),
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
                        equ_cert_rules[type_id] = r;
                        render_equ_rule();
                    }
                });
            }
            // 普通规则
            else {
                var item = v.split('='),
                    ele  = $('#require_equ_' + item[0]);
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
    init_equ_select = function (items) {
        $('#equ_require_options').html('');
        var tpl = [
            '<div class="col-sm-6 require_equ" style="margin-top:10px;">',
                '<div class="form-group">',
                    '<label class="col-sm-3 control-label text-center">筛选</label>',
                    '<div class="col-sm-9">',
                        '<select class="form-control require_equ_tag" data-item="">',
                            '<option value="nul">不限</option>',
                        '</select>',
                    '</div>',
                '</div>',
            '</div>'
        ];

        for (var i = 0, tag; tag = items[i]; i ++) {
            var node = $(tpl.join(''));
            node.find('.control-label').html(tag);
            node.find('.require_equ_tag').attr('data-item', tag);
            $('#equ_require_options').append(node);
        }

    },

    /**
     * 获取规则筛选结果
     * @return {[type]} [description]
     */
    equ_rules_result = function () {
        var require_emp = [];
        $('#filter_equ_rules li').each(function () {
            require_emp.push({
                index   : $(this).index(),
                value   : $(this).attr('data-value')
            });
        });
        if (require_emp.length > 0) {
            RGX.ajaxpost({
                url     : RGXLIB.url('document-stat_equ'),
                data    : {
                    req : JSON.stringify(require_emp)
                },
                succ    : function (d) {
                    if (d.code == '0' && d.data.length > 0) {
                        for (var i = 0, v; v = d.data[i]; i ++) {
                            $('#filter_equ_rules li:eq(' + v.index + ')').find('span.badge').html(v.numbers);
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
    render_equ_rule = function () {
        var format = [
                'type', 'nums', 'via', 'location', 'location_label'
            ], 
            text = [];

        // 人员基本条件
        for (var i = 0, f; f = format[i]; i ++) {
            if (equ_rules.hasOwnProperty(f) && equ_rules[f]) {
                text.push(
                    '<a href="javascript:;" data-key="' + f + '" class="btn btn-xs btn-warning equ_tag">' + 
                        '<small>' + 
                            equ_rules[f].label + 
                        '</small> - ' + 
                        (equ_rules[f].text ==  equ_rules[f].label ?  equ_rules[f].value :  equ_rules[f].text) + 
                    '</a>');
            }
        }

        // 证书条件
        for (var k in equ_cert_rules) {
            if (equ_cert_rules.hasOwnProperty(k) && equ_cert_rules[k]) {
                text.push(
                    '<a href="javascript:;" data-key="' + equ_cert_rules[k].id + '" class="btn btn-xs btn-primary equ_rule_tag">' + 
                        equ_cert_rules[k].label +  
                    '</a>');
            }
        }
        $('#filter_equ_rule').html(text.join(' '));
    }
;

$(function () {

    // 初始化
    $('#filter-equ-modal').on('show.bs.modal', function () {
        $('#add_resource_equ_form')[0].reset();
        $('#filter_equ_rule').html('');
        equ_rules = {};
        equ_cert_rules = {};
    });

    // 显示车辆筛选层
    $('#add_equ_rules_btn').on('click', function () {
        $('#filter-equ-modal').modal();
        equ_cert_rules = {};
        $('.require_equ_options').trigger('change');
    });

    // 添加筛选规则
    $('#add_equ_rule_btn').on('click', function () {
        if ($('#require_equ_ctype').val() == 'nul') {
            RGX.msg('请选择证书类型');
        }
        else {
            var row = {
                    id      : $('#require_equ_ctype').val().split('#')[0].split(',')[0],
                    cat     : $('#require_equ_ctype').val().split('#')[0].split(',')[1] || 0,
                    label   : $('#require_equ_ctype option:selected').text(),
                    tags    : {}
                },
                labels = [
                    $('#require_equ_ctype option:selected').attr('data-label'),
                ]
            ;
            $('.require_equ_tag').each(function () {
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
            equ_cert_rules[row.id] = row;
            render_equ_rule();
        }
    });

    /**
     * 资质证件类型选择
     */
    $('#require_equ_ctype').on('change', function () {
        var val  = $(this).val() || "",
            id   = val.split('#')[0],
            tags = val.split('#').length > 1 ? (val.split('#')[1].split(',')) : [];

        init_equ_select(tags);
        $('.require_cert_tag').each(function () {
            $(this).html('<option value="nul">不限</option>');
        });

        var url = RGXLIB.url('document-equ_options-id-' + id);
        RGX.get_json(url, function (d) {
            if (d.code == '0') {
                for (var k in d.data) {
                    if (d.data.hasOwnProperty(k)) {
                        var t = $('.require_equ_tag[data-item="' + k + '"]'),
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
    $('body').on('click', '.equ_rule_tag', function () {
        $(this).remove();
        equ_cert_rules[$(this).attr('data-key')] = undefined;
    });

    $('body').on('click', '.equ_rule_mod_btn', function () {
        equ_update_index = $(this).parent().parent().index();
        $('#filter-equ-modal').modal();
        init_equ_modal($(this).parent().parent().attr('data-value').split(';'));
    });

    $('body').on('click', '.equ_rule_del_btn', function () {
        $(this).parent().parent().remove();
    });

    // 车辆 选择条件
    $('.require_equ_options').on('change', function () {
        equ_rules[$(this).attr('data-key')] = {
            label : $(this).attr('data-label'),
            value : $(this).val(),
            text  : $(this).find('option:selected').text()
        };
        render_equ_rule();
    });

    // 车辆 输入条件
    $('.require_equ_input').on('keyup', function () {
        if ($(this).val() != '') {
            equ_rules[$(this).attr('data-key')] = {
                label : $(this).attr('data-label'),
                value : $(this).val(),
                text  : $(this).attr('data-text') || $(this).attr('data-label')
            };
        }
        render_equ_rule();
    });

    // 地区筛选
    $('#require_equ_location').on('click', function () {
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
                
                equ_rules['location'] = {
                    id    : 'location',
                    label : '所在位置',
                    value : values.join('#'),
                    text  : labels.join(' , ')
                };
                $('#require_equ_location_value').val(values.join('#'));
                $('#require_equ_location_value').attr('data-text', labels.join(','));
                $('#require_equ_location_value').trigger('keyup');
            }
        });
    });

    // 确认添加筛选条件
    $('#equ-modal-ok').on('click', function () {
        var rule = [], _label = [];
        // 基本规则
        for (var k in equ_rules) {
            if (equ_rules.hasOwnProperty(k) && equ_rules[k]) {
                rule.push(k + '=' + equ_rules[k].value);
                _label.push(equ_rules[k].label + '=' + (equ_rules[k].text ==  equ_rules[k].label ?  equ_rules[k].value :  equ_rules[k].text));
            }
        }
        // 证书要求规则
        for (var k in equ_cert_rules) {
            if (equ_cert_rules.hasOwnProperty(k) && equ_cert_rules[k]) {
                var _info = 'cert-' + k + ',' +  equ_cert_rules[k].cat + '#0#',
                    _rule = equ_cert_rules[k],
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
            if (equ_update_index >= 0) {
                $('#filter_equ_rules li:eq(' + equ_update_index + ')').attr('data-value', rule.join(';')).html([
                        '<span class="badge badge-info badge-stat">0</span>',
                        _label.join('&nbsp;&nbsp;'),
                        '<span class="pull-right text-right">',
                            '<a href="javascript:;" class="btn btn-xs btn-info equ_rule_mod_btn"><i class="fa fa-pencil"></i></a>&nbsp;&nbsp;',
                            '<a href="javascript:;" class="btn btn-xs btn-danger equ_rule_del_btn"><i class="fa fa-trash-o"></i></a>&nbsp;&nbsp;',
                        '</span>',
                        '<div class="clearfix"></div>'].join(''));
                equ_update_index = -1;
            }
            else {
                var append = [
                    '<li data-value="' + rule.join(';') + '">',
                        '<span class="badge badge-info badge-stat">0</span>',
                        _label.join('&nbsp;&nbsp;'),
                        '<span class="pull-right text-right">',
                            '<a href="javascript:;" class="btn btn-xs btn-info equ_rule_mod_btn"><i class="fa fa-pencil"></i></a>&nbsp;&nbsp;',
                            '<a href="javascript:;" class="btn btn-xs btn-danger equ_rule_del_btn"><i class="fa fa-trash-o"></i></a>&nbsp;&nbsp;',
                        '</span>',
                        '<div class="clearfix"></div>',
                    '</li>'
                ].join('');
                $('#filter_equ_rules').append(append);
            }
        }

        $('#filter-equ-modal').modal('hide');
        $('#add_resource_equ_form')[0].reset();
        equ_rules_result();
    });

});