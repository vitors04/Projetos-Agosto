// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões de aba e conteúdos
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Função para trocar de aba
    function switchTab(targetTab) {
        // Remove a classe 'active' de todos os botões e conteúdos
        tabButtons.forEach(button => button.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Adiciona a classe 'active' ao botão clicado
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        activeButton.classList.add('active');
        
        // Adiciona a classe 'active' ao conteúdo correspondente
        const activeContent = document.getElementById(targetTab);
        activeContent.classList.add('active');
        
        // Salva a aba ativa no localStorage
        localStorage.setItem('activeTab', targetTab);
        
        // Scroll suave para o topo da seção
        activeContent.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    // Adiciona event listeners para todos os botões de aba
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
        
        // Adiciona efeito de hover com som (opcional)
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Restaura a aba ativa salva no localStorage
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab && document.getElementById(savedTab)) {
        switchTab(savedTab);
    }
    
    // Adiciona animação aos itens do menu quando ficam visíveis
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observa todos os itens do menu
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        // Define estado inicial para animação
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(item);
    });
    
    // Função para filtrar itens (funcionalidade extra)
    function filterItems(searchTerm) {
        const currentTab = document.querySelector('.tab-content.active');
        const items = currentTab.querySelectorAll('.menu-item');
        
        items.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('.description').textContent.toLowerCase();
            
            if (title.includes(searchTerm.toLowerCase()) || 
                description.includes(searchTerm.toLowerCase())) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.3s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Adiciona funcionalidade de busca por teclado (Ctrl+F personalizado)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            
            const searchTerm = prompt('Buscar no cardápio:');
            if (searchTerm) {
                filterItems(searchTerm);
            }
        }
        
        // Reset da busca com ESC
        if (e.key === 'Escape') {
            const items = document.querySelectorAll('.menu-item');
            items.forEach(item => {
                item.style.display = 'block';
            });
        }
    });
    
    // Adiciona efeito de loading suave
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
    
    // Funcionalidade para navegação por teclado
    document.addEventListener('keydown', function(e) {
        const currentActiveButton = document.querySelector('.tab-button.active');
        const currentIndex = Array.from(tabButtons).indexOf(currentActiveButton);
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            
            let newIndex;
            if (e.key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % tabButtons.length;
            } else {
                newIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
            }
            
            const newTab = tabButtons[newIndex].getAttribute('data-tab');
            switchTab(newTab);
        }
    });
    
    console.log('Cardápio Nonna\'s Pasta carregado com sucesso! 🍝');
});