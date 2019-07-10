import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    const assistance = document.querySelector('#confirm-assistance');
    if (assistance) {
        assistance.addEventListener('submit', confirmAssitance);
    }
});

function confirmAssitance(e) {
    e.preventDefault();

    const btn = document.querySelector('#confirm-assistance input[type="submit"]');
    let operation = document.querySelector('#operation').value;
    let message = document.querySelector('#message');

    while (message.firstChild) {
        message.removeChild(message.firstChild);
    }

    const data = {
        operation
    }

    axios.post(this.action, data)
        .then(response => {
            if (operation === 'confirm') {
                document.querySelector('#operation').value = 'cancel';
                btn.value = 'Cancelar';
                btn.classList.remove('btn-azul');
                btn.classList.add('btn-rojo');
            } else {
                document.querySelector('#operation').value = 'confirm';
                btn.value = 'Si';
                btn.classList.remove('btn-rojo');
                btn.classList.add('btn-azul');
            }
            message.appendChild(document.createTextNode(response.data));
        });

}