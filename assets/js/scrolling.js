import ASScroll from '@ashthornton/asscroll'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Timeline } from 'gsap/gsap-core';

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

  //   var tl = gsap.timeline({
  //     scrollTrigger: {    
  //       invalidateOnResize: true,
  //       invalidateOnRefresh: true,
  //         trigger: '#section-work',
  //         start: "top bottom-=500",
  //         end: "top top-=500",
  //         scrub: 1,
  //     },
  //     defaults: {
  //     duration: 1
  //     }
  // })
  // .to('.expanding-background', {
  //     width: getWidth,
  //     height: getHeight,
  //     padding: 0,
  //     borderRadius: 0
  // }, 0)

  // sort of like the above, make a div go from 85% width to 100% with and then back to 85% width
  var tl = gsap.timeline({
    scrollTrigger: {
      invalidateOnResize: true,
      invalidateOnRefresh: true,
      trigger: '#section-work',
      start: "top bottom-=500",
      end: "bottom top-=300",
      scrub: 1,
    },
    defaults: {
      duration: 1
    }
  })
  .to('.expanding-background', {
    width: getWidth,
    height: getHeight,
    duration: 0.2,
  }, 0)
  .to('.expanding-background', {
    width: '85%',
    height: '100%',
    duration: 0.25,
  }, 0.85)


  const workitems = document.querySelectorAll('.work-item');
  const workitemcontainer = document.querySelector('.work-item-container');

  // work-item should be -200px from the top by default and scroll to 0 the more its center to the screen
  workitems.forEach( (e, i) => {
    let tl = gsap.timeline({
      scrollTrigger: {
        invalidateOnResize: true,
        invalidateOnRefresh: true,
        trigger: e,
        start: "top bottom",
        end: "top bottom-=600",
        scrub: 1,
      },
    })
    .fromTo(e, {
      y: 100,
      ease: "none"
    }, {
      y: 0,
      ease: "none"
    }, 0)
  });
  

  asscroll.enable();
});

