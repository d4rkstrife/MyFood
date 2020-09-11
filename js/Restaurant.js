class Restaurant {
    constructor(data) {
        this.name = data.restaurantName
        this.divName = this.name.replace(/ /g, "") + Math.floor(Math.random() * 100);
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
            return Math.round(sum / rating.length)
        }
    }

    ratingsRender(map) { //rendu du formulaire d'ajout d'avis et de tous les avis utilisateurs.
        if (!this.isRatingsShow) {
            console.log("open");
            map.map.setView([this.latitude, this.longitude], 16);
            $(`#${this.divName} .avis_utilisateurs`).html(`
                            <form>
                            <label for="note">Noter le restaurant :</label>
                            <select name="note" id="note">
                            <option value="1" selected>1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            </select>
                            <textarea id="avis" name="avis" required></textarea>
                            <button id="valider_avis">Valider</button>
                            </form>
                            <div class="liste_avis">
                            <h4>Avis Clients</h4>
                            </div>
            `)
            this.rating.forEach(element => {
                this.ratingRender(element);

            });
            this.isRatingsShow = true;
        } else {
            this.closeRating();
        }

        //event du click sur le formulaire
        $(`#${this.divName} .avis_utilisateurs form`).on('click', () => {
            event.stopPropagation();
        })
        $('#valider_avis').on('click', () => {//event du clique sur le bouton valider du formulaire d ajout d avis
            event.preventDefault();
            let stars = parseInt($('#note').val());
            let comment = $('#avis').val().replace(/<(?:.|\s)*?>/g, "");

            if ((stars > 0 && stars <= 5) && comment) {
                $('#avis').val("");
                this.addRating(stars, comment);
                $(`#${this.divName} .nom_etoiles .nbr_etoiles p`).text(`${this.ratingAverage}`);
            }

        });
    }

    ratingRender(rating) {//rendu d'un seul avis
        $(`#${this.divName} .liste_avis`).append(`
        <p class="ligne"></p>
        <div class="avis">
        <div class="nbr_etoiles">
        <p class="stars_number">${rating.stars}</p>
        <img src="image/etoile.png" alt="image etoile" class="image_etoile">
        </div>
        <p class="comment_elt">${rating.comment}</p>
        </div>
        `);
    }

    addRating(stars, comment) { //on rajoute l'avis à tous les autres avis deja presents.
        let newRating = {
            "stars": stars,
            "comment": comment
        };
        this.rating.push(newRating);
        this.ratingRender(newRating);
        this.ratingAverage = this.calculateRatingAverage(this.rating);

    }

    closeRating() {
        $(`#${this.divName} .avis_utilisateurs`).html("");
        console.log("close");
        this.isRatingsShow = false;
    }
}