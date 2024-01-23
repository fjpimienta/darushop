import { Component, OnInit, Input, ElementRef, Renderer2, HostListener } from '@angular/core';

@Component({
	selector: 'app-count-to',
	templateUrl: './count-to.component.html',
	styleUrls: ['./count-to.component.scss']
})

export class CountToComponent implements OnInit {

	@Input() to: number;
	@Input() from: number;
	@Input() speed: number;
	@Input() interval: number;

	isExcuted = false;

	constructor(public elRef: ElementRef, private renderer: Renderer2) {
	}

	@HostListener('window:scroll', ['$event'])

	scrollHandler() {
    let pt = 0;
    const amount = this.to - this.from;
    const parentNode = this.renderer.parentNode(this.elRef.nativeElement);

    // Verificar si el nodo padre existe antes de intentar acceder a offsetTop
    if (parentNode) {
      const height = parentNode.offsetTop;

      if (!this.isExcuted && pt <= this.speed && height >= window.pageYOffset) {
        if (!this.isExcuted) {
          let timer = setInterval(() => {
            if (pt >= this.speed) {
              clearInterval(timer);
            }

            this.elRef.nativeElement.innerHTML = Math.ceil(pt * amount / this.speed).toString();
            pt = pt + this.interval;
          }, this.interval);
        }

        this.isExcuted = true;
      }
    } else {
      console.error("El nodo padre no se encontró. No se puede manejar el desplazamiento.");
    }
  }

	ngOnInit(): void {
	}
}
