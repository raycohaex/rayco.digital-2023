import ASScroll from '@ashthornton/asscroll'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isTouch = ('ontouchstart' in document.documentElement);

// https://github.com/ashthornton/asscroll
const asscroll = new ASScroll({
  disableRaf: true });


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

  let test = document.getElementById('section-intro').getBoundingClientRect();

  var tl = gsap.timeline({
        scrollTrigger: {    
            start: test.bottom - 300,
            scrub: 1,
        },
        defaults: {
        duration: 1
        }
    })
    .to('.expanding-background', {
        width: window.innerWidth,
        height: '100%',
        borderRadius: 0
    }, 0)

//   gsap.to(".expanding-background", {
//     scrollTrigger: {
//         pinType: isTouch ? 'fixed' : 'transform',
//         trigger: "#section-work",
//         scrub: true,
//     },
//     width: window.innerWidth,
//     ease: "sine.out",
//   }, 0)


  asscroll.enable();
});