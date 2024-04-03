class Slider {
    constructor(sliderId, options = {}) {
        this.slider = document.getElementById(sliderId);
        this.currentSlideIndex = 0;
        this.options = {
            slidesShow: options.slidesShow || 1,
            slidesScroll:  options.slidesScroll || 1,
            container: options.container || '.slider__wrapper',
            infinite: options.infinite || false,
            autoplay: options.autoplay || false,
            autoplaySpeed: options.autoplaySpeed || 3000,
            buttonClasses: options.buttonClasses || { prevBtn: '.slider__button_left', nextBtn: '.slider__button_right', disabled: 'slider__button_disabled'},
            pagination: options.pagination || { el: '.slider__pagination', type: 'dots' },
            breakpoints: options.breakpoints || null,
            spacing: options.spacing || 20
        };
        this.slidesShow = this.options.slidesShow;
        this.container = this.slider.querySelector(this.options.container);
        this.slides =  Array.from(this.container.children);
        this.prevButton = this.slider.querySelector(this.options.buttonClasses.prevBtn);
        this.nextButton = this.slider.querySelector(this.options.buttonClasses.nextBtn);
        this.timerId = null;
        this.init();
    }

    init() {
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());

        if(this.options.pagination.type === 'numbers') {
            const [paginationStart, paginationEnd] = this.slider.querySelector(this.options.pagination.el).children;

            paginationStart.textContent = this.currentSlideIndex;
            paginationEnd.textContent = this.slides.length;
        } else {
            const dots = Array.from(this.slider.querySelector(this.options.pagination.el).children);
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            })
        }

        this.adaptiveSlider();
        window.addEventListener('resize', () => this.handleResize());
        this.startAutoplay();
        this.render();
    }

    adaptiveSlider() {
        if(this.options.breakpoints) {
            const sizes = Object.keys(this.options.breakpoints);
            const values = Object.values(this.options.breakpoints);

            const currenWidth = window.innerWidth;
    
            sizes.forEach((size, index) => {
                if(currenWidth >= size) {
                    this.slidesShow = values[index].slidesShow;
                }
            });
            this.render()
        }
    }

    updatePagination() {
        if(this.options.pagination.type === 'numbers') {
            const [paginationStart, paginationEnd] = this.slider.querySelector(this.options.pagination.el).children;

            paginationStart.textContent = this.currentSlideIndex + this.slidesShow;
            paginationEnd.textContent = this.slides.length;
        } else {
            const dots = Array.from(this.slider.querySelector(this.options.pagination.el).children);
            dots.forEach((dot, index) => {
                index === this.currentSlideIndex ? 
                dot.classList.add('slider__pagination-dot_active') : 
                dot.classList.remove('slider__pagination-dot_active')
            })
        }
    }

    prevSlide() {
        const prevIndex = this.currentSlideIndex - this.options.slidesScroll;

        if(this.options.infinite && prevIndex < 0) {
            this.currentSlideIndex = this.slides.length - this.slidesShow;
        } else if(prevIndex >= 0) {
            this.currentSlideIndex = prevIndex;
        }
        this.render();
    }

    nextSlide() {
        const nextIndex = this.currentSlideIndex + this.options.slidesScroll;
        if(this.options.infinite && nextIndex > this.slides.length - this.slidesShow) {
            this.currentSlideIndex = 0
        } else if(nextIndex <= this.slides.length - this.slidesShow) {
            this.currentSlideIndex = nextIndex;
        }
        this.render();
    }

    goToSlide(index) {
        this.currentSlideIndex = index;
        this.render();
    }

    startAutoplay() {
        if(this.options.autoplay) {
            this.timerId = setInterval(() => {
                this.nextSlide();
            }, this.options.autoplaySpeed);
        }
    }

    handleResize() {
        this.adaptiveSlider();
        this.currentSlideIndex = 0;
    }

    render() {
        const slideWidth = (100 / this.slidesShow);
        this.slides.forEach(slide => slide.style.width = `calc(${slideWidth}%)`);
        // this.container.style.gap = `${this.options.spacing}px`;
        const translateX = -1 * this.currentSlideIndex * slideWidth;

        !this.options.infinite && this.currentSlideIndex === 0 ? 
        this.prevButton.classList.add(this.options.buttonClasses.disabled) : 
        this.prevButton.classList.remove(this.options.buttonClasses.disabled);

        !this.options.infinite && this.currentSlideIndex === this.slides.length - this.slidesShow ? 
        this.nextButton.classList.add(this.options.buttonClasses.disabled) : 
        this.nextButton.classList.remove(this.options.buttonClasses.disabled);

        this.container.style.transition = 'transform 0.5s ease-in-out';
        this.container.style.transform = `translateX(${translateX}%)`;
        this.updatePagination();
    }
}

const stageSlider = new Slider('stages-slider');
const membersSlider = new Slider('members-slider', { 
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    pagination: { 
        el: '.slider__pagination', 
        type: 'numbers'
    },
    slidesShow: 3,
    breakpoints: {
        320: {
            slidesShow: 1
        },
        720: {
            slidesShow: 2
        },
        1050: {
            slidesShow: 3
        }
    }
});