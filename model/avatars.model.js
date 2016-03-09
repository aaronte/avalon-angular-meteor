Avatars = new Mongo.Collection("avatars");

Avatars.allow({
    insert: function (userId, avatar) {
        return true;
    },
    update: function (userId, avatar, fields, modifier) {
        return true;
    },
    remove: function (userId, avatar) {
        return true;
    }
});
