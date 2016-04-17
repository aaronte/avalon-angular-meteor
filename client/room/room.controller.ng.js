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
    vm.removeParticipant = removeParticipant;

    vm.savedRoles = Rooms.find({_id: vm.user.roomId}).fetch()[0].firstGame ? { Merlin: true, Assassin: true} : Rooms.find({_id: vm.user.roomId}).fetch()[0].selectedRoles;


    var goodToBadPlayerRatios = {
        2: [1, 1],
        5: [3, 2],
        6: [4, 2],
        7: [4, 3],
        8: [5, 3],
        9: [6, 3],
        10: [6, 4]
    };

    var servantsOfArthur = 'Loyal Servants of Arthur';
    var merlin = 'Merlin';
    var percival = 'Percival';

    var  minionsOfMordred = 'Minions of Mordred';
    var assassin = 'Assassin';
    var mordred = 'Mordred';
    var morgana = 'Morgana';
    var oberon = 'Oberon';


    vm.helpers({
        getParticipants: function () {
            vm.participants = Users.find({roomId: vm.user.roomId}).fetch();
            vm.numParticipants = vm.participants.length;
            return vm.participants;
        },
        hasEnoughPlayers: function () {
            var numberOfRequiredPlayers = 5;
            return numberOfRequiredPlayers <= Users.find({roomId: vm.user.roomId}).fetch().length;
        },
        getCode: function () {
            return Rooms.find({_id: vm.user.roomId}).fetch()[0].code;
        },
        nextMaster: function () {
            var participantsInRoom = Users.find({roomId: vm.user.roomId}).fetch();
            if (vm.user._id == _.get(participantsInRoom[0], '_id')) {
                vm.user.master = true;
                Users.update({_id: vm.user._id}, {$set: {'master': true}});
            }
        },
        isGameStarted: function () {
            var inGame = Rooms.find({_id: vm.user.roomId}).fetch();
            if (_.get(inGame, '[0].gameStarted')) {
                $state.go('am.game');
            }
        },
        updateRoomSelectedRoles: function () {
            Rooms.update({_id: vm.user.roomId}, {$set: {selectedRoles: vm.savedRoles}});
        },
        getRoomSelectedRoles: function () {
            return Rooms.find({_id: vm.user.roomId}).fetch()[0].selectedRoles;
        },
        updateMasterFromDBConsole: function () {
            vm.user.master = Users.find({_id : vm.user._id}).fetch()[0].master;
        }
    });

    function isMaster() {
        return vm.getReactively('user.master');
    }

    function participantIsMaster(participantId) {
        if(participantId) return Users.find({_id: participantId}).fetch()[0].master;

    }

    function participantIsUser(participantId) {
        return _.isEqual(participantId, vm.user._id);
    }

    function leaveRoom() {
        Users.remove({_id: vm.user._id});
    }

    function removeParticipant(participantId) {
        Users.remove({_id: participantId});
    }

    function gameStarting() {
        var selectedGoodRoles = [];
        var selectedBadRoles =[];
        if(vm.savedRoles.Merlin) selectedGoodRoles.push(merlin);
        if(vm.savedRoles.Percival) selectedGoodRoles.push(percival);
        if(vm.savedRoles.Assassin) selectedBadRoles.push(assassin);
        if(vm.savedRoles.Morgana) selectedBadRoles.push(morgana);
        if(vm.savedRoles.Mordred) selectedBadRoles.push(mordred);
        if(vm.savedRoles.Oberon) selectedBadRoles.push(oberon);

        var numGood = goodToBadPlayerRatios[vm.numParticipants][0];
        var numBad = goodToBadPlayerRatios[vm.numParticipants][1];

        var roles = new Array(vm.numParticipants);

        _.forEach(selectedGoodRoles, function(role, index) {
            roles[index] = role;
        });
        _.fill(roles, servantsOfArthur, selectedGoodRoles.length, numGood);

        _.forEach(selectedBadRoles, function(role, index) {
            roles[numGood + index] = role;
        });
        _.fill(roles, minionsOfMordred, numGood + selectedBadRoles.length, vm.numParticipants);

        var shuffledRoles = _.shuffle(roles);

        _.forEach(
            _.zip(vm.participants, shuffledRoles),
            _.spread(
                function(user, role){
                    Users.update({ _id: user._id }, { $set: {'role': role} });
                }
            )
        );
        Rooms.update({_id: vm.user.roomId}, {$set: {'firstGame': false}});
        Rooms.update({_id: vm.user.roomId}, {$set: {'gameStarted': true}});
    }


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
                Rooms.update({_id: vm.user.roomId}, {$set: {selectedRoles: vm.savedRoles}});
        });
    };
    function DialogController($mdDialog, savedRoles, numParticipants) {
        var vm = this;
        vm.selectedRoles = angular.copy(savedRoles);
        vm.selectedBadRoles = 0x0;
        vm.user = userService.getModel();

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
