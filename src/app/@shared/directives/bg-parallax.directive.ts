import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[bgParallax]'
})

export class BgParallaxDirective {

  @Input() offset = 50;
  @Input() speed = 900;

  constructor(public el: ElementRef) {
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    let parallax = this.el.nativeElement;

    // Verificar si el elemento existe antes de intentar acceder a offsetTop
    if (parallax) {
      let y = (parallax.offsetTop - window.pageYOffset) * 47 / parallax.offsetTop + this.offset;

      parallax.style.backgroundPositionY = y + "%";
    } else {
      console.error("El elemento no se encontró. No se puede manejar el efecto parallax.");
    }
  }
}
