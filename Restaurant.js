class Restaurant {
    constructor(data) {
        this.name = data.restaurantName;
        this.address = data.address;
        this.latitude = data.lat;
        this.longitude = data.long;
        this.rating = data.ratings;
        this.ratingAverage = this.calculateRatingAverage(this.rating);
    }
    render(elementPosition, map) {
        $(`#${elementPosition}`).append(`
        <div id="${this.name}" class="restaurant_div">
        <h3 class="nom_restaurant">${this.name}</h3>
        <img src="https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${this.latitude},${this.longitude}&fov=80&heading=70&pitch=0 &key=AIzaSyBfhcy9vQ6MGH5rO_faSiF48S-jkGNZMGY" alt="image street" class="image_etoile">
        <p>${this.address}</p>
        <div class="nbr_etoiles">
        <p>${this.ratingAverage}</p>
        <img src="image/etoile.png" alt="image etoile" class="image_etoile">
        </div>
      
       </div>
        `);
        $(`#${this.name}`).on('click', () =>{
          this.ratingsRender(map)
          });
    }

    calculateRatingAverage(rating) {
        let sum = 0;
        for (let i = 0; i < rating.length; i++) {
            sum += rating[i].stars;
        }
        return Math.floor(sum / rating.length)
    }

    ratingsRender(map) {
        $(`.user_comment`).empty();
        map.map.setView([this.latitude, this.longitude], 16);
        map.getNearestRestaurant(this.latitude, this.longitude);
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