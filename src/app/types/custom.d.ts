declare global {
  interface JQuery {
    magnificPopup({type: string, gallery: {enabled: bool}});

    niceSelect(): JQLite;

    sticky(): JQLite;

    owlCarousel(param?:any):JQuery
  }
}
declare const $:JQueryStatic
