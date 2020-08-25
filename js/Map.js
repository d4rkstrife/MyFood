class Map {
  constructor(emplacement, restaurant, filtre) {
    this.emplacement = emplacement;
    this.restaurant = restaurant;
    this.map;
    this.markers = [];
    this.filtre = filtre;
    //  this.groupLayer = L.markerClusterGroup([]);
    this.groupMarker = L.layerGroup([]);
  }

  init() {
    let that = this;
    if (navigator.geolocation) { //le navigator prend en charger la localisation
      let watchId = navigator.geolocation.getCurrentPosition((position) => {
        
      $('#position').hide();
        this.userPositionAcquired(position.coords.latitude, position.coords.longitude);
        this.map.on('click', function(e){ 
      var coord = e.latlng;
      var lat = coord.lat;
      var lng = coord.lng; 
      console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng); 
          that.addRestaurant(lat, lng);
        });
      
      },

        this.userPositionDenied()
      );

    } else { //le navigateur ne prend pas en charge la localisation.
      console.log("votre navigateur ne prend pas en charge la localisation")
    }
    
  }
  
  addRestaurant(latitude, longitude){
    let name = prompt("Entrez le nom du restaurant");
    let adress = prompt("Entrez l'adresse du restaurant");
    let data = {
      "restaurantName": name,
      "address": adress,
      "lat": latitude,
      "long": longitude,
      "ratings": []
    }
    let newRestaurant = new Restaurant (data);
    console.log(newRestaurant)
  }

  userPositionAcquired(latitude, longitude) {
    this.map = L.map(`${this.emplacement}`).setView([latitude, longitude], 16);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiZDRya3N0cmlmZSIsImEiOiJja2QxdXc2cTUxMGx5MnJvN2N3azU1Z2FzIn0.ZkS1QneAeZBKnyju3c5CQA'
    }).addTo(this.map);
    let marker = L.marker([latitude, longitude]).addTo(this.map);
    this.getNearestRestaurant(latitude, longitude);
    this.map.addLayer(this.groupMarker);


    $('#filter_button').on('click', () => {

      event.preventDefault();
      this.filtre.init(this)
    })
  }

  userPositionDenied() {
    let latitude;
    let longitude;
    let that = this;
    $('#position').append(`
        <h3>Entrez votre Code Postal</h3>
        <form>
          <input name="code postal" id="code" cols="20" rows="10"></input>
          <button id="validate">Valider</button>
        </form>
      </div>`)
    $('#position').show();

    function ajaxGet(url, callback) {
      let req = new XMLHttpRequest();
      req.open("GET", url);
      req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
          // Appelle la fonction callback en lui passant la réponse de la requête
          callback(req.responseText);
        } else {
          console.error(req.status + " " + req.statusText + " " + url);
        }
      });
      req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
      });
      req.send(null);
    }

    $('#validate').on('click', (e) => {
      e.preventDefault();

      console.log($('#code').val());
      let codePostal = $('#code').val();
      $('#position').hide();
      ajaxGet(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=centre&format=json&geometry=centre`, function (reponse) {
        let ville = JSON.parse(reponse);
        latitude = ville[0].centre.coordinates[1];
        longitude = ville[0].centre.coordinates[0];
        console.log(latitude, longitude, that);
        that.userPositionAcquired(latitude, longitude);
      });
      


    })
  }

  getNearestRestaurant() {
    $('#restaurant_elt').empty();
    this.restaurantNear = [];
    this.restaurant.forEach(element => {
      if (element.ratingAverage >= this.filtre.min && element.ratingAverage <= this.filtre.max) {
        this.restaurantRender(element);
      }
    });
  }

  restaurantRender(element) {
    let circle = L.circle([element.latitude, element.longitude], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 20
    }).bindPopup(`${element.name}, ${element.address}`)
      .on('click', () => {
        element.ratingsRender(this);
      });
    this.groupMarker.addLayer(circle);

    $(`#restaurant_elt`).append(`
            <div id="${element.name}" class="restaurant_div">
            <h3 class="nom_restaurant">${element.name}</h3>
            <p>${element.address}</p>
            <div class="nbr_etoiles">
            <p>${element.ratingAverage}</p>
            <img src="image/etoile.png" alt="image etoile" class="image_etoile">
            </div>
          
           </div>
            `);
    $(`#${element.name}`).on('click', () => {
      element.ratingsRender(this)
    });
  }

  /*   calculateDistance(lat1, long1, lat2, long2) { //comparer position de l utilisateur avec la position du restaurant pour savoir si on doit l afficher
         let p = 0.017453292519943295;    // Math.PI / 180
         let c = Math.cos;
         let a = 0.5 - c((lat2 - lat1) * p) / 2 +
             c(lat1 * p) * c(lat2 * p) *
             (1 - c((long2 - long1) * p)) / 2;
 
         return 12742 * Math.asin(Math.sqrt(a));
     }*/

}