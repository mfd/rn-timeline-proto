/* global TimelineMax, TweenMax, Power4 */
/* global Youtube API */

import clipit from '../utils/clipit';
// import { TimelineLite, TweenMax, Power4 } from 'gsap/TweenMax';

export default class videoModal {
  constructor(el) {
    this.$el = el;
    this.$body = document.querySelector('body');
    this.$popup = this.$body.querySelector('[data-ref="video-hero.popup"]');

    this.$trigger = this.$body.querySelector('[data-ref="video-hero.trigger"]');
    this.$popup = this.$body.querySelector('[data-ref="video-hero.popup"]');
    this.$popupInner = this.$body.querySelector('[data-ref="video-hero.popupInner"]');
    this.$overlay = this.$body.querySelector('[data-ref="video-hero.overlay"]');
    this.$close = this.$body.querySelector('[data-ref="video-hero.close"]');
    this.$player = this.$body.querySelector('[data-ref="video-hero.player"]');

    this.videoId = this.$el.getAttribute('data-video-id');

    console.log(this.$el)

    this.bind();

    // this.checkYT()
    // .then(() => {
    //   this.initPlayer();
    //   console.log('Youtube works!')
    // });

    window.addEventListener('youtube-api-ready', this.initPlayer.bind(this));
  }
  bind() {
    if (this.$trigger) {
      this.$trigger.addEventListener('click', this.onModal.bind(this));
      this.$close.addEventListener('click', this.onModal.bind(this));
      this.$overlay.addEventListener('click', this.onModal.bind(this));
    }
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    window.addEventListener('keyup', this.keyUp.bind(this));
  }

  initPlayer() {
    //const { width, height } = this.$player.getBoundingClientRect();
    const width = window.innerWidth / 2;
    const height = window.innerHeight / 2;

    this.player = new YT.Player(this.$player, {
      height,
      width,
      videoId: this.videoId,
      controls: false,
      modestbranding: 1,
      enablejsapi: 1,
      rel: 0,
      origin: window.location.origin,
      playerVars: {rel: 0, showinfo: 0, ecver: 2}
    });
  }
  playVideo() {
    this.$loopVideo.play()
  }
  onModal(e) {
    e.preventDefault();
    console.log(e.currentTarget);
    switch (e.currentTarget.getAttribute('data-ref')) {
      case 'video-hero.trigger':
        this.open();
        break;
      case 'video-hero.close':
        this.close();
        break;
      case 'video-hero.overlay':
        this.close();
        break;
      default:
    }
  }
  open() {
    console.log(this.el);
    TweenMax.set(this.$popup, {
      display: 'flex',
    });

    const c = clipit(this.$popupInner, {
      from: 'middleY',
      to: 'visible',
    });

    TweenMax.set(this.$popupInner, {
      clip: c.from,
    });

    this.tl = new TimelineLite({
      onComplete: () => {
        this.$el.classList.add('popup-is-open');

        TweenMax.set(this.$popupInner, {
          clearProps: 'all',
        });


        this.player.playVideo();
      },
    });

    this.tl
      .from(this.$overlay, 0.3, {
        opacity: 0,
        ease: Power4.easeOut,
      })
      .to(this.$popupInner, 0.7, {
        clip: c.to,
        ease: Power4.easeInOut,
      });
  }

  close() {
    const c = clipit(this.$popupInner, {
      from: 'visible',
      to: 'middleY',
    });

    this.tl = new TimelineLite({
      onComplete: () => {
        this.$el.classList.remove('popup-is-open');

        TweenMax.set([
          this.$overlay,
          this.$popupInner,
          this.$popup,
        ], {
          clearProps: 'all',
        });
      },
    });

    this.tl
      .set(this.$popupInner, {
        clip: c.from,
      })
      .to(this.$popupInner, 0.7, {
        clip: c.to,
        ease: Power4.easeInOut,
      })
      .to(this.$overlay, 0.3, {
        opacity: 0,
        ease: Power4.easeOut,
      });

    this.player.pauseVideo();
  }

  checkYT() {
    return new Promise(e=>{
      const t = setInterval(()=>{
        YT && (clearInterval(t),
        e())
      }
      , 500)
    }
    )
  }
  keyUp(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      this.close();
    }
  }
  resize() {
    if (window.innerWidth >= 1024) {
      console.log('desk')
    } else {
      console.log('mobile')
    }
  }
}