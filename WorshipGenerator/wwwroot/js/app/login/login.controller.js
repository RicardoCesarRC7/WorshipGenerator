angular
    .module('worshipGeneratorApp')
    .controller('loginController', ['$scope', '$http', '$timeout', function ($scope, $http) {

        const self = this;

        self.userLogin = { email: '', password: '', confirmPassword: '' };
        self.hasUserLogged = false;

        self.EAction = {
            REGISTER: 1,
            LOGIN: 2,
            LOGOUT: 3
        }

        self.action = null;

        self.message = 'Insira as informações';

        self.init = () => {

            self.action = self.EAction.LOGIN;

            if (window.location.href.includes('reg=1')) {

                self.action = self.EAction.REGISTER;
            }
        }

        self.login = () => {

            if (self.userLogin.email && self.userLogin.password) {

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Login/Login',
                    data: self.userLogin
                }).then((response) => {

                    if (!response.data.success) {

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.message.length > 0 ? response.data.message : 'Algo deu errado. Tente novamente mais tarde.'
                        });
                    } else
                        window.location = getAppRoot();
                });
            }
        }

        self.register = () => {

            if (self.userLogin.email && self.userLogin.password && self.userLogin.confirmPassword) {

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Login/Register',
                    data: self.userLogin
                }).then((response) => {

                    if (!response.data.success) {

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.message.length > 0 ? response.data.message : 'Algo deu errado. Tente novamente mais tarde.'
                        });
                    } else
                        window.location = getAppRoot();
                });
            }
        }

        self.logout = () => {

            $http({
                method: 'POST',
                url: getAppRoot() + 'Login/Logout',
            }).then((response) => window.location = getAppRoot());
        }

        self.checkUserLogged = () => {

            $http({
                method: 'POST',
                url: getAppRoot() + 'Login/HasUserLogged'
            }).then((response) => {

                self.hasUserLogged = response.data;
            });
        }

        self.openRegister = () => {

            window.location = getAppRoot() + 'Login?reg=1';
        }
    }]);