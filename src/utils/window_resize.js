let callbacks = [],
    running = false;

// run the actual callbacks
function runCallbacks() {

    callbacks.forEach((callback) => {
        callback();
    });

    running = false;
}

// fired on resize event
function resize() {

    if (!running) {
        running = true;

        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(runCallbacks);
        } else {
            setTimeout(runCallbacks, 66);
        }
    }

}

// adds callback to loop
function addCallback(callback) {

    if (callback) {
        callbacks.push(callback);
    }

}
// removes callback from loop
function removeCallback(callback) {

    if (callback) {
        const index = callbacks.findIndex(c => c === callback);
        if (index >= 0) {
            callbacks.splice(index, 1);
        }
    }

}

export const WindowResize = {
    on: (callback) => {
        if (!callbacks.length) {
            window.addEventListener('resize', resize);
        }
        addCallback(callback);
    },
    off: (callback) => {
        removeCallback(callback);
    }
};
