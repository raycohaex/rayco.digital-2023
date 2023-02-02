const jumpContainers = document.querySelector('[data-jump-container="menu"]');
const jumpToElements = document.querySelector('[data-jump-to="menu"]');
const breakpoint = 768;

if (jumpContainers && jumpToElements) {
    const originalParent = jumpToElements.parentElement;
    let elementMoved = false;

    // on window resize
    window.addEventListener('load', () => {
        adjustMenu();
    });

    window.addEventListener('resize', () => {
        adjustMenu();
    });

    const adjustMenu = () => {
        if (window.innerWidth < breakpoint && !elementMoved) {
            jumpContainers.appendChild(jumpToElements);
            elementMoved = true;
        } else if (window.innerWidth >= breakpoint && elementMoved) {
            // add back to the front of original parent
            originalParent.insertBefore(jumpToElements, originalParent.firstChild);
            elementMoved = false;
        }
    };
}