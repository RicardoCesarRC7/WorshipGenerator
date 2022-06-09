angular
    .module('worshipGeneratorApp')
    .controller('broadcastController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

        self = this;

        self.isLoading = false;

        self.broadcastSetList = [];
        self.broadcastMembers = [];

        self.init = () => {

            self.listBroadcastMembers();
        }

        self.listBroadcastMembers = () => {

            self.isLoading = true;

            $http({
                method: 'GET',
                url: getAppRoot() + 'Management/ListDepartments'
            }).then(function success(response) {

                console.log(response.data)

                let departments = response.data;

                if (departments != null && departments.length > 0) {

                    let broadcastDepartment = departments.filter(i => i.name.toUpperCase().includes('SOM') && i.name.toUpperCase().includes('PROJEÇÃO'))[0];

                    if (broadcastDepartment != null) {

                        $http({
                            method: 'POST',
                            url: getAppRoot() + 'Management/ListMembersByDepartment',
                            data: { departmentId: broadcastDepartment.id }
                        }).then(function success(response) {

                            console.log(response);

                            if (response.data != null) {

                                self.broadcastMembers = response.data;
                            }
                        });
                    }
                }

                self.isLoading = false;
            });
        }

    }]);