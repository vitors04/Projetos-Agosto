const grid = document.getElementById('grid');
const colorPicker = document.getElementById('color');
const limparBtn = document.getElementById('limpar');
function criarGrid() {
    for (let i = 0; i < 378; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => {
            cell.style.backgroundColor = colorPicker.value;
        });
        grid.appendChild(cell);
    }
}
limparBtn.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.backgroundColor = '#fff';
    });
});
criarGrid();