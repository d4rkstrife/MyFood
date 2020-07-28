class App {
    constructor(mapEmplacement) {
        this.mapEmplacement = mapEmplacement;
    }
    init() {
        let map = new Map(this.mapEmplacement);
        map.init();
    }
}