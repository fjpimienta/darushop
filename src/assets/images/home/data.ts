import { sliderOpt } from 'src/app/shared/data';

export const serviceSlider = {
    ...sliderOpt,
    dots: false,
    nav: false,
    responsive: {
        0: {
            items: 1
        },
        375: {
            items: 2
        },
        768: {
            items: 3
        },
        992: {
            items: 4
        }
    }
}

export const productSlider = {
    ...sliderOpt,
    nav: false,
    dots: false,
    loop: false,
    responsive: {
        992: {
            nav: true
        }
    }
}

export const reviewSlider = {
    ...sliderOpt,
    nav: false,
    dots: false,
    margin: 20,
    responsive: {
        0: {
            items: 1,
            dots: true
        },
        576: {
            items: 2,
            dots: true
        },
        992: {
            items: 3
        }
    }
}