"use strict";
/**
 * Слайдер с миниатюрами
 */

import Swiper from 'swiper';

class GalSlider {
    constructor() {
        this.dataName = {
            gal: 'gal',
            history: 'history',
            galThumb: 'gal-thumb',
            galThumbSlide: 'gal-thumb-slide',
            galMain: 'gal-main',
            galNext: 'gal-next',
            galPrev: 'gal-prev'
        };

        this.className = {
          isDrag: 'is-drag',
          notVisible: 'not-visible',
          swiperActiveThumb:'swiper-active-thumb',
        };
        this.init(document.querySelector('.history'))
    }

    init($container){
        let _this = this,
            $gal = $container.querySelectorAll(`[data-${this.dataName.gal}]`);

        if (!$gal.length) return false;

        $gal.forEach((el) => {
            let $self = el,
                dir = $self.getAttribute(`data-${this.dataName.gal}`),
                isHistory = $self.getAttribute(`data-${this.dataName.history}`),
                $thumb = $self.querySelector(`[data-${this.dataName.galThumb}]`),
                $thumbSlide = $self.querySelectorAll(`[data-${this.dataName.galThumbSlide}]`),
                $mainGal = $self.querySelector(`[data-${this.dataName.galMain}]`),
                $mainGalNext = $self.querySelector(`[data-${this.dataName.galNext}]`),
                $mainGalPrev = $self.querySelector(`[data-${this.dataName.galPrev}]`),
                sliderLength = $self.querySelectorAll('.knpk-gal-slider__main .swiper-slide').length,
                currentSlide = $self.querySelector('.knpk-common-slider__counter-current-slide'),
                lastSlide = $self.querySelector('.knpk-common-slider__counter-last-slide'),
                counterProgress = $self.querySelector('.knpk-common-slider__counter-timeline'),
                timerId,
                dirXs = dir === 'vertical' ? 10 : 15,
                dirMd = dir === 'vertical' ? 10 : 47,
            //Init Swiper for thumbnails of main gallery
                galleryThumbs = new Swiper($thumb, {
                    direction: dir || 'horizontal',
                    spaceBetween: isHistory ? 0 : 10,
                    slidesPerView: 'auto',
                    loop: false,
                    freeMode: true,
                    speed: 300,
                    resistanceRatio: 0.5,
                    allowTouchMove: false,
                    breakpoints: { //>=
                        768: {
                            spaceBetween: isHistory ? 0 : 40
                        },
                        992: {
                            spaceBetween: isHistory ? 0 : 47,
                        }
                    },
                    on: {
                        init: function(){
                            this.update();
                        },
                    }
                }),
            //Init Swiper for main gallery
                galleryTop = new Swiper($mainGal, {
                    slidesPerView: 1,
                    spaceBetween: 10,
                    loop: false,
                    speed: 400,
                    resistanceRatio: 0.5,
                    navigation: {
                        nextEl: $mainGalNext,
                        prevEl: $mainGalPrev,
                    },
                    autoplay: {
                        delay: 8000,
                        disableOnInteraction: false,
                        },
                    on: {
                        init: function(){
                            this.update();
                            $self.classList.remove(_this.className.notVisible);
                            _this.thumbScroll(galleryThumbs, this);
                            if (lastSlide) lastSlide.textContent = sliderLength.toString().padStart(2, "0");
                        },
                        slideChange: function () {
                            _this.thumbScroll(galleryThumbs, this);
                            setTimeout(()=>{
                                let $currentYear = $self.querySelector('.swiper-active-thumb .knpk-history__year').innerText;
                                document.querySelector('.odometer').innerHTML = $currentYear;
                            }, 300);
                        },
                        slideChangeTransitionStart: function () {
                            const currentTimeline = $self.querySelector('.swiper-slide-active .experts-slider__timeline');
                            if (currentSlide) {
                                currentSlide.textContent = (galleryTop.realIndex + 1).toString().padStart(2, "0");
                            }

                            if (currentTimeline) {
                                clearTimeout(timerId);
                                currentTimeline.classList.remove("fill-animation");

                                timerId = setTimeout(() => {
                                    currentTimeline.classList.add("fill-animation");
                                }, 10);
                            }

                            if (isHistory) {
                                $self.querySelector('.swiper-active-thumb').classList.add('fill-animation');
                            }
                        }
                    }
                });
            
                console.log(galleryTop)
            // Запуск слайдера после докрутки до него
            const galSlider = document.querySelector('[data-gal]');
            if (galSlider) {
                // galleryTop.autoplay.stop();
                // galleryTop.autoplay.start();
                $self.querySelector('.swiper-active-thumb').classList.add('fill-animation');
            }


            // if (galSlider) {
            //     galleryTop.autoplay.stop();

            //     const onWindowScroll = () => {
            //         const galSliderOffsetTop = $(galSlider).offset().top + $(galSlider).outerHeight();
            //         const scrolledHeight = window.pageYOffset + $(window).height();
            //         const expertsTimeline = $self.querySelector('.experts-slider__timeline');

            //         if (scrolledHeight >= galSliderOffsetTop - 115) {
            //             galleryTop.autoplay.start();

            //             $self.querySelector('.swiper-active-thumb').classList.add('fill-animation');
            //             if (expertsTimeline) $self.querySelector('.experts-slider__timeline').classList.add('fill-animation');

            //             window.removeEventListener('scroll', onWindowScroll);
            //         }
            //     }

            //     window.addEventListener('scroll', onWindowScroll);
            // }

            //Add or remove dragging class into thumbnails wrapper
            galleryThumbs.on('touchStart transitionStart sliderMove', function () {
                this.$el.addClass(_this.className.isDrag);
            });
            galleryThumbs.on('touchEnd transitionEnd', function () {
                this.$el.removeClass(_this.className.isDrag);
            });

            //Update positions if thumbnail slide clicked
            $thumbSlide.forEach((el) => {
               el.addEventListener('click', (e) => {
                   e.preventDefault();
                   const $slide = e.currentTarget,
                         index = this.indexInParent($slide);

                   if (galleryTop){
                       this.thumbScroll(galleryThumbs, galleryTop, index);
                       galleryTop.slideTo(index);
                   }
               });
            });
        });
    }

    /**
     * Update thumbnails wrapper position
     * @param sliderThumb
     * @param sliderMain
     * @param index
     * @returns {boolean}
     */
    thumbScroll (sliderThumb, sliderMain, index) {
        if (!sliderThumb && !sliderMain) return false;

        sliderThumb.activeIndex = index || sliderMain.activeIndex;

        let activeIndex = sliderThumb.activeIndex,
            dir = sliderThumb.params.direction,
            $activeThumb = sliderThumb.slides[activeIndex];

        if ((!sliderMain.el.offsetHeight || !sliderMain.el.offsetWidth) && (!sliderThumb.length)) return false;

        let sliderHeight = sliderMain.el.offsetHeight || 0,
            sliderWidth = sliderMain.el.offsetWidth || 0,
            sliderSize = (dir === 'horizontal') ? sliderWidth : sliderHeight,

            thumbSpaceBetween = parseInt(sliderThumb.params.spaceBetween),
            thumbCount = sliderThumb.slides.length,
            thumbHeight = $activeThumb.offsetHeight || 0,
            thumbWidth = $activeThumb.offsetWidth || 0,
            thumbSize = (dir === 'horizontal') ? thumbWidth : thumbHeight,

            thumbsSizeAll = (thumbSize + thumbSpaceBetween) * thumbCount,
            position = (sliderSize / 2) - (thumbSize / 2),
            scrollThumbSize = activeIndex * (thumbSize + thumbSpaceBetween) - position;


        if ((scrollThumbSize + sliderSize) > thumbsSizeAll) {
            scrollThumbSize = thumbsSizeAll - sliderSize - thumbSpaceBetween;
        }
        if (scrollThumbSize < 0) scrollThumbSize = 0;

        sliderThumb.wrapperEl.style.transitionDuration = '';
        sliderThumb.setTranslate(-scrollThumbSize);
        for (let i = 0; i < sliderThumb.slides.length; i++){
            sliderThumb.slides[i].classList.remove(this.className.swiperActiveThumb);
        }
        $activeThumb.classList.add(this.className.swiperActiveThumb);
    }
    indexInParent(node) {
        let children = node.parentNode.childNodes,
            num = 0;
        for (let i = 0; i < children.length; i++) {
            if (children[i] === node) return num;
            if (children[i].nodeType === 1) num++;
        }
        return -1;
    }
}

export default GalSlider;
