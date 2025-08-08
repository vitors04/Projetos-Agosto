const valores =
['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const naipes = ['♥️', '♦️', '♣️', '♠️'];
const carta = document.getElementById('carta');
const novaCarta = document.getElementById('novaCarta');
novaCarta.addEventListener('click', () => {
    const valor = valores[Math.floor(Math.random() * valores.length)];
    const naipe = naipes[Math.floor(Math.random() * naipes.length)];
    const cor = (naipe === '♥️' || naipe === '♦️') ? 'red' : 'black';

    carta.querySelectorAll('.valor').forEach(el => el.textContent = valor);
    carta.querySelectorAll('.naipe').forEach(el => el.textContent = naipe);
    carta.querySelector('.centro').textContent = naipe;

    carta.querySelectorAll('.valor, .naipe, .centro').forEach(el => {
        el.style.color = cor;
    });
});