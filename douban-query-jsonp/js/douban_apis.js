/* Douban API Javascript Library 0.2

Copyright (2007) Douban Inc.  All rights reserved.

Some code is copied from jQuery 1.2.1 ( by John Resig ) which is licensed under the MIT license.
*/

(function() {




    var isFunction = function(fn) {
        return !!fn && typeof fn != "string" && !fn.nodeName && fn.constructor != Array && /function/i.test(fn + "");
    }






    var buildURL = function(url, params) {
        var tmp = url.split("?"); // 分解url,分解为路径+参数
        var uri = tmp[0]; // 取出域名+路径,资源定位
        var ps = null;
        if (tmp.length > 1) ps = tmp[1].split("&"); // 分解参数

        var pnames = uri.match(/{\w+}/g);
        
        if (pnames != null) {
            for (var i = 0; i < pnames.length; ++i) {
                var pn = pnames[i];
                var ppn = pnames[i].match(/{(\w+)}/)[1];
                if (!params[ppn]) return null;
                else uri = uri.replace(pn, params[ppn]);
            }
        }

        if (!ps) return uri; // 如果url后面没有参数，则返回该url
        
        var re_ps = [];
        for (var i = 0; i < ps.length; ++i) {
            var tmp = ps[i].match(/{(\w+)}/);
            if (tmp == null) re_ps.push(ps[i]);
            else {
                var pn = tmp[0];
                var ppn = tmp[1];
                if (params[ppn]) re_ps.push(encodeURI(ps[i].replace(pn, params[ppn])));
            }
        }

        if (re_ps.length > 0) return [uri, re_ps.join("&")].join("?");

        else return uri;
    }





    var jsc = (new Date).getTime();





    var buildTempFunction = function(cb) {
        var jsonp = "jsonp" + jsc++; // 生成随机参数字符串，格式为“jsonp2342342347”，作为 callback 的 value
        window[jsonp] = function(data) {
            cb(data);
            // Garbage collect
            window[jsonp] = undefined;
            try {
                delete window[jsonp];
            } catch (e) {}
        };
        return jsonp; // 返回该
    }



    // 发送动态 <script> 请求，可以实现 GET 跨域

    var sendScriptRequest = function(url) {
        var head = document.getElementsByTagName("head")[0]; // 获取 DOM 树上的 <head> 节点，添加[0]是因为获取到的是一个 HTMLCollection 对象
        var script = document.createElement("script"); // 创建 <script> 标签
        script.src = url; // 设置 src 属性
        script.charset = 'utf-8'; // 设置 charset
        head.appendChild(script); // 将 <script> 标签添加至 <head> 之前 ？？？为什么要放到 <head> 前面，而不是 <body> 前面
    }



    // 格式化参数

    var formatParams = function(params) {
        if (isFunction(params.callback)) params.callback = buildTempFunction(params.callback);  // 令callbcak=jsonp234234234，生成随机回调函数
        if (!params.apikey) params.apikey = api_obj.apikey;
        return params;
    }



    // 发送请求

    var send = function(url, params) {
        var url = buildURL(url, params);  // 获取经 buildURL() 处理的 url
        if (url != null) sendScriptRequest(url); // 如果传入了 url，则调用 sendScriptRequest() 发送请求
    }










    var apikey = '';
    var namespace = 'DOUBAN';
    var obj = {
        apikey: apikey
    };
    var baseUri = 'https://api.douban.com/';
    var pp = 'start-index={startindex}&max-results={maxresults}';
    var sp = 'q={keyword}&' + pp;
    var pubp = 'published-min={publishedmin}&published-max={publishedmax}';
    var updp = 'updated-min={updatedmin}&updated-max={updatedmax}';
    var pup = pubp + '&' + updp;
    var ratp = 'rating-min={ratingmin}&rating-max={ratingmax}';
    var cp = 'apikey={apikey}&alt=xd&callback={callback}';
    var apis = {
        getUser: {
            url: baseUri + 'people/{id}'
        },
        searchUsers: {
            url: baseUri + 'people?' + sp
        },
        getBook: {
            url: baseUri + 'book/subject/{id}'
        },
        getISBNBook: {
            url: baseUri + 'book/subject/isbn/{isbn}'
        },
        searchBooks: {
            url: baseUri + 'book/subjects?tag={tag}&' + sp
        },
        getMovie: {
            url: baseUri + 'movie/subject/{id}'
        },
        searchMovies: {
            url: baseUri + 'movie/subjects?tag={tag}&' + sp
        },
        getMusic: {
            url: baseUri + 'music/subject/{id}'
        },
        searchMusic: {
            url: baseUri + 'music/subjects?tag={tag}&' + sp
        },
        getReview: {
            url: baseUri + 'review/{id}'
        },
        getUserReviews: {
            url: baseUri + 'people/{uid}/reviews?' + pup + '&' + pp
        },
        getBookReviews: {
            url: baseUri + 'book/subject/{sid}/reviews?' + pup + '&' + pp
        },
        getISBNBookReviews: {
            url: baseUri + 'book/subject/isbn/{isbn}/reviews?' + pup + '&' + pp
        },
        getMovieReviews: {
            url: baseUri + 'movie/subject/{sid}/reviews?' + pup + '&' + pp
        },
        getMusicReviews: {
            url: baseUri + 'music/subject/{sid}/reviews?' + pup + '&' + pp
        },
        getCollection: {
            url: baseUri + 'people/{uid}/collection/{cid}'
        },
        getUserCollection: {
            url: baseUri + 'people/{uid}/collection?cat={cat}&tag={tag}&status={status}&' + updp + '&' + ratp + '&' + pp
        },
        getBookTags: {
            url: baseUri + 'book/subject/{id}/tags?' + pp
        },
        getISBNBookTags: {
            url: baseUri + 'book/subject/isbn/{isbn}/tags?' + pp
        },
        getMovieTags: {
            url: baseUri + 'movie/subject/{id}/tags?' + pp
        },
        getMusicTags: {
            url: baseUri + 'music/subject/{id}/tags?' + pp
        },
        getUserBookTags: {
            url: baseUri + 'people/{id}/tags?cat=book&' + pp
        },
        getUserMovieTags: {
            url: baseUri + 'people/{id}/tags?cat=movie&' + pp
        },
        getUserMusicTags: {
            url: baseUri + 'people/{id}/tags?cat=music&' + pp
        }
    };





    for (var name in apis)
        if (apis[name].url.search(/\?/) != -1) apis[name].url = apis[name].url + '&' + cp;
        else apis[name].url = apis[name].url + '?' + cp;



    if (!window[namespace]) window[namespace] = {} // 如果 window.DOUBAN 没有被占用，则初始化 window.DOUBAN



    var api_obj = window[namespace]; // 令 api_obj === window.DOUBAN



    for (var name in obj) api_obj[name] = obj[name]; // 将 obj 拷贝至 api_obj



    for (var name in apis)

        // 初始化 api_obj 中的方法，即生成 window.DOUBAN 全局对象（因为 api_obj === window.DOUBAN ），可用来调用
        // 此处使用立即执行函数，将配置好的的 apis 对象中的 url 传入 api_obj 中，生成与 apis 对象属性名称一样的方法

        api_obj[name] = (function(url) {
            return function(params) {
                send(url, formatParams(params));
            };
        })(apis[name].url)
})()




