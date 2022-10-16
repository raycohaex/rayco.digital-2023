const THROTTLE_MIN = 30;//ms

window.addEventListener('DOMContentLoaded', (event) => {
    
    const holographicElements = document.querySelectorAll('[data-skill]');
    const mousetrigger = document.getElementById('section-intro');

    let enableCall = true;
    mousetrigger.addEventListener('mousemove', (event) => {
      if (!enableCall) return;

      enableCall = false;
      handleMouseMove(event);
      setTimeout(() => enableCall = true, THROTTLE_MIN);
    });

    updateHolographicBackground = (valueX, valueY) => {
        holographicElements.forEach( e => {
          e.style.backgroundPosition = "calc("+valueX * 9+"% + " + e.dataset.staticx +"px) "+valueY * 12+"%";
        });
      }
      
        handleMouseMove = event => {
        const valueX = event.clientX / document.documentElement.clientWidth;
        const valueY = event.clientY / document.documentElement.clientHeight;

        updateHolographicBackground(valueX, valueY);
        var halfW = ( document.documentElement.clientWidth / 2 );
        var halfH = ( document.documentElement.clientHeight / 2 );
        var coorX = ( halfW - ( event.pageX - document.documentElement.offsetLeft ) );
        var coorY = ( halfH - ( event.pageY - document.documentElement.offsetTop ) );
        var degX  = ( ( coorY / halfH ) * 5 ) + 'deg';
        var degY  = ( ( coorX / halfW ) * -5 ) + 'deg'; 
          
        holographicElements.forEach( e => {
          e.style.transform = "perspective( 600px ) translate3d( 0, 0, 0 ) scale(1) rotateX("+ degX +") rotateY("+ degY +")";
        });
      };
});