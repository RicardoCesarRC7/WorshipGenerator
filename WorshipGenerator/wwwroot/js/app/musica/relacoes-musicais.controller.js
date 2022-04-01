angular
    .module('worshipGeneratorApp')
    .controller('RelacoesMusicaisController', ['$scope', '$http', '$timeout', function RelacoesMusicaisController($scope, $http, $timeout) {

        self = this;

        self.from = '';
        self.to = '';

        self.relacaoMusical = {

            isValid: false
        }

        self.relacoesMusicais = [];
        self.musicSet = [''];
        self.songs = [];

        self.init = () => {

            //self.initSelect2();
            self.list();
            self.listSongs();
        }

        self.list = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Musica/ListarRelacoes'
            }).then(function success(response) {

                if (response.data != null && response.data.$values.length > 0)
                    self.relacoesMusicais = response.data.$values;
            });
        }

        self.listSongs = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Musica/ListarMusicas'
            }).then(function success(response) {

                if (response.data != null && response.data.$values.length > 0)
                    self.songs = response.data.$values;
            });
        }

        self.getConfirmDates = () => {

            if (self.from.length > 0 && self.to.length > 0) {

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/CarregarItensRelacao',
                    data: { from: self.from, to: self.to }
                }).then(function success(response) {

                    if (response.data.$values != null && response.data.$values.length > 0) {

                        self.musicSet = response.data.$values;
                    }
                });
            }
        }

        self.add = () => {

            if (self.relacaoMusical.isValid) {

                showLoader('Estamos inserindo as informações da Música...');

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/AdicionarRelacaoMusical',
                    data: self.song
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Música Adicionada!',
                            text: 'A música foi adicionada com sucesso.'
                        }).then(() => self.list());

                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo deu errado. Tente novamente mais tarde.'
                        });
                    }
                });
            }
        }

        self.edit = () => {


        }

        self.remove = () => {


        }

        self.initSelect2 = () => $('.musica-relacao-select').select2();
    }]);