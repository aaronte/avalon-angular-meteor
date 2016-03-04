'use strict';

angular
    .module('avalonMeteorApp')
    .controller('CreateController', CreateController);

CreateController.$inject = ['$reactive', '$scope', '$state', 'userService'];

function CreateController($reactive, $scope, $state, userService) {
    $reactive(this).attach($scope);

    var vm = this;
    var roomCodeLength = 6;

    vm.user = {};

    vm.createGame = createGame;

    function createGame() {
        if (vm.user.name) {
            var count = Rooms.find().count();
            if (count >= Math.pow(10, roomCodeLength)) {
                console.log('No more rooms available');
                return;
            }

            var code = '';
            while ('' === code) {
                for (var i = 0; i < roomCodeLength; i++) {
                    code += Math.floor((Math.random() * 10)).toString();
                }
                var roomExists = Rooms.findOne({code: code});

                if (roomExists) {
                    code = '';
                }
            }

            console.log('Room: ' + code + ' was created');

            var roomId = Rooms.insert({code: code, gameStarted: false});
            var currentUser = {userName: vm.user.name, roomId: roomId, master: true};
            currentUser._id = Users.insert(currentUser);

            userService.setModel(currentUser);
            Session.set('userId',currentUser._id);


            $state.go('room');
        }
    }
}