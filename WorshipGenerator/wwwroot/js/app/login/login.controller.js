angular
    .module('worshipGeneratorApp')
    .controller('loginController', ['$scope', '$http', '$timeout', function ($scope, $http) {

        const self = this;

        self.userLogin = { email: '', password: '', confirmPassword: '', isValid: false };
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

            self.initEnterKeypress();
        }

        self.login = () => {

            self.validate();

            if (self.userLogin.isValid) {

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

            self.validate();

            if (self.userLogin.isValid) {

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

        self.sendRedefinePasswordEmail = () => {

            if (self.userLogin.email != null && self.userLogin.email.length > 0) {

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Login/SendRedefinePasswordEmail',
                    data: { email: self.userLogin.email }
                }).then((response) => {

                    if (response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'E-mail enviado!',
                            text: 'Enviamos um e-mail de redefinição de senha. Verifique sua caixa de entrada.'
                        }).then(() => window.location.reload());

                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.message.length > 0 ? response.data.message : 'Algo deu errado. Tente novamente mais tarde.'
                        });
                    }
                });

            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Insira o e-mail de sua conta!'
                });
            }
        }

        self.openRegister = () => {

            window.location = getAppRoot() + 'Login?reg=1';
        }

        self.validate = () => {

            self.userLogin.isValid = true;

            if (!self.userLogin.email || self.userLogin.email.length == 0) {

                self.userLogin.isValid = false;
                return;
            }

            if (!self.userLogin.password || self.userLogin.password.length == 0) {

                self.userLogin.isValid = false;
                return;
            }

            if (self.action == self.EAction.REGISTER) {

                if (!self.userLogin.confirmPassword || self.userLogin.confirmPassword.length == 0) {

                    self.userLogin.isValid = false;
                    return;
                }

                if (self.userLogin.password != self.userLogin.confirmPassword) {

                    self.userLogin.isValid = false;
                    return;
                }
            }
        }

        self.initEnterKeypress = () => {

            $(document).keypress(() => {

                if (event.keyCode === 13 && event.key === 'Enter') {

                    if (self.action == self.EAction.LOGIN)
                        self.login();
                    else if (self.action == self.EAction.REGISTER)
                        self.register();
                }
            });
        }
    }]);