class Restaurant {
    constructor(data) {
        this.name = data.restaurantName
        this.divName = Math.floor(Math.random() * 100000);
        this.address = data.address;
        this.latitude = data.lat;
        this.longitude = data.long;
        this.rating = data.ratings;
        this.ratingAverage = this.calculateRatingAverage(this.rating);
        this.isRatingsShow = false;
        this.streetView = this.getStreetView();
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

    async getStreetView() {//on récupère la photo street view et on 
        let response = fetch(`https://maps.googleapis.com/maps/api/streetview?size=400x200&fov=90&location=${this.name},${this.address}&key=AIzaSyDHewuFhhdEj6CjeUotALhXvbNs6DsOjik`)
        let data = await response;
        this.streetView = data.url;
    }

    ratingsRender(map) { //rendu du formulaire d'ajout d'avis et de tous les avis utilisateurs.
        if (!this.isRatingsShow) {
            map.map.setView([this.latitude, this.longitude], 17);
            $(`#${this.divName} .avis_utilisateurs`).html(`
                            <img class="image_street_view" src="${this.streetView}" alt ="image street view">
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
        $(`#${this.divName} .avis_utilisateurs form`).on('click', (event) => {
            event.stopPropagation();
        })
        $('#valider_avis').on('click', (event) => {//event du clique sur le bouton valider du formulaire d ajout d avis
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
        this.isRatingsShow = false;
    }
}