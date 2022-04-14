angular
    .module('worshipGeneratorApp')
    .controller('loginController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

        self = this;

        self.userLogin = { email: '', password: '', confirmPassword: '' };

        self.EAction = {
            REGISTER: 1,
            LOGIN: 2,
            LOGOUT: 3
        }

        self.action = null;

        self.message = 'Insira as informações';

        self.init = () => {

            self.action = self.EAction.LOGIN;

            if (window.location.href.includes('reg=1'))
                self.action = self.EAction.REGISTER;
        }

        self.login = () => {

            if (self.userLogin.email && self.userLogin.password) {

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Login/Login',
                    data: self.userLogin
                });
            }
        }

        self.register = () => {

            if (self.userLogin.email && self.userLogin.password && self.userLogin.confirmPassword) {

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Login/Register',
                    data: self.userLogin
                });
            }
        }
    }]);