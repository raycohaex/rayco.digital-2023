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

  // let resizeTimeout;
  // window.addEventListener("resize", () => {
  //   clearTimeout(resizeTimeout);
  //   resizeTimeout = setTimeout(() => {
  //     window.location.reload();
  //   }, 200);
  // });


asscroll.on("update", ScrollTrigger.update);

// fix gsap resize bug caused by asscroll

window.addEventListener("load", () => {
  const totalScroll = asscroll.containerElement.scrollHeight - innerHeight;

  let sectionintro = document.getElementById('section-intro');

  // sort of like the above, make a div go from 85% width to 100% with and then back to 85% width
  // if width < 700px
  if (window.innerWidth > 576) {
  gsap.timeline({
    scrollTrigger: {
      trigger: '#section-work',
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
    defaults: {
      duration: 1
    }
  })
  .to('.expanding-background', {
    width: "100%",
    duration: 0.4,
  }, 0)
  .to('.expanding-background', {
    
    width: "calc(100% - 200px)",
    duration: 0.2
  }, 1)
}
  

  const workitems = document.querySelectorAll('.work-item');
  const workitemcontainer = document.querySelector('.work-item-container');

  // work-item should be -200px from the top by default and scroll to 0 the more its center to the screen
  workitems.forEach( (e, i) => {
  gsap.timeline({
      scrollTrigger: {
        trigger: e,
        start: "top bottom",
        end: "bottom top",
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

  const imgCraft = document.getElementById('img-craft-education');
  gsap.timeline({
    scrollTrigger: {
      trigger: imgCraft,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  })
  .fromTo(imgCraft, {
    y: 40,
    scale: 0.90,
    rotate: "-16deg",
    ease: "none"
  }, {
    y: 0,
    ease: 0,
    scale: 1,
    rotate: "0deg",
  }, 0)

  const imgMicroservice = document.getElementById('img-microservices');
  gsap.timeline({
    scrollTrigger: {
      trigger: imgMicroservice,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  })
  .fromTo(imgMicroservice, {
    y: 150,
    scale: 0.96,
    skew: "-8deg",
    ease: "none"
  }, {
    y: 0,
    ease: 0,
    scale: 1,
    skew: "0deg",
    rotate: "0deg",
  }, 0)

  const imgWeb3 = document.getElementById('img-web-3');
  gsap.timeline({
    scrollTrigger: {
      trigger: imgWeb3,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  })
  .fromTo(imgWeb3, {
    y: -220,
  }, {
    y: 0,
  }, 0)

  const imgWeb3Special = document.getElementById('special-img-web3-toplayer');
  gsap.timeline({
    scrollTrigger: {
      trigger: imgWeb3Special,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  })
  .fromTo(imgWeb3Special, {
    y: -50,
  }, {
    y: 0,
  }, 0)

  

  asscroll.enable();
});

