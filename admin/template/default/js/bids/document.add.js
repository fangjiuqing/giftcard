var 
    rules = {},
    cert_rules = {},
    cert_rules_last = {
        'base'  : {},
        'cert'  : {}
    },
    update_index = -1,

    /**
     * 获取规则筛选结果
     * @return {[type]} [description]
     */
    rules_result = function () {
        var require_emp = [];
        $('#filter_rules li').each(function () {
            require_emp.push({
                index   : $(this).index(),
                value   : $(this).attr('data-value'),
                label   : $.trim($(this).text().replace(/^\d+/, ''))
            });
        });
        if (require_emp.length > 0) {
            RGX.ajaxpost({
                url     : RGXLIB.url('document-stat'),
                data    : {
                    req : JSON.stringify(require_emp)
                },
                succ    : function (d) {
                    if (d.code == '0' && d.data.length > 0) {
                        for (var i = 0, v; v = d.data[i]; i ++) {
                            $('#filter_rules li:eq(' + v.index + ')').find('span.badge').html(v.numbers);
                        }
                    }
                }
            });
        }
    },

    /**
     * 显示规格信息
     * @return {[type]} [description]
     */
    render_rule = function () {
        var format = [
                'duty', 'nums', 'edu', 'major', 'workyears'
            ], 
            text = [];

        // 人员基本条件
        for (var i = 0, f; f = format[i]; i ++) {
            if (rules.hasOwnProperty(f) && rules[f]) {
                text.push(
                    '<a href="javascript:;" data-key="' + f + '" class="btn btn-xs btn-warning rule_tag">' + 
                        '<small>' + 
                            rules[f].label + 
                        '</small> - ' + 
                        (rules[f].text ==  rules[f].label ?  rules[f].value :  rules[f].text) + 
                    '</a>');
            }
        }

        // 证书条件
        for (var k in cert_rules) {
            if (cert_rules.hasOwnProperty(k) && cert_rules[k]) {
                text.push(
                    '<span data-key="' + cert_rules[k].key + '" class="btn btn-xs btn-default cert_rule_tag">' + 
                        '<i class="fa fa-circle"></i> &nbsp; ' +
                        cert_rules[k].label + ' &nbsp; ' +
                        '<i class="fa fa-trash-o"></i> ' +
                    '</span>');
            }
        }
        $('#filter_rule').html(text.join(' '));
    },
    // 渲染输出最终条件
    render_last_cert = function () {
        var append = [],
            text = [];

        // 人员基本条件
        for (var k in cert_rules_last['base']) {
            if (cert_rules_last['base'].hasOwnProperty(k) && cert_rules_last['base'][k]) {
                html = '<span>' + 
                            '<small>' + 
                                cert_rules_last['base'][k].label + 
                            '</small> - ' + 
                            (cert_rules_last['base'][k].text ==  cert_rules_last['base'][k].label ? 
                                cert_rules_last['base'][k].value :  cert_rules_last['base'][k].text) + 
                        '</span>';
                append.push(
                    '<div class="cert_rule_tag_last" data-key="' + k + '" >' + 
                        html +
                        '<a href="javascript:;" class="btn btn-xs btn-danger pull-right cert_rule_tag_last_base_del">' + 
                            '<i class="fa fa-trash-o"></i>' + 
                        '</a>' + 
                    '</div>'
                );
            }
        }

        // 证书条件
        for (var k in cert_rules_last['cert']) {
            if (cert_rules_last['cert'].hasOwnProperty(k) && cert_rules_last['cert'][k]) {
                var text = [];
                for (var key in cert_rules_last['cert'][k]['list']) {
                    if (cert_rules_last['cert'][k]['list'].hasOwnProperty(key)) {
                        var row = cert_rules_last['cert'][k]['list'][key];
                        text.push(
                            '<span class="btn btn-xs btn-info">' + 
                                row.label +
                            '</span>');
                    }
                }
                if (text.length > 0) {
                    append.push(
                        '<div class="cert_rule_tag_last cert_logic_bg_' + cert_rules_last['cert'][k]['type'] + '" data-key="' + k + '" >' + 
                            text.join('<span class="rule_logic rule_logic_' + cert_rules_last['cert'][k]['type'] + '">' + 
                                {'AND' : '与', 'OR' : '或'}[cert_rules_last['cert'][k]['type']] + 
                            '</span>') + 
                            '<a href="javascript:;" class="btn btn-xs btn-danger pull-right cert_rule_tag_last_del"><i class="fa fa-trash-o"></i></a>' + 
                        '</div>'
                    );
                }
            }
        }
        $('#filter_rule_result').html(append.join(' '));
    },

    // 初始化modal
    init_modal = function (val) {
        cert_rules_last = val;
        render_last_cert();
    },

    init_select = function (items) {
        $('#cert_require_options').html('');
        var tpl = [
            '<div class="col-sm-6 require_cert">',
                '<div class="row row-margin-top">',
                    '<label class="col-sm-4 control-label text-right">筛选</label>',
                    '<div class="col-sm-8">',
                        '<select class="form-control require_cert_tag" data-item="">',
                            '<option value="nul">不限</option>',
                        '</select>',
                    '</div>',
                '</div>',
            '</div>'
        ];

        for (var i = 0, tag; tag = items[i]; i ++) {
            var node = $(tpl.join(''));
            node.find('.control-label').html(tag);
            node.find('.require_cert_tag').attr('data-item', tag);
            $('#cert_require_options').append(node);
        }
    }

;

/**
 * 标书发布
 */
$(function () {

    // 确认添加筛选条件
    $('#cert-modal-ok').on('click', function () {
        var labels = [];

        // 基本要求
        for (var k in cert_rules_last['base']) {
            if (cert_rules_last['base'].hasOwnProperty(k) && cert_rules_last['base'][k]) {
                var row = cert_rules_last['base'][k];
                labels.push(
                    '<span class="condition-block">' +
                        row.label + '=' + (row.label == row.text ? row.value : row.text) +
                    '</span>'
                );
            }
        }
        // 证件要求
        for (var k in cert_rules_last['cert']) {
            if (cert_rules_last['cert'].hasOwnProperty(k) && cert_rules_last['cert'][k]) {
                var row = cert_rules_last['cert'][k],
                    tmp = [];
                for (var i in row['list']) {
                    if (row['list'].hasOwnProperty(i)) {
                        tmp.push(
                            row['list'][i].label
                        );
                    }
                }
                labels.push(
                    '<span class="condition-block">' +
                        tmp.join({"OR" : '<code> 或 </code>', "AND" : '<code> 与 </code>'}[row.type]) +
                    '</span>'
                );
            }
        }

        if (labels.length > 0) {
            var value = encodeURIComponent(JSON.stringify(cert_rules_last));
            if (update_index >= 0) {
                $('#filter_rules li:eq(' + update_index + ')').attr('data-value', value).html([
                        '<span class="badge badge-info badge-stat">0</span>',
                        labels.join('&nbsp;&nbsp;'),
                        '<span class="pull-right text-right">',
                            '<a href="javascript:;" class="btn btn-xs btn-info rule_mod_btn"><i class="fa fa-pencil"></i></a>&nbsp;&nbsp;',
                            '<a href="javascript:;" class="btn btn-xs btn-danger rule_del_btn"><i class="fa fa-trash-o"></i></a>&nbsp;&nbsp;',
                        '</span>',
                        '<div class="clearfix"></div>'].join(''));
                update_index = -1;
            }
            else {
                var append = [
                    '<li data-value="' + value + '">',
                        '<span class="badge badge-info badge-stat">0</span>',
                        labels.join('&nbsp;&nbsp;'),
                        '<span class="pull-right text-right">',
                            '<a href="javascript:;" class="btn btn-xs btn-info rule_mod_btn"><i class="fa fa-pencil"></i></a>&nbsp;&nbsp;',
                            '<a href="javascript:;" class="btn btn-xs btn-danger rule_del_btn"><i class="fa fa-trash-o"></i></a>&nbsp;&nbsp;',
                        '</span>',
                        '<div class="clearfix"></div>',
                    '</li>'
                ].join('');
                $('#filter_rules').append(append);
            }
            $('#filter-modal').modal('hide');
            $('#add_resource_form')[0].reset();
            $('#filter_rule_result').html('');
            $('#filter_rule').html('');
            rules_result();
        }
        else {
            RGX.msg('请设置条件');
        }
    });

    // 初始化
    $('#filter-modal').on('show.bs.modal', function () {
        $('.require_cert').addClass('hide');
        $('.require_input').each(function () {
            $(this).val('');
        });
        $('.require_options').each(function () {
            $(this).find('option[value="nul"]').attr('selected', true);
        });
        $('#filter_rule').html('');
        rules = {};
        cert_rules = {};
        cert_rules_last = {
            'base'  : {},
            'cert'  : {}
        };
    });

    $('body').on('click', '.rule_mod_btn', function () {
        update_index = $(this).parent().parent().index();
        $('#filter-modal').modal();
        init_modal(JSON.parse(decodeURIComponent($(this).parent().parent().attr('data-value'))));
    });

    $('body').on('click', '.rule_del_btn', function () {
        $(this).parent().parent().remove();
    });


    $('#add_cert_rule_btn').on('click', function () {
        if ($('#require_cert').val() == 'nul') {
            RGX.msg('请选择证书类型');
        }
        else {
            var row = {
                    id      : $('#require_cert').val().split('#')[0].split(',')[0],
                    cat     : $('#require_cert').val().split('#')[0].split(',')[1] || 0,
                    label   : $('#require_cert option:selected').text(),
                    ps      : $('.require_ps:checked').val(),
                    tags    : {}
                },
                labels = [
                    $('#require_cert option:selected').attr('data-label'),
                ]
            ;
            row.key = row.id + '_' + row.cat;
            $('.require_cert_tag').each(function () {
                if ($(this).val() != 'nul') {
                    labels.push($(this).val());
                    row.tags[$(this).attr('data-item')] = {
                        label   : $(this).attr('data-item'),
                        value   : $(this).val(),
                        text    : $(this).val()
                    };
                }
            });
            labels.unshift(row.ps);
            row.label = labels.join(' - ');
            cert_rules[row.key] = row;
            render_rule();
        }
    });

    // 删除已设置的条件
    $('body').on('click', '.rule_tag', function () {
        if ($('.require_options[data-key="' + $(this).attr('data-key') + '"] option').length > 0) {
            $('.require_options[data-key="' + $(this).attr('data-key') + '"] option')[0].selected = true;
        }
        if ($('.require_input[data-key="' + $(this).attr('data-key') + '"]').length > 0) {
            $('.require_input[data-key="' + $(this).attr('data-key') + '"]').val('');
        }
        $(this).remove();
        delete rules[$(this).attr('data-key')];
    });

    // 删除已设置的条件
    $('body').on('click', '.cert_rule_tag .fa-trash-o', function () {
        $(this).parent().remove();
        delete cert_rules[$(this).parent().attr('data-key')];
    });

    // 删除最终条件
    $('body').on('click', '.cert_rule_tag_last_del', function () {
        var k = $(this).parent().attr('data-key');
        delete cert_rules_last['cert'][k];
        $(this).parent().remove();
    });

    // 删除最终base条件
    $('body').on('click', '.cert_rule_tag_last_base_del', function () {
        var k = $(this).parent().attr('data-key');
        delete cert_rules_last['base'][k];
        $(this).parent().remove();
    });

    // 选择已设置的条件
    $('body').on('click', '.cert_rule_tag', function () {
        $(this).toggleClass('cert_rule_tag_select')
    });

    // 条件 && 
    $('#cert_rule_btn_and').on('click', function () {
        if ($('.cert_rule_tag_select').length < 1) {
            RGX.msg('请选择条件');
            return false;
        }
        var ids = [], row = {
            'list'  : {},
            'type'  : 'AND'
        };
        $('.cert_rule_tag_select').each(function () {
            ids.push($(this).attr('data-key'));
            row.list[$(this).attr('data-key')] = cert_rules[$(this).attr('data-key')];
        });

        cert_rules_last['cert'][ids.sort().join('-')] = row;
        render_last_cert();
    });

    // 条件 ||
    $('#cert_rule_btn_or').on('click', function () {
        if ($('.cert_rule_tag_select').length < 2) {
            RGX.msg('至少需要选择2个条件');
            return false;
        }
        var ids = [], row = {
            'list'  : {},
            'type'  : 'OR'
        };
        $('.cert_rule_tag_select').each(function () {
            ids.push($(this).attr('data-key'));
            row.list[$(this).attr('data-key')] = cert_rules[$(this).attr('data-key')];
        });
        cert_rules_last['cert'][ids.sort().join('-')] = row;
        render_last_cert();
    });

    // 显示筛选层
    $('#add_rule_btn').on('click', function () {
        $('#filter-modal').modal();
    });

    // 选择条件
    $('.require_options').on('change', function () {
        if ($(this).val() != 'nul') {
            cert_rules_last['base'][$(this).attr('data-key')] = {
                label : $(this).attr('data-label'),
                value : $(this).val(),
                text  : $(this).find('option:selected').text()
            };
        }
        else {
            delete cert_rules_last['base'][$(this).attr('data-key')];
        }
        render_last_cert();
    });

    // 输入条件
    $('.require_input').on('keyup', function () {
        if ($(this).val() != '') {
            cert_rules_last['base'][$(this).attr('data-key')] = {
                label : $(this).attr('data-label'),
                value : $(this).attr('data-value') || $(this).val(),
                text  : $(this).attr('data-text') || $(this).attr('data-label')
            };
        }
        render_last_cert();
    });

    /**
     * 证书选择
     */
    $('#require_cert').on('change', function () {
        var val  = $(this).val(),
            id   = val.split('#')[0],
            tags = val.split('#').length > 1 ? (val.split('#')[1].split(',')) : [];
        init_select(tags);
        $('.require_cert_tag').each(function () {
            $(this).html('<option value="nul">不限</option>');
        });

        var url = RGXLIB.url('document-options-id-' + id);
        RGX.get_json(url, function (d) {
            if (d.code == '0') {
                for (var k in d.data) {
                    if (d.data.hasOwnProperty(k)) {
                        var t = $('.require_cert_tag[data-item="' + k + '"]'),
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

    $('.require_cert_tag').on('change', function () {
        var url = [
                'document-options',
                'id-' + $('#require_cert').val().split('#')[0]
            ],
            level = parseInt($(this).attr('data-level'));

        $('.require_cert_tag').each(function () {
            var id  = parseInt($(this).attr('data-level')),
                val = $(this).val();
            if (id > level) {
                $(this).html('<option value="nul">不限</option>');
            }
            else if (val != 'nul') {
                url.push("tag" + id + '-' + encodeURIComponent(val));
            }

        });
        
        RGX.get_json(RGXLIB.url(url.join('-')), function (d) {
            if (d.code == '0') {
                for (var k in d.data) {
                    if (d.data.hasOwnProperty(k)) {
                        var t = $('#require_cert_tag' + k);
                        t.html('<option value="nul">不限</option>');
                        for (var i = 0, v; v = d.data[k][i]; i ++) {
                            t.append('<option value="' + v + '">' + v + '</option>');
                        }
                    }
                }
            }
        })
    });

    // 案例要求按钮
    $('#add_case_btn').on('click', function () {
        window.case_exists_ids = [];
        $('#filter_case_result_body tr.contract_result').each(function () {
            case_exists_ids.push(parseInt($(this).attr('data-id')));
        });
        $('#filter-case-modal').modal();
    });

    // 地区筛选
    $('#region_preview').on('click', function () {
        var that = $(this);
        $(this).brs({
            multi      : true,
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
                var values = [],
                    labels = [];
                for (var i = 0, region; region = d[i]; i ++) {
                    values.push(region.value);
                    labels.push(region.label.replace(',', '-'));
                }
                that.attr('data-value', values.join(';'));
                that.val(labels.join(' , '));
            }
        });
    });

    // 人员地区筛选
    $('#employee_region_preview').on('click', function () {
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
                $('#emp_region').attr('data-value', d.value);
                $('#emp_region').attr('data-text', d.label);
                $('#emp_region').val(d.label);
                $('#employee_region_preview').val(d.label);
                $('#emp_region').trigger('keyup');
            }
        });
    });

    // 筛选项目显隐按钮
    $('#filter_opts_switch').on('click', function () {
        // 显示 =>隐藏
        if ($(this).find('i').hasClass('fa-angle-double-down')) {
            $(this).find('i').addClass('fa-angle-double-up').removeClass('fa-angle-double-down');
            $('#case_filter_wraper').hide();
            $('#filter_case_list').css('height', '82vh');
        }
        else {
            $(this).find('i').addClass('fa-angle-double-down').removeClass('fa-angle-double-up');
            $('#filter_case_list').css('height', '46vh');
            $('#case_filter_wraper').show();
        }
    });

    // 业绩全选
    $('#case_check_all').on('click', function () {
        var checked = this.checked,
            counts  = 0;
            nodes   = $('#filter_case_list input:checkbox');
        for (var i = 0, node; node = nodes[i]; i ++) {
            $(node).prop('checked', checked);
            checked && counts ++;
        }
        $('#case_check_counts').html(counts);
    });

    // 添加案例记录
    var add_case_select_li = function (labels, data) {
        var max_id = 0;
        $('.contract_result_info').each(function () {
            var tr_id = parseInt($(this).attr('id').match(/contract_group_(\d+)/)[1]);
            max_id = max_id > tr_id ? max_id : tr_id;
        });
        max_id += 1;
        var data_ids = [],
            append = [];
        for (var i = 0, id; id = data[i]; i ++) {
            id = id.split(',')[0];
            var d = window.case_data[id],
                sid = i + 1;
            data_ids.push(d.sub_ids.join(','));
            if ($('#case_result_' + d.contract_id).length == 0) {
                append.push(get_selected_tr(d, 0, sid, max_id).join(''));
                if (d['subs'] && d['subs'].length > 0) {
                    for (var j = 0, sd; sd = d.subs[j]; j ++) {
                        append.push(get_selected_tr(sd, 1, sid + '-' + (j + 1), max_id).join(''));
                    }
                }
            }
        }
        append.unshift(
            '<tr id="contract_group_' + max_id + '" class="contract_result_info info" data-label="' + 
            labels + '" data-ids="' + data_ids.join(',') + '"><td></td><td class="text-left" colspan="35">' + 
            labels + '</td></tr>'
        );

        $('#filter_case_result tbody').append(append.join(''));
        $('#case_result_count').html($('#filter_case_result tbody tr.contract_result button.case_remove_btn').length);
    };

    // 业绩相关配置
    $('#filter_case_result').on('click', '.case_config_btn', function () {
        window.case_config_id = parseInt($(this).attr('data-id'));
        $('#filter-case-config-modal').modal();
    });

    // 业绩结果删除
    $('#filter_case_result').on('click', '.case_remove_btn', function () {
        var group_id = $(this).parents('tr').attr('class').match(/contract_result_group_(\d+)/)[1];
        $('.contract_result_' + $(this).attr('data-id')).remove();
        // 更新结果
        var vals = [];
        $('tr.contract_result_group_' + group_id + ' button.case_remove_btn').each(function () {
            vals.push($(this).attr('data-id'));
        });
        if (vals.length == 0) {
            $('#contract_group_' + group_id).remove();
        }
        else {
            $('#contract_group_' + group_id).attr('data-ids', vals.join(','));
        }
        $('#case_result_count').html($('#filter_case_result tbody tr.contract_result button.case_remove_btn').length);
    });

    // 添加业绩发票列表
    var add_case_invoice_list = function (data, is_append) {
        var append = [];
        for (var i = 0, d; d = data[i]; i ++) {
            if ($('#case_invoice_' + d.invoice_id).length > 0) {
                continue;
            }
            if (is_append) {
                var sn = $('#case_result_' + window.case_config_id).attr('data-append');
                sn = sn ? sn.split(',') : [];
                // 若不存在该发票, 则添加
                if (sn.indexOf(d.invoice_sn) < 0) {
                    sn.push(d.invoice_sn);
                    $('#case_result_' + window.case_config_id).attr('data-append', sn.join(','));
                }
            }
            append.push([
                '<tr id="case_invoice_', d.invoice_id ,'" data-id="', d.invoice_id, '">',
                    '<td class="text-left">', 
                        is_append ? ('<i class="fa fa-trash-o text-danger" data-id="' + d.invoice_id + '"></i>&nbsp;') : '',
                        d.invoice_sn, 
                    '</td>',
                    '<td class="text-center">', d.date, '</td>',
                    '<td class="text-center text-success">', d.invoice_amount, '</td>',
                    '<td class="center">', d.relation_prop_amount || d.relation_prop_percent, '</td>',
                    '<td>', d.invoice_buyer_name, '</td>',
                    '<td>', d.invoice_item, '</td>',
                '</tr>'
            ].join(''));
        }
        if (append.length > 0) {
            $('#case_config_list_body .empty_tr').remove();
        }
        if (is_append) {
            $('#case_config_list_body').append(append.join(''));
        }
        else {
            $('#case_config_list_body').html(append.join(''));
        }
    };

    // 附加临时发票按钮
    $('#add_case_extra_invoice_btn').on('click', function () {
        var url = $(this).attr('data-url') + $('#add_case_extra_invoice_input').val();
        RGX.get_json(url, function (d) {
            if (d.code == '0') {
                add_case_invoice_list([d.data], true);
            }
        });
    });

    // 移除附加发票
    $('#case_config_list_body').on('click', '.fa-trash-o', function () {
        var sn = $('#case_result_' + window.case_config_id).attr('data-append'),
            id = $(this).attr('data-id');
        sn = sn ? sn.split(',') : [];
        sn.remove(sn.indexOf(id));
        $('#case_result_' + window.case_config_id).attr('data-append', sn.join(','));
        $(this).parents('tr').remove();
    });

    // 获取合同发票及订单
    $('#filter-case-config-modal').on('shown.bs.modal', function () {
        $('#case_config_list_body').html([
            '<tr class="empty_tr">',
                '<td colspan="6" class="text-center">',
                    '加载中, 请稍后 ...',
                '</td>',
            '</tr>'
        ].join(''));
        var sn = $('#case_result_' + window.case_config_id).attr('data-append');
        RGX.get_json(RGXLIB.url('document-case_config-id-%d-sn-%s~', window.case_config_id, sn || ''), function (d) {
            if (d.code == '0') {
                $('#case_config_amount').html(d.data.contract.contract_amount);
                $('#case_config_invoice_amount').html(d.data.contract.contract_invoice_amount);
                $('#case_config_amount_diff').html(d.data.contract.contract_amount - d.data.contract.contract_invoice_amount);
                if (d.data.invoices.length == 0) {
                    $('#case_config_list_body').html([
                        '<tr class="empty_tr">',
                            '<td colspan="6" class="text-center">',
                                '暂无记录',
                            '</td>',
                        '</tr>'
                    ].join(''));
                }
                else {
                    add_case_invoice_list(d.data.invoices);
                }

                add_case_invoice_list(d.data.append, true);
            }
        });
    });

    // 提交选择结果
    $('#case_select_result_btn').on('click', function () {
        var rows = [], labels = [
            "甲方名称: " + $('#filter_pu option:selected').text(),
            "合同性质: " + $('#filter_type option:selected').text(),
            "业务类型: " + $('#filter_service option:selected').text()
        ];
        $('.case_row_checkbox:checked').each(function () {
            rows.push($(this).val());
            $('.' + $(this).parents('tr').attr('class')).remove();
        });
        add_case_select_li(labels.join(' - '), rows);
        $('#case_result_count').html(rows.length);
        $('#case_check_counts').html('0');
        $('#case_check_all').removeAttr('checked');
        $('#filter-case-modal').modal('hide');
        // window.case_result_sort = Sortable.create(document.getElementById('filter_case_result_body'), {
        //     forceFallback : true,
        //     handle        : '.handle'
        // });
    });

    // 添加已选择列表
    var get_selected_tr = function (d, level, id, label_id) {
        label_id = label_id || 0;
        return ['<tr class="contract_result_group_' + label_id + ' contract_result contract_result_', (level == '0' ? d.contract_id : d.contract_parent_id) ,'"id="case_result_' + d.contract_id +'" data-id="' + d.contract_id + '">',
                    '<td class="text-center">',
                        (level == '0' ? '<button class="btn btn-xs btn-danger case_remove_btn" data-id="' + 
                            (d.sub_ids.length > 0 ? d.sub_ids.join(',') : d.contract_id) + 
                        '"><i class="fa fa-trash-o"></i></button>' : ''),
                    '</td>',
                    '<td class="case_row strcut" data-key="contract_part_a">', d.contract_part_a, '</td>', 
                    '<td class="text-center case_row" data-key="region">', d.region, '</td>', 
                    '<td class="text-center case_row" data-key="label">', d.type_label, '</td>',
                    '<td class="text-center case_row" data-key="service_type">', d.service_type, '</td>',
                    '<td class="text-left   case_row" data-key="row_id">', id, '</td>',
                    '<td class="case_row" data-key="contract_sn">', d.contract_sn, '</td>',
                    '<td class="case_row strcut" data-key="title">', d.contract_title, '</td>',
                    '<td class="text-center case_row" data-key="amount">', d.contract_amount, '</td>',
                    '<td class="text-center case_row" data-key="invoice_amount">', d.contract_invoice_amount, '</td>',
                    '<td class="text-center case_row" data-key="manager_name">', d.contract_jufang_manager_name, '</td>',
                    '<td class="text-center case_row" data-key="manager_mobile">', d.manager_mobile, '</td>',
                    '<td class="text-center case_row" data-key="sign_date">', d.contract_sign_date, '</td>',
                    '<td class="text-center case_row" data-key="start_date">', d.contract_start_date, '</td>',
                    '<td class="text-center case_row" data-key="expire_date">', d.contract_expire_date, '</td>',
                    '<td class="text-center case_row" data-key="images">', d.images, '</td>',
                    '<td class="text-center case_row" data-key="images">', d.invoices_amount, '</td>',
                    '<td class="text-center case_row strcut" data-key="invoices">', d.invoices, '</td>',
                    (function (types, reports) {
                        var html = [];
                        for (var k in types) {
                            if (types.hasOwnProperty(k)) {
                                html.push([
                                    '<td class="text-center case_row" data-key="reports_' + k +'">', 
                                        undefined == reports ? '' : (reports[k] || ''),
                                    '</td>',
                                    ].join(''));
                            }
                        }
                        return html.join('');
                    })(report_types, d.reports),
                '</tr>'];
    };

    var get_tr = function (d, level, id) {
        return ['<tr class="contract_', (level == '0' ? d.contract_id : d.contract_parent_id) ,'">',
                    '<td class="text-center">',
                        (level == '0' ? '<input type="checkbox" class="case_row_checkbox" value="' + 
                        (d.sub_ids.length > 0 ? d.sub_ids.join(',') : d.contract_id) + '"/>' : ''),
                    '</td>',
                    '<td class="case_row strcut" data-key="contract_part_a">', d.contract_part_a, '</td>', 
                    '<td class="text-center case_row" data-key="region">', d.region, '</td>', 
                    '<td class="text-center case_row" data-key="label">', d.type_label, '</td>',
                    '<td class="text-center case_row" data-key="service_type">', d.service_type, '</td>',
                    '<td class="text-left   case_row" data-key="row_id">', id, '</td>',
                    '<td class="case_row" data-key="contract_sn">', d.contract_sn, '</td>',
                    '<td class="case_row strcut" data-key="title">', d.contract_title, '</td>',
                    '<td class="text-center case_row" data-key="amount">', d.contract_amount, '</td>',
                    '<td class="text-center case_row" data-key="invoice_amount">', d.contract_invoice_amount, '</td>',
                    '<td class="text-center case_row" data-key="manager_name">', d.contract_jufang_manager_name, '</td>',
                    '<td class="text-center case_row" data-key="manager_mobile">', d.manager_mobile, '</td>',
                    '<td class="text-center case_row" data-key="sign_date">', d.contract_sign_date, '</td>',
                    '<td class="text-center case_row" data-key="start_date">', d.contract_start_date, '</td>',
                    '<td class="text-center case_row" data-key="expire_date">', d.contract_expire_date, '</td>',
                    '<td class="text-center case_row" data-key="images">', d.images, '</td>',
                    '<td class="text-center case_row" data-key="images">', d.invoices_amount, '</td>',
                    '<td class="text-center case_row strcut" data-key="invoices">', d.invoices, '</td>',
                    (function (types, reports) {
                        var html = [];
                        for (var k in types) {
                            if (types.hasOwnProperty(k)) {
                                html.push([
                                    '<td class="text-center case_row" data-key="reports_' + k +'">', 
                                        undefined == reports ? '' : (reports[k] || ''),
                                    '</td>',
                                    ].join(''));
                            }
                        }
                        return html.join('');
                    })(report_types, d.reports),
                '</tr>'];
    };

    // 添加业绩列表
    var add_case_list = function (data) {
        var append = [], i = 1;
        for (var k in data) {
            if (data.hasOwnProperty(k)) {
                var id = i;
                append.push(get_tr(data[k], 0, id).join(''));
                if (data[k]['subs'] && data[k]['subs'].length > 0) {
                    for (var j = 0, sd; sd = data[k].subs[j]; j ++) {
                        append.push(get_tr(sd, 1, id + '-' + (j + 1)).join(''));
                    }
                }
                i ++;
            }
        }
        $('#filter_case_list tbody').html(append.join(''));
    };

    // 筛选案例列表
    $('#filter_case_btn').on('click', function () {
        var data  = {
                exists_ids  : case_exists_ids.join(',')
            },
            nodes = $('.filter_case_vals');

        $('#filter_case_list tbody').html('');
        for (var i = 0, node; node = nodes[i]; i ++) {
            var k = $(node).attr('data-key'),
                v = $(node).val();
            if (k != 'regions') {
                data[$(node).attr('data-key')] = $(node).val();
            }
            else {
                data[$(node).attr('data-key')] = $(node).attr('data-value');
            }
        }
        RGX.ajaxpost({
            url         : $(this).attr('data-url'),
            data        : data,
            succ        : function (d) {
                if (!$('#case_filter_wraper').is(':hidden')) {
                    $('#filter_opts_switch').trigger('click');
                }
                $('#case_check_counts').html('0');
                $('#case_check_all').removeAttr('checked');
                window.case_data = d.data;
                add_case_list(d.data);
            }
        });
    });

    // 案例确认
    $('#solution-modal-ok').on('click', function () {
        var values = $('#solution_select').val();
        if (values == null || values.length == 0) {
            RGX.msg('请选择案例');
        }
        else {
            $('#solution_result').html('');
            $.each(values, function (k, v) {
                var label = $('#solution_select option[value="' + v + '"]').text();
                var append = [
                    '<li data-value="' + v + '#' + label +'">',
                        label,
                        '<div class="clearfix"></div>',
                    '</li>'
                ].join('');
                $('#solution_result').append(append);
            });
            $('#solution-modal').modal('hide');
        }
    });

    // 表单提交
    $('#document-submit-btn').on('click', function () {
        var req = {
            certificate : [],
            employee    : [],
            solution    : [],
            car         : [],
            equ         : [],
            house       : []
        };
        $('.filter_check_tag.active').each(function () {
            req.certificate.push({
                value   : $(this).attr('data-id'),
                label   : $.trim($(this).text())
            });
        });

        // 雇员条件
        $('#filter_rules li').each(function () {
            req.employee.push({
                value   : $(this).attr('data-value'),
                label   : $.trim($(this).text().replace(/^\d+/, ''))
            });
        });

        $('#filter_case_result_body tr.contract_result_info').each(function () {
            req.solution.push({
                label   : $(this).attr('data-label'),
                ids     : $(this).attr('data-ids')
            });
        });
        $('#filter_car_rules li').each(function () {
            req.car.push({
                value   : $(this).attr('data-value'),
                label   : $.trim($(this).text().replace(/^\d+/, ''))
            });
        });
        $('#filter_equ_rules li').each(function () {
            req.equ.push({
                value   : $(this).attr('data-value'),
                label   : $.trim($(this).text().replace(/^\d+/, ''))
            });
        });
        $('#filter_house_rules li').each(function () {
            req.house.push({
                value   : $(this).attr('data-value'),
                label   : $.trim($(this).text().replace(/^\d+/, ''))
            });
        });

        $('#doc_resource').val(JSON.stringify(req));

        RGX.formpost('#cform', function (d) {
            if (d.code == '0') {
                RGX.msg(d.msg, function () {
                    location.href = d.url;
                });
            }
            else {
                RGX.show_error(d.error);
            }
        });
    });
    window.solution_is_loaded = false;

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if ($(e.target).attr('data-id') == 'case' && $('#filter_case_result_body tr').length == 0) {
            for (var i = 0, row; row = contracts[i]; i ++) {
                (function (data) {
                    RGX.ajaxpost({
                        url         : RGXLIB.url('document-contract'),
                        data        : {
                            ids     : data.ids,
                            invoice : $("input[name='doc[doc_invoice]']:checked").val()
                        },
                        succ        : function (d) {
                            window.case_data = d.data;
                            add_case_select_li(data.label, Object.keys(d.data));
                            window.solution_is_loaded = true;
                        }
                    });
                })(row);
            }
        }
    });

});