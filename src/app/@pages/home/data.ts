import { sliderOpt } from '@shared/data';

export const introSlider = {
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

export const brandSlider = {
    ...sliderOpt,
    nav: false,
    dots: false,
    margin: 0,
    responsive: {
        0: {
            items: 2
        },
        420: {
            items: 3
        },
        600: {
            items: 4
        },
        900: {
            items: 5
        },
        1024: {
            items: 6
        },
        1360: {
            items: 6,
            nav: true,
            margin: 30
        }
    }
}

export const newSlider = {
    ...sliderOpt,
    nav: true,
    dots: false,
    margin: 20,
    loop: false,
    responsive: {
        0: {
            items:2
        },
        480: {
            items:2
        },
        768: {
            items:3
        },
        992: {
            items:4
        },
        1200: {
            items:5,
            dots: true
        }
    }
}

export const trendySlider = {
    ...sliderOpt,
    nav: true,
    dots: false,
    margin: 20,
    loop: false,
    responsive: {
        0: {
            items:2
        },
        480: {
            items:2
        },
        768: {
            items:3
        },
        992: {
            items:4
        }
    }
}

export const blogSlider = {
    ...sliderOpt,
    nav: false,
    dots: true,
    items: 3,
    margin: 20,
    loop: false,
    responsive: {
        0: {
            items: 1
        },
        576: {
            items: 2
        },
        992: {
            items: 3
        }
    }
}

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
