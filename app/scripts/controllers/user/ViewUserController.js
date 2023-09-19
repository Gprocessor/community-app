(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewUserController: function (scope, routeParams, route, location, resourceFactory, $uibModal) {
            scope.user = [];
            scope.formData = {};
            resourceFactory.userListResource.get({userId: routeParams.id}, function (data) {
                scope.user = data;
            });
            scope.open = function () {
                $uibModal.open({
                    templateUrl: 'password.html',
                    controller: ModalInstanceCtrl
                });
            };
            scope.deleteuser = function () {
                $uibModal.open({
                    templateUrl: 'deleteuser.html',
                    controller: UserDeleteCtrl
                });
            };
            scope.blockuser = function (blockdays) {
                $uibModal.open({
                    templateUrl: 'blockuser.html',
                    controller: UserBlockCtrl
                });
            };

            scope.unblockuser = function () {
                $uibModal.open({
                    templateUrl: 'unblockuser.html',
                    controller: UserUnblockCtrl
                });
            };
            var ModalInstanceCtrl = function ($scope, $uibModalInstance) {
                $scope.save = function (staffId) {
                    resourceFactory.userListResource.update({'userId': routeParams.id}, this.formData, function (data) {
                        $uibModalInstance.close('activate');
                        if (data.resourceId == scope.currentSession.user.userId) {
                            scope.logout();
                        } else{
                            route.reload();
                        };
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            var UserDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.userListResource.delete({userId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/users');
                        // added dummy request param because Content-Type header gets removed
                        // if the request does not contain any data (a request body)
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            var UserBlockCtrl = function ($scope, $uibModalInstance) {
                $scope.data = {
                    blockDays: 1,
                    locale: scope.optlang.code
                };
                $scope.block = function () {
                    resourceFactory.userListResource.blockOrUnblock({'userId': routeParams.id, command: 'block'}, $scope.data, function (data) {
                        $uibModalInstance.close('block');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            var UserUnblockCtrl = function ($scope, $uibModalInstance) {
                $scope.unblock = function () {
                    resourceFactory.userListResource.blockOrUnblock({'userId': routeParams.id, command: 'unblock'}, {}, function (data) {
                        $uibModalInstance.close('unblock');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }

        }
    });
    mifosX.ng.application.controller('ViewUserController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$uibModal', mifosX.controllers.ViewUserController]).run(function ($log) {
        $log.info("ViewUserController initialized");
    });
}(mifosX.controllers || {}));
