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
            console.log(element)
            var circle = L.circle([element.latitude, element.longitude], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 20
            }).addTo(mymap);

            element.render("restaurant_elt");


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

}