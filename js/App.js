class App {
    constructor(mapEmplacement) {
        this.mapEmplacement = mapEmplacement;
    }
    init() {
        let filtre = new Filtre("filter_button", "minimum", "maximum");
        let map = new Map(this.mapEmplacement, filtre);
        map.init();
    }
}