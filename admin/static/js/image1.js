;
if (typeof(jQuery) === 'undefined') {
    throw new Error('RGXAlbum\'s JavaScript requires jQuery');
}
var md5 = md5 || require('md5'),
    is_empty = function(obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    },
    album_sort = null;


Math.fround = Math.fround || (function (array) {
  return function(x) {
    return array[0] = x, array[0];
  }; 
})(Float32Array(1));

if (!FileReader.prototype.readAsBinaryString) {
    FileReader.prototype.readAsBinaryString = function (fileData) {
       var binary = "";
       var pt     = this;
       var reader = new FileReader();
       reader.onload = function (e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            pt.content = binary;
            pt.onload(e);
            //$(pt).trigger('onload');
        }
        reader.readAsArrayBuffer(fileData);
    }
};

(function ($) {
    'use strict'

    /**
     * 相册管理类
     * @param {[type]} ele  [description]
     * @param {[type]} opts [description]
     */
    var RGXAlbumClass = function (ele, opts) {
        $(ele).attr('id', $(ele).attr('id') || 'RGXAlbum-' + parseInt(Math.random() * 1000));
        this.ele = ele;
        $(ele).data('album', this);
        // 上传配置
        this.upload_config = $.extend({
            id              : $(this.ele).attr('id') + '-upload',
            url             : '?',
            max             : 10240,        // 最大(KB)
            extra           : {},
            allows          : ['*/*'],
            multiple        : false,        // 是否多文件
            length          : 50,           // 最多(个)
            preview         : $.noop,
            success         : $.noop,
            after           : $.noop,
            progress        : $.noop,
            before          : $.noop,
            auto            : true,
            failure         : function () {
                throw new Error('服务端返回异常');
            }
        }, opts.upload);

        // 相册配置
        this.album_config = $.extend({
            id              : $(this.ele).attr('id') + '-album',
            click           : $.noop,
            has_cover       : true,
            has_insert      : true,
            has_cut         : true,
            thumb           : '800xauto',
            fixed           : false,
            fixed_height    : 'auto',
            wrapper_id      : 'body',
            images          : [],
            delete_file     : $.noop
        }, opts.album);
    };

    /**
     * 类方法
     * @type {Object}
     */
    RGXAlbumClass.prototype = {

        /**
         * 获取相册节点对象
         * @return {[type]} [description]
         */
        get_album : function () {
            return $('#' + this.album_config['id']);
        },

        /**
         * 设置隐藏
         * @return {[type]} [description]
         */
        album_hide : function () {
            this.get_album().hide();
        },

        /**
         *  显示
         * @return {[type]} [description]
         */
        album_show : function () {
            this.get_album().show();
        },

        /**
         * 获取资源地址
         * @param  {[type]} object [description]
         * @return {[type]}        [description]
         */
        create_obj_url : function (object) {
            return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
        },

        /**
         * 获取图片及对应说明
         * @return {[type]} [description]
         */
        get_images : function () {
            var li = this.get_album().find('#rgx-album-images li'),
                ret = [];
            for (var i = 0, node; node = li[i]; i ++) {
                if (!$(node).hasClass('not-upload') && !$(node).hasClass('on-upload')) {
                    ret.push({
                        url     : $(node).find('img').attr('data-source'),
                        desc    : $(node).find('input').val(),
                        file_id : $(node).find('img').attr('data-fileId')
                    });
                }
            }
            return ret;
        },

        /**
         * 删除文件
         * @param  {[type]} file [description]
         * @param  {[type]} succ [description]
         * @param  {[type]} fail [description]
         * @return {[type]}      [description]
         */
        delete_file : function (file, succ, fail) {
            var data = this.upload_config.extra;
            data.file  = file;
            if (this.upload_config.del_url) {
                RGX.ajaxpost({
                     url        : this.upload_config.del_url,
                     data       : data,
                     succ       : succ || function (d) {
                        console.log('删除成功 : ' + file);
                        console.log(d);
                     },
                     fail       : fail || function (d) {
                        console.log('删除失败了 : ' + file);
                     }
                });
            }
            this.album_config.delete_file(file);
        },

        /**
         * ajax 上传
         * @type {Object}
         */
        ajax_upload : {

            /**
             * 请求对象
             * @type {[type]}
             */
            xhr         : null,

            /**
             * 失败次数
             * @type {Number}
             */
            error_count : 0,

            /**
             * 执行上传
             * @param  {[type]} opts [description]
             * @return {[type]}      [description]
             */
            exec : function (opts) {
                if (this.xhr == null) {
                    this.xhr = new XMLHttpRequest();
                }
                // 处理完成
                this.xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        opts.success(JSON.parse(this.responseText), opts);
                    }
                    else if (this.readyState == 4 && this.status != 200) {
                        opts.failure(opts);
                    }
                }
                // 进度条
                this.xhr.upload.onprogress = function (evt) {
                    var loaded = evt.loaded;
                    var tot = evt.total;
                    var per = Math.floor(100 * loaded / tot);
                    opts.progress(per);
                }
                this.xhr.open("POST", opts.url);
                this.xhr.send(opts.data);
            },

            /**
             * 取消上传
             * @return {[type]} [description]
             */
            abort : function () {
                if (this.xhr.readyState < 4) {
                    this.xhr.abort();
                }
            }
        },

        /**
         * 待上传的图片列表
         * @type {Array}
         */
        upload_queue  : {

            /**
             * hash map
             * @type {Object}
             */
            hash  : {},

            /**
             * queue
             * @type {Array}
             */
            queue : [],

            /**
             * 获取文件的hash特征码
             * @param  {[type]} file [description]
             * @return {[type]}      [description]
             */
            get_hash : function (file) {
                return md5(file.name + file.type + file.size + file.lastModified);
            },

            /**
             * 是否已经存在
             * @param  {[type]} key [description]
             * @return {[type]}     [description]
             */
            exists : function (key) {
                return this.hash[key] == 1;
            },

            /**
             * 新增
             * @param {[type]} file [description]
             */
            add   : function (file) {
                file.hash = file.hash || this.get_hash(file);
                // 判断是否已经存在
                if (!this.hash[file.hash]) {
                    this.queue.push(file);
                    this.hash[file.hash] = 1;
                }
            },

            /**
             * 替换
             * @param  {[type]} file [description]
             * @param  {[type]} key  [description]
             * @return {[type]}      [description]
             */
            replace : function (file, key) {
                file.hash = file.hash || this.get_hash(file);
                if (is_empty(this.hash)) {
                    this.add(file);
                    return true;
                }
                else if (this.hash[key]) {
                    if (!this.hash[file.hash]) {
                        this.del(key);
                        this.add(file);
                        return true;
                    }
                }
                return false;
            },

            /**
             * 删除
             * @param  {[type]} hash [description]
             * @return {[type]}      [description]
             */
            del   : function (hash) {
                for (var i = 0, file; file = this.queue[i]; i ++) {
                    if (file.hash == hash) {
                        this.queue.splice(i, 1);
                        delete this.hash[hash];
                        break;
                    }
                }
            },

            /**
             * 删除hash记录
             */
            del_hash : function (hash) {
                delete this.hash[hash];
            },

            /**
             * 获取任务
             * @return {[type]} [description]
             */
            get : function () {
                var file = this.queue.shift();
                if (file) {
                    delete this.hash[file.hash];
                }
                return file;
            },

            /**
             * 获取队列长度
             * @return {[type]} [description]
             */
            length : function () {
                return this.queue.length;
            },

            /**
             * 清空
             * @return {[type]} [description]
             */
            clear : function () {
                this.queue = [];
                this.hash  = {};
            }
        },

        /**
         * 选择文件
         * @return {[type]} [description]
         */
        select_files : function (is_multiple, target) {
            var file_input = $('#' + this.upload_config.id);
            if (is_multiple) {
                file_input.attr('multiple', 'multiple');
                file_input.removeAttr('data-target');
            }
            else {
                file_input.removeAttr('multiple');
                if (target) {
                    file_input.attr('data-target', target);
                }
            }
            file_input.trigger('click');
        },

        /**
         * 预览上传文件
         * @param  {[type]} files  [description]
         * @param  {[type]} config [description]
         * @return {[type]}        [description]
         */
        preview_files : function (files) {
            var queue = [],
                data  = new FormData(),
                config = this.upload_config;

            if (files.length > config.length) {
                RGX.msg('您选择的文件过多,最多可选' + config.length + '个');
                return false;
            }

            for (var i = 0, v; v = files[i]; i ++) {
                // 类型验证
                if (config.allows.indexOf('*/*') == -1 && config.allows.indexOf(v.type) == -1) {
                    RGX.msg(v.name + ' (' + v.type + ') 类型不允许, 请重新选择!', $.noop, 'hits', 2);
                    return false;
                }
                // 大小验证
                else if (v.size > config.max * 1024) {
                    RGX.msg(v.name + ' (' + parseInt(v.size / 1024) + ' KB) 文件过大, 请重新选择!', $.noop, 'hits', 2);
                    return false;
                }
                else {
                    var key = this.upload_queue.get_hash(v);
                    if (!this.upload_queue.exists(key) && $('#image-' + key).length === 0) {
                        v.hash = key;
                        this.upload_queue.add(v);
                        this.get_images_node().add(v, key);
                    }
                }
            }

            if (this.upload_queue.queue.length > 0) {
                $(this.ele).find('.rgx-album-upbtn').removeAttr('disabled');
            }
        },

        /**
         * 获取图片节点操作对象
         * @return {[type]} [description]
         */
        get_images_node : function () {
            return {

                /**
                 * 实例引用
                 * @type {[type]}
                 */
                album       : this,

                /**
                 * 获取节点结构样式
                 * @return {[type]} [description]
                 */
                get_html : function () {
                    return $('<ul class="rgx-album-images clearfix" id="rgx-album-images"></ul>');
                },

                /**
                 * 替换
                 * @param  {[type]} file [description]
                 * @param  {[type]} key  [description]
                 * @return {[type]}      [description]
                 */
                replace : function (file, key) {
                    var node = $('#image-' + key);
                    if (node.length > 0) {
                        // 替换本地文件
                        if (node.hasClass('not-upload')) {
                            this.album.upload_queue.del_hash(key);
                        }
                        // 替换服务器文件
                        else {
                            this.album.delete_file(node.attr('data-source'));
                        }
                        node.find('img').attr('src', this.album.create_obj_url(file)).attr('data-hash', file.hash);
                        node.addClass('not-upload').attr('id', 'image-' + file.hash);
                    }
                },

                /**
                 * 图片预览
                 * @param {[type]} file [description]
                 */
                add : function (file, key, exists) {
                    exists = exists == undefined ? false : true;
                    var album = this.album.get_album().find('.rgx-album-images'),
                        image = $('<li id="image-' + key + '" draggable="true"><img class="album-preview-image" src=""></li>'),
                        num   = $('<span class="album-preview-num">1</span>'),
                        btns  = $('<span class="album-preview-btns"></span>'),
                        desc  = $('<span class="album-preview-desc">等待上传</span>'),
                        input_desc = $('<input type="text" readonly class="album-desc"/>'),
                        proc     = $('<span class="album-preview-proc"></span>'),
                        rmbtn    = $('<a href="javascript:;" title="移除"    class="album-preview-btn album-preview-rmbtn"><i class="fa fa-trash-o"></i></a>'),
                        modbtn   = $('<a href="javascript:;" title="编辑说明" class="album-preview-btn album-preview-modbtn"><i class="fa fa-pencil"></i></a>'),
                        repbtn   = $('<a href="javascript:;" title="替换图片" class="album-preview-btn album-preview-repbtn"><i class="fa fa-refresh"></i></a>'),
                        coverbtn = $('<a href="javascript:;" title="查看图片" class="album-preview-btn album-preview-coverbtn"><i class="fa fa-image"></i> 设为封面</a>');

                    btns.append(rmbtn).append(repbtn).append(modbtn);
                    image.append(btns).append(desc).append(proc).append(num).append(input_desc);
                    if (this.album.album_config.has_cover) {
                        image.append(coverbtn);
                    }

                    var _album = this.album;

                    // 已上传的文件
                    if (exists) {
                        image.find('img').attr('src', UPLOAD_URL + RGX.thumb(file.url, _album.album_config.thumb));
                        image.find('img').attr('data-source', file.url);
                        image.find('img').attr('data-hash', key);
                        image.find('img').attr('data-fileId', file.file_id);
                        input_desc.val(file.desc);
                    }
                    // 本地文件
                    else {
                        image.addClass('not-upload');
                        image.find('img').attr('src', _album.create_obj_url(file)).attr('data-hash', key);
                    }

                    album.append(image);
                    num.html(image.index() + 1);
                    if (document.getElementById('rgx-album-images') && $('#rgx-album-images li').length > 1) {
                        // album_sort = Sortable.create(document.getElementById('rgx-album-images'), {
                        //     forceFallback : true,
                        //     onUpdate : function (evt) {
                        //         for (var k = 0, lis = $('#rgx-album-images').find('li'), li; li = lis[k]; k ++) {
                        //             $(li).find('.album-preview-num').html(k + 1);
                        //         }
                        //         evt.stopPropagation();
                        //     }
                        // });
                    }

                    /**
                     * 备注说明编辑
                     */
                    modbtn.on('click', function () {
                        var dist = $(this).parents('li').find('input');

                        $('#desc-textarea').val(dist.val());

                        $('#desc-modal .ok').one('click', function(e) {
                            dist.val($('#desc-textarea').val());
                            $('#desc-modal').modal('hide');
                        });
                        $('#desc-modal').css({
                            'z-index'   : 99999
                        });
                        $('#desc-modal').modal();
                    });

                    input_desc.on('click', function () {
                        $(this).parent().find('.album-preview-modbtn').trigger('click');
                    });


                    /**
                     * 封面裁剪
                     */
                    if (this.album.album_config.has_cover) {
                        coverbtn.on('click', function () {
                            var li = $(this).parents('li'),
                                img = li.find('img');

                            if (li.hasClass('not-upload') || li.hasClass('on-upload')) {
                                RGX.msg('请先上传该图片');
                            }
                            else {
                                if (_album.album_config.has_cut) {
                                    $('#cut-image').attr('src', UPLOAD_URL + img.attr('data-source'));
                                    $('#cut-image').attr('data-source', img.attr('data-source'));
                                    _album.image_cut();
                                }
                                else {
                                    _album.album_config.set_cover(img.attr('data-source'));
                                }
                            }
                        });
                    }

                    /**
                     *  图片删除
                     */
                    rmbtn.one('click', function () {
                        var target = $(this).parent().parent().find('img');

                        if (!target.parent().hasClass('not-upload') && !target.parent().hasClass('on-upload')) {
                            _album.delete_file(target.attr('data-source'));
                        }
                        // 本地预览文件删除, 删除任务
                        else if (target.attr('data-hash') != undefined) {
                            if ($(this).parent().parent().hasClass('on-upload')) {
                                _album.ajax_upload.abort();
                            }
                        }

                        _album.upload_queue.del(target.attr('data-hash'));
                        $(this).parents('li').remove();
                        for (var k = 0, lis = $('#rgx-album-images').find('li'), li; li = lis[k]; k ++) {
                            $(li).find('.album-preview-num').html(k + 1);
                        }
                        if ($('#rgx-album-images li').length == 0) {
                            //RGXAlbum.album_hide();
                        }
                    });

                    /**
                     * 图片替换
                     */
                    repbtn.on('click', function () {
                        _album.select_files(false, $(this).parents('li').attr('id').replace('image-', ''));
                    });

                    /**
                     * 插入图片
                     */
                    if (_album.album_config.has_insert) {
                        image.on('click', 'img', function () {
                            if ($(this).parent().hasClass('not-upload') || $(this).parent().hasClass('on-upload')) {
                                RGX.msg('请先上传该图片');
                            }
                            else {
                                _album.album_config.click({
                                    'image'     : $(this).attr('data-source'),
                                    'desc'      : $(this).parent().find('input').val()
                                });
                            }
                        });
                    }

                }
            };
        },

        /**
         * 执行上传
         * @return {[type]} [description]
         */
        exec_upload : function () {
            var file   = this.upload_queue.get(),
                _album = this;

            if (file) {
                var data = new FormData(),
                    img  = $('#image-' + file.hash);

                img.removeClass('not-upload').addClass('on-upload');

                // extra data
                if (!is_empty(this.upload_config.extra)) {
                    for (var k in this.upload_config.extra) {
                        data.append(k, this.upload_config.extra[k]);
                    }
                }

                data.append(file.name, file);
                this.ajax_upload.exec({
                    url     : this.upload_config.url,
                    data    : data,
                    extra   : this.upload_config.extra,
                    success : function (d) {
                        if (d.code == '0') {
                            img.removeClass('on-upload');
                            img.find('.album-preview-proc').stop().css({
                                'width'   : 0,
                                'display' : 'none'
                            });
                            img.find('img').attr('data-source', d.data.url);
                            img.find('img').attr('data-fileId', d.data.file_id);
                        }
                        else {
                            _album.ajax_upload.error_count ++;
                            _album.upload_queue.add(file);
                            img.removeClass('on-upload').addClass('not-upload');
                            _album.upload_config.failure(file, d.msg);
                        }

                        // 避免无限错误重试
                        if (_album.ajax_upload.error_count <= _album.upload_queue.length()) {
                            _album.exec_upload();
                        }
                        else {
                            $('.rgx-album-upbtn').removeAttr('disabled');
                        }
                        if (_album.upload_queue.length() == 0) {
                            _album.upload_config.after();
                        }
                    },
                    failure : function (d) {
                        _album.upload_queue.add(file);
                        img.addClass('not-upload').removeClass('on-upload');
                        _album.get_album().find('.rgx-album-upbtn').removeAttr('disabled');
                    },
                    progress: function (per) {
                        if (per < 100) {
                            img.find('.album-preview-proc').stop().animate({
                                'width'     : per + '%'
                            });
                        }
                    }
                });
            }
            // 没有任务
            else {
                this.get_album().find('.rgx-album-upbtn').removeAttr('disabled');
            }
        },

        /**
         * 初始化
         * @return {[type]} [description]
         */
        init        : function () {
            this.init_upload();
            this.init_album();
            return this;
        },

        /**
         * 相册初始化
         * @return {[type]} [description]
         */
        init_album  : function () {
            // 初始化
            if ($('#' + this.album_config['id']).length == 0) {
                var
                    album   = $('<div id="' + this.album_config['id'] + '" class="rgx-album"></div>'),
                    toolbar = $('<div class="rgx-album-toolbar"></div>'),
                    addbtn  = $('<a href="javascript:;" title="添加图片" class="rgx-album-addbtn"><i class="fa fa-plus"></i> 图片</a>'),
                    upbtn   = $('<a href="javascript:;" title="上传图片" class="rgx-album-upbtn" disabled><i class="fa fa-upload"></i> 开始上传</a></a>'),
                    maxbtn  = $('<a href="javascript:;" title="最大化" class="rgx-album-maxbtn"><i class="fa fa-window-maximize"></i></a>'),
                    minbtn  = $('<a href="javascript:;" title="最小化" class="rgx-album-minbtn"><i class="fa fa-window-minimize"></i></a>');

                toolbar.append(addbtn);

                if (!this.upload_config.auto) {
                    toolbar.append(upbtn);
                }

                toolbar.append(maxbtn).append(minbtn);

                album.append(toolbar).append(this.get_images_node().get_html());

                $(this.ele).append(album);
                var that = this;

                album.attr('data-max', '0');
                album.attr('data-width', album.outerWidth());
                album.attr('data-margin-top', this.album_config['top'] || 20);
                album.attr('data-margin-bottom', this.album_config['bottom'] || 10);

                that.get_album().find('.rgx-album-maxbtn').on('click', function () {
                    if ($(this).parents('.rgx-album').attr('data-max') == '0') {
                        $(this).parents('.rgx-album').attr('data-max', '1');
                        $(this).parents('.rgx-album').attr('data-height', $(this).parents('.rgx-album').outerHeight());
                        $(this).parents('.rgx-album').addClass('rgx-album-fixed').css({
                            'width'    : $(window).width(),
                            'height'   : $(window).height()
                        });
                        $(this).parents('.rgx-album').find('.rgx-album-images').css({
                            'height'        : 'auto',
                            'max-height'    : (parseInt($(window).height() / 145)  ) * 145
                        });
                        $('body').addClass('body-locked');
                    }
                });

                /**
                 * 最小化
                 */
                that.get_album().find('.rgx-album-minbtn').on('click', function () {
                    if ($(this).parents('.rgx-album').attr('data-max') == '1') {
                        $(this).parents('.rgx-album').attr('data-max', '0');
                        $(this).parents('.rgx-album').removeClass('rgx-album-fixed').css({
                            'width'    : $(this).parents('.rgx-album').attr('data-width'),
                            'height'   : 'initial'
                        });
                        $(this).parents('.rgx-album').find('.rgx-album-images').css({
                            'height'        : 'initial',
                            'max-height'    : 145 * 2
                        });
                        $('body').removeClass('body-locked');
                    }
                });

                /**
                 * 上传
                 */
                that.get_album().find('.rgx-album-upbtn').on('click', function () {
                    if (that.upload_queue.length() == '0') {
                        RGX.msg('请先选择图片');
                    }
                    else {
                        $(this).attr('disabled', true);
                        that.ajax_upload.error_count = 0;
                        that.upload_config.before();
                        that.exec_upload();
                    }
                });

                /**
                 * 新增文件
                 */
                that.get_album().find('.rgx-album-addbtn').on('click', function () {
                    that.select_files(true);
                });

            }// init end

            if (this.album_config.images) {
                for (var i = 0, img; img = this.album_config.images[i]; i ++) {
                    var hash = this.upload_queue.get_hash({
                        name : img.url,
                        type : '',
                        size : 0,
                        lastModified : 0
                    });
                    this.get_images_node().add(img, hash, true);
                }
                if (this.album_config.images.length > 0) {
                    this.album_show();
                }
            }

        },

        /**
         * 上传初始化
         * @return {[type]} [description]
         */
        init_upload : function () {
            if ($('#' + this.upload_config.id).length == 0) {
                var node = $('<input type="file" name="files[]" id="' + this.upload_config.id + '" class="rgx-album-input-file"/>');
                if (this.upload_config.multiple) {
                    node.attr('multiple', 'multiple');
                }
                node.attr('accept', this.upload_config.allows.join(','));
                node.css('display', 'none');
                $(this.ele).append(node);
                var _album = this;

                $('#' + this.upload_config.id).on('change', function (e, obj) {
                    var files = this.files;
                    if (typeof(obj) == 'object' && obj.files.length > 0) {
                        files = obj.files;
                    }
                    if ($(this).attr('data-target') && files.length == 1) {
                        var key = $(this).attr('data-target');
                        if (_album.upload_queue.replace(files[0], key)) {
                            _album.get_images_node().replace(files[0], key);
                            if (_album.upload_config.auto) {
                                _album.upload_config.before();
                                _album.exec_upload();
                            }
                        }
                        else {
                            RGX.msg('替换失败了, 所选文件已经存在 !');
                        }
                    }
                    else {
                        _album.album_show();
                        _album.preview_files(files);
                        if (_album.upload_config.auto) {
                            _album.upload_config.before();
                            _album.exec_upload();
                        }
                        $(this).val('');
                    }
                });
            }
        }

    };

    $.fn.RGXAlbum = function (opts) {
        return (new RGXAlbumClass(this, opts)).init();
    };

})(jQuery);