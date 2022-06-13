angular
    .module('worshipGeneratorApp')
    .controller('broadcastController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

        self = this;

        self.isLoading = false;

        self.broadcastSetList = [];
        self.broadcastMembers = [];
        self.broadcastFunctions = [];

        self.periodicSet = { from: null, to: null };

        self.broadcastSetId = null;
        self.isUpdate = false;

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

                        self.broadcastFunctions = broadcastDepartment.functions;

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

        self.getConfirmDates = () => {

            if (self.periodicSet.from.length > 0 && self.periodicSet.to.length > 0) {

                $http({
                    method: 'POST',
                    url: getAppRoot() + 'Broadcast/LoadSetItems',
                    data: { from: self.periodicSet.from, to: self.periodicSet.to }
                }).then(function success(response) {

                    if (response.data != null && response.data.success) {

                        self.periodicSet = response.data.content;
                        self.broadcastSet = response.data.content.broadcastSet;

                        self.periodicSet.from = moment(self.periodicSet.from).format('DD/MM/yyyy');
                        self.periodicSet.to = moment(self.periodicSet.to).format('DD/MM/yyyy');

                        angular.forEach(self.broadcastSet, function (set, index) {

                            set.date = moment(set.date).format('DD/MM/yyyy');
                        });
                    }
                });
            }
        }

        self.addMember = (set) => set.members.push({ id: '' });

        self.removeMember = (set, member) => {

            if (set.members.length > 1)
                set.members.splice(set.members.indexOf(member), 1);
        }

    }]);