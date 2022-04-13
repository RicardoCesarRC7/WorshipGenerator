angular
    .module('worshipGeneratorApp')
    .controller('loginController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

        self = this;

        self.userLogin = { email: '', password: '' };

        self.init = () => { }

        self.login = () => {

            if (self.userLogin.email && self.userLogin.password) {

                showLoader();

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Login/Login',
                    data: self.userLogin
                });
            }
        }
    }]);