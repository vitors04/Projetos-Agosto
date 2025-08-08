const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const caption = document.getElementById("caption");
const closeBtn = document.getElementById("closeBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");

document.querySelectorAll(".gallery img").forEach(img => {
    img.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = img.src.replace("/300/200", "/900/600");
        caption.textContent = img.alt;
    });
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

modal.addEventListener("click", e => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleThemeBtn.textContent
    = document.body.classList.contains("dark") ? "☀️" : "🌙";
});