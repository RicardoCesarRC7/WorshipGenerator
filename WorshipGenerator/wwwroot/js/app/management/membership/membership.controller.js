angular
    .module('worshipGeneratorApp')
    .controller('membershipController', ['$scope', '$http', function ($scope, $http) {

        const self = this;

        self.member = null;

        self.members = [];
        self.churchDepartments = [];
        self.churchFunctions = [];

        self.isEdit = false;

        self.init = () => {

            self.member = self.initMemberModel();
            self.listDepartments();
            self.listAllFunctions();
            self.initFormValidation();
            self.list();
        }

        self.initFormValidation = () => {

            $.validator.messages.required = 'Este campo é obrigatório';

            $('#manage-member-form').validate({
                rules: {
                    firstName: 'required',
                    lastName: 'required',
                    age: 'required',
                    birthDate: 'required',
                    cellphone: 'required',
                    rg: 'required',
                    cpf: 'required'
                }
            });
        }

        self.list = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Management/ListMembers'
            }).then(function success(response) {

                console.log(response.data)

                if (response.data != null && response.data.length > 0)
                    self.members = response.data;
            });
        }

        self.add = () => {

            self.validate();

            if (self.member.isValid) {

                showLoader('Estamos inserindo as informações do membro...');

                console.log(self.member)

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Management/AddMember',
                    data: self.member
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Membro Adicionado!',
                            text: 'O membro foi adicionado com sucesso.'
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

        self.update = () => {

            self.validate();

            if (self.member.isValid) {

                showLoader('Estamos atualizando as informações do membro...');

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Management/UpdateMember',
                    data: self.song
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Membro Atualizada!',
                            text: 'As informações do membro foram atualizadas com sucesso.'
                        }).then(() => {
                            $('#manage-member-modal').modal('toggle');
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

                showLoader('Estamos removendo o membro...')

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Management/RemoverMember',
                    data: { id: id }
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Membro Removido!',
                            text: 'O membro foi removido com sucesso.'
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

            self.member.isValid = true;

            if (!self.member.firstName || !self.member.lastName) {

                self.member.isValid = false;
                return;
            }

            if (self.member.age == 0) {

                self.member.isValid = false;
                return;
            }

            if (!self.member.birthDate || self.member.birthDate.length == 0) {

                self.member.isValid = false;
                return;
            }

            if (!self.member.cellphone || self.member.cellphone.length == 0) {

                self.member.isValid = false;
                return;
            }

            if (!self.member.address || !self.member.address.place || !self.member.address.number) {

                self.member.isValid = false;
                return;
            }
        }

        self.openManageMemberModal = (member) => {

            self.member = self.initMemberModel();
            self.isEdit = false;

            if (member) {

                self.isEdit = true;

                self.member = member;
            }

            $('#manage-member-modal').modal('toggle');
        }

        self.initMemberModel = () => {

            return {
                id: '',
                firstName: '',
                lastName: '',
                age: 0,
                birthDate: 1,
                rg: null,
                cpf: null,
                email: null,
                phone: null,
                cellphone: null,
                address: {
                    place: null,
                    number: 0,
                    complement: null,
                    zipCode: null
                },
                departments: [{ id: '', functions: [{ id: '' }] }],
                functions: [''],
                isValid: false
            };
        }

        self.listDepartments = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Management/ListDepartments'
            }).then(function success(response) {

                console.log(response.data)

                if (response.data != null && response.data.length > 0)
                    self.churchDepartments = response.data;
            });
        }

        self.listAllFunctions = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Management/ListAllFunctions'
            }).then(function success(response) {

                console.log(response.data)

                if (response.data != null && response.data.length > 0)
                    self.churchFunctions = response.data;
            });
        }
    }]);