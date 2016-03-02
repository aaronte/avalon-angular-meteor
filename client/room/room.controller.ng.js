'use strict';

angular
    .module('avalonMeteorApp')
    .controller('RoomController', RoomController);

RoomController.$inject = ['$reactive', '$scope', 'userService'];

function RoomController($reactive, $scope, userService) {
    $reactive(this).attach($scope);
    var vm = this;

    vm.user = userService.getModel();

    vm.code = code;
    vm.leaveRoom = leaveRoom;

    vm.helpers({
        participants: function () {
            return Users.find({roomId: vm.user.roomId});
        },
        hasEnoughPlayers: function () {
            var numberOfRequiredPlayers = 5;
            return numberOfRequiredPlayers <= Users.find({roomId: vm.user.roomId}).length;
        }
    });

    function code() {
        return vm.user.roomId;
    }

    function leaveRoom() {
        Users.remove({_id: vm.user._id});
    }
}