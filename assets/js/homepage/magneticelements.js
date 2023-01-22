import { Timeline } from 'gsap/gsap-core';
import gsap from 'gsap';
import MagnetMouse from 'magnet-mouse';

let mm = new MagnetMouse({
  magnet: {
    element: '.magnetic',
    enabled: true,
    distance: 5,
    position: 'center'
  },
  throttle: 20, /* Time (in ms) between each eventListener calls */
  inCallback: null, /* Callback when mouse enters in the magnet effect */
  outCallback: null /* Callback when mouse leaves in the magnet effect */
});
  
mm.init();