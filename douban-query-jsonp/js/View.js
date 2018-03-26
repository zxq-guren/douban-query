!function () {
    window.View = function (userView) {
        let view ={
            homepage: $('#site-homepage'),
            option: $('#site-dropdown-button')[0],
            content: $('#site-search-content')[0],
            init: function () {
                userView.init();
            }
        };
        for (let key in userView) {
            if (key !== 'init'){
                view[key] = userView[key];
            }
        }
        return view;
    }
}();