angular
    .module('worshipGeneratorApp')
    .controller('MusicSetController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

        const self = this;

        self.musicSetId = null;
        self.isUpdate = false;

        self.from = '';
        self.to = '';

        self.relacaoMusical = {

            isValid: false
        }

        self.periodicSetList = [];
        self.periodicSet = { from: null, to: null };
        self.musicSet = [];
        self.songs = [];

        self.init = () => {

            self.list();
            self.listSongs();

            if (typeof musicSetId != 'undefined' && musicSetId.length > 0)
                self.musicSetId = musicSetId;

            if (self.musicSetId != null || window.location.pathname.includes('DetalhesRelacao')) {

                self.isUpdate = self.musicSetId != null && !window.location.pathname.includes('DetalhesRelacao')

                self.get();
            }
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

                        if (self.isUpdate) {

                            self.musicSet = self.periodicSet.musicSet;

                            angular.forEach(self.musicSet, function (set, i) {

                                set.date = moment(set.date).format('DD/MM/yyyy');

                                angular.forEach(set.songs, function (song, ii) {

                                    song.selected = JSON.parse(JSON.stringify(song));
                                });
                            });
                        }
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

            if (self.periodicSet.from.length > 0 && self.periodicSet.to.length > 0) {

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/CarregarItensRelacao',
                    data: { from: self.periodicSet.from, to: self.periodicSet.to }
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        self.periodicSet = response.data.content;
                        self.musicSet = response.data.content.musicSet;

                        self.periodicSet.from = moment(self.periodicSet.from).format('DD/MM/yyyy');
                        self.periodicSet.to = moment(self.periodicSet.to).format('DD/MM/yyyy');

                        angular.forEach(self.musicSet, function (set, index) {

                            set.date = moment(set.date).format('DD/MM/yyyy');
                        });
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
                        }).then(() => window.location = getAppRoot() + 'Musica/DetalhesRelacao/' + response.data.message);

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

            let request = self.generateMusicSetRequestObject();

            if (request != null) {

                showLoader('Estamos atualizando as informações da Relação Musical...');

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/UpdateMusicSet',
                    data: request
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Relação Musical Atualizada!',
                            text: 'A relação foi atualizada com sucesso.'
                        }).then(() => window.location = getAppRoot() + 'Musica/DetalhesRelacao/' + self.musicSetId);

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

            if (self.isUpdate)
                request.id = self.periodicSet.id;

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

        self.goToEditMusicSetPage = () => {

            window.location = getAppRoot() + 'Musica/Relacao/' + self.musicSetId;
        }
    }]);