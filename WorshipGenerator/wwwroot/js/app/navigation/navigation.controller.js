angular
    .module('worshipGeneratorApp')
    .controller('navigationController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

        const self = this;

        self.hasUserLogged = false;
        self.isLogin = false;

        self.init = () => {

            self.isLogin = window.location.pathname.includes('Login');

            self.checkUserLogged();
        }

        self.openLoginPage = (action) => {

            let url = getAppRoot() + 'Login'

            if (action == 'register')
                url += '?reg=1';

            window.location = url;
        }

        self.checkUserLogged = () => {

            $http({
                method: 'POST',
                url: getAppRoot() + 'Login/HasUserLogged'
            }).then((response) => {

                self.hasUserLogged = response.data;
            });
        }

        self.logoutUser = () => {

            $http({
                method: 'POST',
                url: getAppRoot() + 'Login/Logout',
            }).then((response) => window.location = getAppRoot());
        }
    }]);