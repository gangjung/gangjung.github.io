document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    const header = document.createElement('h1');
    header.textContent = 'Welcome to My Webpage';
    app.appendChild(header);

    const button = document.createElement('button');
    button.textContent = 'Click Me';
    app.appendChild(button);

    button.addEventListener('click', () => {
        const message = document.createElement('p');
        message.textContent = 'Button was clicked!';
        app.appendChild(message);
    });
});