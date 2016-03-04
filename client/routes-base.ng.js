angular.module('avalonMeteorApp').config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('main', {
            url: '/',
            templateUrl: 'client/main/main.view.ng.html'

        })
        .state('create', {
            url: '/create',
            templateUrl: 'client/create/create.view.ng.html',
            controller: 'CreateController',
            controllerAs: 'createVm'

        })
        .state('join', {
            url: '/join',
            templateUrl: 'client/join/join.view.ng.html',
            controller: 'JoinController',
            controllerAs: 'joinVm'
        })
        .state('room', {
            url: '/room',
            templateUrl: 'client/room/room.view.ng.html',
            controller: 'RoomController',
            controllerAs: 'roomVm'
        })
        .state('game', {
            url: '/game',
            templateUrl: 'client/game/game.view.ng.html',
            controller: 'GameController',
            controllerAs: 'gameVm'
        });

    $urlRouterProvider.otherwise("/");
})
    .run(function ($rootScope, $state) {
        $rootScope.$on('stateChangeError', function (event, toState, toParams, fromState, fromParams, error){
            if (error === 'AUTH_REQUIRED') {
                $state.go('main');
            }
        });
    });
