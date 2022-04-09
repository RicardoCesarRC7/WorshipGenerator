angular
    .module('worshipGeneratorApp')
    .controller('MusicSetController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

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

            if (window.location.pathname.includes('DetalhesRelacao'))
                self.get();
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

        self.get = () => {

            let request = window.location.pathname.split('/').pop();

            if (request.length > 0) {

                showLoader("Estamos buscando as informações da Relação Musical...");

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/BuscarRelacao',
                    data: { request: request }
                }).then(function success(response) {

                    if (response.data != null) {

                        self.periodicSet = response.data;

                        self.periodicSet.from = moment(self.periodicSet.from).format('DD/MM/yyyy');
                        self.periodicSet.to = moment(self.periodicSet.to).format('DD/MM/yyyy');
                    }

                    Swal.close();
                });
            }
        }

        self.listSongs = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Musica/ListarMusicas'
            }).then(function success(response) {

                if (response.data != null && response.data.length > 0)
                    self.songs = response.data;
            });
        }

        self.getConfirmDates = () => {

            if (self.from.length > 0 && self.to.length > 0) {

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/CarregarItensRelacao',
                    data: { from: self.from, to: self.to }
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        self.periodicSet = response.data.content;
                        self.musicSet = response.data.content.musicSet;

                        angular.forEach(self.musicSet, function (set, index) {

                            set.date = moment(set.date).format('DD/MM/yyyy');
                        });

                        //$('html, body').animate({
                        //    scrollTop: $('#itens-relacao-musicas').offset().top + 100
                        //}, 500);
                    }
                });
            }
        }

        self.add = () => {

            let request = self.generateMusicSetRequestObject();

            if (request != null) {

                showLoader('Estamos inserindo as informações da Relação Musical...');

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/AdicionarRelacaoMusical',
                    data: request
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Relação Musical Adicionada!',
                            text: 'A relação foi adicionada com sucesso.'
                        }).then(() => window.location.reload());

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

        self.generateMusicSetRequestObject = () => {

            let request = {
                from: self.periodicSet.from,
                to: self.periodicSet.to,
                type: self.periodicSet.type,
                musicSet: []
            };

            if (self.musicSet && self.musicSet.length > 0) {

                angular.forEach(self.musicSet, function (set, index) {

                    let musicSetItem = { date: set.date, songs: [] };

                    angular.forEach(set.songs, (song, iindex) => {

                        musicSetItem.songs.push(song.selected);
                    });

                    request.musicSet.push(musicSetItem);
                });
            }

            return request;
        }

        self.clearFields = () => {

            self.from = '';
            self.to = '';
            self.periodicSet = null;
            self.musicSet = [];
        }

        self.addSong = (set) => {

            set.songs.push({ id: '' });
        }

        self.removeSong = (set, song) => {

            if (set.songs.length > 1)
                set.songs.splice(set.songs.indexOf(song), 1);
        }
    }]);