class Map {
  constructor(emplacement, restaurant, filtre) {
    this.emplacement = emplacement;
    this.restaurant = restaurant;
    this.map;
    this.userPosition;
    this.markers = [];
    this.filtre = filtre;
    this.groupMarker = L.layerGroup([]);
    this.positionMarker = L.layerGroup([]);
    this.mapIsInit = false;
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
    $('#show_newrest_elt').on('click', (event) => {
      event.preventDefault;
      $(`#user_comment`).empty();
      this.addRestaurant();
    })

    $('#search_init').on('click', (event) => {
      event.preventDefault;
      let position = this.map.getCenter();
      this.getRestaurantFromGoogle(position.lat, position.lng)


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

  addRestaurant(latitude, longitude) { //permet de rajouter un restaurant(appelée lors du clic sur la carte ou sur le bouton)
    if (latitude && longitude) {
      this.getPostalByPosition(latitude, longitude);
    };

    this.showUserComment();

    $('#cancel_newrestaurant').on('click', (event) => {
      event.preventDefault();
      $(`#user_comment`).empty();
      $(`#user_comment`).hide();
    })
    $('#add_restaurant').on('click', (event) => {
      event.preventDefault();
      let name = $('#nom_restaurant');
      let numero = $('#numero_adresse_restaurant');
      let street = $('#rue_adresse_restaurant');
      let postalCode = $('#code_adresse_restaurant');
      let city = $('#ville_adresse_restaurant');

      if (name.val() && numero.val() && street.val() && postalCode.val() && city.val()) {//lorsque tous les champs sont correctement remplis
        let adress = `${numero.val()}, ${street.val()}, ${postalCode.val()} ${city.val()}`
        this.getPositionByAdress(adress, name.val());
        $(`#user_comment`).empty();
        $(`#user_comment`).hide();

      } else {
        let adressArray = [name, numero, street, postalCode, city];
        adressArray.forEach((element) => {
          if (!element.val()) {
            element.css("border", "2px solid red");
          } else {
            element.css("border", "none");
          }
        })
        $(`#user_comment form #erreur`).html("<p style='color : red'>Veuillez remplir tous les champs</p>");//erreur lorsqu'il manque des champs
      }
    })
  }

  userPositionAcquired(latitude, longitude) { //lorsque l on a accès à la position de l utilisateur
    let that = this;
    this.getRestaurantFromGoogle(latitude, longitude);
    if (this.mapIsInit === false) { // si la carte n est pas encore initialisée
      this.mapIsInit = true;
      this.map = L.map(`${this.emplacement}`).setView([latitude, longitude], 15);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZDRya3N0cmlmZSIsImEiOiJja2QxdXc2cTUxMGx5MnJvN2N3azU1Z2FzIn0.ZkS1QneAeZBKnyju3c5CQA'
      }).addTo(this.map);
    } else { // si la carte est déjà initialisée
      this.map.setView([latitude, longitude], 15);//on rajoute le marqueur de la position après avoir supprimé l ancien; 
    }
    this.map.removeLayer(this.positionMarker)
    this.positionMarker = L.layerGroup([]);
    let marker = L.marker([latitude, longitude]);
    this.positionMarker.addLayer(marker);
    this.map.addLayer(this.positionMarker);

    this.map.on('click', function (e) { // event du clic sur la map qui permet l ajout de restaurant
      var coord = e.latlng;
      var lat = coord.lat;
      var lng = coord.lng;
      $(`#user_comment`).empty();
      that.addRestaurant(lat, lng);
    });

    $('#filter_button').on('click', (event) => { //event du bouton valider du filtre
      event.preventDefault();
      that.filtre.state = "on";
      if ($(`#minimum`).val() >= $(`#maximum`).val()) {
        const min = $(`#minimum`).val();
        $(`#minimum`).val($(`#maximum`).val());
        $(`#maximum`).val(min);
      }
      this.filtre.newInit(this);
    });

    $('#reinit_button').on('click', (event) => { //event du bouton annuler du filtre
      event.preventDefault();
      this.filtre.state = "off";
      $(`#minimum`).val(1)
      $(`#maximum`).val(5);
      this.filtre.newInit(this);
    })
  }

  userPositionDenied() { //lorsque la position de l utilisateur n'est pas accessible.
    $('#position').append(`
        <h3>Entrez votre Code Postal</h3>
        <form>
          <input name="code postal" id="code" cols="20" rows="10"></input>
          <button id="validate">Valider</button>
          <div id="invalid_postal"></div>
        </form>
      `)
    $('#position').show();
    $('#validate').on('click', (e) => {
      e.preventDefault();
      let codePostal = $('#code').val().replace(/<(?:.|\s)*?>/g, "");//on supprime d eventuelles balises
      if (codePostal) {
        this.getPositionByPostal(codePostal);
      } else {
        $('#invalid_postal').html(`
        <p style="color : red">Veuillez entrer un code postal</p>
        `)
        $('#code').css("border", "2px solid red");
      }

    });
  }

  async getRestaurantFromGoogle(latitude, longitude) { //on récupère les restaurants les plus proches de la position transmise 
    this.restaurant = []; //on vide la collection de restaurants.
    let position = {
      "lat": latitude,
      "lng": longitude
    }
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&type=restaurant&rankby=distance&key=AIzaSyDHewuFhhdEj6CjeUotALhXvbNs6DsOjik`; // site that doesn’t send Access-Control-* 
    fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com 
      .then(response => response.json())
      .then(contents => {
        contents.results.forEach((element) => {
          let data = { //on organise la reponse pour la transmettre à la méthode qui va creer le nouvel objet restaurant
            "restaurantName": element.name,
            "address": element.vicinity,
            "lat": element.geometry.location.lat,
            "long": element.geometry.location.lng,
            "ratings": [{
              "stars": element.rating,
              "comment": "Moyenne des avis Google"
            }]
          }
          this.refreshRestaurantListeNewRest(data, position);
          this.mapUpdate();
        })
      })
  }

  async getPositionByPostal(postalCode) {  //on interroge l api geo gouv afin d avoir le centre de la ville dont on a rentré le code postal.
    let reponse = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=centre&format=json&geometry=centre`);
    let data = await reponse.json();
    let ville = data;
    if (ville.length != 0) {
      let latitude = ville[0].centre.coordinates[1];
      let longitude = ville[0].centre.coordinates[0];
      $('#position').hide();
      this.userPositionAcquired(latitude, longitude);
    } else {
      console.log("pas de code postal")
      $('#invalid_postal').html(`
      <p style="color : red">Code postal non valide</p>
      `)
      $('#code').css("border", "2px solid red");
    }

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
    let position = {
      "lat": place.data[0].latitude,
      "lng": place.data[0].longitude
    }

    let data = {
      "restaurantName": name.replace(/<(?:.|\s)*?>/g, ""),
      "address": adresse.replace(/<(?:.|\s)*?>/g, ""),
      "lat": latitude,
      "long": longitude,
      "ratings": []
    }
    this.refreshRestaurantListeNewRest(data, position)
  }

  mapUpdate() {//rendu des restaurant sur la carte
    this.map.removeLayer(this.groupMarker); // on supprime tous les marqueurs
    this.groupMarker = L.layerGroup([]);
    this.getNearestRestaurant(position);
    this.map.addLayer(this.groupMarker); //on remet tous les marqueurs dont le nouveau restaurant.
  }

  refreshRestaurantListeNewRest(data) {//rafraichir liste des restaurant après
    let newRestaurant = new Restaurant(data);//nouvel objet restaurant créé
    this.restaurant.push(newRestaurant); //on le rajoute à la collection de restaurants
    this.mapUpdate();
  }

  getNearestRestaurant() {
    $('#restaurant_elt').empty();
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

}