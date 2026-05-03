const activateCarousel = () => {
    const carouselInnerRR = document.querySelector('#rr-carousel-inner');
    const carouselInnerCS = document.querySelector('#cs-carousel-inner');

    const firstCard = document.querySelector('.carousel-item');

    const nextCardButtonRR = document.querySelector('#rr-carousel-control-next');
    const prevCardButtonRR = document.querySelector('#rr-carousel-control-prev');

    const nextCardButtonCS = document.querySelector('#cs-carousel-control-next');
    const prevCardButtonCS = document.querySelector('#cs-carousel-control-prev');

    let carouselWidth = carouselInnerRR.scrollWidth;
    let cardWidth = firstCard.offsetWidth;

    let browserWidth = window.innerWidth
    let numCardDisplay;
    if (browserWidth >= 1300) {
        numCardDisplay = 5;
    } else {
        numCardDisplay = 3;
    }
    let scrollPosition = 0;

    //Alter carousel panning to match new window size
    window.addEventListener('resize', e => {
        browserWidth = window.innerWidth
        if (browserWidth >= 1300) {
            numCardDisplay = 5;
        } else {
            numCardDisplay = 3;
        }
        carouselInnerRR.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        })
        carouselInnerCS.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        })
    })

    //Pan Carousel to next item
    nextCardButtonRR.addEventListener('click', e => {
        if (scrollPosition < (carouselWidth - (cardWidth * numCardDisplay))) {
            scrollPosition += cardWidth;
        } else {
            scrollPosition = 0;
        }
        carouselInnerRR.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        })
    })

    nextCardButtonCS.addEventListener('click', e => {
        if (scrollPosition < (carouselWidth - (cardWidth * numCardDisplay))) {
            scrollPosition += cardWidth;
        } else {
            scrollPosition = 0;
        }
        carouselInnerCS.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        })
    })

    //Pan Carousel to previous item
    prevCardButtonRR.addEventListener('click', e => {
        if (scrollPosition <=  0) {
            scrollPosition = cardWidth * (numCardDisplay - 1);
        } else {
            scrollPosition -= cardWidth;
        }
        carouselInnerRR.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        })
    })

    prevCardButtonCS.addEventListener('click', e => {
        if (scrollPosition <=  0) {
            scrollPosition = cardWidth * (numCardDisplay - 1);
        } else {
            scrollPosition -= cardWidth;
        }
        carouselInnerCS.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        })
    })
}

export default {
  activateCarousel,
};