class App {
    constructor(mapEmplacement, restaurantData) {
        this.mapEmplacement = mapEmplacement;
        this.restaurants = restaurantData;
        this.restaurantCollection = [];
    }
    init() {
        this.restaurants.forEach(element => {
            this.restaurantCollection.push(new Restaurant(element));
        });
        let map = new Map(this.mapEmplacement, this.restaurantCollection);


        map.init();
    }
}