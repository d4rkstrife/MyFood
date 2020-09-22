class Filtre {
  constructor(buttonElt, minElt, maxElt) {
    this.elt = buttonElt;
    this.minElt = minElt;
    this.maxElt = maxElt;
    this.min = 1;
    this.max = 5;
    this.state = "off";
  }

  newInit(map) {
    this.min = $(`#${this.minElt}`).val();
    this.max = $(`#${this.maxElt}`).val();
    map.map.removeLayer(map.groupMarker);
    map.groupMarker = L.layerGroup([]);
    $('#restaurant_elt').empty();
    map.restaurant.forEach(element => {
      if (this.state === "off") {
        map.restaurantRender(element);
      } else if ((this.state === "on") && (element.ratingAverage >= this.min && element.ratingAverage <= this.max)) {
        map.restaurantRender(element);
      }
    })
    map.map.addLayer(map.groupMarker);
  }

}