angular
    .module('worshipGeneratorApp')
    .controller('RelacoesMusicaisController', ['$scope', '$http', '$timeout', function RelacoesMusicaisController($scope, $http, $timeout) {

        self = this;

        self.from = '';
        self.to = '';

        self.relacaoMusical = {

            isValid: false
        }

        self.periodicSetList = [];
        self.periodicSet = null;
        self.musicSet = [];
        self.songs = [];

        self.init = () => {

            self.list();
            self.listSongs();
        }

        self.list = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Musica/ListarRelacoes'
            }).then(function success(response) {

                if (response.data != null && response.data.length > 0) {

                    self.periodicSetList = response.data;

                    angular.forEach(self.periodicSetList, function (set, index) {

                        set.from = moment(set.from).format('DD/MM/yyyy');
                        set.to = moment(set.to).format('DD/MM/yyyy');
                    });
                }
            });
        }

        self.listSongs = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Musica/ListarMusicas'
            }).then(function success(response) {

                if (response.data != null && response.data.length > 0)
                    self.songs = response.data;

                console.log(self.songs);
            });
        }

        self.getConfirmDates = () => {

            if (self.from.length > 0 && self.to.length > 0) {

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/CarregarItensRelacao',
                    data: { from: self.from, to: self.to }
                }).then(function success(response) {

                    console.log(response);

                    if (response.data != null && response.data.success) {

                        self.periodicSet = response.data.content;
                        self.musicSet = response.data.content.musicSet;

                        angular.forEach(self.musicSet, function (set, index) {

                            set.date = moment(set.date).format('DD/MM/yyyy');
                        });

                        $('#itens-relacao-musicas').show();

                        /*self.initSelect2();*/
                    }
                });
            }
        }

        self.add = () => {

            if (true) {

                self.periodicSet.relacoesMusicais = self.musicSet;

                showLoader('Estamos inserindo as informações da Música...');

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/AdicionarRelacaoMusical',
                    data: self.periodicSet
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Relação Musical Adicionada!',
                            text: 'A relação foi adicionada com sucesso.'
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

        self.addSong = (set) => {

            set.songs.push({ id: '' });
        }

        self.removeSong = (set, song) => {

            if (set.songs.length > 1)
                set.songs.splice(set.songs.indexOf(song), 1);
        }

        self.selectSong = (set) => {

            console.log(set);
        }
    }]);