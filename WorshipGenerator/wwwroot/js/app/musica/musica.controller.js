angular
    .module('worshipGeneratorApp')
    .controller('MusicaController', ['$scope', '$http', function ($scope, $http) {

        self = this;

        self.song = { id: '', name: '', author: '', page: 0, edition: 1, source: null, isValid: false };

        self.songs = [];
        self.musicalSources = [];

        self.isEdit = false;

        self.init = () => {

            self.list();
            self.listSources();
        }

        self.list = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Musica/ListarMusicas'
            }).then(function success(response) {

                console.log(response.data)

                if (response.data != null && response.data.length > 0)
                    self.songs = response.data;
            });
        }

        self.add = () => {

            self.validate();

            if (self.song.isValid) {

                showLoader('Estamos inserindo as informações da Música...');

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/AdicionarMusica',
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

            self.validate();

            if (self.song.isValid) {

                showLoader('Estamos atualizando as informações da Música...');

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/EditarMusica',
                    data: self.song
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Música Atualizada!',
                            text: 'A música foi atualizada com sucesso.'
                        }).then(() => {
                            $('#manage-song-modal').modal('toggle');
                        });

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

        self.remove = (id) => {

            if (id) {

                showLoader('Estamos removendo a música...')

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Musica/RemoverMusica',
                    data: { id: id }
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Música Removida!',
                            text: 'A música foi removida com sucesso.'
                        }).then(() => {
                            self.list();
                        });

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

        self.validate = () => {

            self.song.isValid = true;

            if (!self.song.name || !self.song.author || !self.song.page || !self.song.edition || !self.song.source)
                self.song.isValid = false;
        }

        self.openManageSongModal = (song) => {

            self.song = { id: '', name: '', author: '', page: 0, edition: 1, source: null, isValid: false };
            self.isEdit = false;

            if (song) {

                self.isEdit = true;

                self.song = song;
            }

            $('#manage-song-modal').modal('toggle');
        }

        self.listSources = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Musica/ListarFontesMusicais'
            }).then(function success(response) {

                if (response.data != null && response.data.length > 0)
                    self.musicalSources = response.data;
            });
        }
    }]);