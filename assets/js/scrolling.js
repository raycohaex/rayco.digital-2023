import ASScroll from '@ashthornton/asscroll'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isTouch = ('ontouchstart' in document.documentElement);

// https://github.com/ashthornton/asscroll
const asscroll = new ASScroll({
  disableRaf: true,
  ease: 0.175,
  touchEase: 0.175
});


gsap.ticker.add(asscroll.update);

ScrollTrigger.defaults({
  scroller: asscroll.containerElement });


ScrollTrigger.scrollerProxy(asscroll.containerElement, {
  scrollTop(value) {
    return arguments.length ? asscroll.currentPos = value : asscroll.currentPos;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  } });


asscroll.on("update", ScrollTrigger.update);
ScrollTrigger.addEventListener("refresh", asscroll.resize);

window.addEventListener("load", () => {
  const totalScroll = asscroll.containerElement.scrollHeight - innerHeight;

  let sectionintro = document.getElementById('section-intro');

  const getWidth = () => {
    return window.innerWidth;
  }

  const getHeight = () => {
    return '100%';
  }

    var tl = gsap.timeline({
      scrollTrigger: {    
        invalidateOnResize: true,
        invalidateOnRefresh: true,
          trigger: '#section-work',
          start: (window.innerHeight/100*70)+" bottom",
          end: "+="+(window.innerHeight-(window.innerHeight/100*70)),
          scrub: 1,
      },
      defaults: {
      duration: 1
      }
  })
  .to('.expanding-background', {
      width: getWidth,
      height: getHeight,
      padding: 0,
      borderRadius: 0
  }, 0)


  asscroll.enable();
});

