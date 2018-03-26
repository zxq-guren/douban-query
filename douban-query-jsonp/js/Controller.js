!function () {
    window.Controller = function (userController) {
        let controller = {
            init: function () {
                userController.init();
            }
        };
        for (let key in userController) {
            if (key !== 'init'){
                controller[key] = userController[key];
            }
        }
        return controller;
    }
}();