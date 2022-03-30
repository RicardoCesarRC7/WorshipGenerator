angular
    .module('worshipGeneratorApp')
    .controller('MusicaController', ['$scope', '$http', function ($scope, $http) {

        self = this;

        self.song = { id: '', nome: '', autor: '', pagina: 0, edicao: 1, fonte: null, isValid: false };

        self.songs = [];
        self.musicalSources = [];

        self.init = () => {

            self.list();
            self.listSources();
        }

        self.list = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Musica/ListarMusicas'
            }).then(function success(response) {

                if (response.data != null && response.data.$values.length > 0)
                    self.songs = response.data.$values;
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
                    url: getAppRoot() + 'Musica/ListarMusicas',
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

            if (!self.song.nome || !self.song.autor || !self.song.pagina || !self.edicao || !self.song.fonte)
                self.song.isValid = false;
        }

        self.openManageSongModal = (song) => {

            self.song = { id: '', nome: '', autor: '', pagina: 0, edicao: 1, fonte: null, isValid: false };

            if (song)
                self.song = song;

            $('#manage-song-modal').modal('toggle');
        }

        self.listSources = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Musica/ListarFontesMusicais'
            }).then(function success(response) {

                if (response.data != null && response.data.$values.length > 0)
                    self.musicalSources = response.data.$values;
            });
        }
    }]);