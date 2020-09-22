class App {
    constructor(mapEmplacement) {
        this.mapEmplacement = mapEmplacement;
        this.restaurantCollection = [];
    }
    init() {
        let filtre = new Filtre("filter_button", "minimum", "maximum");
        let map = new Map(this.mapEmplacement, this.restaurantCollection, filtre);
        map.init();
    }
}