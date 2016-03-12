angular
    .module('avalonMeteorApp')
    .controller('GameController', GameController);

GameController.$inject = ['$reactive', '$scope', 'userService', '$state'];

function GameController ($reactive, $scope, userService, $state) {
    $reactive(this).attach($scope);
    var vm = this;

    vm.user = userService.getModel();
    vm.endGame = endGame;
    vm.userId = Session.get('userId');

    vm.helpers({
        isGameEnded: function () {
            vm.roomInfo = Rooms.find({_id: vm.user.roomId}).fetch()[0];
            if(!vm.roomInfo.gameStarted){
                $state.go('room');
            }
        },
        getRole: function () {
            vm.user.role = Users.find({_id: vm.userId}).fetch()[0].role;
            console.log(vm.user.role);
            return vm.user.role;
        }
    });

    function endGame(){
        Rooms.update({_id: vm.user.roomId},{$set: {'gameStarted': false}});
    }


}