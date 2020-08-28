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
        map.map.setView([this.latitude, this.longitude], 16);
        this.rating.forEach(element => {
            $(`#${this.name} .liste_avis`).append(`
                        <div class="avis">
                        <div class="nbr_etoiles">
                        <p class="stars_number">${element.stars}</p>
                        <img src="image/etoile.png" alt="image etoile" class="image_etoile">
                        </div>
                        <p class="comment_elt">${element.comment}</p>
                        </div>
                        `);
            $(`#${this.name}`).on('click', () => {
                $(`#${this.name} .liste_avis`).empty();
            });
        })

    }
}