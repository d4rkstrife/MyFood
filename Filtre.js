class Filtre {
  constructor(buttonElt, minElt, maxElt){
    this.elt = buttonElt;
    this.minElt = minElt;
    this.maxElt = maxElt;
    this.min = 1;
    this.max = 5;
  }
  init(){
    $(`#${this.elt}`).on('click', ()=> {
      this.min = $(`#${this.minElt}`).val();
      this.max = $(`#${this.maxElt}`).val();
      console.log(this.min)
      console.log(this.max)
    })
  }
  
}