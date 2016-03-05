'use strict';

angular
    .module('avalonMeteorApp')
    .controller('JoinController', JoinController);

JoinController.$inject = ['$mdToast', '$reactive', '$scope', '$state', 'userService', '_'];

function JoinController($mdToast, $reactive, $scope, $state, userService, _) {
    $reactive(this).attach($scope);
    var vm = this;

    vm.form = {roomCode: '', userName: ''};
    vm.error = '';

    vm.joinRoom = joinRoom;

    function joinRoom() {
        if (!vm.form.roomCode) {
            return showToast('You need to enter a room code!');
        }

        if (!vm.form.userName) {
            return showToast('You need to enter a user name!');
        }

        var existingRoom = Rooms.find({code: vm.getReactively('form.roomCode')}).fetch();
        if (!_.isEmpty(existingRoom)) {
            console.log('Joining ', vm.form.roomCode, ' as ', vm.form.userName);

            var currentUser = {
                userName: vm.form.userName,
                roomId: existingRoom[0]._id,
                master: false
            };
            currentUser._id = Users.insert(currentUser);

            userService.setModel(currentUser);
            Session.set('userId', currentUser._id);
            $state.go('room');

            vm.form = {roomCode: '', userName: ''};
            return;
        }

        showToast('Cannot Find Room!');
    }

    function showToast(message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .hideDelay(3000)
        );
    }
}