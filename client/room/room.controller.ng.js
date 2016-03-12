'use strict';

angular
    .module('avalonMeteorApp')
    .controller('RoomController', RoomController);

RoomController.$inject = ['$mdDialog', '$reactive', '$scope', '$state', 'userService', '_'];

function RoomController($mdDialog, $reactive, $scope, $state, userService, _) {
    $reactive(this).attach($scope);
    var vm = this;

    vm.user = userService.getModel();
    vm.gameStart = false;

    vm.leaveRoom = leaveRoom;
    vm.isMaster = isMaster;
    vm.gameStarting = gameStarting;
    vm.participantIsMaster = participantIsMaster;
    vm.participantIsUser = participantIsUser;

    vm.helpers({
        participants: function () {
            return Users.find({roomId: vm.user.roomId}).fetch();
        },
        hasEnoughPlayers: function () {
            var numberOfRequiredPlayers = 5;
            return numberOfRequiredPlayers <= Users.find({roomId: vm.user.roomId}).fetch().length;
        },
        getCode: function () {
            return Rooms.find({_id: vm.user.roomId}).fetch()[0];
        },
        nextMaster: function () {
            var participantsInRoom = Users.find({roomId: vm.user.roomId}).fetch();
            var userId = Session.get('userId');
            if (userId == _.get(participantsInRoom[0], '_id')) {
                vm.user.master = true;
                Users.update({_id: Session.get('userId')}, {$set: {'master': true}});
            }
        },
        isGameStarted: function () {
            var inGame = Rooms.find({_id: vm.user.roomId}).fetch();
            if (_.get(inGame, '[0].gameStarted')) {
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

    function participantIsUser(participantId) {
        return _.isEqual(participantId, vm.user._id);
    }

    function leaveRoom() {
        Users.remove({_id: vm.user._id});
    }

    function gameStarting() {
        Rooms.update({_id: vm.user.roomId}, {$set: {'gameStarted': true}});
    }

    vm.savedRoles = {};
    vm.numParticipants = vm.participants.length;
    vm.showSettingsDialog = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            controllerAs: 'dialogVm',
            templateUrl: 'client/room/settingsDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                savedRoles : vm.savedRoles,
                numParticipants: vm.numParticipants
            }
        })
            .then(function(savedData) {
                vm.savedRoles = savedData;
        });
    };
    function DialogController($mdDialog, savedRoles, numParticipants) {
        var vm = this;
        vm.selectedRoles = angular.copy(savedRoles);
        vm.selectedBadRoles = 0x0;

        vm.checkMerlin = function() {
            vm.selectedRoles.Assassin = !vm.selectedRoles.Assassin;
            if(vm.selectedRoles.Percival) vm.selectedRoles.Percival = !vm.selectedRoles.Percival;
            if(vm.selectedRoles.Mordred) vm.selectedRoles.Mordred = !vm.selectedRoles.Mordred;
        };

        vm.checkPercival = function() {
            if(vm.selectedRoles.Morgana) vm.selectedRoles.Morgana = !vm.selectedRoles.Morgana;
        };

        vm.checkBadRoles = function() {
            var selectedAssassin = 0x0;
            var selectedMorgana = 0x0;
            var selectedMordred = 0x0;
            var selectedOberon = 0x0;

            if (vm.selectedRoles.Assassin) selectedAssassin = 0x8;
            if (vm.selectedRoles.Morgana) selectedMorgana = 0x4;
            if (vm.selectedRoles.Mordred) selectedMordred = 0x2;
            if (vm.selectedRoles.Oberon) selectedOberon = 0x1;

            vm.selectedBadRoles = (selectedAssassin | selectedMorgana | selectedMordred | selectedOberon);
        };

        vm.closeDialog = function() {
            $mdDialog.cancel();
        };
        vm.save = function(savedData) {
            $mdDialog.hide(savedData);
        };

        vm.disableOberon = function() {
            return (numParticipants < 7) ? ((vm.selectedBadRoles == 0xA) || (vm.selectedBadRoles == 0xC)) : (numParticipants < 10) ? vm.selectedBadRoles == 0xE : false;
        };
        vm.disableMordred = function() {
            return (numParticipants < 7) ? ((vm.selectedBadRoles == 0xC) || (vm.selectedBadRoles == 0x9)): (numParticipants < 10) ? vm.selectedBadRoles == 0xD : false;
        };
        vm.disableMorgana = function() {
            return (numParticipants < 7) ? ((vm.selectedBadRoles == 0xA) || (vm.selectedBadRoles == 0x9)): (numParticipants < 10) ? vm.selectedBadRoles == 0xB : false;
        };
    }

}
