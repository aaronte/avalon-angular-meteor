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
        var numParticipants = Users.find({roomId: existingRoom[0]._id}).fetch().length;
        var isMaxPlayers = numParticipants == 1;

        if (isMaxPlayers) {
            return showToast('The room is full!');
        }

        if (!_.isEmpty(existingRoom)) {
            console.log('Joining ', vm.form.roomCode, ' as ', vm.form.userName);
            var avatarsRm = existingRoom[0].availAvatars;
            var numOfAvatars = avatarsRm.length;

            var avatarNumber = Math.floor((Math.random() * numOfAvatars ));
            var avatarImg = avatarsRm[avatarNumber].toString() + '.png';
            var availAvatars = [];
            for (var j = 0; j < numOfAvatars; j++) {
                if (j == avatarNumber) {

                }
                else {
                    availAvatars.push(avatarsRm[j])
                }
            }

            Rooms.update({_id: existingRoom[0]._id},{$set:{availAvatars: availAvatars}});

            var currentUser = {
                userName: vm.form.userName,
                roomId: existingRoom[0]._id,
                master: false,
                avatar: avatarImg
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