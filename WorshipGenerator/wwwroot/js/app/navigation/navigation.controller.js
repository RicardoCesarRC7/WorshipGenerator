angular
    .module('worshipGeneratorApp')
    .controller('navigationController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

        self = this;

        self.isLogin = false;

        self.init = () => {

            self.isLogin = window.location.pathname.includes('Login');
        }

        self.openLoginPage = (action) => {

            let url = getAppRoot() + 'Login/Login'

            if (action == 'register')
                url += '?reg=1';

            window.location = url;
        }
    }]);