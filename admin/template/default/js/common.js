/**
 * [description]
 * @method
 * @param  {[type]} ) {} [description]
 * @return {[type]} [description]
 */
$(function() {
	/**
	 * 点击上传封面图片
	 * @method
	 * @return {[type]} [description]
	 */
	$('.add-cover').on('click', function () {
        var that = $(this);
        var thumb_size = that.attr('data-thumb-size');
        if ( thumb_size == '' || thumb_size == undefined ) {
        	thumb_size    =    '400xauto';
        }
        extra_var    =    that.attr('data-extra');
        if (extra_var == undefined) {
            extra_var = 'default';
        }

        var callback = that.attr('data-callback');

        RGXUpload.select_file({
            id        : that.attr('data-id'),
            url       : upload_image_url,
            allows    : ['image/png','image/gif', 'image/jpeg'],
            max       : 1000,
            extra     : extra_var,
            after     : function () {
                that.loading = RGX.loading('上传中 ...');
            },
            'preview'  : function (files) {
                that.attr('src', RGXUpload.create_obj_url(files[0]));
            },
            'success'  : function (d) {
                that.attr('src', UPLOAD_URL + RGX.thumb(d.data.url, thumb_size));
                that.loading.close();
                that.parent().find('input[type="hidden"]').val(d.data.url);
                if ( callback != undefined ) {
                    if (window[callback]) {
                        window[callback](d);
                    }
                }
            }
        });
    });

	/**
	 * [description]
	 * @method
	 * @return {[type]} [description]
	 */
    $('.date span').on('click', function () {
        $(this).siblings('input').trigger('focus');
    });

    /**
     * [startView description]
     * @type {Number}
     */
    $('.date input').datepicker({
        startView: 2,
        todayBtn: "linked",
        keyboardNavigation: !1,
        forceParse: !1,
        autoclose: !0,
        format: 'yyyy/mm/dd'
    });

    /**
     * [生成编号]
     * @method
     * @param  {Date} ){    	var mydate [description]
     * @return {[type]} [description]
     */
    $('.generate-sn').on('click' , function(){
    	var mydate = new Date();
		var sn = mydate.getFullYear() + '' + (mydate.getMonth() + 1) + '' + mydate.getDate() + '' + mydate.getHours() + '' + mydate.getMinutes() + '' + mydate.getSeconds() + '' + mydate.getMilliseconds();
    	var prefix = $(this).attr('data-prefix');
    	if (prefix == '' || prefix == undefined) {
    		prefix = 'NO';
    	}
    	$(this).prev('input').val(prefix + sn);
    });


    /**
     * [@todo 鼠标移动上去加一段提示]
     * @method
     * @param  {[type]} event){		 if(event.type [description]
     * @return {[type]} [description]
     */
    $('.add-cover').on("mouseover mouseout",function(event){
		 if(event.type == "mouseover"){
		    //鼠标悬浮
		    //alert('点击上传');
		 }else if(event.type == "mouseout"){
		    //鼠标离开
		    //console.log('mouseout');
		}
	});

    $('.add-attachment').on('click', function () {
        var type = 1, label = $(this).attr('data-title');

        init_album('#cert-images', images[type]);
        $('#add-cert-modal .modal-title').html('添加 ' + label);
        $('#add-cert-modal').modal();
        $('#add-cert-modal').on('hidden.bs.modal', function () {
            $('.rgx-album').remove();
            $('.rgx-album-input-file').remove();
        });
    });

     /**
     * 附件保存
     */
    $('.attach-relation').on('click', function () {
        var images = RGXAlbum.get_images(),
            imgs   = [];
        for (var i = 0, img; img = images[i]; i ++) {
            imgs.push(img.file_id);
        }

        if (images.length > 0) {
            $('#images_id').val(imgs.join('#'));
        }

        if ( 1 == 0){
            // 条件验证
            var t = 1;
        }
        else {
            RGX.formpost('#cform', function (d) {
                RGX.msg(d.msg, function () {
                    if (d.code == '0') {
                        $('#add-cert-modal').modal('hide');
                        location.reload();
                    }
                });
            }, function (d) {
                RGX.msg(d.msg);
            });
        }
    });

    $('#search-btn').on('click', function () {
        filter_complated();
    });

        /** {{{ 筛选完成刷新页面函数 **/
    var filter_complated = function (except) {
        // 筛选例外项
        except = except == undefined ? 'null' : except;
        $('.label-opt').each(function(i, d){
            if ($(d).attr('data-key') != except ) {
                if (this.tagName.toUpperCase() == 'INPUT'
                    || this.tagName.toUpperCase() == 'TEXTAREA'
                    || this.tagName.toUpperCase() == 'SELECT'
                ) {
                    val = $(this).val();
                }

                if ($(this).hasClass('search_key')) {
                    if ($(this).hasClass('date-picker')) {
                        val = get_timestamp(val);
                        val = isNaN(val) ? '0' : val;
                    }
                    else {
                        val = encodeURIComponent(val);
                    }
                }

                if (val != '') {
                    filter[$(this).attr('data-key')] = val;
                }
                else {
                    filter[$(this).attr('data-key')] = '';
                }
            }
        });

        var params  = [];
        for (var k in filter) {
            if (filter[k] != '0' && filter[k] != '') {
                _url += '-' + k + '-%s';
                params.push(encodeURIComponent(filter[k]));
            }
        }
        location.href = RGXLIB.url(_url, params);
    }
    /** }}} **/

    /**
     * [description]
     * @method
     * @param  {[type]} ) {    } [description]
     * @return {[type]} [description]
     */
    $('.btn-dialog-delete').on('click' , function() {
        var _this  = $(this);
        var url    = _this.attr('data-href');
        var target = _this.attr('data-target');
        $.getJSON(url , function(d) {
            if ( d.code == 0 && target != undefined ) {
                $(target).remove();
            }
        });
    });

    /**
     * [description]
     * @method
     * @param  {[type]} ){    } [description]
     * @return {[type]} [description]
     */
    $('.onblue-submit').on('blur' , function(){
        var _this   = $(this);
        var _url    = _this.attr('data-url');
        var data    = {
            "type"  : _this.attr('data-type'),
            "field" : _this.attr('data-field'),
            "value" : _this.val(),
        };

        var _submit = true;
        if ( data.type == 'date' ) {
            var reg  = /^2017\d{4}$/;
            if ( !reg.test(_this.val() )) {
                RGX.msg('日期格式：20170101');
                _submit = false;
            }
        }

        if ( data.type == 'decimal' ) {
            var reg  = /^\d+\.?\d{0,1}$/;
            if ( !reg.test(_this.val() )) {
                RGX.msg('小数格式：9.0');
                _submit = false;
            }
        }

        if ( data.type == 'int' ) {
            var reg  = /^\d$/;
            if ( !reg.test(_this.val() )) {
                RGX.msg('数字格式：1');
                _submit = false;
            }
        }

        // 源数据与当前是否一致
        var old = _this.attr('data-old');
        if ( old == _this.val() ) {
            _submit = false;
        }

        if ( _submit == true ) {
            RGX.ajaxpost({
                'url': _url,
                'data': data,
                'succ' : function (d) {
                    if (d.code == 0) {
                        RGX.msg('修改成功' , $.noop, 'succ');
                    }
                },
                'fails': function() {
                    RGX.msg('删除失败了');
                }
            });
        }
    });

    /**
     * [description]
     * @method
     * @param  {String} ){        var timestamp [description]
     * @return {[type]} [description]
     */
    $('.add-contacter').on('click' , function(){
        var timestamp = '' + Date.parse(new Date()) + '';
        var key  = timestamp;
        var tr   = '<tr id="'+key+'">';
            tr   +=    '<td class="text-center">';
            tr   +=        '<input type="text" name="contacter['+key+'][contacter_name]" value="" class="form-control" />';
            tr   +=    '</td>';
            tr   +=    '<td class="text-center">';
            tr   +=        '<input type="text" name="contacter['+key+'][contacter_phone]" value="" class="form-control" />';
            tr   +=    '</td>';
            tr   +=    '<td class="text-center">';
            tr   +=        '<input type="text" name="contacter['+key+'][contacter_mobile]" value="" class="form-control" />';
            tr   +=    '</td>';
            tr   +=    '<td class="text-center">';
            tr   +=        '<input type="text" name="contacter['+key+'][contacter_title]" value="" class="form-control" />';
            tr   +=    '</td>';
            tr   +=    '<td class="text-center">';
            tr   +=        '<input type="text" name="contacter['+key+'][contacter_buss_type]" value="" class="form-control" />';
            tr   +=    '</td>';
            tr   +=    '<td class="text-center">';
            tr   +=        '<input type="checkbox" class="is-checked" checked="true" />';
            tr   +=    '</td>';
            tr   += '</tr>';

            var _pos = $('#contacter-list');

            _pos.prepend(tr);
    });

    /**
     * [删除 this>parent1>parent2 DOM结构元素]
     * @method remove
     * @param  {[type]} obj [description]
     * @return {[type]} [description]
     */
    $('.dynamic').on('click','a.remove',function(){　　　　
        $(this).parent().parent().remove();
    });

    /**
     * [生成发票校验证书图片]
     * @method
     * @param  {[type]} ) {        if ( receipt_ocr_data.length [description]
     * @return {[type]} [description]
     */
    $('.generate-invoice-verifi').on('click' , function () {
        if ( receipt_ocr_data.length == 0 ) {
            RGX.msg('请先上传发票图片!');
        }else{
            request = new Object();
            request.url = receipt_verify_url;
            request.data= receipt_ocr_data;
            request.succ= function(d) {
                RGX.msg(d.msg);
                if (d.code == 0) {
                    $('#invoice_verifi').val(d.data.path);
                    $('#invoice-verify-preview').removeClass('hide').attr('href' , UPLOAD_URL + d.data.path );
                }
            }
            RGX.ajaxpost(request);
        }
    });

}) //Jquery End

/** {{{ 地区设置回调函数 **/
function setregion (data ) {
    $('#res_region0').val(data[0].id);
    $('#res_region1').val(data[1].id);
    $('#res_region2').val(data[2].id);

    var region_str    =    data[0].name;
    if ( data[1].name ) {
        region_str += ' - ' + data[1].name;
    }
    if ( data[2].name ) {
        region_str += ' - ' + data[2].name;
    }
    $('#region_preview').val(region_str);
}
/** }}} **/

// 发票上传识别后回调函数
function receipt (d) {
    if ( d.data.receipt != undefined ) {
        receipt_ocr_data = d.data.receipt;
        $.each(d.data.receipt , function(key,val){
            $('#'+key).val(val);
        });
    }

}

// select2方式加载合同数据列表
function select2_contract_init (api_url , ele_cls ) {
    $(ele_cls).select2({
        ajax: {
            type    : 'GET',
            url     : api_url,
            dataType: 'json',
            delay   : 250,
            data: function (params) {
                 return {
                    skey : params.term, // search term 请求参数 ， 请求框中输入的参数
                    stype: 'sn',
                    page : params.page
                 };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                var itemList = [];//当数据对象不是{id:0,text:'ANTS'}这种形式的时候，可以使用类似此方法创建新的数组对象

                $.each(data.data , function(key , val) {
                    itemList.push({id: val.contract_id, text: val.contract_sn});
                });

                return {
                    results: itemList,//itemList
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
             },
             cache: true
        },
        placeholder:'请选择',//默认文字提示
        language: "zh-CN",
        tags: false,//允许手动添加
        allowClear: true,//允许清空
        escapeMarkup: function (markup) { return markup; }, // 自定义格式化防止xss注入
        minimumInputLength: 2,//最少输入多少个字符后开始查询
        // 函数用来渲染结果
        formatResult: function formatRepo(repo){
            return repo.text;
        },
        // 函数用于呈现当前的选择
        formatSelection: function formatRepoSelection(repo){
            return repo.text;
        }
     });
}

// select2方式加载客户（公司）数据列表
function select2_customer_init (api_url , ele_cls ) {
    $(ele_cls).select2({
        ajax: {
            type    : 'GET',
            url     : api_url,
            dataType: 'json',
            delay   : 250,
            data: function (params) {
                 return {
                    skey : params.term, // search term 请求参数 ， 请求框中输入的参数
                    stype: 'name',
                    page : params.page
                 };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                var itemList = [];//当数据对象不是{id:0,text:'ANTS'}这种形式的时候，可以使用类似此方法创建新的数组对象

                $.each(data.data , function(key , val) {
                    itemList.push({id: val.company_id, text: val.company_title});
                });

                return {
                    results: itemList,//itemList
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
             },
             cache: true
        },
        placeholder:'请选择',//默认文字提示
        language: "zh-CN",
        tags: false,//允许手动添加
        allowClear: true,//允许清空
        escapeMarkup: function (markup) { return markup; }, // 自定义格式化防止xss注入
        minimumInputLength: 2,//最少输入多少个字符后开始查询
        // 函数用来渲染结果
        formatResult: function formatRepo(repo){
            return repo.text;
        },
        // 函数用于呈现当前的选择
        formatSelection: function formatRepoSelection(repo){
            return repo.text;
        }
     });
}

// 过滤未选中 通用接口
function remove_no_check () {
    $('.dynamic input.is-checked').each(function(idx , ele) {
        var is_checked = $(ele).is(':checked');
        if ( !is_checked ) {
            $(ele).parent().parent().remove();
        }
    });
}

