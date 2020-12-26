export const slideUp = (target, duration = 500) => {
    return new Promise((resolve) => {
        //remember full height
        const height = target.scrollHeight;
        //set initial styles for animation
        target.style.height = height + "px";
        target.style.overflow = "hidden";
        // set final styles
        let startAnimation = null;
        function step(timestamp) {
            if (!startAnimation) {
                startAnimation = timestamp;
            }
            const progressAnimation = timestamp - startAnimation;
            target.style.height =
                height - (height * progressAnimation) / duration + "px";
            if (progressAnimation < duration) {
                window.requestAnimationFrame(step);
            } else {
                //remove all props after animation end
                target.style.display = "none";
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                resolve();
            }
        }
        window.requestAnimationFrame(step);
    });
}
export const slideDown = (target, duration = 500) => {
    return new Promise((resolve) => {
        //Check if already shown
        target.style.removeProperty("display");
        let display = window.getComputedStyle(target).display;
        if (display === "none") {
            display = "block";
        }
        target.style.display = display;
        //remember full height
        const height = target.scrollHeight;
        //set start styles
        target.style.height = 0;
        target.style.overflow = "hidden";
        //set final styles
        let startAnimation = null;
        function step(timestamp) {
            if (!startAnimation) {
                startAnimation = timestamp;
            }
            const progressAnimation = timestamp - startAnimation;
            target.style.height = (height * progressAnimation) / duration + "px";
            if (progressAnimation < duration) {
                window.requestAnimationFrame(step);
            } else {
                //remove all props after animation end
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                resolve();
            }
        }
        window.requestAnimationFrame(step);
    });
}