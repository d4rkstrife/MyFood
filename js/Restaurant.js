class Restaurant {
    constructor(data) {
        this.name = data.restaurantName;
        this.address = data.address;
        this.latitude = data.lat;
        this.longitude = data.long;
        this.rating = data.ratings;
        this.ratingAverage = this.calculateRatingAverage(this.rating);
        this.isRatingsShow = false;
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
        if (!this.isRatingsShow) {
            console.log("open");
            map.map.setView([this.latitude, this.longitude], 16);
            $(".avis_utilisateurs").html(`
                <div class="liste_avis"></div>
            `);
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

            });
            $(`#${this.name} .avis_utilisateurs`).append(`
                            <form>
                            <label for="note">Noter le restaurant :</label>
                            <select name="note" id="note">
                            <option value="1" selected>1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            </select>
                            <input type="text" id="avis" name="avis">
                            <button id="valider_avis">Valider</button>
                            </form>
            `)
            this.isRatingsShow = true;
        } else {
            this.closeRating();
        }
        $(`#${this.name} .avis_utilisateurs form`).on('click', () => {
            event.stopPropagation();
        })
        $('#valider_avis').on('click', () => {
            event.preventDefault();
            let stars = parseInt($('#note').val());
            let comment = $('#avis').val();
            this.addRating(stars, comment);
            $(`#${this.name} .avis_utilisateurs`).empty();
            $(`#${this.name} .nom_etoiles .nbr_etoiles p`).text(`${this.ratingAverage}`);



        })

    }

    addRating(stars, comment) {
        let newRating = {
            "stars": stars,
            "comment": comment
        };
        this.rating.push(newRating);
        this.ratingAverage = this.calculateRatingAverage(this.rating);

    }

    closeRating() {
        $(`#${this.name} .avis_utilisateurs`).empty();
        console.log("close");
        this.isRatingsShow = false;
    }
}