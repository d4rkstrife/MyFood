class App {
    constructor(mapEmplacement, restaurantData) {
        this.mapEmplacement = mapEmplacement;
        this.restaurantsData = restaurantData;
    }
    init() {
        console.log(this.restaurantsData)
        let map = new Map(this.mapEmplacement, this.restaurantsData);
        map.getUserPosition();
    }
}