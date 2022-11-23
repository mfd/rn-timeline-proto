export default class VideoItem {
  constructor(el) {
    this.$el = el;
    this.init(this.$el);
  }
  init() {
    this.link = this.$el;
    this.$body = document.querySelector('body');
    this.$popup = this.$body.querySelector('[data-ref="video-hero.popup"]');
    this.$close = this.$body.querySelector('[data-ref="video-hero.close"]');
    this.$player = this.$body.querySelector('[data-ref="video-hero.player"]');
    this.setEvents();
    window.addEventListener('youtube-api-ready', this.initPlayer.bind(this));
    // this.initPlayer();
  }

  getElements() {
    // this.link = this.$el.querySelector('.media__cover');
  }

  setEvents() {
    this.link.addEventListener('mouseenter', this.mouseEnter.bind(this));
    this.link.addEventListener('mouseleave', this.mouseLeave.bind(this));
    this.link.addEventListener('focus', this.mouseEnter.bind(this));
    this.link.addEventListener('blur', this.mouseLeave.bind(this));
    this.link.addEventListener('click', this.startVideo.bind(this));

    this.$close.addEventListener('click', this.hide.bind(this));

    window.addEventListener('keyup', (e) => {
      if(e.keyCode == 27) {
        this.hide();
      }
    });

  }

  mouseEnter() {
    this.$el.classList.add('media--hover');
    console.log(`${this.link.getAttribute('data-video-id')}`)
  }

  mouseLeave() {
    this.$el.classList.remove('media--hover');
    console.log('leave') 
  }

  startVideo(e) {
    e.preventDefault();
    this.loadVideo({
      video: this.link.getAttribute('data-video-id'),
      title: this.link.getAttribute('data-title'),
    });
  }
  loadVideo(data) {
    if(this.current == data.video) {
      this.player.playVideo();
      setTimeout(() => {
        this.show();
      }, 80);
      return;
    }
    this.current = data.video;

    this.player.loadVideoById({
      videoId: data.video
    });
    //this.$refs.title.textContent = data.title;
    this.show();
  }

  initPlayer() {
    console.log('init Player')
    this.player = new YT.Player(this.$player, {
      playerVars: {
        controls: 2,
        rel: 0
      }
    });
  }
  show() {
    TweenMax.set(this.$popup, {
      display: 'flex',
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
      // .to(this.$popupInner, 0.7, {
      //   clip: c.to,
      //   ease: Power4.easeInOut,
      // });
  }

  hide(e) {
    if(e) e.preventDefault();
    this.player.pauseVideo();
    this.$el.classList.remove('video--show');
  }
}