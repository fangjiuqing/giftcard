;
/**
 * 地区选择控件
 * @param  {[type]} W [description]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
$.fn.region = function (opts) {
    window['rgx_region_config' + this.attr('id')] = {
        config : {},
        wrap : null,
        result : [],
        label  : [],
        set_result : function (text, d) {
            var id    = parseInt(d.id),
                level = parseInt(d.level) - 1;
            this.label[level] = text;
            this.result[level] = {
                id   : id,
                text : text
            };
        },
        hide : function () {
            this.wrap.find('.rgx-region-tab').hide();
        },
        show : function () {
            this.wrap.find('.rgx-region-tab').show();
        },
        set_label : function () {
            this.wrap.find('.rgx-region-input').val(this.label.join(" - "));
        },
        set_active : function (index) {
            this.wrap.find('.rgx-region-tab-header-li').eq(index).find('a').trigger('click');
        },
        get_html : function (url, index) {
            var wrap = this.wrap;
            $.getJSON(url, function (d) {
                if (d.code == '0') {
                    wrap.find('.rgx-region-tab-content-div').eq(index).html(d.data);
                }
            });
        },
        init : function (wrap, opts) {
            this.config = $.extend({
                url         : '#',
                init_url    : '#',
                success     : $.noop,
                input_class : null,
                tabs        : [],
                label       : '',
            }, opts);
            if (wrap.find('.rgx-region').length === 0) {
                this.wrap = wrap;
                this.wrap.html([
                    '<div class="rgx-region">',
                        '<input type="text" class="rgx-region-input form-control" placeholder="选择地区" value="', this.config.label, '"/>',
                        '<div class="rgx-region-tab">',
                            '<ul class="rgx-region-tab-header">',
                            '</ul>',
                            '<div class="rgx-region-tab-content">',
                            '</div>',
                        '</div>',
                    '</div>'
                ].join(""));

                this.wrap.css({
                    'position'  : 'relative'
                });
                this.wrap.find('.rgx-region').css({
                    'width'         : this.config.wrap_width || 480,
                    'top'           : this.config.top || 0
                });

                this.wrap.find('.rgx-region-tab').css({
                    'width'         : 480,
                    'top'           : this.wrap.find('.rgx-region-input').outerHeight() + 1,
                    'display'       : 'none'
                });

                for (var i = 0, tab; tab = this.config.tabs[i]; i ++) {
                    this.wrap.find('.rgx-region-tab-header').append([
                            '<li class="rgx-region-tab-header-li" data-id="', i, '">',
                                '<a href="javascript:;">', tab, '</a>',
                            '</li>'
                        ].join(""));
                    this.wrap.find('.rgx-region-tab-content').append([
                            '<div class="rgx-region-tab-content-div" data-id="', i, '" style="display: none"></div>'
                        ].join(""));
                }

                var that = this;

                this.wrap.find('.rgx-region-input').on('focus', function () {
                    that.show();
                });

                this.wrap.find('.rgx-region-input').on('keydown', function () {
                    return false;
                });

                this.wrap.find('.rgx-region').on('mouseleave', function () {
                    //that.hide();
                });

                this.wrap.find('.rgx-region-tab-header-li a').on('click', function () {
                    $(this).parent().addClass('active').siblings().removeClass('active');
                    var index = $(this).parent().index(),
                        target = $(this).parents('.rgx-region-tab').find('.rgx-region-tab-content-div').eq(index);
                        $(target).show().siblings().hide();
                });

                this.wrap.on('click', '.rgx-region-row', function () {
                    var index = parseInt($(this).parents('.rgx-region-tab-content-div').attr('data-id')) + 1,
                        id    = $(this).attr('data-id'),
                        wrap  = $(this).parents('.rgx-region');
                        $(this).addClass('active').siblings().removeClass('active');
                        that.set_result($.trim($(this).text()), $(this).data());
                        if ($(this).attr('data-id') == '0') {
                            that.set_label();
                            that.hide();
                            that.config.success(that.result);
                            return true;
                        }
                        // 有下一级
                        if (wrap.find('.rgx-region-tab-header-li').eq(index).length > 0) {
                            wrap.find('.rgx-region-tab-header-li').eq(index).find('a').trigger('click');
                            var divs = wrap.find('.rgx-region-tab-content-div');
                            for (var i = 0, node; node = divs[i]; i ++) {
                                if ($(node).index() > index) {
                                    $(node).html('');
                                }
                            }
                            $.getJSON(that.config.url + id, function (d) {
                                if (d.code == '0') {
                                    wrap.find('.rgx-region-tab-content-div').eq(index).html(d.data);
                                    if (d.data == '') {
                                        that.set_label();
                                        that.hide();
                                        that.config.success(that.result);
                                    }
                                }
                            });
                        }
                        else {
                            that.set_label();
                            that.hide();
                            that.config.success(that.result);
                        }
                });
            }

            this.set_active(0);
            this.get_html(this.config.init_url, 0);

            return this;
        }
    }.init(this, opts);
}