document.addEventListener("DOMContentLoaded", () => {
  // --- Elementos do DOM ---
  const petMoodEl = document.getElementById("pet-mood")
  const petImageEl = document.getElementById("pet-image")
  const petNameEl = document.getElementById("pet-name")
  const petLevelEl = document.getElementById("pet-level")
  const expFillEl = document.getElementById("exp-fill")
  const coinsAmountEl = document.getElementById("coins-amount")

  // Status elements
  const statusHungerEl = document.getElementById("status-hunger")
  const statusHappinessEl = document.getElementById("status-happiness")
  const statusEnergyEl = document.getElementById("status-energy")
  const statusCleanlinessEl = document.getElementById("status-cleanliness")
  const statusAgeEl = document.getElementById("status-age")
  const statusHealthEl = document.getElementById("status-health")

  // Status bars
  const hungerBarEl = document.getElementById("hunger-bar")
  const happinessBarEl = document.getElementById("happiness-bar")
  const energyBarEl = document.getElementById("energy-bar")
  const cleanlinessBarEl = document.getElementById("cleanliness-bar")
  const healthBarEl = document.getElementById("health-bar")

  // Action buttons
  const actionFeedBtn = document.getElementById("action-feed")
  const actionPlayBtn = document.getElementById("action-play")
  const actionSleepBtn = document.getElementById("action-sleep")
  const actionCleanBtn = document.getElementById("action-clean")
  const actionMedicineBtn = document.getElementById("action-medicine")
  const actionPetBtn = document.getElementById("action-pet")

  // Tab buttons
  const tabCareBtn = document.getElementById("tab-care")
  const tabGamesBtn = document.getElementById("tab-games")
  const tabShopBtn = document.getElementById("tab-shop")
  const tabAchievementsBtn = document.getElementById("tab-achievements")

  // Panels
  const carePanelEl = document.getElementById("care-panel")
  const gamesPanelEl = document.getElementById("games-panel")
  const shopPanelEl = document.getElementById("shop-panel")
  const achievementsPanelEl = document.getElementById("achievements-panel")

  // Game controls
  const resetGameBtn = document.getElementById("reset-game-btn")

  // Modals
  const messageBox = document.getElementById("message-box")
  const messageText = document.getElementById("message-text")
  const closeMessageBtn = document.getElementById("close-message-btn")
  const gameModal = document.getElementById("game-modal")
  const gameTitle = document.getElementById("game-title")
  const gameContent = document.getElementById("game-content")
  const closeGameBtn = document.getElementById("close-game-btn")

  // Effects
  const heartsEffectEl = document.getElementById("hearts-effect")
  const sparklesEffectEl = document.getElementById("sparkles-effect")
  const foodEffectEl = document.getElementById("food-effect")
  const starsEffectEl = document.getElementById("stars-effect")

  // --- Configurações do Jogo ---
  const GAME_INTERVAL_MS = 1000
  const AGE_INTERVAL_SECONDS = 60
  const MAX_STAT = 100
  const MIN_STAT = 0
  const LOW_STAT_THRESHOLD = 30
  const MEDIUM_STAT_THRESHOLD = 60

  // --- Definições do Pet ---
  const PET_STAGES = [
    { name: "Ovo", image: "images/egg.png", minAge: 0, maxAge: 2 },
    { name: "Bebê", image: "images/baby.png", minAge: 2, maxAge: 8 },
    { name: "Criança", image: "images/child.png", minAge: 8, maxAge: 20 },
    { name: "Adolescente", image: "images/teen.png", minAge: 20, maxAge: 40 },
    { name: "Adulto", image: "images/adult.png", minAge: 40, maxAge: Number.POSITIVE_INFINITY },
  ]

  // --- Estado do Tamagotchi ---
  const tamagotchi = {
    name: "Ovo",
    hunger: MAX_STAT,
    happiness: MAX_STAT,
    energy: MAX_STAT,
    cleanliness: MAX_STAT,
    health: MAX_STAT,
    ageDays: 0,
    level: 1,
    experience: 0,
    coins: 100,
    lastUpdateTime: Date.now(),
    isSleeping: false,
    isSick: false,
    isAlive: true,
    inventory: {
      "premium-food": 0,
      toy: 0,
      medicine: 0,
      decoration: 0,
    },
    achievements: {
      "first-feed": false,
      "happy-pet": false,
      "level-5": false,
      "game-master": false,
    },
    gamesWon: 0,
  }

  let gameIntervalId = null
  let ageCounter = 0
  let currentTab = "care"
  let isResetting = false // Added flag to prevent auto-save during reset

  // --- Funções Auxiliares ---
  function showMessage(message) {
    messageText.textContent = message
    messageBox.style.display = "flex"
  }

  function hideMessage() {
    messageBox.style.display = "none"
  }

  function showGameModal(title, content) {
    gameTitle.textContent = title
    gameContent.innerHTML = content
    gameModal.style.display = "flex"
  }

  function hideGameModal() {
    gameModal.style.display = "none"
    // Clean up any running game intervals or timeouts
    if (window.gameInterval) {
      clearInterval(window.gameInterval)
      delete window.gameInterval
    }
    if (window.gameTimeout) {
      clearTimeout(window.gameTimeout)
      delete window.gameTimeout
    }
    // Clean up game-specific functions
    delete window.selectColor
    delete window.checkColorGuess
    delete window.restartMemoryGame
    delete window.restartReactionGame
    delete window.restartMathGame
    delete window.restartCatchGame
  }

  window.hideGameModal = hideGameModal

  function createParticleEffect(type) {
    const effectEl =
      type === "hearts"
        ? heartsEffectEl
        : type === "sparkles"
          ? sparklesEffectEl
          : type === "food"
            ? foodEffectEl
            : starsEffectEl

    effectEl.style.opacity = "1"

    const particles = []
    const particleCount = 8

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.style.position = "absolute"
      particle.style.fontSize = "1.5em"
      particle.style.pointerEvents = "none"
      particle.style.zIndex = "10"

      if (type === "hearts") {
        particle.textContent = ["❤️", "💖", "💕"][Math.floor(Math.random() * 3)]
      } else if (type === "sparkles") {
        particle.textContent = ["✨", "⭐", "🌟"][Math.floor(Math.random() * 3)]
      } else if (type === "food") {
        particle.textContent = ["🍔", "🍖", "🥕", "🍎"][Math.floor(Math.random() * 4)]
      } else {
        particle.textContent = ["⭐", "🌟", "💫"][Math.floor(Math.random() * 3)]
      }

      particle.style.left = Math.random() * 100 + "%"
      particle.style.top = Math.random() * 100 + "%"

      effectEl.appendChild(particle)
      particles.push(particle)

      // Animate particle
      particle.animate(
        [
          { transform: "translateY(0px) scale(0)", opacity: 0 },
          { transform: "translateY(-50px) scale(1)", opacity: 1 },
          { transform: "translateY(-100px) scale(0)", opacity: 0 },
        ],
        {
          duration: 1500,
          easing: "ease-out",
        },
      )
    }

    setTimeout(() => {
      effectEl.style.opacity = "0"
      particles.forEach((p) => p.remove())
    }, 1500)
  }

  function updateDisplay() {
    // Basic info
    petNameEl.textContent = tamagotchi.name
    const petImage = getPetImage()
    petImageEl.innerHTML = `<img src="${petImage}" alt="${tamagotchi.name}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 15px;">`
    petMoodEl.textContent = getPetMoodEmoji()
    petLevelEl.textContent = tamagotchi.level
    coinsAmountEl.textContent = tamagotchi.coins

    // Experience bar
    const expNeeded = tamagotchi.level * 100
    const expPercent = (tamagotchi.experience / expNeeded) * 100
    expFillEl.style.width = expPercent + "%"

    // Status values
    statusHungerEl.textContent = `${Math.round(tamagotchi.hunger)}%`
    statusHappinessEl.textContent = `${Math.round(tamagotchi.happiness)}%`
    statusEnergyEl.textContent = `${Math.round(tamagotchi.energy)}%`
    statusCleanlinessEl.textContent = `${Math.round(tamagotchi.cleanliness)}%`
    statusAgeEl.textContent = `${tamagotchi.ageDays} dias`
    statusHealthEl.textContent = `${Math.round(tamagotchi.health)}%`

    // Status bars
    updateStatusBar(hungerBarEl, tamagotchi.hunger)
    updateStatusBar(happinessBarEl, tamagotchi.happiness)
    updateStatusBar(energyBarEl, tamagotchi.energy)
    updateStatusBar(cleanlinessBarEl, tamagotchi.cleanliness)
    updateStatusBar(healthBarEl, tamagotchi.health)

    // Status value colors
    updateStatusColor(statusHungerEl, tamagotchi.hunger)
    updateStatusColor(statusHappinessEl, tamagotchi.happiness)
    updateStatusColor(statusEnergyEl, tamagotchi.energy)
    updateStatusColor(statusCleanlinessEl, tamagotchi.cleanliness)
    updateStatusColor(statusHealthEl, tamagotchi.health)

    // Button states
    const isDisabled = !tamagotchi.isAlive || tamagotchi.isSleeping
    actionFeedBtn.disabled = isDisabled
    actionPlayBtn.disabled = isDisabled
    actionCleanBtn.disabled = isDisabled
    actionMedicineBtn.disabled = isDisabled || tamagotchi.inventory.medicine === 0
    actionPetBtn.disabled = isDisabled
    actionSleepBtn.disabled = tamagotchi.isSleeping

    // Update achievements
    updateAchievements()
  }

  function updateStatusBar(barEl, value) {
    barEl.style.width = value + "%"
    barEl.classList.remove("low", "medium")

    if (value < LOW_STAT_THRESHOLD) {
      barEl.classList.add("low")
    } else if (value < MEDIUM_STAT_THRESHOLD) {
      barEl.classList.add("medium")
    }
  }

  function updateStatusColor(el, value) {
    el.classList.remove("low")
    if (value < LOW_STAT_THRESHOLD) {
      el.classList.add("low")
    }
  }

  function getPetImage() {
    if (!tamagotchi.isAlive) return "images/ghost.png"
    if (tamagotchi.isSleeping) return "images/sleeping.png"

    for (const stage of PET_STAGES) {
      if (tamagotchi.ageDays >= stage.minAge && tamagotchi.ageDays < stage.maxAge) {
        return stage.image
      }
    }
    return PET_STAGES[0].image
  }

  function getPetMoodEmoji() {
    if (!tamagotchi.isAlive) return "💀"
    if (tamagotchi.isSleeping) return "💤"
    if (tamagotchi.isSick) return "🤢"

    const avgHappiness = (tamagotchi.hunger + tamagotchi.happiness + tamagotchi.energy + tamagotchi.cleanliness) / 4

    if (avgHappiness > 80) return "🤩"
    if (avgHappiness > 60) return "😊"
    if (avgHappiness > 40) return "😐"
    if (avgHappiness > 20) return "😟"
    return "😭"
  }

  function clampStat(stat) {
    return Math.max(MIN_STAT, Math.min(MAX_STAT, stat))
  }

  function gainExperience(amount) {
    tamagotchi.experience += amount
    const expNeeded = tamagotchi.level * 100

    if (tamagotchi.experience >= expNeeded) {
      tamagotchi.level++
      tamagotchi.experience = 0
      createParticleEffect("sparkles")
      showMessage(`🎉 Parabéns! Seu pet subiu para o nível ${tamagotchi.level}!`)
    }
  }

  function earnCoins(amount) {
    tamagotchi.coins += amount
    createParticleEffect("sparkles")
  }

  function performAction(actionType) {
    if (!tamagotchi.isAlive) {
      showMessage("Seu Tamagotchi não está mais vivo.")
      return
    }
    if (tamagotchi.isSleeping && actionType !== "sleep") {
      showMessage("Seu Tamagotchi está dormindo.")
      return
    }

    let message = ""
    let expGain = 5

    switch (actionType) {
      case "feed":
        if (tamagotchi.hunger === MAX_STAT) {
          showMessage("Seu Tamagotchi não está com fome.")
          return
        }
        tamagotchi.hunger = clampStat(tamagotchi.hunger + 25)
        tamagotchi.happiness = clampStat(tamagotchi.happiness + 5)
        message = "Você alimentou seu Tamagotchi!"
        petImageEl.classList.add("animate-feed")
        createParticleEffect("food")

        // First feed achievement
        if (!tamagotchi.achievements["first-feed"]) {
          tamagotchi.achievements["first-feed"] = true
          showMessage("🏆 Conquista desbloqueada: Primeira Refeição!")
        }
        break

      case "play":
        if (tamagotchi.happiness === MAX_STAT) {
          showMessage("Seu Tamagotchi já está muito feliz.")
          return
        }
        tamagotchi.happiness = clampStat(tamagotchi.happiness + 30)
        tamagotchi.energy = clampStat(tamagotchi.energy - 10)
        message = "Você brincou com seu Tamagotchi!"
        petImageEl.classList.add("animate-play")
        createParticleEffect("hearts")
        expGain = 10
        break

      case "sleep":
        if (tamagotchi.energy === MAX_STAT) {
          showMessage("Seu Tamagotchi não está com sono.")
          return
        }
        tamagotchi.isSleeping = true
        petImageEl.style.transform = "scale(0.8)"
        message = "Seu Tamagotchi foi dormir."
        break

      case "clean":
        if (tamagotchi.cleanliness === MAX_STAT) {
          showMessage("Seu Tamagotchi já está limpo.")
          return
        }
        tamagotchi.cleanliness = MAX_STAT
        tamagotchi.happiness = clampStat(tamagotchi.happiness + 10)
        message = "Você limpou seu Tamagotchi!"
        petImageEl.classList.add("animate-clean")
        createParticleEffect("sparkles")
        break

      case "medicine":
        if (tamagotchi.inventory.medicine === 0) {
          showMessage("Você não tem remédios!")
          return
        }
        tamagotchi.inventory.medicine--
        tamagotchi.health = clampStat(tamagotchi.health + 40)
        tamagotchi.isSick = false
        message = "Você deu remédio ao seu Tamagotchi!"
        createParticleEffect("sparkles")
        expGain = 15
        break

      case "pet":
        tamagotchi.happiness = clampStat(tamagotchi.happiness + 15)
        message = "Você fez carinho no seu Tamagotchi!"
        createParticleEffect("hearts")
        petImageEl.classList.add("pulse")
        setTimeout(() => petImageEl.classList.remove("pulse"), 1000)
        break
    }

    if (actionType !== "sleep") {
      gainExperience(expGain)
      earnCoins(Math.floor(expGain / 2))
    }

    showMessage(message)
    updateDisplay()

    // Remove animation classes
    setTimeout(() => {
      petImageEl.classList.remove("animate-feed", "animate-play", "animate-clean")
    }, 1000)
  }

  function gameLoop() {
    if (!tamagotchi.isAlive) {
      clearInterval(gameIntervalId)
      gameIntervalId = null
      return
    }

    // Age increment
    ageCounter++
    if (ageCounter >= AGE_INTERVAL_SECONDS) {
      tamagotchi.ageDays++
      ageCounter = 0

      // Evolution check
      const currentStage = PET_STAGES.find(
        (stage) => tamagotchi.ageDays >= stage.minAge && tamagotchi.ageDays < stage.maxAge,
      )
      if (currentStage && tamagotchi.name !== currentStage.name) {
        tamagotchi.name = currentStage.name
        createParticleEffect("sparkles")
        showMessage(`🎉 Seu Tamagotchi evoluiu para ${currentStage.name}!`)
      }
    }

    // Stat decay
    if (!tamagotchi.isSleeping) {
      tamagotchi.hunger = clampStat(tamagotchi.hunger - 0.3) // reduced from 0.75
      tamagotchi.happiness = clampStat(tamagotchi.happiness - 0.2) // reduced from 0.4
      tamagotchi.energy = clampStat(tamagotchi.energy - 0.25) // reduced from 0.5
      tamagotchi.cleanliness = clampStat(tamagotchi.cleanliness - 0.15) // reduced from 0.25
    } else {
      // Recovery while sleeping
      tamagotchi.energy = clampStat(tamagotchi.energy + 8)
      tamagotchi.happiness = clampStat(tamagotchi.happiness + 3)
      tamagotchi.health = clampStat(tamagotchi.health + 2)

      if (tamagotchi.energy >= MAX_STAT) {
        tamagotchi.isSleeping = false
        petImageEl.style.transform = "scale(1)"
        showMessage("Seu Tamagotchi acordou!")
      }
    }

    // Health logic
    let healthPenalty = 0
    if (tamagotchi.hunger < LOW_STAT_THRESHOLD) healthPenalty += 3
    if (tamagotchi.happiness < LOW_STAT_THRESHOLD) healthPenalty += 2
    if (tamagotchi.energy < LOW_STAT_THRESHOLD) healthPenalty += 1
    if (tamagotchi.cleanliness < LOW_STAT_THRESHOLD) healthPenalty += 2

    tamagotchi.health = clampStat(tamagotchi.health - healthPenalty)

    // Sickness
    if (!tamagotchi.isSick && tamagotchi.health < LOW_STAT_THRESHOLD && Math.random() < 0.03) {
      tamagotchi.isSick = true
      petImageEl.classList.add("shake")
      setTimeout(() => petImageEl.classList.remove("shake"), 500)
      showMessage("Seu Tamagotchi ficou doente! 🤒")
    } else if (tamagotchi.isSick && tamagotchi.health >= LOW_STAT_THRESHOLD + 20) {
      tamagotchi.isSick = false
      showMessage("Seu Tamagotchi se recuperou! 😊")
    }

    // Death
    if (tamagotchi.health <= MIN_STAT) {
      tamagotchi.isAlive = false
      showMessage("Seu Tamagotchi faleceu... 😢 Considere reiniciar o jogo.")
      clearInterval(gameIntervalId)
      gameIntervalId = null
    }

    // Happy pet achievement
    if (tamagotchi.happiness === MAX_STAT && !tamagotchi.achievements["happy-pet"]) {
      tamagotchi.achievements["happy-pet"] = true
      showMessage("🏆 Conquista desbloqueada: Pet Feliz!")
    }

    // Level 5 achievement
    if (tamagotchi.level >= 5 && !tamagotchi.achievements["level-5"]) {
      tamagotchi.achievements["level-5"] = true
      showMessage("🏆 Conquista desbloqueada: Nível 5!")
    }

    updateDisplay()
  }

  function updateAchievements() {
    Object.keys(tamagotchi.achievements).forEach((key) => {
      const achievementEl = document.querySelector(`[data-achievement="${key}"]`)
      if (achievementEl) {
        const statusEl = achievementEl.querySelector(".achievement-status")
        if (tamagotchi.achievements[key]) {
          achievementEl.classList.add("unlocked")
          statusEl.textContent = "✅"
        } else {
          achievementEl.classList.remove("unlocked")
          statusEl.textContent = "🔒"
        }
      }
    })
  }

  // Tab switching
  function switchTab(tabName) {
    // Remove active class from all tabs and panels
    document.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"))
    document.querySelectorAll(".action-panel").forEach((panel) => panel.classList.remove("active"))

    // Add active class to selected tab and panel
    document.getElementById(`tab-${tabName}`).classList.add("active")
    document.getElementById(`${tabName}-panel`).classList.add("active")

    currentTab = tabName
  }

  // Shop functionality
  function buyItem(itemType, cost) {
    if (tamagotchi.coins < cost) {
      showMessage("Você não tem moedas suficientes!")
      return
    }

    tamagotchi.coins -= cost
    tamagotchi.inventory[itemType]++
    earnCoins(0) // Just for the effect
    showMessage(`Você comprou ${getItemName(itemType)}!`)
    updateDisplay()
  }

  function getItemName(itemType) {
    const names = {
      "premium-food": "Comida Premium",
      toy: "Brinquedo",
      medicine: "Remédio",
      decoration: "Decoração",
    }
    return names[itemType] || itemType
  }

  // Mini-games
  function startMemoryGame() {
    delete window.checkColorGuess
    delete window.restartMathGame
    delete window.selectColor
    delete window.restartMemoryGame
    delete window.restartCatchGame
    delete window.restartReactionGame

    const colors = ["🔴", "🟡", "🟢", "🔵", "🟣", "🟠"]
    let sequence = []
    let playerSequence = []
    let level = 1
    let score = 0
    let showingSequence = false

    function generateSequence() {
      sequence = []
      for (let i = 0; i < level + 2; i++) {
        sequence.push(colors[Math.floor(Math.random() * colors.length)])
      }
    }

    function showSequence() {
      showingSequence = true
      let index = 0

      const interval = setInterval(() => {
        if (index < sequence.length) {
          if (gameContent) {
            gameContent.innerHTML = `
              <div style="font-size: 4em; margin: 20px;">${sequence[index]}</div>
              <p>Memorize a sequência!</p>
              <p>Nível: ${level} | Pontuação: ${score}</p>
            `
          }
          index++
        } else {
          clearInterval(interval)
          showingSequence = false
          showPlayerTurn()
        }
      }, 800)
    }

    function showPlayerTurn() {
      playerSequence = []
      if (gameContent) {
        gameContent.innerHTML = `
          <p>Sua vez! Clique na sequência:</p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px;">
            ${colors.map((color) => `<button onclick="window.selectColor('${color}')" style="font-size: 2em; padding: 15px; border: none; border-radius: 10px; cursor: pointer; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">${color}</button>`).join("")}
          </div>
          <p>Nível: ${level} | Pontuação: ${score}</p>
        `
      }
    }

    window.selectColor = (color) => {
      if (showingSequence) return

      playerSequence.push(color)

      if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
        // Wrong!
        const finalScore = score + (level - 1) * 10
        if (gameContent) {
          gameContent.innerHTML = `
            <div style="font-size: 3em;">❌</div>
            <p>Errou! Você chegou ao nível ${level}</p>
            <p>Pontuação Final: ${finalScore}</p>
            <div style="margin: 20px;">
              <button onclick="window.restartMemoryGame()" class="action-button">Jogar Novamente</button>
              <button onclick="hideGameModal()" class="action-button">Sair</button>
            </div>
          `
        }
        earnCoins(finalScore)
        gainExperience(level * 10)
        delete window.selectColor
        return
      }

      if (playerSequence.length === sequence.length) {
        // Correct sequence!
        score += level * 10
        level++
        if (gameContent) {
          gameContent.innerHTML = `
            <div style="font-size: 3em;">✅</div>
            <p>Correto! Próximo nível: ${level}</p>
            <p>Pontuação: ${score}</p>
          `
        }
        setTimeout(() => {
          generateSequence()
          showSequence()
        }, 1500)
      }
    }

    window.restartMemoryGame = () => {
      level = 1
      score = 0
      sequence = []
      playerSequence = []
      generateSequence()
      showSequence()
    }

    generateSequence()
    showSequence()
  }

  function startReactionGame() {
    delete window.checkColorGuess
    delete window.restartMathGame
    delete window.selectColor
    delete window.restartMemoryGame
    delete window.restartCatchGame

    let startTime
    let gameActive = false
    let round = 1
    let totalScore = 0
    let roundsCompleted = 0
    const maxRounds = 5

    function updateGameDisplay() {
      gameContent.innerHTML = `
        <div style="font-size: 2em; margin-bottom: 10px;">⚡</div>
        <p>Rodada ${round}/${maxRounds}</p>
        <p>Clique no botão assim que ele ficar verde!</p>
        <button id="reaction-btn" style="width: 200px; height: 100px; font-size: 1.5em; border: none; border-radius: 15px; cursor: pointer; background: #dc3545; color: white; margin: 20px;">
          Aguarde...
        </button>
        <p>Pontuação Total: ${totalScore}</p>
        <p>Melhor tempo: <span id="best-time">-</span>ms</p>
      `
    }

    updateGameDisplay()

    const reactionBtn = document.getElementById("reaction-btn")
    const bestTimeEl = document.getElementById("best-time")

    let bestTime = localStorage.getItem("bestReactionTime") || Number.POSITIVE_INFINITY
    if (bestTime !== Number.POSITIVE_INFINITY) {
      bestTimeEl.textContent = bestTime
    }

    function startRound() {
      gameActive = false
      const reactionBtn = document.getElementById("reaction-btn")
      if (!reactionBtn) return

      reactionBtn.style.background = "#dc3545"
      reactionBtn.textContent = "Aguarde..."
      reactionBtn.disabled = false

      const delay = Math.random() * 3000 + 1000

      setTimeout(() => {
        const btn = document.getElementById("reaction-btn")
        if (btn) {
          btn.style.background = "#28a745"
          btn.textContent = "CLIQUE AGORA!"
          startTime = Date.now()
          gameActive = true
        }
      }, delay)
    }

    function handleReactionClick() {
      const reactionBtn = document.getElementById("reaction-btn")
      if (!reactionBtn) return

      if (!gameActive) {
        reactionBtn.textContent = "Muito cedo!"
        reactionBtn.style.background = "#ffc107"
        setTimeout(() => {
          if (document.getElementById("reaction-btn")) {
            startRound()
          }
        }, 1500)
        return
      }

      const reactionTime = Date.now() - startTime
      gameActive = false
      roundsCompleted++

      reactionBtn.textContent = `${reactionTime}ms`
      reactionBtn.style.background = "#6c757d"

      // Calculate score based on reaction time
      const roundScore = Math.max(10, Math.floor(200 - reactionTime / 5))
      totalScore += roundScore

      if (reactionTime < bestTime) {
        bestTime = reactionTime
        localStorage.setItem("bestReactionTime", bestTime)
        const bestTimeEl = document.getElementById("best-time")
        if (bestTimeEl) bestTimeEl.textContent = bestTime
        showMessage("🏆 Novo recorde!")
      }

      if (roundsCompleted >= maxRounds) {
        // Game finished
        setTimeout(() => {
          gameContent.innerHTML = `
            <div style="font-size: 3em;">🏁</div>
            <p>Jogo Concluído!</p>
            <p>Pontuação Final: ${totalScore}</p>
            <p>Melhor Tempo: ${bestTime}ms</p>
            <div style="margin: 20px;">
              <button onclick="window.restartReactionGame()" class="action-button">Jogar Novamente</button>
              <button onclick="hideGameModal()" class="action-button">Sair</button>
            </div>
          `
          earnCoins(Math.floor(totalScore / 10))
          gainExperience(roundsCompleted * 8)
        }, 2000)
      } else {
        round++
        setTimeout(() => {
          updateGameDisplay()
          const newBtn = document.getElementById("reaction-btn")
          if (newBtn) {
            newBtn.addEventListener("click", handleReactionClick)
            startRound()
          }
        }, 2000)
      }
    }

    window.restartReactionGame = () => {
      round = 1
      totalScore = 0
      roundsCompleted = 0
      gameActive = false
      startReactionGame()
    }

    reactionBtn.addEventListener("click", handleReactionClick)
    startRound()
  }

  function startMathGame() {
    delete window.selectColor
    delete window.restartMemoryGame
    delete window.restartReactionGame
    delete window.restartCatchGame

    let score = 0
    let timeLeft = 60
    let currentColor = ""
    let currentColorName = ""
    let level = 1
    let questionsAnswered = 0
    let attempts = 0
    let maxAttempts = 3

    const colors = [
      { name: "vermelho", hex: "#FF0000", hints: ["cor do sangue", "cor do fogo", "cor da paixão"] },
      { name: "azul", hex: "#0000FF", hints: ["cor do céu", "cor do mar", "cor da tranquilidade"] },
      { name: "verde", hex: "#00FF00", hints: ["cor da natureza", "cor das plantas", "cor da esperança"] },
      { name: "amarelo", hex: "#FFFF00", hints: ["cor do sol", "cor da banana", "cor da alegria"] },
      { name: "roxo", hex: "#800080", hints: ["cor da uva", "cor da realeza", "cor da magia"] },
      { name: "laranja", hex: "#FFA500", hints: ["cor da laranja", "cor do pôr do sol", "cor do outono"] },
      { name: "rosa", hex: "#FFC0CB", hints: ["cor delicada", "cor romântica", "cor suave"] },
      { name: "marrom", hex: "#8B4513", hints: ["cor da terra", "cor da madeira", "cor do chocolate"] },
      { name: "preto", hex: "#000000", hints: ["ausência de luz", "cor da noite", "cor elegante"] },
      { name: "branco", hex: "#FFFFFF", hints: ["cor da neve", "cor da pureza", "cor da paz"] },
    ]

    function getDifficultyColors() {
      if (score < 5) return colors.slice(0, 4) // vermelho, azul, verde, amarelo
      if (score < 15) return colors.slice(0, 6) // + roxo, laranja
      if (score < 30) return colors.slice(0, 8) // + rosa, marrom
      return colors // todas as cores
    }

    function generateColor() {
      const availableColors = getDifficultyColors()
      const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)]
      currentColor = randomColor.hex
      currentColorName = randomColor.name
      level = Math.floor(score / 5) + 1
      attempts = 0
      maxAttempts = 3
    }

    function updateDisplay(preserveInput = false) {
      const availableColors = getDifficultyColors()
      const currentInputValue = preserveInput ? document.getElementById("color-input")?.value || "" : ""
      const colorObj = colors.find((c) => c.name === currentColorName)
      const randomHint = colorObj.hints[Math.floor(Math.random() * colorObj.hints.length)]

      gameContent.innerHTML = `
        <div style="font-size: 1.8em; margin: 20px; color: #667eea;">
          🎨 Adivinhe a cor!
        </div>
        <div style="width: 100px; height: 100px; background-color: ${currentColor}; border: 3px solid #333; border-radius: 10px; margin: 20px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.3);"></div>
        <div style="margin: 10px; color: #666; font-style: italic;">
          Dica: ${randomHint}
        </div>
        <div style="margin: 10px; color: #666;">
          Tentativas restantes: ${maxAttempts - attempts}
        </div>
        <input type="text" id="color-input" placeholder="Digite o nome da cor..." style="font-size: 1.2em; padding: 10px; border: 2px solid #ddd; border-radius: 8px; text-align: center; width: 200px;" value="${currentInputValue}" autofocus>
        <button onclick="window.checkColorGuess()" class="action-button" style="margin: 10px;">Tentar</button>
        <div id="hint-text" style="margin: 15px; font-size: 1.2em; color: #764ba2; font-weight: bold;"></div>
        <div style="margin-top: 20px;">
          <p>Pontuação: ${score} | Nível: ${level}</p>
          <p>Tempo: ${timeLeft}s</p>
          <p>Cores descobertas: ${questionsAnswered}</p>
        </div>
        <div style="margin-top: 15px; font-size: 0.9em; color: #888;">
          Cores disponíveis: ${availableColors.map((c) => c.name).join(", ")}
        </div>
      `

      const colorInput = document.getElementById("color-input")
      if (colorInput) {
        colorInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") window.checkColorGuess()
        })
      }
    }

    function updateStats() {
      const statsDiv = gameContent.querySelector("div:nth-last-child(2)")
      if (statsDiv) {
        statsDiv.innerHTML = `
          <p>Pontuação: ${score} | Nível: ${level}</p>
          <p>Tempo: ${timeLeft}s</p>
          <p>Cores descobertas: ${questionsAnswered}</p>
        `
      }
    }

    window.checkColorGuess = () => {
      const colorInput = document.getElementById("color-input")
      const hintText = document.getElementById("hint-text")
      if (!colorInput || !hintText) return

      const userGuess = colorInput.value.toLowerCase().trim()
      if (!userGuess) {
        hintText.textContent = "Digite o nome de uma cor!"
        hintText.style.color = "#dc3545"
        return
      }

      attempts++

      if (userGuess === currentColorName) {
        const points = (maxAttempts - attempts + 1) * level * 5
        score += points
        questionsAnswered++
        hintText.textContent = `🎉 Correto! Era ${currentColorName}! +${points} pontos`
        hintText.style.color = "#28a745"
        colorInput.value = ""

        setTimeout(() => {
          generateColor()
          updateDisplay()
        }, 1500)
      } else if (attempts >= maxAttempts) {
        hintText.textContent = `❌ Acabaram as tentativas! Era ${currentColorName}`
        hintText.style.color = "#dc3545"
        colorInput.value = ""

        setTimeout(() => {
          generateColor()
          updateDisplay()
        }, 2000)
      } else {
        const attemptsDiv = gameContent.querySelector("div:nth-child(4)")
        if (attemptsDiv) {
          attemptsDiv.textContent = `Tentativas restantes: ${maxAttempts - attempts}`
        }

        hintText.textContent = `❌ Não é ${userGuess}. Tente novamente!`
        hintText.style.color = "#fd7e14"
        colorInput.focus()
      }
    }

    const timer = setInterval(() => {
      timeLeft--
      updateStats()
      if (timeLeft <= 0) {
        clearInterval(timer)
        gameContent.innerHTML = `
          <div style="font-size: 3em;">🎨</div>
          <p>Tempo esgotado!</p>
          <p>Pontuação Final: ${score}</p>
          <p>Nível Alcançado: ${level}</p>
          <p>Cores Descobertas: ${questionsAnswered}</p>
          <div style="margin: 20px;">
            <button onclick="window.restartMathGame()" class="action-button">Jogar Novamente</button>
            <button onclick="hideGameModal()" class="action-button">Sair</button>
          </div>
        `
        earnCoins(score * 5)
        gainExperience(score * 3)
        tamagotchi.gamesWon++
        checkGameMasterAchievement()
        delete window.checkColorGuess
      }
    }, 1000)

    window.restartMathGame = () => {
      score = 0
      timeLeft = 60
      level = 1
      startMathGame()
    }

    generateColor()
    updateDisplay()
  }

  function startCatchGame() {
    delete window.checkColorGuess
    delete window.restartMathGame
    delete window.selectColor
    delete window.restartMemoryGame
    delete window.restartReactionGame
    delete window.restartCatchGame

    let score = 0
    let timeLeft = 30
    let level = 1
    let gameArea
    let gameTimer
    let fruitInterval

    function updateLevel() {
      level = Math.floor(score / 10) + 1
    }

    function getFruitSpeed() {
      return Math.max(1500, 3000 - level * 200) // Faster fruits at higher levels
    }

    function getSpawnRate() {
      return Math.max(400, 800 - level * 50) // More frequent spawns at higher levels
    }

    if (gameContent) {
      gameContent.innerHTML = `
        <div style="font-size: 2em; margin-bottom: 10px;">🎯 Pegue as Frutas!</div>
        <div id="catch-game-area" style="position: relative; width: 300px; height: 200px; background: linear-gradient(135deg, #87CEEB, #98FB98); border: 3px solid #4CAF50; border-radius: 15px; margin: 20px auto; overflow: hidden;"></div>
        <div>
          <p>Pontuação: <span id="catch-score">0</span> | Nível: <span id="catch-level">1</span></p>
          <p>Tempo: <span id="catch-time">30</span>s</p>
        </div>
      `
    }

    setTimeout(() => {
      gameArea = document.getElementById("catch-game-area")
      const scoreEl = document.getElementById("catch-score")
      const timeEl = document.getElementById("catch-time")
      const levelEl = document.getElementById("catch-level")

      if (!gameArea || !scoreEl || !timeEl || !levelEl) {
        console.error("Game elements not found")
        return
      }

      function createFruit() {
        if (!gameArea) return // Safety check

        const fruits = ["🍎", "🍊", "🍌", "🍇", "🍓", "🥝", "🍑", "🍒"]
        const fruit = document.createElement("div")
        fruit.textContent = fruits[Math.floor(Math.random() * fruits.length)]
        fruit.style.position = "absolute"
        fruit.style.fontSize = "2em"
        fruit.style.cursor = "pointer"
        fruit.style.left = Math.random() * 250 + "px"
        fruit.style.top = "0px"
        fruit.style.transition = `top ${getFruitSpeed()}ms linear`
        fruit.style.userSelect = "none"
        fruit.style.zIndex = "10"

        if (Math.random() < 0.1) {
          // 10% chance for golden fruit
          fruit.textContent = "⭐"
          fruit.style.fontSize = "2.5em"
          fruit.dataset.special = "true"
        }

        fruit.addEventListener("click", () => {
          const points = fruit.dataset.special ? 5 : 1
          score += points
          if (scoreEl) scoreEl.textContent = score
          updateLevel()
          if (levelEl) levelEl.textContent = level
          fruit.remove()
          createParticleEffect(fruit.dataset.special ? "stars" : "sparkles")

          if (fruit.dataset.special) {
            showMessage("⭐ Fruta Especial! +5 pontos!")
          }
        })

        gameArea.appendChild(fruit)

        setTimeout(() => {
          if (fruit.parentNode) {
            fruit.style.top = "170px"
          }
        }, 50)

        setTimeout(() => {
          if (fruit.parentNode) {
            fruit.remove()
          }
        }, getFruitSpeed())
      }

      fruitInterval = setInterval(createFruit, getSpawnRate())

      gameTimer = setInterval(() => {
        timeLeft--
        if (timeEl) timeEl.textContent = timeLeft

        if (timeLeft <= 0) {
          clearInterval(gameTimer)
          clearInterval(fruitInterval)
          if (gameContent) {
            gameContent.innerHTML = `
              <div style="font-size: 3em;">🎯</div>
              <p>Tempo esgotado!</p>
              <p>Frutas coletadas: ${score}</p>
              <p>Nível alcançado: ${level}</p>
              <div style="margin: 20px;">
                <button onclick="window.restartCatchGame()" class="action-button">Jogar Novamente</button>
                <button onclick="hideGameModal()" class="action-button">Sair</button>
              </div>
            `
          }
          earnCoins(score * 8)
          gainExperience(score * 6)
          tamagotchi.gamesWon++
          checkGameMasterAchievement()
        }
      }, 1000)
    }, 100) // 100ms delay to ensure DOM is ready

    window.restartCatchGame = () => {
      if (gameTimer) clearInterval(gameTimer)
      if (fruitInterval) clearInterval(fruitInterval)
      score = 0
      timeLeft = 30
      level = 1
      startCatchGame()
    }
  }

  // Save/Load/Reset functions
  function autoSave() {
    if (isResetting) return // Don't save during reset

    try {
      const gameState = {
        tamagotchi: { ...tamagotchi },
        timestamp: Date.now(),
      }
      localStorage.setItem("tamagotchiSave", JSON.stringify(gameState))
    } catch (error) {
      console.error("Erro ao salvar automaticamente:", error)
    }
  }

  function loadGame() {
    try {
      const savedState = localStorage.getItem("tamagotchiSave")
      if (savedState) {
        const loadedTamagotchi = JSON.parse(savedState)
        Object.assign(tamagotchi, loadedTamagotchi)
        tamagotchi.lastUpdateTime = Date.now()

        if (petImageEl) {
          if (tamagotchi.isSleeping) {
            petImageEl.style.transform = "scale(0.8)"
          } else {
            petImageEl.style.transform = "scale(1)"
          }
        }

        updateDisplay()
        console.log("[v0] Game loaded automatically")
        return true
      } else {
        console.log("[v0] No saved game found, starting fresh")
        return false
      }
    } catch (error) {
      console.error("[v0] Error loading game:", error)
      return false
    }
  }

  function checkGameMasterAchievement() {
    if (tamagotchi.gamesWon >= 10 && !tamagotchi.achievements["game-master"]) {
      tamagotchi.achievements["game-master"] = true
      showMessage("🏆 Conquista desbloqueada: Mestre dos Jogos!")
    }
  }

  // Event Listeners
  actionFeedBtn.addEventListener("click", () => {
    performAction("feed")
    setTimeout(autoSave, 1000) // Save 1 second after feeding
  })

  actionPlayBtn.addEventListener("click", () => {
    performAction("play")
    setTimeout(autoSave, 1000) // Save 1 second after playing
  })

  actionSleepBtn.addEventListener("click", () => {
    performAction("sleep")
    setTimeout(autoSave, 1000) // Save 1 second after sleep action
  })

  actionCleanBtn.addEventListener("click", () => {
    performAction("clean")
    setTimeout(autoSave, 1000) // Save 1 second after cleaning
  })

  actionMedicineBtn.addEventListener("click", () => performAction("medicine"))
  actionPetBtn.addEventListener("click", () => performAction("pet"))

  // Tab switching
  tabCareBtn.addEventListener("click", () => switchTab("care"))
  tabGamesBtn.addEventListener("click", () => switchTab("games"))
  tabShopBtn.addEventListener("click", () => switchTab("shop"))
  tabAchievementsBtn.addEventListener("click", () => switchTab("achievements"))

  // Modal controls
  closeMessageBtn.addEventListener("click", hideMessage)
  closeGameBtn.addEventListener("click", hideGameModal)

  messageBox.addEventListener("click", (e) => {
    if (e.target === messageBox) hideMessage()
  })

  gameModal.addEventListener("click", (e) => {
    if (e.target === gameModal) hideGameModal()
  })

  // Shop items
  document.querySelectorAll(".shop-item").forEach((item) => {
    item.addEventListener("click", () => {
      const itemType = item.dataset.item
      const cost = Number.parseInt(item.dataset.cost)
      buyItem(itemType, cost)
    })
  })

  // Mini-games
  document.getElementById("game-memory").addEventListener("click", () => {
    showGameModal("🧠 Jogo da Memória", "")
    startMemoryGame()
  })

  document.getElementById("game-reaction").addEventListener("click", () => {
    showGameModal("⚡ Teste de Reflexo", "")
    startReactionGame()
  })

  document.getElementById("game-math").addEventListener("click", () => {
    showGameModal("🎨 Adivinhe a Cor", "")
    startMathGame()
  })

  document.getElementById("game-catch").addEventListener("click", () => {
    showGameModal("🎯 Pegar Frutas", "")
    startCatchGame()
  })

  // Pet click interaction
  petImageEl.addEventListener("click", () => {
    if (tamagotchi.isAlive && !tamagotchi.isSleeping) {
      performAction("pet")
      setTimeout(autoSave, 1000) // Save 1 second after petting
    }
  })

  // Initialize
  const gameLoaded = loadGame()
  if (!gameIntervalId) {
    updateDisplay()
    gameIntervalId = setInterval(gameLoop, GAME_INTERVAL_MS)
  }

  setInterval(autoSave, 30000)

  window.addEventListener("beforeunload", autoSave)

  // Reset game functionality
  if (resetGameBtn) {
    resetGameBtn.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja reiniciar o jogo? Todo o progresso será perdido!")) {
        // Set reset flag to prevent auto-save
        isResetting = true

        // Clear all intervals and timeouts
        if (gameIntervalId) clearInterval(gameIntervalId)

        // Clear localStorage
        localStorage.removeItem("tamagotchiSave")

        // Reset tamagotchi to initial state
        Object.assign(tamagotchi, {
          name: "Ovo",
          hunger: MAX_STAT,
          happiness: MAX_STAT,
          energy: MAX_STAT,
          cleanliness: MAX_STAT,
          health: MAX_STAT,
          ageDays: 0,
          level: 1,
          experience: 0,
          coins: 100,
          lastUpdateTime: Date.now(),
          isSleeping: false,
          isSick: false,
          isAlive: true,
          inventory: {
            "premium-food": 0,
            toy: 0,
            medicine: 0,
            decoration: 0,
          },
          achievements: {
            "first-feed": false,
            "happy-pet": false,
            "level-5": false,
            "game-master": false,
          },
        })

        // Force immediate reload
        setTimeout(() => {
          location.reload()
        }, 100)
      }
    })
  }
})
