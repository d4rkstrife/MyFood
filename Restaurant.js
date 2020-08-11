class Restaurant {
    constructor(data) {
        this.name = data.restaurantName;
        this.adress = data.address;
        this.latitude = data.lat;
        this.longitude = data.long;
        this.rating = data.ratings;
        this.ratingAverage = this.calculateRatingAverage(this.rating)
    }
    render(elementPosition) {
        $(`#${elementPosition}`).append(`
        <div id="${this.name}" class="restaurant_div">
        <h3 class="nom_restaurant">${this.name}</h3>
        <p>${this.ratingAverage}</p>
       </div>
        `);
        $(`#${this.name}`).on('click', () => {
            $(`.user_comment`).empty();
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
        })
    }

    calculateRatingAverage(rating) {
        let sum = 0;
        for (let i = 0; i < rating.length; i++) {
            sum += rating[i].stars;
        }
        return Math.floor(sum / rating.length)
    }

    ratingsRender(elementPosition) {
        this.rating.forEach(element => {
            $(`#${elementPosition}`).append(`
            <div class="user_comment">
            <p class="stars_number">${element.stars}</p>
            <p class="comment_elt">${element.comment}</p>
            </div>
            `);

        });
    }
}