export async function getData(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
            document.querySelector('#root').classList.add('isLoaded');
        }, 3000); // Simulate a delay
    });
}
