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
    if (navigator.geolocation) { //le navigator prend en charger la localisation
      let watchId = navigator.geolocation.getCurrentPosition((position) => {

        $('#position').hide();
        this.userPositionAcquired(position.coords.latitude, position.coords.longitude);
      },

        this.userPositionDenied()
      );

    } else { //le navigateur ne prend pas en charge la localisation.
      console.log("votre navigateur ne prend pas en charge la localisation")
    }
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
      console.log($(`#minimum`).val(), $(`#maximum`).val())
      if ($(`#minimum`).val() <= $(`#maximum`).val()) {
        this.filtre.init(this)
      }
    })
  }

  userPositionDenied() {
    $('#position').append(`
        <h3>Entrez votre Code Postal</h3>
        <form>
          <input name="code postal" id="code" cols="20" rows="10"></input>
          <button id="validate">Valider</button>
        </form>
      </div>`)
    $('#position').show();
    $('#validate').on('click', (e) => {
      e.preventDefault();

      let codePostal = $('#code').val();
      $('#position').hide();
      this.getPositionByPostal(codePostal)
    });
  }

  async getPositionByPostal(postalCode) {
    let reponse = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=centre&format=json&geometry=centre`);
    let data = await reponse.json()
    let ville = data;
    let latitude = ville[0].centre.coordinates[1];
    let longitude = ville[0].centre.coordinates[0];
    this.userPositionAcquired(latitude, longitude);
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
            <div class="nom_etoiles">
            <h3 class="nom_restaurant">${element.name}</h3>
            <div class="nbr_etoiles">
            <p>${element.ratingAverage}</p>
            <img src="image/etoile.png" alt="image etoile" class="image_etoile">
            </div>
            </div>
            <p>${element.address}</p>         
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