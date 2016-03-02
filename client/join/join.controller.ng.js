'use strict';

angular
    .module('avalonMeteorApp')
    .controller('JoinController', JoinController);

JoinController.$inject = ['$reactive', '$scope', '$state','userService'];

function JoinController($reactive, $scope, $state, userService) {
    $reactive(this).attach($scope);
    var vm = this;

    vm.form = {roomCode: '', userName: ''};

    vm.joinRoom = joinRoom;

    function joinRoom() {
        var existingRoom = Rooms.findOne({code:  vm.getReactively('form.roomCode')});

        if (existingRoom) {
            console.log('Joining ', vm.form.roomCode, ' as ', vm.form.userName);

            var currentUser = {
                userName: vm.form.userName,
                roomId: existingRoom._id,
                master: false
            };
            currentUser._id = Users.insert(currentUser);

            userService.setModel(currentUser);
            $state.go('/room');

            vm.form = {roomCode: '', userName: ''};
            return;
        }

        console.log('Cant find room.');
    }
}