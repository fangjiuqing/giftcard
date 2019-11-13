// 筛选相关交互处理
// $Id$

var 
    apply_filter = function () {

        var params = [];

        $('.search_type,.search_key').each(function () {
            var val = $(this).attr('data-val');
            if (this.tagName.toUpperCase() == 'INPUT' || this.tagName.toUpperCase() == 'TEXTAREA') {
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
                _filter[$(this).attr('data-key')] = val;
            }
            else {
                _filter[$(this).attr('data-key')] = '';
            }
        });

        for (var key in _filter) {
            if (_filter.hasOwnProperty(key)) {
                var v = $.trim(_filter[key]).replace(/\-/g, '');
                if (v != '' && v != '0') {
                    params.push(key + '-' + encodeURIComponent(v));
                }
            }
        }

        location.href = RGXLIB.url(_url + '-' + params.join('-'));
    }
;

$(function () {

    $('#filter_search_btn').on('click', function () {
        apply_filter();
    });

    // checkbox
    $('.filter-opt').on('click', function () {
        var key = $(this).attr('data-key'),
            val = $(this).attr('data-val');
        if ($.trim(val) == '') {
            if ($(this).hasClass('filter-radio')) {
                _filter[key] = '';
                apply_filter();
                return false;
            }
            $(this).addClass('active').siblings().removeClass('active');
        }
        else if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else {
            $(this).addClass('active');
            if ($(this).hasClass('filter-radio')) {
                _filter[key] = val;
                apply_filter();
                return false;
            }
        }

        _filter[key] = [];
        $('.filter-opt.active[data-key="' + key + '"]').each(function () {
            var val = $.trim($(this).attr('data-val'));
            if (val != '' && val != '0') {
                _filter[key].push($(this).attr('data-val'));
            }
        });
        _filter[key] = _filter[key].join(',');
        apply_filter();
    });

    $('.dpm_opt').on('click', function () {
        $($(this).attr('data-target')).attr('data-val', $(this).attr('data-val'));
        $($(this).attr('data-target')).html($(this).text());;
    });

    if ($('.dpm_opt').length > 0) {
        $('.dpm_opt[data-val="' + _filter['stype'] + '"]').trigger('click');
    }


    /**
     * 分页跳转处理
     */
    $('body').on('click', '.pagination-atag', function (e) {
        var url = $(this).attr('href'),
            callback = $(this).parents('.paging').attr('data-callback');

        if (!$(this).parents('li').hasClass('disabled')) {
            // Btn Go
            if ($(this).attr('data-url') != undefined) {
                var pn  = parseInt($(this).parents('.input-group').find('.paging_pn').val());
                if (isNaN(pn)) {
                    $(this).parents('.input-group').find('.paging_pn').focus();
                    url = null;
                }
                else {
                    url = $(this).attr('data-url') + pn;
                }
            }

            if (url != null && url != 'javascript:;') {
                if (typeof(callback) != 'undefined' && callback != "nil" && callback != "{nil}") {
                    window[callback](url);
                }
                else {
                    location.href = url;
                }
            }
        }

        e.stopPropagation();
        return false;
    });

});