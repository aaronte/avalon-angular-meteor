'use strict'

angular.module('avalonMeteorApp')
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('light-blue');
    });