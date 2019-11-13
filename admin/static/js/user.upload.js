if (typeof(jQuery) === 'undefined') {
    throw new Error('RGXAlbum\'s JavaScript requires jQuery');
}
var md5 = md5 || require('md5');

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
}

/**
 * 相册库
 * @param  {[type]} W [description]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
;
(function(W, $) {
    'use strict';

    W.RGXAlbum = W.RGXAlbum || {

        /**
         * 上传配置
         * @type {Object}
         */
        upload_config : {},

        /**
         * 相册管理配置
         * @type {Object}
         */
        album_config  : {},

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
                if (this.hash[key]) {
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
         * 图片裁剪
         * @param  {[type]} url [description]
         * @return {[type]}     [description]
         */
        image_cut : function (source) {
            var image = $('#cut-image'),
                cropBoxData,
                canvasData;

            image.attr('src', UPLOAD_URL + source.attr('data-source'));

            $('#cut-modal').one('shown.bs.modal', function() {
                image.cropper({
                    autoCropArea: 0.5,
                    viewMode: 2,
                    minWidth:500,
                    minHeight:309,
                    width: 500,
                    height:309,
                    aspectRatio: 500 / 309,
                    dragMode: 'crop',
                    ready: function() {
                        image.cropper('setCanvasData', canvasData);
                        image.cropper('setCropBoxData', cropBoxData);
                    }
                });
            }).one('hidden.bs.modal', function() {
                cropBoxData = image.cropper('getCropBoxData');
                canvasData = image.cropper('getCanvasData');
                console.log(cropBoxData, canvasData);
                image.cropper('destroy');
            });

            $('#cut-modal').modal();
        },

        /**
         * 已上传的文件
         * @type {Array}
         */
        album_images  : [],

        /**
         * 初始化
         * @param  {[type]} opts [description]
         * @return {[type]}      [description]
         */
        init : function (opts) {
            this.init_album(opts.album || {});
            this.init_upload(opts.upload || {});
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
         * 图片节点
         * @return {[type]} [description]
         */
        album_images_node : {

            /**
             * 获取节点结构样式
             * @return {[type]} [description]
             */
            get_html : function () {
                return $('<ul class="rgx-album-images clearfix"></ul>');
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
                    node.find('img').attr('src', RGXAlbum.create_obj_url(file)).attr('data-hash', file.hash);
                    node.addClass('not-upload').attr('id', 'image-' + file.hash);
                }
            },

            /**
             * 图片预览
             * @param {[type]} file [description]
             */
            add : function (file, key) {
                var album = RGXAlbum.get_album().find('.rgx-album-images'),
                    image = $('<li id="image-' + key + '" class="not-upload"><img class="album-preview-image" src=""></li>'),
                    btns  = $('<span class="album-preview-btns"></span>'),
                    desc  = $('<span class="album-preview-desc">等待上传</span>'),
                    proc  = $('<span class="album-preview-proc"></span>'),
                    rmbtn    = $('<a href="javascript:;" title="移除"    class="album-preview-btn album-preview-rmbtn"><i class="fa fa-trash-o"></i></a>'),
                    modbtn   = $('<a href="javascript:;" title="编辑说明" class="album-preview-btn album-preview-modbtn"><i class="fa fa-pencil"></i></a>'),
                    repbtn   = $('<a href="javascript:;" title="替换图片" class="album-preview-btn album-preview-repbtn"><i class="fa fa-refresh"></i></a>'),
                    coverbtn = $('<a href="javascript:;" title="设为封面" class="album-preview-btn album-preview-coverbtn"><i class="fa fa-image"></i></a>');

                btns.append(rmbtn).append(repbtn).append(coverbtn).append(modbtn);
                image.append(btns).append(desc).append(proc);

                image.find('img').attr('src', RGXAlbum.create_obj_url(file)).attr('data-hash', key);

                album.append(image);


                /**
                 * 封面裁剪
                 */
                coverbtn.on('click', function () {
                    var li = $(this).parents('li'),
                        img = li.find('img');

                    if (li.hasClass('not-upload') || li.hasClass('on-upload')) {
                        RGX.msg('请先上传该图片');
                    }
                    else {
                        RGXAlbum.image_cut(img);
                    }
                });

                /**
                 *  图片删除
                 */
                rmbtn.one('click', function () {
                    var target = $(this).parent().parent().find('img');
                    // 本地预览文件删除, 删除任务
                    if (target.attr('data-hash') != undefined) {
                        RGXAlbum.upload_queue.del(target.attr('data-hash'));
                        if ($(this).parent().parent().hasClass('on-upload')) {
                            RGXAlbum.ajax_upload.abort();
                        }
                    }
                    else {
                        // @todo 服务端文件删除
                        console.log('发送文件删除请求', target.attr('data-source'));
                    }
                    RGXAlbum.upload_queue.del(target.attr('data-hash'));
                    $(this).parents('li').remove();
                });

                /**
                 * 图片替换
                 */
                repbtn.on('click', function () {
                    RGXAlbum.select_files(false, $(this).parents('li').attr('id').replace('image-', ''));
                });
            }
        },

        /**
         * 获取相册节点对象
         * @return {[type]} [description]
         */
        get_album : function () {
            return $('#' + this.album_config['id']);
        },

        /**
         * 初始化相册插件配置
         * @param  {[type]} config [description]
         * @return {[type]}        [description]
         */
        init_album  : function (config) {
            this.album_config = $.extend({
                id         : 'RGX-album-' + parseInt(Math.random() * 1000),
                wrapper_id : 'body'
            }, config);

            // 初始化
            if ($('#' + this.album_config['id']).length == 0) {
                var 
                    album   = $('<div id="' + this.album_config['id'] + '" class="rgx-album"></div>'),
                    toolbar = $('<div class="rgx-album-toolbar"></div>'),
                    addbtn  = $('<a href="javascript:;" title="添加图片" class="rgx-album-addbtn"><i class="fa fa-plus"></i> 图片</a>'),
                    upbtn   = $('<a href="javascript:;" title="上传图片" class="rgx-album-upbtn" disabled><i class="fa fa-upload"></i> 开始上传</a></a>'),
                    maxbtn  = $('<a href="javascript:;" title="最大化" class="rgx-album-maxbtn"><i class="fa fa-window-maximize"></i></a>'),
                    minbtn  = $('<a href="javascript:;" title="最小化" class="rgx-album-minbtn"><i class="fa fa-window-minimize"></i></a>');

                toolbar.append(addbtn).append(upbtn).append(maxbtn).append(minbtn);

                album.append(toolbar).append(this.album_images_node.get_html());

                $(this.album_config['wrapper_id']).append(album);
                album.attr('data-max', '0');
                album.attr('data-width', album.parent().outerWidth());
                album.attr('data-margin-top', this.album_config['top'] || 20);
                album.attr('data-margin-bottom', this.album_config['bottom'] || 10);

                $('.rgx-album-maxbtn').on('click', function () {
                    if ($(this).parents('.rgx-album').attr('data-max') == '0') {
                        $(this).parents('.rgx-album').attr('data-max', '1');
                        $(this).parents('.rgx-album').attr('data-height', $(this).parents('.rgx-album').outerHeight());
                        $(this).parents('.rgx-album').css({
                            'position' : 'fixed',
                            'width'    : $(window).width(),
                            'height'   : $(window).height(),
                            'left'     : 0,
                            'top'      : 0,
                            'z-index'  : 99999
                        });
                    }
                });

                /**
                 * 最小化
                 */
                $('.rgx-album-minbtn').on('click', function () {
                    if ($(this).parents('.rgx-album').attr('data-max') == '1') {
                        $(this).parents('.rgx-album').attr('data-max', '0');
                        $(this).parents('.rgx-album').css({
                            'position' : 'static',
                            'width'    : $(this).parents('.rgx-album').attr('data-width'),
                            'height'   : $(this).parents('.rgx-album').attr('data-height'),
                            'z-index'  : 1
                        });
                    }
                });

                /**
                 * 上传
                 */
                $('.rgx-album-upbtn').on('click', function () {
                    if (RGXAlbum.upload_queue.length() == '0') {
                        RGX.msg('请先选择图片');
                    }
                    else {
                        $(this).attr('disabled', true);
                        RGXAlbum.ajax_upload.error_count = 0;
                        RGXAlbum.exec_upload();
                    }
                });

                /**
                 * 新增文件
                 */
                $('.rgx-album-addbtn').on('click', function () {
                    RGXAlbum.select_files(RGXAlbum.upload_config.multiple);
                });
            }// init end


        },

        /**
         * 初始化上传配置
         * @param  {[type]} config [description]
         * @return {[type]}        [description]
         */
        init_upload : function (config) {
            this.upload_config = $.extend({
                id         : 'RGX-upload-' + parseInt(Math.random() * 1000),
                allows     : ['*/*'],
                max        : 10240,        // 最大(KB)
                multiple   : false,        // 是否多文件
                length     : 50,           // 最多(个)
                extra      : {},
                preview    : $.noop,
                success    : $.noop,
                after      : $.noop,
                progress   : $.noop,
                failure    : function () {
                    throw new Error('服务端返回异常');
                }
            }, config);

            if ($('#' + this.upload_config.id).length == 0) {
                var node = $('<input type="file" name="files[]" id="' + this.upload_config.id + '"/>');
                if (this.upload_config.multiple) {
                    node.attr('multiple', 'multiple');
                }
                node.attr('accept', this.upload_config.allows.join(','));
                node.css('display', 'none');
                $('body').append(node);

                node.on('change', function () {
                    if ($(this).attr('data-target') && this.files.length == 1) {
                        var key = $(this).attr('data-target');
                        if (RGXAlbum.upload_queue.replace(this.files[0], key)) {
                            RGXAlbum.album_images_node.replace(this.files[0], key);
                        }
                        else {
                            RGX.msg('替换失败了, 所选文件已经存在 !');
                        }
                    }
                    else {
                        RGXAlbum.preview_files(this.files, RGXAlbum.upload_config);
                    }
                });

                $(this.upload_config.btn_id).on('click', function () {
                    RGXAlbum.select_files(RGXAlbum.upload_config.multiple);
                });
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
        preview_files : function (files, config) {
            if (files.length > config.length) {
                RGX.msg('您选择的文件过多,最多可选' + config.length + '个');
                return false;
            }

            var queue = [],
                data  = new FormData();

            for (var i = 0, v; v = files[i]; i ++) {
                // 类型验证
                if (config.allows.indexOf(v.type) == -1) {
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
                    if (!this.upload_queue.exists(key)) {
                        v.hash = key;
                        this.upload_queue.add(v);
                        this.album_images_node.add(v, key);
                    }
                }
            }

            if (this.upload_queue.queue.length > 0) {
                $('.rgx-album-upbtn').removeAttr('disabled');
            }
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
            xhr : null,

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
         * 执行上传
         * @return {[type]} [description]
         */
        exec_upload : function () {
            var file = this.upload_queue.get();
            if (file) {
                var data = new FormData(),
                    img  = $('#image-' + file.hash);

                img.removeClass('not-upload').addClass('on-upload');

                data.append('extra', this.upload_config.extra);
                data.append(file.name, file);

                this.ajax_upload.exec({
                    url     : this.upload_config.url,
                    data    : data,
                    extra   : this.upload_config.extra,
                    success : function (d) {
                        if (d.code == '0') {
                            img.removeClass('on-upload');
                            img.find('img').attr('data-source', d.data.url);
                        }
                        else {
                            RGXAlbum.ajax_upload.error_count ++;
                            RGXAlbum.upload_queue.add(file);
                            img.removeClass('on-upload').addClass('not-upload');
                            RGXAlbum.upload_config.failure(file, d.msg);
                        }

                        // 避免无限错误重试
                        if (RGXAlbum.ajax_upload.error_count <= RGXAlbum.upload_queue.length()) {
                            RGXAlbum.exec_upload();
                        }
                        else {
                            $('.rgx-album-upbtn').removeAttr('disabled');
                        }
                    },
                    failure : function (d) {
                        RGXAlbum.upload_queue.add(file);
                        img.addClass('not-upload').removeClass('on-upload');
                        $('.rgx-album-upbtn').removeAttr('disabled');
                    },
                    progress: function (per) {
                        if (per < 100) {
                            img.find('.album-preview-proc').animate({
                                'width'     : per + '%'
                            });
                        }
                        else {
                            img.find('.album-preview-proc').animate({
                                'width'   : 0,
                                'display' : 'none'
                            });
                        }
                    }
                });
            }
            // 没有任务
            else {
                $('.rgx-album-upbtn').removeAttr('disabled');
            }
        }
    };

})(window, jQuery);