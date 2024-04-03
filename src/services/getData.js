export async function getData(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
            document.querySelector('#root').classList.add('isLoaded');
            setTimeout(() => {
                document.querySelector('header').classList.add('isLoaded');
            }, 500);            
        }, 3000); // Simulate a delay
    });
}
