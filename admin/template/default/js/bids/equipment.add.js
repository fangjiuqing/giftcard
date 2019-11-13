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
        var url = RGXLIB.url('equipment-cert-equip-%d-type-%d-cat-%d~', equip_id, type_id, cat_id);
        RGX.get_json(url, function (d) {
            if (d.code == '0') {
                images[d.data.asset_cert_type] = d.data.asset_cert_images;
                $('#asset_cert_id').val(d.data.asset_cert_id);
                $('#asset_cert_type').val(d.data.asset_cert_type);
                $('#asset_cert_cat_id').val(d.data.asset_cert_cat_id);
                //$('#asset_cert_images').val(d.data.asset_cert_images.join('#'));
                $('#asset_cert_sn').val(d.data.asset_cert_sn);
                $('#asset_cert_effect_date').val(d.data.asset_cert_effect_date);
                $('#asset_cert_expire_date').val(d.data.asset_cert_expire_date);
                init_input(tags, d.data.vals);
                callback();
            }
            else {
                images[type_id] = [];
                $('#asset_cert_id').val('0');
                $('#asset_cert_type').val(type_id);
                $('#asset_cert_cat_id').val(cat_id);
                $('#asset_cert_cover').val('');
                $('#asset_cert_images').val('');
                $('#asset_cert_sn').val('');
                $('#asset_cert_effect_date').val('');
                $('#asset_cert_expire_date').val('');
                $('#asset_cert_tags').val('');
                init_input(tags);
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
            if ( equip_id == 0 ) {
                var equip_title = $('#equip_title').val();
                var equip_sn    = $('#equip_sn').val();
                if ( equip_sn == '' ) {
                    RGX.msg('请先完善基本信息！' , function() {
                        $('#equip_sn').focus();
                    }, 'fail');
                }
                else if ( equip_title == '' ) {
                    RGX.msg('请先完善基本信息！' , function() {
                        $('#equip_title').focus();
                    }, 'fail');
                }
                else{
                    RGX.formpost('#sform', function (d) {
                        if ( d.code == 0 ) {
                            equip_id = d.row_id;
                            $('#equip_id').val(d.row_id);
                            $('#asset_equip_id').val(d.row_id);
                        }
                    });
                }
            }
            else if ( equip_id > 0 ) {
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
            var url = RGXLIB.url('equipment-certdel-id-%d-~', id);
            RGX.get_json(url, function (d) {
                if (d.code == '0') {
                    images[type] = [];
                    $('#cert-' + id).remove();
                    $('#cert_type' + type).removeClass('btn-primary').addClass('btn-default');
                }
            });
        });

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
                $('#asset_cert_images').val(imgs.join('#'));
            }
            else {
                RGX.msg('至少上传一张图片');
                return;
            }

            if ($('#asset_cert_sn').val() == '') {
                RGX.msg('请输入编号');
                $('#asset_cert_sn').focus();
            }
            else {
                var asset_cert_tags = '';
                $('.cert_tag_value').each(function () {
                    asset_cert_tags += $(this).attr('data-item') + ':' + $(this).val() + '|';
                });

                $('#asset_cert_tags').val(asset_cert_tags);
                RGX.formpost('#cform', function (d) {
                    RGX.msg(d.msg, function () {
                        if (d.code == '0') {
                            $('#asset_cert-' + d.data.asset_cert_id).remove();
                            images[d.data.cert_id] = d.data.images;
                            $('#add-cert-modal').modal('hide');
                            $('#asset_cert_type' + d.data.asset_cert_type).removeClass('btn-default').addClass('btn-primary');
                            if (confirm('页面刷新后可见新增资质文件，确认刷新吗？') ) {
                                var _new_url  = RGXLIB.url('equipment-add-id-%d-~', equip_id);
                                location.href = _new_url;
                            }
                        }
                    });
                }, function (d) {
                    RGX.msg(d);
                });
            }
        });

        $('#region_preview').on('click', function () {
            $(this).brs({
                multi      : false,
                gateway    : $(this).attr('data-url'),
                succ       : function (d) {
                    var region_preview = region_value = '';
                    if ( parseInt(d.value) > 0 ) {
                        region_preview += d.label.replace(',' , '-');
                        region_value   += d.value.replace(',' , '#');
                    }else{
                        region_preview = '全部';
                        region_value   = 0;
                    }
                    $('#region_preview').val(region_preview);
                    $('#regions').val(region_value);
                }
            });
        });

        // 租赁来源需要调出租赁截止日期时间插件
        $('select[name="data[equip_via]"]').on('change' , function(){
            var ep_via = parseInt($(this).find('option:selected').val());
            console.log(ep_via);
            if ( ep_via == 1 ) {
                $('.equip_rent_edate').addClass('hide');
            }else if ( ep_via == 2 ) {
                $('.equip_rent_edate').removeClass('hide');
            }
        });
        // END
        RGX.post('#sform');
    });