Meteor.startup(function () {
    if (Avatars.find().count() === 0) {
        var avatars = [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10

            ];
        }
        Avatars.insert({'avatarArray' : avatars});

});