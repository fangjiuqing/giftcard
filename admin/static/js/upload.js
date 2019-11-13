if (typeof(jQuery) === 'undefined') {
    throw new Error('RGXUpload\'s JavaScript requires jQuery');
}
/**
 * JS上传库
 * @param  {[type]} W [description]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
;
(function(W, $) {
    'use strict';

    W.RGXUpload = W.RGXUpload || {

        /**
         * 初始化输入框
         * @param  {[type]} opts [description]
         * @return {[type]}      [description]
         */
        insert_input : function (opts) {
            if ($('#' + opts.id).length == 0) {
                var node = $('<input type="file" name="files[]" id="' + opts.id + '"/>');
                if (opts.multiple) {
                    node.attr('multiple', 'multiple');
                }
                node.attr('accept', opts.allows.join(','));
                node.css('display', 'none');
                $('body').append(node);
                node.on('change', function () {
                    if (this.files.length > 0) {
                        RGXUpload.upload_files(opts, this.files);
                    }
                });
            }
            return $('#' + opts.id);
        },

        /**
         * 上传文件
         * @param  {[type]} opts  [description]
         * @param  {[type]} files [description]
         * @return {[type]}       [description]
         */
        upload_files : function (opts, files) {

            if (files.length > opts.length) {
                RGX.msg('您选择的文件过多,最多可选' + opts.length + '个');
                return false;
            }

            var queue = [],
                error = false,
                data  = new FormData();

            for (var i = 0, v; v = files[i]; i ++) {
                // 类型验证
                if (opts.allows.indexOf(v.type) == -1) {
                    RGX.msg(v.name + ' (' + v.type + ') 类型不允许, 请重新选择!', $.noop, 'hits', 2);
                    error = true;
                    return false;
                }
                // 大小验证
                else if (v.size > opts.max * 1024) {
                    RGX.msg(v.name + ' (' + parseInt(v.size / 1024) + ' KB) 文件过大, 请重新选择!', $.noop, 'hits', 2);
                    error = true;
                    return false;
                }
                data.append(v.name, v);
            }

            if (!error && data.length == 0) {
                RGX.msg('无可用文件,请重新选择文件!', $.noop, 'hits', 2);
                return;
            }

            opts.after();
            // 预览
            opts.preview(files);

            if (typeof(opts.extra) == 'string') {
                data.append('extra', opts.extra);
            }
            else {
                for (var k in opts.extra) {
                    if (opts.extra.hasOwnProperty(k)) {
                        data.append(k, opts.extra[k]);
                    }
                }
            }

            var xhr = new XMLHttpRequest();

            // 处理完成
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {  
                    opts.success(JSON.parse(xhr.responseText));  
                }
                else if (xhr.readyState == 4 && xhr.status != 200) {
                    opts.failure();
                }
            }
            // 进度条
            xhr.upload.onprogress = function (evt) {
                var loaded = evt.loaded;
                var tot = evt.total;
                var per = Math.floor(100 * loaded / tot);
                opts.progress(per);
            }
            xhr.open("POST", opts.url);
            xhr.send(data);
        },

        /**
         * 选择文件
         * @param  {[type]} opts [description]
         * @return {[type]}      [description]
         */
        select_file : function (opts) {
            opts = $.extend({
                'id'        : 'upload-tmp-' + parseInt(Math.random() * 1000),
                'allows'    : ['*/*'],
                'max'       : 10240,        // 最大(KB)
                'multiple'  : false,        // 是否多文件
                'length'    : 32,           // 最多(个)
                'extra'     : {},
                'preview'   : $.noop,
                'success'   : $.noop,
                'after'     : $.noop,
                'progress'  : $.noop,
                'failure'   : function () {
                    throw new Error('服务端返回异常');
                }
            }, opts);
            this.insert_input(opts).trigger('click');
        },

        /**
         * 获取资源地址
         * @param  {[type]} object [description]
         * @return {[type]}        [description]
         */
        create_obj_url : function (object) {
            return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
        }
    };

})(window, jQuery);