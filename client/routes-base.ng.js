angular
    .module('avalonMeteorApp')
    .config(Config)
    .run(Run);

Config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];

function Config($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('am', {
            abstract: true,
            template: '<div ui-view></div>',
            resolve: {
                userData: ['userService', function (userService) {
                    var sessionUser = Session.get('userData');
                    if (sessionUser) {
                        userService.setModel(sessionUser);
                    }
                    return userService.getModel();
                }]
            }
        })
        .state('am.main', {
            url: '/',
            templateUrl: 'client/main/main.view.ng.html'

        })
        .state('am.create', {
            url: '/create',
            templateUrl: 'client/create/create.view.ng.html',
            controller: 'CreateController',
            controllerAs: 'createVm'

        })
        .state('am.join', {
            url: '/join',
            templateUrl: 'client/join/join.view.ng.html',
            controller: 'JoinController',
            controllerAs: 'joinVm'
        })
        .state('am.room', {
            url: '/room',
            templateUrl: 'client/room/room.view.ng.html',
            controller: 'RoomController',
            controllerAs: 'roomVm'
        })
        .state('am.game', {
            url: '/game',
            templateUrl: 'client/game/game.view.ng.html',
            controller: 'GameController',
            controllerAs: 'gameVm'
        });

    $urlRouterProvider.otherwise('/');
}

Run.$inject = ['$rootScope', '$state'];

function Run($rootScope, $state) {
    $rootScope.$on('stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        if (error === 'AUTH_REQUIRED') {
            $state.go('main');
        }
    });
}
