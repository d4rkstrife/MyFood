class Map {
  constructor(emplacement, restaurant, filtre) {
    this.emplacement = emplacement;
    this.restaurant = restaurant;
    this.map;
    this.markers = [];
    this.filtre = filtre;
    this.groupMarker = L.layerGroup([]);
  }

  init() {
    let that = this;
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
    $('#show_newrest_elt').on('click', () => {
      event.preventDefault;
      $(`#user_comment`).empty();
      this.addRestaurant();
    })

  }

  hideRestaurantRatings() { //cache tous les avis sur les restaurants.
    this.restaurant.forEach(element => {
      if (element.isRatingsShow === true) {
        element.closeRating();
      }
    })
  }

  showUserComment() { //fait apparaitre la div permettant d ajouter un restaurant
    $(`#user_comment`).show();
    $(`#user_comment`).append(`
    <h3>Rajouter un restaurant</h3>
    <form>
    <div id="nom_form">
      <label for="nom_restaurant">Nom du restaurant:</label><br>
      <input type="text" id="nom_restaurant" name="nom_restaurant"><br>
    </div>
    <div id="adress_form">
      <h4>Entrez l'adresse</h4>
      <label for="numero_adresse_restaurant">Numero:</label><br>
      <input type="text" id="numero_adresse_restaurant" name="numero_adresse_restaurant"><br>
      <label for="rue_adresse_restaurant">Rue:</label><br>
      <input type="text" id="rue_adresse_restaurant" name="rue_adresse_restaurant"><br>
      <label for="code_adresse_restaurant">Code Postal:</label><br>
      <input type="text" id="code_adresse_restaurant" pattern="[0-9]{5}" name="code_adresse_restaurant"><br>
      <label for="ville_adresse_restaurant">Ville:</label><br>
      <input type="text" id="ville_adresse_restaurant" name="ville_adresse_restaurant"><br>
    </div>
      <button id="add_restaurant">Valider</button>
      <button id="cancel_newrestaurant">Annuler</button>
      <div id="erreur"></div>
    </form>
    `)
  }

  addRestaurant(latitude, longitude) { //permet de rajouter un restaurant lors du clic sur la carte ou sur le bouton
    if (latitude && longitude) {
      this.getPostalByPosition(latitude, longitude);
    };

    this.showUserComment();

    $('#cancel_newrestaurant').on('click', () => {
      event.preventDefault();
      $(`#user_comment`).empty();
      $(`#user_comment`).hide();
    })
    $('#add_restaurant').on('click', () => {
      event.preventDefault();
      let name = $('#nom_restaurant');
      let numero = $('#numero_adresse_restaurant');
      let street = $('#rue_adresse_restaurant');
      let postalCode = $('#code_adresse_restaurant');
      let city = $('#ville_adresse_restaurant');

      if (name.val() && numero.val() && street.val() && postalCode.val() && city.val()) {
        let adress = `${numero.val()}, ${street.val()}, ${postalCode.val()} ${city.val()}`
        this.getPositionByAdress(adress, name.val());
      } else {
        let adressArray = [name, numero, street, postalCode, city];
        adressArray.forEach((element) => {
          if (!element.val()) {
            element.css("border", "2px solid red");
          } else {
            element.css("border", "none");
          }
        })
        $(`#user_comment form #erreur`).html("<p style='color : red'>Veuillez remplir tous les champs</p>");
      }
    })
  }

  userPositionAcquired(latitude, longitude) { //lorsque l on a accès à la position de l utilisateur
    let that = this;
    this.getRestaurantFromGoogle(latitude, longitude)
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

    this.map.on('click', function (e) { // event du clic sur la map qui permet l ajout de restaurant
      var coord = e.latlng;
      var lat = coord.lat;
      var lng = coord.lng;
      $(`#user_comment`).empty();
      that.addRestaurant(lat, lng);
    });


    $('#filter_button').on('click', () => { //event du bouton valider du filtre
      event.preventDefault();
      this.filtre.state = "on";
      if ($(`#minimum`).val() >= $(`#maximum`).val()) {
        const min = $(`#minimum`).val();
        $(`#minimum`).val($(`#maximum`).val());
        $(`#maximum`).val(min);
      }
      this.filtre.init(this);
    });

    $('#reinit_button').on('click', () => { //event du bouton annuler du filtre
      event.preventDefault();
      this.filtre.state = "off";
      $(`#minimum`).val(1)
      $(`#maximum`).val(5);
      this.filtre.init(this);
    })
  }

  userPositionDenied() { //lorsque la position de l utilisateur n'est pas accessible.
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

      let codePostal = $('#code').val().replace(/<(?:.|\s)*?>/g, "");
      $('#position').hide();
      this.getPositionByPostal(codePostal)
    });
  }

  async getRestaurantFromGoogle(latitude, longitude) {
    let reponse = fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=45.7589,4.7719&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyDHewuFhhdEj6CjeUotALhXvbNs6DsOjik`, {
      mode: 'no-cors' // 'cors' by default
    })
    let data = await reponse;
    console.log(data)

  }

  async getPositionByPostal(postalCode) {  //on interroge l api geo gouv afin d avoir le centre de la ville dont on a rentré le code postal.
    let reponse = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=centre&format=json&geometry=centre`);
    let data = await reponse.json();
    let ville = data;
    let latitude = ville[0].centre.coordinates[1];
    let longitude = ville[0].centre.coordinates[0];
    this.userPositionAcquired(latitude, longitude);
  }

  async getPostalByPosition(latitude, longitude) { // permet de remplir les cases adresse du formulaire ajout de restaurant lors du clic sur la carte
    let response = await fetch(`http://api.positionstack.com/v1/reverse?access_key=ad81b9c232a0cab345eef95c3036636d&query=${latitude},${longitude}`);
    let data = await response.json();
    $('#numero_adresse_restaurant').val(data.data[0].number);
    $('#rue_adresse_restaurant').val(data.data[0].street);
    $('#code_adresse_restaurant').val(data.data[0].postal_code);
    $('#ville_adresse_restaurant').val(data.data[0].administrative_area);
  }

  async getPositionByAdress(adresse, name) { //ajout d'un restaurant a la liste de restaurant suite a son ajout dans le formulaire
    let response = await fetch(`http://api.positionstack.com/v1/forward?access_key=ad81b9c232a0cab345eef95c3036636d&query=${adresse}`);
    let placeData = await response.json();
    let place = placeData;
    let latitude = place.data[0].latitude;
    let longitude = place.data[0].longitude;

    let data = {
      "restaurantName": name.replace(/<(?:.|\s)*?>/g, ""),
      "address": adresse.replace(/<(?:.|\s)*?>/g, ""),
      "lat": latitude,
      "long": longitude,
      "ratings": []
    }
    this.refreshRestaurantListeNewRest(data)
  }

  refreshRestaurantListeNewRest(data) {//rafraichir liste des restaurant après
    let newRestaurant = new Restaurant(data);//nouvel objet restaurant créé
    newRestaurant.ratingAverage = 0;
    this.restaurant.push(newRestaurant); //on le rajoute à la collection de restaurants
    this.map.removeLayer(this.groupMarker); // on supprime tous les marqueurs
    this.groupMarker = L.layerGroup([]);
    this.getNearestRestaurant();
    this.map.addLayer(this.groupMarker); //on remet tous les marqueurs dont le nouveau restaurant.*/
    $(`#user_comment`).empty();
    $(`#user_comment`).hide();
  }

  getNearestRestaurant() {
    $('#restaurant_elt').empty();
    this.restaurantNear = [];
    this.restaurant.forEach(element => {
      if (this.filtre.state === "off") {
        this.restaurantRender(element);
      } else if ((this.filtre.state === "on") && (element.ratingAverage >= this.filtre.min && element.ratingAverage <= this.filtre.max)) {
        this.restaurantRender(element);
      }
    })
  }

  restaurantRender(element) {
    let circle = L.circle([element.latitude, element.longitude], {
      color: '#9A0DD8',
      fillColor: '#9A0DD8',
      fillOpacity: 1,
      radius: 15
    }).bindPopup(`${element.name}, ${element.address}`)
      .on('click', () => {
        if (!element.isRatingsShow) {
          this.hideRestaurantRatings();
        }
        element.ratingsRender(this);
      });
    this.groupMarker.addLayer(circle);

    $(`#restaurant_elt`).append(`
    <div id="${element.divName}" class="restaurant_div">
    <div class="nom_etoiles">
    <h3 class="nom_restaurant">${element.name}</h3>
    <div class="nbr_etoiles">
    <p>${element.ratingAverage}</p>
    <img src="image/etoile.png" alt="image etoile" class="image_etoile">
    </div>
    </div>
    <p>${element.address}</p> 
    <div class="avis_utilisateurs">
    </div        
   </div>
    `);
    $(`#${element.divName}`).on('click', () => {
      if (!element.isRatingsShow) {
        this.hideRestaurantRatings();
      }
      element.ratingsRender(this);
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