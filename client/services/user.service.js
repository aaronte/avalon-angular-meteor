'use strict';

angular
    .module('avalonMeteorApp')
    .service('userService', userService);

userService.$inject = ['_'];

function userService(_) {
    var model = {};

    return {
        getModel: getModel,
        setModel: setModel
    };

    function getModel() {
        return model;
    }

    function setModel(newModel) {
        _.assign(model, newModel);
        Session.setPersistent('userData', model);
    }
}