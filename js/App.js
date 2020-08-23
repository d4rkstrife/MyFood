class App {
    constructor(mapEmplacement, restaurantData) {
        this.mapEmplacement = mapEmplacement;
        this.restaurants = restaurantData;
        this.restaurantCollection = [];
    }
    init() {
        let filtre =  new Filtre("filter_button","minimum", "maximum");
        this.restaurants.forEach(element => {
            this.restaurantCollection.push(new Restaurant(element));
        });
        let map = new Map(this.mapEmplacement, this.restaurantCollection, filtre);


        map.init();
    }
}