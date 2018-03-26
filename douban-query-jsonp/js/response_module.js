!function () {
    let view = View({
        showArea: $('#show-data-area'),
        init: function () {
            view.images = $('.image');
        },
        renderData: function () {
            if (!model.data.total){
                this.render404Page();
            } else if (!model.data.count) {
                this.renderTheLastPage();
            } else {
                this.showArea.empty();
                this.renderHTML(model.data.count);
                this.renderBackground(model.data.count);
            }
        },
        renderHTML: function (number) {
            switch (model.option) {
                case 'books': model.initBooksTemplete(number); break;
                case 'movies': model.initMoviesTemplete(number); break;
                case 'musics': model.initMusicsTemplete(number); break;
            }
            for (let i = 0; i < number; i++) {
                this.showArea.append(model.templete[model.option][i]);
            }
        },
        renderBackground: function (number) {
            this.init();
            for (let i = 0; i < number; i++) {
                $(this.images[i]).css(model.propertyName.bg, model.propertyValue.bg[i]);
            }
            this.images.css(model.propertyName.bgSize, model.propertyValue.bgSize);
            this.homepage.addClass(model.className.hide);
        },
        renderTheLastPage: function () {
            alert(model.theLastPage);
        },
        render404Page: function () {
            this.homepage.removeClass(model.className.loading).addClass(model.className.notFound);
            setTimeout(function (){
                confirm(model.jumpToGithub) ? window.location.href = model.githubSite : window.location.reload();
            },1000);
        }
    });
    let model = Model({
        githubSite: 'https://github.com/CaptainInPHW/douban-query-jsonp/',
        jumpToGithub: '哎呀，没有找到呢，客官要不要去我的 GitHub 一探究竟呀？',
        theLastPage: '客官，您翻到最后一页了，真厉害呢！',
        notFound: '暂无',
        className: {
            loading: 'site-loading',
            notFound: 'site-not-found',
            hide: 'site-homepage-hide'
        },
        propertyName: {
            bg: 'background',
            bgSize: 'background-size'
        },
        propertyValue: {
            bg: [],
            bgSize: 'contain',
        },
        data: {
            total: 0,
            count: undefined,
            content: []
        },
        templete: {
            books: [],
            movies: [],
            musics: []
        },
        init: function (json) {
            this.getOption(view);
            this.getSearchContent(view);
            this.data.total = json.total;
        },
        initBooksTemplete: function (number) {
            for (let i = 0; i < number; i++) {
                this.templete.books[i] = `<div class="col-12 col-md-6 item"><div class="row"><div class="col-4 col-md-3 image"></div><div class="col-8 col-md-9"><ul class="list-group"><li class="list-group-item"><a href=${model.data.content[i].url} class="title">${model.data.content[i].title}</a></li><li class="list-group-item author">作者：<span class="author-name">${model.data.content[i].author}</span></li><li class="list-group-item publisher">出版社：<span class="publisher-name">${model.data.content[i].publisher}</span></li><li class="list-group-item pubdate">出版年月：<span class="date">${model.data.content[i].pubdate}</span></li><li class="list-group-item price">定价：<span class="currency-icon">￥</span><span class="price-number">${model.data.content[i].price}</span></li><li class="list-group-item rating">评分：<span class="average-rating">${model.data.content[i].rating}</span></li><li class="list-group-item ISBN">ISBN：<span class="ISBN-number">${model.data.content[i].ISBN}</span></li></ul></div></div></div>`;
            }
        },
        initMoviesTemplete: function (number) {
            for (let i = 0; i < number; i++) {
                this.templete.movies[i] = `<div class="col-12 col-md-6 item"><div class="row"><div class="col-4 col-md-3 image"></div><div class="col-8 col-md-9"><ul class="list-group"><li class="list-group-item"><a href=${model.data.content[i].url} class="title">${model.data.content[i].title}</a></li><li class="list-group-item director">导演：<a href=${model.data.content[i].directorUrl} class="director-name">${model.data.content[i].director}</a></li><li class="list-group-item cast">主演：<span class="cast-name">${model.data.content[i].cast}</span></li><li class="list-group-item pubdate">上映时间：<span class="date">${model.data.content[i].pubdate}</span></li><li class="list-group-item genre">类型：<span class="genre-name">${model.data.content[i].genre}</span></li><li class="list-group-item rating">评分：<span class="average-rating">${model.data.content[i].rating}</span></li></ul></div></div></div>`;
            }
        },
        initMusicsTemplete: function (number) {
            for (let i = 0; i < number; i++) {
                this.templete.musics[i] = `<div class="col-12 col-md-6 item"><div class="row"><div class="col-4 col-md-3 image"></div><div class="col-8 col-md-9"><ul class="list-group"><li class="list-group-item"><a href=${model.data.content[i].url} class="title">${model.data.content[i].title}</a></li><li class="list-group-item singer">歌手：<span class="singer-name">${model.data.content[i].singer}</span></li><li class="list-group-item publisher">出版商：<span class="publisher-name">${model.data.content[i].publisher}</span></li><li class="list-group-item pubdate">发行时间：<span class="date">${model.data.content[i].pubdate}</span></li><li class="list-group-item version">专辑类型：<span class="version-type">${model.data.content[i].version}</span></li><li class="list-group-item rating">评分：<span class="average-rating">${model.data.content[i].rating}</span></li></ul></div></div></div>`;
            }
        },
        initParseBooksJSON: function () {
            window.ParseBooksJSON = function (json) {
                model.init(json);
                model.data.count = json.books.length;
                for (let i = 0; i < model.data.count; i++) {
                    model.data.content[i] = {};
                    model.data.content[i].title = json.books[i].title || model.notFound;
                    model.data.content[i].author = model.ConcatItemsValueToString(json.books[i].author) || model.notFound;
                    model.data.content[i].publisher = json.books[i].publisher || model.notFound;
                    model.data.content[i].pubdate = json.books[i].pubdate || model.notFound;
                    model.data.content[i].price = json.books[i].price || model.notFound;
                    model.data.content[i].rating = json.books[i].rating.average || model.notFound;
                    model.data.content[i].ISBN = json.books[i].isbn13 || model.notFound;
                    model.data.content[i].url = json.books[i].alt || model.notFound;
                    model.propertyValue.bg[i] = `url("${json.books[i].images.large || model.notFound}") center center no-repeat`;
                }
                view.renderData();
            };
        },
        initParseMoviesJSON: function () {
            window.ParseMoviesJSON = function (json) {
                model.init(json);
                model.data.count = json.subjects.length;
                for (let i = 0; i < model.data.count; i++) {
                    model.data.content[i] = {};
                    model.data.content[i].title = json.subjects[i].title || model.notFound;
                    model.data.content[i].director = model.ConcatItemsValueToString(json.subjects[i].directors, 'name') || model.notFound;
                    model.data.content[i].directorUrl = model.ConcatItemsValueToString(json.subjects[i].directors, 'alt') || model.notFound;
                    model.data.content[i].cast = model.ConcatItemsValueToString(json.subjects[i].casts, 'name') || model.notFound;
                    model.data.content[i].pubdate = json.subjects[i].year || model.notFound;
                    model.data.content[i].rating = json.subjects[i].rating.average || model.notFound;
                    model.data.content[i].url = json.subjects[i].alt || model.notFound;
                    model.data.content[i].genre = model.ConcatItemsValueToString(json.subjects[i].genres) || model.notFound;
                    model.propertyValue.bg[i] = `url("${json.subjects[i].images.large || model.notFound}") center center no-repeat`;
                }
                view.renderData();
            }
        },
        initParseMusicsJSON: function () {
            window.ParseMusicsJSON = function (json) {
                model.init(json);
                model.data.count = json.musics.length;
                for (let i = 0; i < model.data.count; i++) {
                    model.data.content[i] = {};
                    model.data.content[i].title = json.musics[i].title || model.notFound;
                    model.data.content[i].singer = json.musics[i].author ? model.ConcatItemsValueToString(json.musics[i].author, 'name') : model.notFound;
                    model.data.content[i].publisher = json.musics[i].attrs.publisher ? json.musics[i].attrs.publisher[0] : model.notFound;
                    model.data.content[i].pubdate = json.musics[i].attrs.pubdate ? json.musics[i].attrs.pubdate[0] : model.notFound;
                    model.data.content[i].pubnum = json.musics[i].attrs.discs ? json.musics[i].attrs.discs[0] : model.notFound;
                    model.data.content[i].version = json.musics[i].attrs.version ? json.musics[i].attrs.version[0] : model.notFound;
                    model.data.content[i].media = json.musics[i].attrs.media ? json.musics[i].attrs.media[0] : model.notFound;
                    model.data.content[i].rating = json.musics[i].rating.average || model.notFound;
                    model.data.content[i].url = json.musics[i].alt || model.notFound;
                    model.propertyValue.bg[i] = `url("${json.musics[i].image || model.notFound}") center center no-repeat`;
                }
                view.renderData();
            }
        },
        ConcatItemsValueToString: function (items, attr) {
            let result = '';
            let itemsNumber = items.length;
            if (typeof items[0] === 'string'){
                for (let i = 0; i < itemsNumber; i++) {
                    result += items[i] + ' / ';
                }
            } else if (typeof items[0] === 'object') {
                for (let i = 0; i < itemsNumber; i++) {
                    result += items[i][attr] + ' / ';
                }
            }
            return result.substring(0, result.length - 3);
        },
    });
    let controller = Controller({
        init: function () {
            model.initParseBooksJSON();
            model.initParseMoviesJSON();
            model.initParseMusicsJSON();
        }
    });
    controller.init();
}();