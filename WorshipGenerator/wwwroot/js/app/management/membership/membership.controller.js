angular
    .module('worshipGeneratorApp')
    .controller('membershipController', ['$scope', '$http', function ($scope, $http) {

        const self = this;

        self.member = null;

        self.members = [];
        self.churchDepartments = [];
        self.churchFunctions = [];

        self.isEdit = false;

        self.EManagementSteps = {
            BASIC_INFO: 1,
            FUNCTIONS: 2
        }

        self.managementSteps = [
            { id: self.EManagementSteps.BASIC_INFO, name: 'Informações Gerais', sort: 1, isSelected: true },
            { id: self.EManagementSteps.FUNCTIONS, name: 'Funções do membro', sort: 2, isSelected: false }
        ];

        self.currentStep = null;

        self.isLoading = false;

        self.init = () => {

            self.member = self.initMemberModel();

            self.isLoading = true;
            
            self.listAllFunctions();
            self.currentStep = self.managementSteps.filter(i => i.isSelected)[0];

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
                    cellphone: 'required'
                }
            });
        }

        self.reinit = () => {

            self.member = self.initMemberModel();
            self.list();

            $.each(self.managementSteps, (index, step) => {

                step.isSelected = false;
            });

            self.currentStep = self.managementSteps.filter(i => i.sort == 1)[0];
            self.currentStep.isSelected = true;
        }

        self.list = () => {

            self.isLoading = true;

            $http({
                method: 'GET',
                url: getAppRoot() + 'Management/ListMembers'
            }).then(function success(response) {

                console.log(response.data)

                if (response.data != null && response.data.length > 0) {

                    $.each(response.data, (index, member) => {

                        member.birthDate = moment(member.birthDate).format('DD/MM/yyyy');
                    });

                    self.members = response.data;
                }

                self.isLoading = false;
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
                        }).then(() => {

                            self.reinit()

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

        self.update = () => {

            self.validate();

            if (self.member.isValid) {

                showLoader('Estamos atualizando as informações do membro...');

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Management/UpdateMember',
                    data: self.member
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Membro Atualizada!',
                            text: 'As informações do membro foram atualizadas com sucesso.'
                        }).then(() => {

                            self.reinit();

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
                    url: getAppRoot() + 'Management/RemoveMember',
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
                functions: [{
                    id: ''
                }],
                isValid: false
            };
        }

        self.listDepartments = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Management/ListDepartments'
            }).then(function success(response) {

                console.log(response.data)

                if (response.data != null && response.data.length > 0) {

                    self.churchDepartments = response.data;

                    if (self.churchFunctions && self.churchFunctions.length > 0) {

                        angular.forEach(self.churchFunctions, function (churchFunction, i) {

                            churchFunction.department = self.churchDepartments.filter(i => i.id == churchFunction.department.id)[0];
                        });
                    }
                }
            });
        }

        self.listAllFunctions = () => {

            $http({
                method: 'GET',
                url: getAppRoot() + 'Management/ListAllFunctions'
            }).then(function success(response) {

                console.log(response.data)

                if (response.data != null && response.data.length > 0) {

                    self.churchFunctions = response.data;

                    self.listDepartments();
                }
            });
        }

        self.addMemberFunction = () => {

            self.member.functions.push({ id: '' });
        }

        self.removeMemberFunction = (memberFunction) => {

            if (self.member.functions.length > 1) {

                let index = self.member.functions.indexOf(memberFunction);

                self.member.functions.splice(index, 1);
            }
        }

        self.goToNextStep = () => {

            let nextStep = self.managementSteps.filter(i => i.id == (self.currentStep.id + 1)).length > 0 ? self.managementSteps.filter(i => i.id == (self.currentStep.id + 1))[0] : null;

            if (nextStep != null) {

                self.currentStep.isSelected = false;

                $.each(self.managementSteps, (index, step) => step.isSelected = false);

                nextStep.isSelected = true;

                self.currentStep = nextStep;
            }
        }

        self.returnToLastStep = () => {

            let nextStep = self.managementSteps.filter(i => i.id == (self.currentStep.id - 1)).length > 0 ? self.managementSteps.filter(i => i.id == (self.currentStep.id - 1))[0] : null;

            if (nextStep != null) {

                self.currentStep.isSelected = false;

                $.each(self.managementSteps, (index, step) => step.isSelected = false);
                
                nextStep.isSelected = true;

                self.currentStep = nextStep;
            }
        }
    }]);