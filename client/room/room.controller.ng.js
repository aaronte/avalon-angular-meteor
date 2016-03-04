'use strict';

angular
    .module('avalonMeteorApp')
    .controller('RoomController', RoomController);

RoomController.$inject = ['$reactive', '$scope', 'userService', '$state'];

function RoomController($reactive, $scope, userService, $state) {
    $reactive(this).attach($scope);
    var vm = this;


    vm.user = userService.getModel();
    vm.leaveRoom = leaveRoom;
    vm.gameStart = false;
    vm.isMaster = isMaster;




    vm.gameStarting = gameStarting;


    vm.helpers({
        participants: function () {
            return Users.find({roomId: vm.user.roomId}).fetch();

        },
        hasEnoughPlayers: function () {
            var numberOfRequiredPlayers = 3;
            return numberOfRequiredPlayers <= Users.find({roomId: vm.user.roomId}).fetch().length;
        },
        getCode: function () {
            return Rooms.find({_id: vm.user.roomId}).fetch()[0];
        },
        nextMaster: function () {
            var participantsInRoom = Users.find({roomId: vm.user.roomId}).fetch();
            var userId = Session.get('userId');
            if (userId == participantsInRoom[0]._id){
                vm.user.master = true;
                Users.update({_id:Session.get('userId')},{$set:{'master':true}});
            }
        },
        isGameStarted: function () {
            var inGame = Rooms.find({_id:vm.user.roomId}).fetch();
            if(inGame[0].gameStarted){
                $state.go('game');
            }
            return inGame[0].gameStarted;
        }

    });


    function isMaster() {
        return vm.getReactively('user.master');

    }

    function leaveRoom() {
        Users.remove({_id: vm.user._id});
    }

    function gameStarting() {
        Rooms.update({_id:vm.user.roomId},{$set:{'gameStarted':true}});
    }

}
