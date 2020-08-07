class Map {
    constructor(emplacement, restaurant) {
        this.emplacement = emplacement;
        this.latitude;
        this.longitude;
        this.restaurant = restaurant;
    }

    init() {
        console.log(this.restaurant)
        let mymap = L.map(`${this.emplacement}`).setView([this.latitude, this.longitude], 16);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZDRya3N0cmlmZSIsImEiOiJja2QxdXc2cTUxMGx5MnJvN2N3azU1Z2FzIn0.ZkS1QneAeZBKnyju3c5CQA'
        }).addTo(mymap);
        var marker = L.marker([this.latitude, this.longitude]).addTo(mymap);
        this.restaurant.forEach(element => {
            if (this.calculateDistance(this.latitude, this.longitude, element.latitude, element.longitude) < 1) {
                console.log(element)
                var circle = L.circle([element.latitude, element.longitude], {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 20
                }).addTo(mymap);

                element.render("restaurant_elt");
            }



        });
    }

    getUserPosition() {
        let that = this;
        var watchId = navigator.geolocation.getCurrentPosition((position) => {
            that.coordsInit(position.coords.latitude, position.coords.longitude);
            this.init();
            this.restaurant.forEach(element => {
                element.render();
            });
        })
    }

    coordsInit(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    calculateDistance(lat1, long1, lat2, long2) { //comparer position de l utilisateur avec la position du restaurant pour savoir si on doit l afficher
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((long2 - long1) * p)) / 2;

        return 12742 * Math.asin(Math.sqrt(a));
    }

}