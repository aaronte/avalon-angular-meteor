'use strict';

angular
    .module('avalonMeteorApp')
    .config(Config);

function Config($stateProvider) {
    $stateProvider
        .state('main', {
            url: '/',
            templateUrl: 'client/main/main.view.ng.html',
            controller: 'MainController'
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
        });
}