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
    file_sort = null;


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
 * 大文件上传插件
 * @param  {[type]} W [description]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function (W, $) {
    'use strict';

    /**
     * 上传操作对象
     * @type {Object}
     */
    W.RGXUploader = {

        /**
         * 配置
         * @type {Object}
         */
        config : {},

        /**
         * 待上传资源
         * @type {Array}
         */
        queue  : {

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
         * 获取资源地址
         * @param  {[type]} object [description]
         * @return {[type]}        [description]
         */
        create_obj_url : function (object) {
            return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
        },


        chunk : {
            file : null,
            items : [],
            index : 0,
            count : 0,
            size  : 0,
            init : function (file) {
                this.file = file;
                this.size  = RGXUploader.config.chunk_size;
                this.count = Math.ceil(file.size / this.size);
                this.items  = [];
                this.index  = 0;
                for (var i = 0; i < this.count; i ++) {
                    this.items[i] = [i * this.size, Math.min((i + 1) * this.size, this.file.size)];
                }
            },
            is_empty : function () {
                return this.file == null;
            },

            seek : function (i) {
                this.index = i;
            },

            clear : function () {
                this.file = null;
                this.item = [],
                this.index = 0;
                this.count = 0;
                this.size  = 0;
            },

            // 获取分片任务
            get : function (succ, next) {
                if (this.index < this.items.length) {
                    var ret = {},
                        fileReader = new FileReader(),
                        spark = new SparkMD5(),
                        blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,
                        that = this;

                    fileReader.onload = function (e) {
                        spark.appendBinary(fileReader.content || e.target.result);
                        ret['md5'] = spark.end();
                        ret['index'] = that.index;
                        ret['count'] = that.count;
                        succ(ret);
                    };
                    ret.type = this.file.type;
                    ret.name = this.file.name;
                    ret.size = this.file.size;
                    ret.count = this.count;
                    ret.blob = blobSlice.call(this.file, this.items[this.index][0], this.items[this.index][1]);
                    fileReader.readAsBinaryString(ret.blob);
                    this.index ++;
                }
                else {
                    this.file  = null;
                    this.index = 0;
                    this.count = 0;
                    next();
                }
            }
        },

        /**
         * 清除文件选择框
         * @return {[type]} [description]
         */
        clear_input : function () {
            $('#' + this.config.input_id).val('');
        },

        /**
         * 选择图片
         * @param  {[type]} files [description]
         * @return {[type]}       [description]
         */
        on_select : function (files) {
            return files;
        },


        /**
         * 选择文件
         * @return {[type]} [description]
         */
        select_files : function (target) {
            var file_input = $('#' + this.config.input_id);
            if (target) {
                file_input.attr('data-target', target);
                file_input.removeAttr('multiple');
            }
            else {
                file_input.attr('multiple', 'multiple');
                file_input.removeAttr('data-target');
            }
            file_input.trigger('click');
        },

        /**
         * 选择封面
         * @return {[type]} [description]
         */
        select_cover : function (hash) {
            if ($('#uploader-cover-input').length == 0) {
                $('#uploader').append('<input type="file" multiple accept="image/jpeg,image/png" style="display:none" id="uploader-cover-input" />');
            }
            $('#uploader-cover-input').off('change').on('change', function () {
                if (this.files.length == 1 || $('#uploader .uploader-panel-row').length > 1) {
                    RGXUploader.config.select_cover(hash, this.files[0]);
                }
                else if (this.files.length > 1) {
                    RGXUploader.config.select_covers(hash, this);
                }
            });
            $('#uploader-cover-input').trigger('click');
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
                    opts.progress(evt.loaded);
                }
                this.xhr.open("POST", opts.url);
                this.xhr.send(opts.data);
            },

            /**
             * 取消上传
             * @return {[type]} [description]
             */
            abort : function () {
                if (this.xhr != null && this.xhr.readyState < 4) {
                    this.xhr.abort();
                }
            }
        },

        /**
         * 取消上传
         * @return {[type]} [description]
         */
        abort : function () {
            this.ajax_upload.abort();
            this.chunk.clear();
            this.queue.clear();
        },

        /**
         * 上传文件
         * @param  {[type]} hash [description]
         * @return {[type]}      [description]
         */
        upload_file : function () {
            var file = this.chunk.file,
                that = this;

            if (file == null) {
                file = this.queue.get();
                if (file == null) {
                    this.config.empty();
                    return;
                }
            }

            if (this.chunk.is_empty()) {
                this.chunk.init(file);
            }

            this.chunk.get(function (d) {
                var form_data = new FormData();
                form_data.append('chunk_md5', d.md5);
                form_data.append('chunk_blob', d.blob);
                form_data.append('chunk_index', d.index);
                form_data.append('chunk_count', d.count);
                form_data.append('file_name', d.name);
                form_data.append('file_size', d.size);
                form_data.append('file_type', d.type);
                form_data.append('file_ext', d.name.match(/\.(.+)$/)[1]);
                for (var k in RGXUploader.config.upload_extra) {
                    form_data.append(k, RGXUploader.config.upload_extra[k]);
                }
                that.ajax_upload.exec({
                    url  : that.config.upload_url,
                    data : form_data,
                    progress : function (p) {
                        var loaded = (d.index - 1) * that.config.chunk_size + p,
                            per = Math.floor(100 * loaded / d.size);
                        that.config.progress(file.hash, per > 100 ? 100 : per, file.name);
                    },
                    success : function (resp) {
                        if (resp.code == '0') {
                            // 一个文件完整上传成功
                            if (resp.data.file != '') {
                                RGXUploader.config.file_complete(file.hash, resp.data, d.name);
                            }
                        }
                        else {
                            RGXUploader.config.upload_fail(resp.msg, d.name);
                        }
                        if (RGXUploader.queue.queue.length > 0 || RGXUploader.chunk.file) {
                            RGXUploader.upload_file();
                        }
                    },
                    failure : function () {
                        RGXUploader.chunk.seek(RGXUploader.chunk.index - 1);
                    }
                });
            }, function () {
                if (RGXUploader.queue.queue.length > 0) {
                    RGXUploader.upload_file();
                }
                else {
                    RGXUploader.config.all_complete();
                }
            });

        },

        /**
         * 删除文件
         * @param  {[type]} file [description]
         * @param  {[type]} succ [description]
         * @param  {[type]} fail [description]
         * @return {[type]}      [description]
         */
        delete_file : function (file, succ, fail) {
            var data = this.config.upload_extra;
            data.file  = file;
            RGX.ajaxpost({
                 url        : this.config.del_url,
                 data       : data,
                 succ       : succ || function (d) {
                    console.log('删除成功 : ' + file);
                    console.log(d);
                 },
                 fail       : fail || function (d) {
                    console.log('删除失败了 : ' + file);
                 }
            });
        },

        /**
         * 初始化
         * @return {[type]} [description]
         */
        init_input : function () {
            if ($('#' + this.config.input_id).length == 0) {
                var node = $('<input type="file" name="files[]" ' + (this.config.limit > 1 ? 'multiple' : '') + ' id="' + this.config.input_id + '"/>');
                // webkit 内核浏览器会卡....如果指定过多的mime type的话
                node.attr('accept', this.config.mime_types.join(','));
                node.css('display', 'none');
                $('body').append(node);

                node.on('change', function () {
                    if (this.files.length > 0) {
                        var files = RGXUploader.config.select_callback(this.files, $(this).attr('data-target'));
                        for (var i = 0, file; file = files[i]; i ++) {
                            RGXUploader.queue.add(file);
                        }
                        if (files.length > 0) {
                            RGXUploader.upload_file();
                        }
                        else {
                            RGXUploader.config.empty();
                        }
                    }
                });

                if (this.config.select_btn[0] == '.') {
                    $(this.config.select_btn).on('click', function () {
                        RGXUploader.select_files();
                    });
                }
                else if (this.config.select_btn[0] == '#') {
                    $(this.config.select_btn).on('click', function () {
                        RGXUploader.select_files();
                    });
                }
                else {
                    $('#' + this.config.select_btn).on('click', function () {
                        RGXUploader.select_files();
                    });
                }
            }
        },

        /**
         * 初始化
         * @param  {[type]} opts [description]
         * @return {[type]}      [description]
         */
        init : function (opts) {
            // 默认配置
            this.config = $.extend({
                wrapper_id : 'body',
                select_btn : 'select-file-btn',
                mime_types : [],
                file_exts  : [],
                chunk_size : 1024 * 1024 * 2,
                upload_url : '',
                upload_extra : {},
                select_covers : $.noop,
                limit       : 10,
                empty      : function () {
                    alert('请先选择文件');
                },
                file_complete : function (hash, file) {
                    console.log(hash, file);
                },
                upload_fail   : function (d, name) {
                    console.log(d, name);
                },
                all_complete     : function () {
                    console.log('all upload tasks have been completed');
                },
                progress   : function (d) {
                    console.log(d);
                },
                select_callback : this.on_select
            }, opts);

            this.config.input_id = this.config.wrapper_id + '-input';
            this.init_input();
        }

    };
})(window, jQuery);