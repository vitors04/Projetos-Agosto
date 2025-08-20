const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');
const toggleThemeBtn = document.getElementById('toggleTheme');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        contents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `tab-${tabId}`) {
                content.classList.add('active');
            }
        });
    });
});

toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggleThemeBtn.textContent
    = document.body.classList.contains('dark') ? '☀️' : '🌙';
});