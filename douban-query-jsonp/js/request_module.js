!function () {
    let view = View({
        body: $('body'),
        optionButton: $('.dropdown-item'),
        searchButton: $('#site-search-button'),
        prevPageButton: $('#prev-page'),
        nextPageButton: $('#next-page'),
        renderTheFirstPage: function () {
            alert(model.theFirstPage);
        },
        playLoadingAnimation: function (view) {
            view.removeClass(model.className.hide, model.className.welcome, model.className.notFound).addClass(model.className.loading);
        }
    });
    let model = Model({
        start: 0,
        flipPage: '&start=',
        theFirstPage: '客官，已经是第一页了！',
        searchBooks: 'book/search?q=',
        searchMovies: 'movie/search?q=',
        searchMusics: 'music/search?q=',
        baseUrl: 'https://api.douban.com/v2/',
        booksCallback: '&callback=ParseBooksJSON',
        moviesCallback: '&callback=ParseMoviesJSON',
        musicsCallback: '&callback=ParseMusicsJSON',
        className: {
            welcome: 'site-welcome',
            loading: 'site-loading',
            notFound: 'site-not-found',
            hide: 'site-homepage-hide'
        },
        init: function (option) {
            switch (option) {
                case 'books': return [this.searchBooks, this.booksCallback];
                case 'movies': return [this.searchMovies, this.moviesCallback];
                case 'musics': return [this.searchMusics, this.musicsCallback];
            }
        },
        SendRequest: function () {
            if (!this.getOption(view)) return;
            if (!this.getSearchContent(view)) return;
            this.optionUrl = this.init(this.option);
            view.playLoadingAnimation(view.homepage);
            let script = document.createElement('script');
            $(script).attr('src', this.baseUrl + this.optionUrl[0] + this.searchContent + this.flipPage + this.start + this.optionUrl[1]);
            view.body.append(script);
            $(script).remove();
        }
    });
    let controller = Controller({
        init: function () {
            this.optionButton();
            this.enterSendRequest();
            this.searchButton();
            this.prevPageButton();
            this.nextPageButton();
        },
        optionButton: function () {
            view.optionButton.on('click', function (event) {
                $('#site-dropdown-button')[0].innerText = event.currentTarget.innerText;
            })
        },
        enterSendRequest: function () {
            $(view.content).on('keydown', function (event) {
                if (event.keyCode === 13) {
                    model.start = 0;
                    model.SendRequest();
                }
            })
        },
        searchButton: function () {
            view.searchButton.on('click',function () {
                model.start = 0;
                model.SendRequest();
            });
        },
        prevPageButton: function () {
            view.prevPageButton.on('click', function () {
                console.log('123');
                if (model.start === 0) {
                    view.renderTheFirstPage();
                } else {
                    model.start -= 10;
                    model.SendRequest();
                }
            });
        },
        nextPageButton: function () {
            view.nextPageButton.on('click', function () {
                model.start += 10;
                model.SendRequest();
            });
        }
    });
    controller.init();
}();