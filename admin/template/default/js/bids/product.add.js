var
    // images = {$images|json,encode},

    init_input = function (items, vals) {
        vals = vals || [];
        $('#cert_tags_wrapper').html('');
        var tpl = [
            '<div class="col-sm-6">',
                '<div class="form-group cert_tags">',
                    '<label class="col-sm-2 control-label text-right cert_tag_label">扩展属性1</label>',
                    '<div class="col-sm-10">',
                        '<input type="text" placeholder="请输入" class="form-control cert_tag_value">',
                    '</div>',
                    '<div class="clearfix"></div>',
                '</div>',
            '</div>'
        ];

        for (var i = 0, tag; tag = items[i]; i ++) {
            var node = $(tpl.join(''));
            node.find('.cert_tag_label').html(tag);
            node.find('.cert_tag_value').attr('placeholder', '请输入' + tag).attr('data-item', tag);
            if (vals[i]) {
                node.find('.cert_tag_value').val(vals[i]);
            }
            $('#cert_tags_wrapper').append(node);
        }

    },
    /**
     * 证书修改
     */
    fill_form = function (type_id, cat_id, tags, callback) {
        var url = RGXLIB.url('product-cert-product-%d-type-%d-cat-%d~', product_id, type_id, cat_id);
        RGX.get_json(url, function (d) {
            if (d.code == '0') {
                images[d.data.product_cert_type] = d.data.product_cert_images;
                $('#product_cert_id').val(d.data.product_cert_id);
                $('#product_cert_type').val(d.data.product_cert_type);
                $('#product_cert_cat_id').val(d.data.product_cert_cat_id);
                //$('#product_cert_images').val(d.data.product_cert_images.join('#'));
                $('#product_cert_sn').val(d.data.product_cert_sn);
                $('#product_cert_effect_date').val(d.data.product_cert_effect_date);
                $('#product_cert_expire_date').val(d.data.product_cert_expire_date);
                init_input(tags, d.data.vals);
                callback();
            }
            else {
                images[type_id] = [];
                $('#product_cert_id').val('0');
                $('#product_cert_type').val(type_id);
                $('#product_cert_cat_id').val(cat_id);
                $('#product_cert_cover').val('');
                $('#product_cert_images').val('');
                $('#product_cert_sn').val('');
                $('#product_cert_effect_date').val('');
                $('#product_cert_expire_date').val('');
                $('#product_cert_tags').val('');
                init_input(tags);
                callback();
            }
        });
    },

    /** 报告 */
    report_form = function (report_id , callback) {
        var url = RGXLIB.url('product-report-id-%d~', report_id);
        RGX.get_json(url, function (d) {
            if (d.code == '0') {
                $('#report_id').val(d.data.report_id);
                $('#report_customer_type').val(d.data.report_customer_type);
                $('#report_customer_title').val(d.data.report_customer_title);
                $('#report_customer_user').val(d.data.report_customer_user);
                $('#report_customer_mobile').val(d.data.report_customer_mobile);
                $('#report_test_date').val(d.data.report_test_date);
                $('#report_create_date').val(d.data.report_create_date);
                $('#report_summary').val(d.data.report_summary);
                callback();
            }
            else {
                $('#report_id').val('0');
                $('#report_customer_type').val('0');
                $('#report_customer_title').val('');
                $('#report_customer_user').val('');
                $('#report_customer_mobile').val('');
                $('#report_test_date').val('');
                $('#report_create_date').val('');
                $('#report_summary').val('');
                callback();
            }
        });
    },

    /**
    * 图片插件初始化
    */
    init_album = function (ele_id, images) {
        $(ele_id).RGXAlbum({
            upload  : {
                url         : upload_image_url,
                del_url     : '',
                allows      : ['image/png', 'image/gif', 'image/jpeg'],
                max         : 20480,
                multiple    : true,
                auto        : true,
                extra       : {
                    channel_id: 2,
                },
                failure     : function(file, msg) {
                    RGX.msg(file.name + ' ' + msg);
                }
            },

            album   : {
                click       : function(d) {},
                thumb       : '300x300',
                has_cut     : false,
                // 删除文件
                delete_file : function (d) {
                    if ($('#cert_cover').val() == d) {
                        $('#cert_cover').val('');
                    }
                },
                images      : (function() {
                    var ret = [],
                        files = images;
                    for (var i = 0, url; url = files[i]; i++) {
                        ret.push({
                            url     : url,
                            key     : url,
                            desc    : ''
                        });
                    }
                    return ret;
                })()
            }
        });
    },

    /**
     * [根据证件资质按钮label更改所需要填写的日期说明]
     * @method modify_date_desc
     * @param  {[type]}         label [description]
     * @return {[type]}         [description]
     */
    modify_date_desc = function (label) {
        var date_desc_1 = date_desc_2 = '';
        if ( label.indexOf('发票') > -1 ) {
            date_desc_1 = '开票日期';
            date_desc_2 = '可不填';
        }else if ( label.indexOf('合同') > -1 || label.indexOf('保单') > -1 ) {
            date_desc_1 = '签订日期';
            date_desc_2 = '到期时间';
        }
        else if ( label.indexOf('行驶证') > -1 ) {
            date_desc_1 = '年检日期';
            date_desc_2 = '可不填';
        }
        if ( date_desc_1 != '' ) {
            $('#date-desc-1').text(date_desc_1);
        }
        if ( date_desc_2 != '' ) {
            $('#date-desc-2').text(date_desc_2);
        }
    };

    $(function() {
        $('.btn-cert-add').on('click', function () {
            if ( product_id == 0 ) {
                var product_title = $('#product_title').val();
                var product_sn    = $('#product_sn').val();
                if ( product_sn == '' ) {
                    RGX.msg('请先完善基本信息！' , function() {
                        $('#product_sn').focus();
                    }, 'fail');
                }
                else if ( product_title == '' ) {
                    RGX.msg('请先完善基本信息！' , function() {
                        $('#product_title').focus();
                    }, 'fail');
                }
                else{
                    RGX.formpost('#sform', function (d) {
                        if ( d.code == 0 ) {
                            product_id = d.row_id;
                            $('#product_id').val(d.row_id);
                            $('#asset_equip_id').val(d.row_id);
                        }
                    });
                }
            }
            else if ( product_id > 0 ) {
                var type = $(this).attr('data-type'),
                    cat  = $(this).attr('data-cat'),
                    tags = $(this).attr('data-tags').split('#'),
                    label = $(this).text();
                fill_form(type || 0, cat || 0, tags, function () {
                    init_album('#cert-images', images[type]);
                    modify_date_desc(label);
                    $('#add-cert-modal .modal-title').html('添加 ' + label);
                    $('#add-cert-modal').modal();
                    $('#add-cert-modal').on('hidden.bs.modal', function () {
                        $('.rgx-album').remove();
                        $('.rgx-album-input-file').remove();
                    });
                });
            }

        });

        /**
         * 证书修改
         */
        $('body').on('click', '.cert_mod_btn', function () {
            var type    = parseInt($(this).attr('data-type')),
                cat     = parseInt($(this).attr('data-cat')),
                key     = cat > 0 ? (type + '-' + cat) : type;
            $('.btn-cert-add[data-key="' + key + '"]').trigger('click');
        });

         /**
         * 证书删除
         */
        $('body').on('click', '.cert_del_btn', function () {
            var id      = $(this).attr('data-id'),
                type    = $(this).attr('data-type');
            var url = RGXLIB.url('product-certdel-id-%d-~', id);
            RGX.get_json(url, function (d) {
                if (d.code == '0') {
                    images[type] = [];
                    $('#cert-' + id).remove();
                    $('#cert_type' + type).removeClass('btn-primary').addClass('btn-default');
                }
            });
        });

        /** 报告JS开始 */
        $('.btn-report-add').on('click', function () {
            if ( product_id == 0 ) {
                var product_title = $('#product_title').val();
                var product_sn    = $('#product_sn').val();
                if ( product_sn == '' ) {
                    RGX.msg('请先完善基本信息！' , function() {
                        $('#product_sn').focus();
                    }, 'fail');
                }
                else if ( product_title == '' ) {
                    RGX.msg('请先完善基本信息！' , function() {
                        $('#product_title').focus();
                    }, 'fail');
                }
                else{
                    RGX.formpost('#sform', function (d) {
                        if ( d.code == 0 ) {
                            product_id = d.row_id;
                            $('#product_id').val(d.row_id);
                            $('#product_report_id').val(d.row_id);
                        }
                    });
                }
            }
            else if ( product_id > 0 ) {
                var report_id = parseInt($(this).attr('data-rid'));
                report_form(report_id, function () {
                    $('#add-report-modal .modal-title').html('添加 试点报告');
                    $('#add-report-modal').modal();
                });
            }

        });

         /**
         * 报告删除
         */
        $('body').on('click', '.report_del_btn', function () {
            var rid = parseInt($(this).attr('data-rid'));
            if ( rid > 0 ) {
                if ( confirm('此操作不可撤销，确认删除吗？') ) {
                    var url = RGXLIB.url('product-reportdel-id-%d-~', rid);
                    RGX.get_json(url, function (d) {
                        if (d.code == '0') {
                            $('#report-' + rid).remove();
                        }
                    });
                }
            }else{
                RGX.msg('删除失败');
            }
        });

        // 报告确认保存
        $('#report-modal-ok').on('click', function () {
            RGX.formpost('#rform', function (d) {
                RGX.msg(d.msg, function () {
                    if (d.code == '0') {
                        $('#add-report-modal').modal('hide');
                        if (confirm('页面刷新后可见新增报告（未保存数据将会丢失），确认刷新吗？') ) {
                            var _new_url  = RGXLIB.url('product-add-id-%d-~', product_id);
                            location.href = _new_url;
                        }
                    }
                });
            }, function (d) {
                RGX.msg(d.msg);
            });
        });

        /** 报告JS结束 */

        $('.modal-date .datepicker').datepicker({
            startView       : 2,
            todayBtn        : "linked",
            keyboardNavigation  : !1,
            forceParse      : !1,
            autoclose       : !0,
            zIndexOffset    : 99999,
            container       : '#add-cert-modal',
            format          : 'yyyy-mm-dd'
        });

        // 资质证件确认保存
        $('#cert-modal-ok').on('click', function () {
            var images = $('#cert-images').data('album').get_images(),
                imgs   = [];
            for (var i = 0, img; img = images[i]; i ++) {
                imgs.push(img.url);
            }
            if (imgs.length > 0) {
                $('#product_cert_images').val(imgs.join('#'));
            }
            else {
                RGX.msg('至少上传一张图片');
                return;
            }

            if ($('#product_cert_sn').val() == '') {
                RGX.msg('请输入编号');
                $('#product_cert_sn').focus();
            }
            else {
                var product_cert_tags = '';
                $('.cert_tag_value').each(function () {
                    product_cert_tags += $(this).attr('data-item') + ':' + $(this).val() + '|';
                });

                $('#product_cert_tags').val(product_cert_tags);
                RGX.formpost('#cform', function (d) {
                    RGX.msg(d.msg, function () {
                        if (d.code == '0') {
                            $('#product_cert-' + d.data.product_cert_id).remove();
                            images[d.data.cert_id] = d.data.images;
                            $('#add-cert-modal').modal('hide');
                            $('#product_cert_type' + d.data.product_cert_type).removeClass('btn-default').addClass('btn-primary');
                            if (confirm('页面刷新后可见新增资质文件，确认刷新吗？') ) {
                                var _new_url  = RGXLIB.url('product-add-id-%d-~', product_id);
                                location.href = _new_url;
                            }
                        }
                    });
                }, function (d) {
                    RGX.msg(d);
                });
            }
        });

        // END
        RGX.post('#sform');
    });