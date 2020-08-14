class Map {
    constructor(emplacement, restaurant, filtre) {
        this.emplacement = emplacement;
        this.restaurant = restaurant;
        this.map;
        this.restaurantNear = [];
        this.markers = [];
        this.filtre = filtre;
    }

    init() {
        let that = this;
        if(navigator.geolocation){
        let watchId = navigator.geolocation.getCurrentPosition((position) => {
          this.map = L.map(`${this.emplacement}`).setView([position.coords.latitude, position.coords.longitude], 16);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'pk.eyJ1IjoiZDRya3N0cmlmZSIsImEiOiJja2QxdXc2cTUxMGx5MnJvN2N3azU1Z2FzIn0.ZkS1QneAeZBKnyju3c5CQA'
        }).addTo(this.map);
        let marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(this.map);
        this.getNearestRestaurant(position.coords.latitude, position.coords.longitude);
        
        this.map.on('drag', () => {
          console.log(this.map.getCenter());
          $('#restaurant_elt').empty();
          this.restaurantNear = [];
          this.getNearestRestaurant(this.map.getCenter().lat, this.map.getCenter().lng);
        })
        },
            
          ()=>{ //l accès a la position est refusé.
          console.log("vous ne pouvez acceder à l application si vous n'acceptez pas la geolocalisation.")
        });
          
        } else {
          console.log("votre navigateur ne prend pas en charge la localisation")
        }

    }
    
    getNearestRestaurant(latitude, longitude){
      this.restaurant.forEach(element => {
        if (this.calculateDistance(latitude, longitude, element.latitude, element.longitude) < 1 && element.ratingAverage >= this.filtre.min && element.ratingAverage <= this.filtre.max) {
          this.restaurantNear.push(element);
          element.render("restaurant_elt", this);
        }
      });
      this.restaurantNear.forEach(element => {
        this.restaurantRender(element);
      });
    }

    restaurantRender(element) {
        var circle = L.circle([element.latitude, element.longitude], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 20
        }).addTo(this.map)
        .bindPopup(`${element.name}, ${element.address}`);
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