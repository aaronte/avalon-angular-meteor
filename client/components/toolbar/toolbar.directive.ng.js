'use strict';

angular
    .module('avalonMeteorApp')
    .directive('toolbar', toolbar);

function toolbar() {
    return {
        restrict: 'AE',
        templateUrl: 'client/components/toolbar/toolbar.view.ng.html',
        replace: true
    };
}