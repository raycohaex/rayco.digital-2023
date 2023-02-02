import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const isTouch = ('ontouchstart' in document.documentElement);

if (document.body.classList.contains('homepage')) {

  window.addEventListener("load", () => {
    if (window.innerWidth > 576) {
      gsap.timeline({
          scrollTrigger: {
            trigger: '#section-work',
            start: "top bottom",
            end: "top top",
            scrub: 1,
          }
        })
        .to('.expanding-background', {
          width: "100%",
          height: "100%",
          duration: 0.3,
        }, 0)
    }

    const workitems = document.querySelectorAll('.work-item');
    workitems.forEach((e, i) => {
      gsap.timeline({
          scrollTrigger: {
            trigger: e,
            start: "top bottom",
            end: "top bottom+=400",
            scrub: 1,
          },
        })
        .fromTo(e, {
          y: 50,
          ease: "none"
        }, {
          y: 0,
          ease: "none"
        }, 0)
    });

    const imgCraft = document.getElementById('img-craft-education');
    let tl = gsap.timeline({
        scrollTrigger: {
          trigger: imgCraft,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          // if viewport is 768px or less, 
          
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
          invalidateOnRefresh: false,
          scrub: 1,
        },
      })
      .fromTo(imgMicroservice, {
        y: 150,
        scale: 0.96,
        ease: "none"
      }, {
        y: 0,
        ease: 0,
        scale: 1,
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

      // if footer element is in view, then add class to site-menu
      const footer = document.getElementById('footer');
      const siteMenu = document.querySelector('.mobile-responsive-menu');

      // when the footer is in view, move the sitemenu up a bit
      // only do it when siteMenu contains child
      if (window.innerWidth < 576) {
      gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "top bottom",
          end: "top bottom",
          scrub: 1,
        },
      })
      .fromTo(siteMenu, {
        y: 0,
      }, {
        y: -35,
      }, 0)
    }

  });
}