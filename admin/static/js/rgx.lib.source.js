;
(function(W) {
    W.RGXLIB = {

        php : {
            vsprintf    : require('locutus/php/strings/vsprintf'),
            substr      : require('locutus/php/strings/substr'),
            strpos      : require('locutus/php/strings/strpos'),
            isset       : require('locutus/php/var/isset'),
            empty       : require('locutus/php/var/empty'),
        },

        // generate url
        url : function () {
            var params = [],
                uri = arguments[0],
                config = window._route;

            if (typeof(arguments[1]) == 'object') {
                params = arguments[1];
            }
            else {
                for (var i = 1; i < arguments.length; i++) {
                    params.push(arguments[i]);
                }
            }

            var prefix = config.app_url,
                suffix = config.suf;

            if (this.php.substr(uri, -1) == '~') {
                uri = this.php.substr(uri, 0, -1);
                suffix = '';
            }

            var expr = uri.split('-'),
                module = expr.shift(),
                pos = false;

            // 相对路径
            if (this.php.substr(module, 0, 1) == '@') {
                prefix = config['path'];
                module = this.php.substr(module, 1);
            }
            // admin.system-login
            else if ((pos = this.php.strpos(module, '.')) !== false) {
                var host_keys = config['host'].split('.');
                if (host_keys.length > 2) {
                    host_keys.shift();
                }
                var host = this.php.substr(module, 0, pos) + "." + host_keys.join('.');
                var prefix = config['scheme'] + '://' + host + config['path'];
                module = this.php.substr(module, pos + 1);
            }

            // admin/user-login
            if ((pos = this.php.strpos(module, '/')) !== false) {
                prefix += this.php.substr(module, 0, pos + 1);
                module = this.php.substr(module, pos + 1);
            }

            var action = this.php.empty(expr) ? config['def_act'] : expr.shift(),
                query = [];

            for (var i = 0; i < expr.length; i += 2) {
                if (!this.php.isset(expr[i + 1])) {
                    break;
                }
                query.push(expr[i] + config['pp_sep'] + expr[i + 1]);
            }

            if (!this.php.empty(query)) {
                query = config['ap_sep'] + query.join(config['pg_sep']);
            }

            var script_file = config['rewrite'] ? '' : 'index.php/',
                url = [prefix, script_file, module, config['ma_sep'], action, query ? query : '', suffix].join('');

            return params.length > 0 ? this.php.vsprintf(url, params) : url;
        }

    };
})(window)
