let callbacks = [];
let freezed = false;

export const SCROLL_UP = 'SCROLL_UP';
export const SCROLL_DOWN = 'SCROLL_DOWN';

function runCallbacks(event) {
    if (freezed) {
        return;
    }

    callbacks.forEach((callback) => {
        callback(event);
    });
}

const onWheel = (e) => {
    e = e || window.event;

    const delta = e.deltaY || e.detail || e.wheelDelta;

    const scrollEvent = delta > 0 ? SCROLL_DOWN : SCROLL_UP;

    runCallbacks(scrollEvent);
};

if (document.addEventListener) {
    if ('onwheel' in document) {
        // IE9+, FF17+, Ch31+
        document.addEventListener('wheel', onWheel);
    } else if ('onmousewheel' in document) {
        // устаревший вариант события
        document.addEventListener('mousewheel', onWheel);
    } else {
        // Firefox < 17
        document.addEventListener('MozMousePixelScroll', onWheel);
    }
} else { // IE8-
    document.attachEvent('onmousewheel', onWheel);
}

export const PageScroll = {
    on(callback) {
        if (callback) {
            callbacks.push(callback);
        }
    },
    off(callback) {
        if (callback) {
            const index = callbacks.findIndex(c => c === callback);
            if (index >= 0) {
                callbacks.splice(index, 1);
            }
        }
    },
    freeze() {
        freezed = true;
    },
    unfreeze() {
        freezed = false;
    }
};
