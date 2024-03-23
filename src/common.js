export function formattedString(str) {
    return str.toLowerCase().replace(/\b\w/g, word => word.toUpperCase()).replace('_', ' ');
}

export function getTheCurrentBreakpoint() {
    switch (Number(window.getComputedStyle(document.querySelector('#root')).getPropertyValue('z-index'))) {
        case 1:
            return 'medium';
        case 2:
            return 'large';
        default:
            return 'small';
    }    
}

export function appendAnOverlayIfNecessary() {
    const existingOverlay = document.querySelector('.overlay');

    if (!existingOverlay) {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.classList.add('hidden');
        document.querySelector('#root').appendChild(overlay);
    }
}