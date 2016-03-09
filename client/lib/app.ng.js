angular
    .module('avalonMeteorApp', [
    'angular-meteor',
    'ui.router',
    'ngMaterial',
    'angularUtils.directives.dirPagination'
    ])
    .constant('_', lodash)
    .config(function($mdIconProvider) {
        $mdIconProvider
            .iconSet('action', 'action.svg', 24)
            .icon('key', 'key.svg');
    });

onReady = function () {
    angular.bootstrap(document, ['avalonMeteorApp']);
};

if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
} else {
    angular.element(document).ready(onReady);
}