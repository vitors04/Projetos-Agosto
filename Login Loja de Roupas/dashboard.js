document.addEventListener("DOMContentLoaded", () => {
  const dashboardUsernameSpan = document.getElementById("dashboard-username")
  const dashboardEmailSpan = document.getElementById("dashboard-email")
  const productsGrid = document.getElementById("products-grid")
  const cartBtn = document.querySelector(".cart-btn")
  const cartSidebar = document.getElementById("cart-sidebar")
  const cartOverlay = document.getElementById("cart-overlay")
  const closeCartBtn = document.querySelector(".close-cart")
  const cartItems = document.getElementById("cart-items")
  const cartTotal = document.getElementById("cart-total")
  const categoryBtns = document.querySelectorAll(".category-btn")

  let cart = []
  let currentCategory = "all"

  const products = [
    {
      id: 1,
      name: "Vestido Floral Elegante",
      price: 129.9,
      category: "feminino",
      image: "img/elegant-floral-dress-woman.png",
      description: "Vestido midi com estampa floral delicada",
    },
    {
      id: 2,
      name: "Camisa Social Masculina",
      price: 89.9,
      category: "masculino",
      image: "img/formal-white-shirt-man.png",
      description: "Camisa social slim fit em algodão premium",
    },
    {
      id: 3,
      name: "Tênis Esportivo Unissex",
      price: 199.9,
      category: "calcados",
      image: "img/modern-white-sneakers.png",
      description: "Tênis confortável para atividades esportivas",
    },
    {
      id: 4,
      name: "Bolsa de Couro Premium",
      price: 249.9,
      category: "acessorios",
      image: "img/luxury-brown-handbag.png",
      description: "Bolsa de couro legítimo com acabamento refinado",
    },
    {
      id: 5,
      name: "Jeans Skinny Feminino",
      price: 99.9,
      category: "feminino",
      image: "img/women-blue-skinny-jeans-denim-fashion.png",
      description: "Calça jeans com modelagem skinny e lavagem moderna",
    },
    {
      id: 6,
      name: "Polo Masculina Casual",
      price: 69.9,
      category: "masculino",
      image: "img/men-navy-polo.png",
      description: "Polo em piquet com bordado discreto",
    },
    {
      id: 7,
      name: "Óculos de Sol Aviador",
      price: 159.9,
      category: "acessorios",
      image: "img/aviator-sunglasses-gold-frame.png",
      description: "Óculos aviador com proteção UV400",
    },
    {
      id: 8,
      name: "Bota Feminina Couro",
      price: 179.9,
      category: "calcados",
      image: "img/brown-leather-ankle-boots-fashion.png",
      description: "Bota ankle boot em couro com salto médio",
    },
    {
      id: 9,
      name: "Blazer Feminino Executivo",
      price: 189.9,
      category: "feminino",
      image: "img/professional-woman-blazer.png",
      description: "Blazer estruturado para look executivo",
    },
    {
      id: 10,
      name: "Relógio Masculino Clássico",
      price: 299.9,
      category: "acessorios",
      image: "img/relógio-clássico.png",
      description: "Relógio clássico com pulseira de metal",
    },
    {
      id: 11,
      name: "Camiseta Básica Premium",
      price: 49.9,
      category: "masculino",
      image: "img/camiseta-básica.png",
      description: "Camiseta básica em algodão 100% premium",
    },
    {
      id: 12,
      name: "Sandália Feminina Elegante",
      price: 119.9,
      category: "calcados",
      image: "img/sandália-feminina.png",
      description: "Sandália de salto alto para ocasiões especiais",
    },
  ]

  // Função para obter usuários do localStorage (duplicado de auth.js, pode ser refatorado se em um módulo maior)
  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || []
  }

  // Função para obter o token (simulado)
  function getAuthToken() {
    return localStorage.getItem("authToken")
  }

  // Função para verificar se o usuário está logado
  function isAuthenticated() {
    return getAuthToken() !== null
  }

  // Função para obter o usuário logado com base no token
  function getLoggedInUser() {
    const token = getAuthToken()
    if (!token) return null
    try {
      // Decodifica o token (username:timestamp)
      const decoded = atob(token)
      const [username] = decoded.split(":")

      const users = getUsers()
      return users.find((u) => u.username === username)
    } catch (e) {
      console.error("Erro ao decodificar token:", e)
      return null
    }
  }

  // --- Proteção de Rota ---
  // Se o usuário não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated()) {
    window.location.href = "index.html"
    return // Impede que o restante do script seja executado
  }

  // Se estiver autenticado, carrega e exibe os dados do usuário
  const loggedInUser = getLoggedInUser()
  if (loggedInUser) {
    dashboardUsernameSpan.textContent = loggedInUser.username
    dashboardEmailSpan.textContent = loggedInUser.email
  } else {
    // Isso pode acontecer se o token for válido mas o usuário não for encontrado (ex: usuário deletado)
    // Neste caso, é melhor forçar o logout
    localStorage.removeItem("authToken")
    window.location.href = "index.html"
  }

  // Store functionality
  function renderProducts(productsToShow = products) {
    productsGrid.innerHTML = productsToShow
      .map(
        (product) => `
      <div class="product-card" data-category="${product.category}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-overlay">
            <button class="add-to-cart-btn" data-id="${product.id}">
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-price">R$ ${product.price.toFixed(2).replace(".", ",")}</div>
        </div>
      </div>
    `,
      )
      .join("")

    // Add event listeners to add-to-cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = Number.parseInt(e.target.dataset.id)
        addToCart(productId)
      })
    })
  }

  function filterProducts(category) {
    currentCategory = category
    const filteredProducts = category === "all" ? products : products.filter((product) => product.category === category)
    renderProducts(filteredProducts)
  }

  function addToCart(productId) {
    const product = products.find((p) => p.id === productId)
    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    updateCartUI()
    showCartNotification()
  }

  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    cartBtn.textContent = `🛒 Carrinho (${totalItems})`
    cartTotal.textContent = totalPrice.toFixed(2).replace(".", ",")

    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>'
    } else {
      cartItems.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-controls">
              <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
            </div>
            <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}</div>
          </div>
          <button class="remove-item" data-id="${item.id}">×</button>
        </div>
      `,
        )
        .join("")

      // Add event listeners for cart controls
      document.querySelectorAll(".quantity-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const productId = Number.parseInt(e.target.dataset.id)
          const action = e.target.dataset.action
          updateQuantity(productId, action)
        })
      })

      document.querySelectorAll(".remove-item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const productId = Number.parseInt(e.target.dataset.id)
          removeFromCart(productId)
        })
      })
    }
  }

  function updateQuantity(productId, action) {
    const item = cart.find((item) => item.id === productId)
    if (item) {
      if (action === "increase") {
        item.quantity += 1
      } else if (action === "decrease" && item.quantity > 1) {
        item.quantity -= 1
      }
      updateCartUI()
    }
  }

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId)
    updateCartUI()
  }

  function showCartNotification() {
    const notification = document.createElement("div")
    notification.className = "cart-notification"
    notification.textContent = "Produto adicionado ao carrinho!"
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 2000)
  }

  // Event listeners
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      categoryBtns.forEach((b) => b.classList.remove("active"))
      e.target.classList.add("active")
      filterProducts(e.target.dataset.category)
    })
  })

  cartBtn.addEventListener("click", () => {
    cartSidebar.classList.add("open")
    cartOverlay.classList.add("active")
  })

  closeCartBtn.addEventListener("click", () => {
    cartSidebar.classList.remove("open")
    cartOverlay.classList.remove("active")
  })

  cartOverlay.addEventListener("click", () => {
    cartSidebar.classList.remove("open")
    cartOverlay.classList.remove("active")
  })

  // Initialize store
  renderProducts()
})
