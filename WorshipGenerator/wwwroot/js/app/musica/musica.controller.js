angular
    .module('worshipGeneratorApp')
    .controller('MusicaController', ['$scope', '$http', MusicaController]);

const MusicaController = ($scope, $http) => {

    self = this;

    self.songs = null;
    self.musica = { id: '', nome: '', autor: '', pagina: 0, edicao: 1, fonte: null, isValid: false };

    self.init = () => {

        self.listar();
    }

    self.list = () => {

        $http({
            method: 'GET',
            url: getAppRoot() + 'Musica/AdicionarMusica'
        }).then(function success(response) {

            if (response != null && response.length > 0)
                self.musicas = response;
        });
    }

    self.adicionar = () => {

        if (validate()) {

            showLoader('Estamos inserindo as informações da Música...');

            $http({
                method: 'POST',
                url: getAppRoot() + 'Musica/ListarMusicas',
                data: self.musica
            }).then(function success(response) {

                if (response != null && response.success) {

                    Swal.fire({
                        icon: 'success',
                        title: 'Música Adicionada!',
                        text: 'A música foi adicionada com sucesso.'
                    }).then(() => {
                        $('#adicionar-musica-modal').modal('toggle');
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

    self.editar = () => {

        if (validate()) {

            showLoader('Estamos atualizando as informações da Música...');

            $http({
                method: 'POST',
                url: getAppRoot() + 'Musica/ListarMusicas',
                data: self.musica
            }).then(function success(response) {

                if (response != null && response.success) {

                    Swal.fire({
                        icon: 'success',
                        title: 'Música Adicionada!',
                        text: 'A música foi adicionada com sucesso.'
                    }).then(() => {
                        $('#adicionar-musica-modal').modal('toggle');
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

    self.remover = () => {


    }

    self.validate = () => {

        let isValid = true;

        if (!self.musica.nome)
            isValid = false;

        if (!self.musica.autor)
            isValid = false;

        if (!self.musica.pagina)
            isValid = false;

        if (!self.musica.edicao)
            isValid = false;

        if (!self.musica.fonte)
            isValid = false;

        return isValid;
    }

    self.generateRequestObject = () => {

        let request = {};

        request.id = $('#id-musica').val();
        request.nome = $('#nome-musica').val();
        request.autor = $('#autor-musica').val();
        request.pagina = $('#pagina-musica').val();
        request.edicao = $('#edicao-musica').val();

        request.fonte = { id: $('#fonte-musica').val() }

        return request;
    }
}