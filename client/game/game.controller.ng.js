angular
    .module('avalonMeteorApp')
    .controller('GameController', GameController);

GameController.$inject = ['$reactive', '$scope', 'userService', '$state'];

function GameController ($reactive, $scope, userService, $state) {
    $reactive(this).attach($scope);
    var vm = this;

    vm.user = userService.getModel();
    vm.endGame = endGame;
    vm.isMerlin = isMerlin;
    vm.isPercival = isPercival;
    vm.isEvil = isEvil;
    vm.getRoleBanner = getRoleBanner;
    vm.hideRoleInfo = hideRoleInfo;
    vm.showRoleInfo = showRoleInfo;
    vm.isShown = true;
    vm.isHidden = false;


    vm.helpers({
        isGameEnded: function () {
            vm.roomInfo = Rooms.find({_id: vm.user.roomId}).fetch()[0];
            if(!vm.roomInfo.gameStarted){
                $state.go('am.room');
            }
        },
        getRole: function () {
            vm.user.role = Users.find({_id: vm.user._id}).fetch()[0].role;
            return vm.user.role;
        },
        getEvilUserNames: function () {
            vm.selectedRoles = Rooms.find({_id: vm.user.roomId}).fetch()[0].selectedRoles;
            var badPlayers = [];
            var minionsOfMordredPlayers = Users.find({roomId: vm.user.roomId, role: 'Minions of Mordred'}).fetch();
            for (var i = 0; i < minionsOfMordredPlayers.length; i ++) {
                badPlayers.push(minionsOfMordredPlayers[i].userName);
            }
            if (vm.selectedRoles.Assassin){
                badPlayers.push(Users.find({roomId: vm.user.roomId, role: 'Assassin'}).fetch()[0].userName);
            }
            if (vm.selectedRoles.Morgana){
                badPlayers.push(Users.find({roomId: vm.user.roomId, role: 'Morgana'}).fetch()[0].userName);
            }
            if (vm.user.role != 'Assassin' && vm.user.role != 'Morgana' && vm.user.role != 'Mordred' && vm.user.role != 'Minions of Mordred') {
                if (vm.selectedRoles.Oberon){
                    badPlayers.push(Users.find({roomId: vm.user.roomId, role: 'Oberon'}).fetch()[0].userName);
                }
            }
            if(vm.user.role != 'Merlin') {
                if (vm.selectedRoles.Mordred){
                    badPlayers.push(Users.find({roomId: vm.user.roomId, role: 'Mordred'}).fetch()[0].userName);
                }
            }
            return _.shuffle(badPlayers);
        },
        getMerlinUserNames: function () {
            vm.selectedRoles = Rooms.find({_id: vm.user.roomId}).fetch()[0].selectedRoles;
            var merlinPlayers = [];
            if (vm.selectedRoles.Merlin){
                merlinPlayers.push(Users.find({roomId: vm.user.roomId, role: 'Merlin'}).fetch()[0].userName);
            }
            if (vm.selectedRoles.Morgana){
                merlinPlayers.push(Users.find({roomId: vm.user.roomId, role: 'Morgana'}).fetch()[0].userName);
            }
            return _.shuffle(merlinPlayers);
        },
        getCode: function () {
            return Rooms.find({_id: vm.user.roomId}).fetch()[0].code;
        },
        getRoomSelectedRoles: function () {
            return Rooms.find({_id: vm.user.roomId}).fetch()[0].selectedRoles;
        }
    });

    function endGame(){
        Rooms.update({_id: vm.user.roomId},{$set: {'gameStarted': false}});
    }
    function isMerlin () {
        return vm.user.role === 'Merlin';
    }
    function isPercival () {
        return vm.user.role === 'Percival';
    }
    function isEvil () {
        return vm.user.role === 'Minions of Mordred' || vm.user.role === 'Assassin' || vm.user.role === 'Mordred' || vm.user.role === 'Morgana';
    }

    function getRoleBanner () {
        return Banners.find({role: vm.user.role}).fetch()[0].imgName;
    }

    function hideRoleInfo () {
        var roleInfoBox = document.getElementById("infoBox");
        var borderExpand = document.getElementById("borderExpandLess");
        roleInfoBox.style.opacity = "0";
        borderExpand.style.opacity = "0";
        vm.isShown = false;
        vm.isHidden = true;

    }

    function showRoleInfo () {
        var roleInfoBox = document.getElementById("infoBox");
        var borderExpand = document.getElementById("borderExpandLess");
        borderExpand.style.opacity = "1"
        vm.isShown = true;
        vm.isHidden = false;
        roleInfoBox.style.opacity = "1";
    }
}