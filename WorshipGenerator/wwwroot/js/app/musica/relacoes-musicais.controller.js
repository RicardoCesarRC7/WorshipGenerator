angular
    .module('worshipGeneratorApp')
    .controller('RelacoesMusicaisController', ['$scope', '$http', RelacoesMusicaisController]);

const RelacoesMusicaisController = ($scope, $http) => {

    self = this;

    self.from = '';
    self.to = '';

    self.relacaoMusical = {

        isValid: false
    }

    self.relacoesMusicais = [];
    self.sundays = [];

    self.init = () => {

        self.list();
    }

    self.list = () => {

        $http({
            method: 'GET',
            url: window.location.protocol + '//' + window.location.host + 'Musica/ListarRelacoesMuscais'
        }).then(function success(response) {

            if (response.data != null && response.data.$values.length > 0)
                self.relacoesMusicais = response.data.$values;
        });
    }

    self.getConfirmDates = () => {

        if (self.from.length > 0 && self.to.length > 0) {

            $http({
                method: 'POST',
                url: getAppRoot() + 'Musica/CarregarItensRelacao',
                data: { de: self.from, ate: self.to }
            }).then(function success(response) {

                if (response.data != null && response.data.length > 0) {

                    self.sundays = response.data;
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
}