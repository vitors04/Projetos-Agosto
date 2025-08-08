const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
let score = 0;
let size = 2;
function gerarCorBase() {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return { r, g, b };
}
function corParaCSS({ r, g, b }) {
    return `rgb(${r}, ${g}, ${b})`;
}
function jogarRodada() {
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.maxWidth = `${size * 75}px`;

    const corBase = gerarCorBase();
    const corBaseCSS = corParaCSS(corBase);
    const diferenca = Math.max(5, 60 - score);
    const corDiferente = {
        r: corBase.r + diferenca,
        g: corBase.g + diferenca,
        b: corBase.b + diferenca
    };
    const corDiferenteCSS = corParaCSS(corDiferente);
    const total = size * size;
    const indiceCerto = Math.floor(Math.random() * total);

    for (let i = 0; i < total; i++) {
        const quadrado = document.createElement("div");
        quadrado.className = "square";
        quadrado.style.backgroundColor
        = i === indiceCerto ? corDiferenteCSS : corBaseCSS;
        quadrado.addEventListener("click", () => {
            if (i === indiceCerto) {
                score++;
                if (score % 3 === 0) size++;
            } else {
                score = 0;
                size = 2;
            }
            scoreDisplay.textContent = score;
            jogarRodada();
        });
        grid.appendChild(quadrado);
    }
}
jogarRodada();