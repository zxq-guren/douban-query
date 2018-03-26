!function () {
    window.Model = function (userModel) {
        let model = {
            option: undefined,
            searchContent: undefined,
            OpimizeSearchContentReg: new RegExp(/[a-zA-Z0-9\u4e00-\u9fa5]+/,'g'),
            getOption: function (view) {
                let option = view.option.innerText.trim();
                switch (option) {
                    case '图书': this.option = 'books'; break;
                    case '电影': this.option = 'movies'; break;
                    case '音乐': this.option = 'musics'; break;
                    default: this.option = undefined;
                }
                return this.option;
            },
            getSearchContent: function (view) {
                this.searchContent = (function (searchContent) {
                    return searchContent === null ? alert('请选择查询内容！') : searchContent.join('');
                })(view.content.value.match(model.OpimizeSearchContentReg));
                return this.searchContent;
            }
        };
        for (let key in userModel) {
            model[key] = userModel[key];
        }
        return model;
    }
}();