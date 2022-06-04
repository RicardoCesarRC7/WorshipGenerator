angular
    .module('worshipGeneratorApp')
    .controller('departmentController', ['$scope', '$http', function ($scope, $http) {

        const self = this;

        self.department = null;
        self.functionController = null;

        self.departments = [];

        self.isEdit = false;

        self.init = () => {

            self.functionController = new functionController($scope, $http);

            self.functionController.init();

            self.department = self.initDepartmentModel();

            self.initFormValidation();
            self.list();
        }

        self.initFormValidation = () => {

            $.validator.messages.required = 'Este campo é obrigatório';

            $('#manage-department-form').validate({
                rules: {
                    name: 'required',
                    description: 'required',
                    functions: 'required'
                }
            });
        }

        self.list = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Management/ListDepartments'
            }).then(function success(response) {

                console.log(response.data)

                if (response.data != null && response.data.length > 0)
                    self.departments = response.data;
            });
        }

        self.add = () => {

            self.validate();

            if (self.department.isValid) {

                showLoader('Estamos inserindo as informações do departamento...');

                self.department.functions = self.functionController.functions.filter(i => i.isValid);

                console.log(self.department)

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Management/AddDepartment',
                    data: self.department
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Departamento Adicionado!',
                            text: 'O departamento foi adicionado com sucesso.'
                        }).then(() => {
                            self.list();
                            self.closeManageDepartmentModal();
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

        self.update = () => {

            self.validate();

            if (self.department.isValid) {

                showLoader('Estamos atualizando as informações do departamento...');

                self.department.functions = self.functionController.functions.filter(i => i.isValid);

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Management/UpdateDepartment',
                    data: self.department
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Departamento Atualizada!',
                            text: 'As informações do departamento foram atualizadas com sucesso.'
                        }).then(() => {
                            $('#manage-department-modal').modal('toggle');
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

                showLoader('Estamos removendo o departamento...')

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Management/RemoveDepartment',
                    data: { id: id }
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Departamento Removido!',
                            text: 'O departamento foi removido com sucesso.'
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

            self.department.isValid = true;

            if (!self.department.name || self.department.name.length == 0) {

                self.department.isValid = false;
                return;
            }

            if (!self.department.description || self.department.description.length == 0) {

                self.department.isValid = false;
                return;
            }

            if (self.department.functions != null && self.department.functions.length > 0) {

                angular.forEach(self.department.functions, function (departmentFunction, i) {

                    self.functionController.validate(departmentFunction);
                });

                if (self.department.functions.filter(i => !i.isValid) > 0) {

                    self.department.isValid = false;
                    return;
                }
            }
        }

        self.openManageDepartmentModal = (department) => {

            self.department = self.initDepartmentModel();

            self.functionController.functions = [];
            self.functionController.add();

            self.isEdit = false;

            if (department) {

                self.isEdit = true;

                self.department = department;

                if (self.department.functions != null && self.department.functions.length > 0)
                    self.functionController.functions = department.functions;
            }

            $('#manage-department-modal').modal('toggle');
        }

        self.closeManageDepartmentModal = () => $('#manage-department-modal').modal('toggle');

        self.initDepartmentModel = () => {

            return {
                id: '',
                name: '',
                description: '',
                functions: [],
                isValid: false
            };
        }
    }]);