function functionController($scope, $http) {

    var self = this;

    self.function = null;

    self.functions = [];

    self.isEdit = false;

    self.init = (isEdit) => {
        
        self.isEdit = isEdit;

        if (!self.isEdit) {

            self.function = self.initFunctionModel();

            self.functions.push(self.function);
        }
    }

    self.list = (departmentId) => {

        $http({
            method: 'GET',
            url: getAppRoot() + 'Management/ListFunctions',
            data: departmentId
        }).then(function success(response) {

            console.log(response.data)

            if (response.data != null && response.data.length > 0)
                self.functions = response.data;
        });
    }

    self.add = (functions) => {

        self.validate();

        if (self.function.isValid) {

            self.functions.push(self.initFunctionModel());
        }
    }

    self.update = () => {

        self.validate();

        if (self.function.isValid) {

            
        }
    }

    self.remove = (id) => {

        if (id) {

            self.functions.slice(self.functions.indexOf(i => i.id == id), 1);
        }
    }

    self.validate = () => {

        self.function.isValid = true;

        if (!self.function.name || self.function.name.length == 0) {

            self.function.isValid = false;
            return;
        }

        if (!self.function.description || self.function.description.length == 0) {

            self.function.isValid = false;
            return;
        }
    }

    self.initFunctionModel = () => {

        return {
            id: '',
            name: '',
            description: '',
            department: null,
            isValid: false
        };
    }
}