class Restaurant {
    constructor(data) {
        this.name = data.restaurantName;
        this.address = data.address;
        this.latitude = data.lat;
        this.longitude = data.long;
        this.rating = data.ratings;
        this.ratingAverage = this.calculateRatingAverage(this.rating);
    }

    calculateRatingAverage(rating) {
        let sum = 0;
        if (rating.length === 0) {
            return 0;
        } else {
            for (let i = 0; i < rating.length; i++) {
                sum += rating[i].stars;
            }
            return Math.floor(sum / rating.length)
        }
    }

    ratingsRender(map) {
        $(`.user_comment`).empty();
        map.map.setView([this.latitude, this.longitude], 16);
        $(`.user_comment`).append(`
                    <h3 class="nom_restaurant">${this.name}</h3>
                    `);
        this.rating.forEach(element => {
            $(`.user_comment`).append(`
                        <div class="avis">
                        <div class="nbr_etoiles">
                        <p class="stars_number">${element.stars}</p>
                        <img src="image/etoile.png" alt="image etoile" class="image_etoile">
                        </div>
                        <p class="comment_elt">${element.comment}</p>
                        </div>
                        `);
        })
    }
}