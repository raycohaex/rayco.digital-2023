// when document is ready, vanilla js
document.addEventListener("DOMContentLoaded", function(event) {

    // capture device tilt
    window.addEventListener('deviceorientation', function(event) {
        //console log the event
        console.log(event);
        // get the tilt values
        let tiltLR = event.gamma;
        let tiltFB = event.beta;
        // get the tilt values
        let dirLR = event.alpha;
        let dirFB = event.alpha;

        // console.log(tiltLR);
        // console.log(tiltFB);
        // console.log(dirLR);
        // console.log(dirFB);
    });
});