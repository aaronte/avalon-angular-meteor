angular
    .module('avalonMeteorApp')
    .controller('GameController', GameController);

GameController.$inject = ['$reactive', '$scope', 'userService', '$state'];

function GameController ($reactive, $scope, userService, $state) {
    $reactive(this).attach($scope);
    var vm = this;

    vm.user = userService.getModel();
    vm.endGame = endGame;

    vm.helpers({
        isGameEnded: function () {
            var inGame = Rooms.find({_id:vm.user.roomId}).fetch();
            if(!inGame[0].gameStarted){
                $state.go('room');
            }
            return inGame[0].gameStarted;
        }
    });

    function endGame(){
        Rooms.update({_id:vm.user.roomId},{$set:{'gameStarted':false}});
    }
}