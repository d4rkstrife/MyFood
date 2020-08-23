class Filtre {
  constructor(buttonElt, minElt, maxElt){
    this.elt = buttonElt;
    this.minElt = minElt;
    this.maxElt = maxElt;
    this.min = 1;
    this.max = 5;
  }
  init(map){
      this.min = $(`#${this.minElt}`).val();
      this.max = $(`#${this.maxElt}`).val();
      map.map.removeLayer(map.groupMarker);
      map.groupMarker = L.layerGroup([]);
      map.getNearestRestaurant();
      map.map.addLayer(map.groupMarker);
  }
  
}