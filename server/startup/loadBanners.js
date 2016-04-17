Meteor.startup(function () {
    if (Banners.find().count() === 0) {
        var banners = [
            {
                "role": "Loyal Servants of Arthur",
                "imgName": "/Banners/loyalservantsofarthur_banner.png"
            },
            {
                "role": "Merlin",
                "imgName": "/Banners/merlin_banner.png"
            },
            {
                "role": "Percival",
                "imgName": "/Banners/percival_banner.png"
            },
            {
                "role": "Minions of Mordred",
                "imgName": "/Banners/minionsofmordred_banner.png"
            },
            {
                "role": "Assassin",
                "imgName": "/Banners/assassin_banner.png"
            },
            {
                "role": "Morgana",
                "imgName": "/Banners/morgana_banner.png"
            },
            {
                "role": "Mordred",
                "imgName": "/Banners/mordred_banner.png"
            },
            {
                "role": "Oberon",
                "imgName" : "/Banners/oberon_banner.png"
            }
        ];



        for (var i = 0; i < banners.length; i++) {
            Banners.insert(banners[i]);
        }

    }


});
