
let app = new App("mapid");
app.init();

$('#mobile_button').on('click', () => {
    //
    if ($('#restaurant_elt').css("display") === "none") {
        $('#restaurant_elt').show();
    } else {
        $('#restaurant_elt').hide();
    }
})
