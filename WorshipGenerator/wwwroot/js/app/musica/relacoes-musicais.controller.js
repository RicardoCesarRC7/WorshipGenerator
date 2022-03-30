angular
    .module('worshipGeneratorApp')
    .controller('RelacoesMusicaisController', ['$scope', '$http', RelacoesMusicaisController]);

const RelacoesMusicaisController = ($scope, $http) => {

    self = this;

    self.relacoesMusicais = null;

    self.init = () => {

        self.listar();
    }

    self.listar = () => {

        $http({
            method: 'GET',
            url: window.location.protocol + '//' + window.location.host + 'Musica/ListarRelacoesMuscais'
        }).then(function success(response) {

            if (response != null && response.length > 0)
                self.relacoesMusicais = response;
        });
    }

    self.adicionar = () => {


    }

    self.editar = () => {


    }

    self.remover = () => {


    }
}