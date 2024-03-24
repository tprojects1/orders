export function formattedString(str) {
    // Split the string on underscores while preserving word boundaries
    const words = str.split(/_(?=\w)/);

    // Convert the first letter of each word to uppercase
    const titleCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

    // Join the words with spaces
    return titleCaseWords.join(' ');
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