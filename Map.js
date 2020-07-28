class Map {
    constructor(emplacement) {
        this.emplacement = emplacement;
        /*  this.map = L.map(`${this.emplacement}`, { zoomDelta: 0.25, zoomSnap: 0, wheelPxPerZoomLevel: 15 });*/
    }

    init() {
        /*  this.map.setView([51.505, -0.09], 13);
          let layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 20,
          });
          this.map.addLayer(layer);*/
        let mymap = L.map(`${this.emplacement}`).setView([51.505, -0.09], 13);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZDRya3N0cmlmZSIsImEiOiJja2QxdXc2cTUxMGx5MnJvN2N3azU1Z2FzIn0.ZkS1QneAeZBKnyju3c5CQA'
        }).addTo(mymap);
    }
}