'use strict';

angular
    .module('avalonMeteorApp')
    .controller('RoomController', RoomController);

RoomController.$inject = ['$reactive', '$scope', 'userService', '$state', '$mdDialog'];

function RoomController($reactive, $scope, userService, $state, $mdDialog) {
    $reactive(this).attach($scope);
    var vm = this;

    vm.user = userService.getModel();
    vm.gameStart = false;

    vm.leaveRoom = leaveRoom;
    vm.isMaster = isMaster;
    vm.gameStarting = gameStarting;
    vm.participantIsMaster = participantIsMaster;


    vm.helpers({
        participants: function () {
            return Users.find({roomId: vm.user.roomId}).fetch();

        },
        hasEnoughPlayers: function () {
            var numberOfRequiredPlayers = 2;
            return numberOfRequiredPlayers <= Users.find({roomId: vm.user.roomId}).fetch().length;
        },
        getCode: function () {
            return Rooms.find({_id: vm.user.roomId}).fetch()[0];
        },
        nextMaster: function () {
            var participantsInRoom = Users.find({roomId: vm.user.roomId}).fetch();
            var userId = Session.get('userId');
            if (userId == participantsInRoom[0]._id) {
                vm.user.master = true;
                Users.update({_id: Session.get('userId')}, {$set: {'master': true}});
            }
        },
        isGameStarted: function () {
            var inGame = Rooms.find({_id: vm.user.roomId}).fetch();
            if (inGame[0].gameStarted) {
                $state.go('game');
            }
        }
    });


    function isMaster() {
        return vm.getReactively('user.master');

    }

    function participantIsMaster(participantId) {
        return Users.find({_id: participantId}).fetch()[0].master;
    }

    function leaveRoom() {
        Users.remove({_id: vm.user._id});
    }

    function gameStarting() {
        Rooms.update({_id: vm.user.roomId}, {$set: {'gameStarted': true}});
    }

    vm.savedRoles = {};
    vm.showSettingsDialog = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            controllerAs: 'dialogVm',
            templateUrl: 'client/room/settingsDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                savedRoles : vm.savedRoles
            }
        })
            .then(function(savedData) {
                vm.savedRoles = savedData;
        });
    };
    function DialogController($mdDialog, savedRoles) {
        var vm = this;
        vm.selectedRoles = angular.copy(savedRoles);

        vm.closeDialog = function() {
            $mdDialog.cancel();
        };
        vm.save = function(savedData) {
            $mdDialog.hide(savedData);
        };
    }

}
