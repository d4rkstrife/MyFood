class Restaurant {
    constructor(data) {
        this.name = data.restaurantName;
        this.adress = data.address;
        this.latitude = data.lat;
        this.longitude = data.long;
        this.rating = data.ratings;
    }
    render(elementPosition) {
        $(`#${elementPosition}`).append(`
        <div id="${this.name}" class="restaurant_div">
        <h3 class="nom_restaurant">${this.name}</h3>
       </div>
        `);
        this.ratingsRender(this.name);
    }
    ratingsRender(elementPosition) {
        this.rating.forEach(element => {
            console.log(element.stars)
            $(`#${elementPosition}`).append(`
            <div class="user_comment">
            <p class="stars_number">${element.stars}</p>
            <p class="comment_elt">${element.comment}</p>
            </div>
            `);

        });
    }
}