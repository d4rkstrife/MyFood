

let app = new App("mapid", restaurantListe);
restaurantListe.forEach(element => {
    let restaurant = new Restaurant(element, restaurantListe);
    restaurant.render("restaurant_elt")
});
app.init();
