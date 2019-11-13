(function($){
    /** 获取登录信息 */
    $.getLogin = function(){
        $.ajax({
            'url': check_login,
            'async' : true,
            'dataType' : 'json',
            'success' : function (data) {
                if(data.code == 200 ) {
                    return true;
                }else{
                    return false;
                }
            }
        });

        return false;
    }

    /** 发起登录 */
    $.doLogin = function (username , password) {
        var url = "{url:'login-submit-~'}"

        var token = false;
        $.ajax({
            'url': login_url,
            'async' : false,
            'method' : 'post',
            'data' : 'username=' + username + '&password=' + password,
            'dataType' : 'json',
            'success' : function (data) {
                console.log(data)
                localStorage.setItem('user', data);
                result = true;
            }
        });

        return result;
    }

    $.getParamsStorage = function ( key ) {
        var data = localStorage.getItem(key);
        if ( data != undefined ) {
            return $.parseJSON(data);
        }
        return undefined;
    }

    $.setParamsStorage = function ( key , data ) {
        return localStorage.setItem(key , JSON.stringify(data));
    }

    /** 计算两个日期之间相差多少天 */
    // 转换为yyyy/MM/dd格式
    $.diffDays = function ( sDate1, sDate2 ) {
        var aDate, oDate1, oDate2, iDays;
        aDate = sDate1.split("/");
        oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);
        aDate = sDate2.split("/");
        oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);
        iDays = parseFloat(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24).toFixed(1); //把相差的毫秒数转换为天数

        return iDays;
    }
})(jQuery);