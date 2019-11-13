$(function () {
    
    $('.select_category_plugin .category_tabs a').hover(function () {
        if (!$(this).parents('li').hasClass('active')) {
            $(this).parents('.select_category_plugin').find('.category_content').hide();
            $(this).parents('.category_tabs').find('li').removeClass('active');
            $(this).parents('li').addClass('active');
            $(this).parents('.select_category_plugin').find('.category_content').eq($(this).parent().index()).show();
        }
    });

    /**
     * 子类点击
     * @param  {[type]} ) 
     * @return {[type]}   [description]
     */
    $('.select_category_plugin .category_contents a.category_name').on('click', function () {
        var cp = $(this).parents('.select_category_plugin'),
            target = $('#' + cp.attr('data-target')),
            label = $('#' + cp.attr('data-label'));

        $(this).addClass('active');
        $(this).parents('.category_contents').find('a.category_name').removeClass('active');
        $(this).parents('.select_category_plugin').hide();
        label.find('span.value').html(cp.find('.category_tabs li.active a').text() + ' - ' + $(this).text());
        target.val($(this).attr('data-cat-id'));
    });

});