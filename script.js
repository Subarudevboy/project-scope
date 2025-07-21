// Application State
const state = {
  currentScreen: "welcome",
  breathingActive: false,
  soundEnabled: false,
  theme: "light",
  visitCount: 0,
  lastFeeling: "",
  emotionalTone: "neutral",
}

// Calm phrases for breathing screen
const calmPhrases = [
  "You are not behind. You are exactly where you need to be.",
  "This feeling will pass. You are stronger than you know.",
  "Breathe. Just breathe. That's all you need to do right now.",
  "You are safe. You are enough. You are not alone.",
  "One breath at a time. One moment at a time.",
  "Your feelings are valid. It's okay to not be okay.",
  "You've survived difficult moments before. You can do this.",
  "Rest is not a reward for work completed. Rest is a right.",
  "Progress isn't always visible. Healing isn't always linear.",
  "You don't have to be perfect. You just have to be present.",
]

// AI Response templates based on emotional tone
const aiResponses = {
  overwhelmed: [
    "It sounds like you're carrying a lot right now. That feeling of being overwhelmed is completely valid - it means you care deeply about many things. Let's take this one breath at a time.",
    "I hear that things feel like too much right now. When we're overwhelmed, our minds try to solve everything at once. You don't have to figure it all out today.",
    "Overwhelm often comes when we're trying to be everything to everyone. It's okay to slow down and focus on just this moment.",
  ],
  anxious: [
    "Anxiety can make everything feel urgent and scary. But right here, right now, you are safe. Your nervous system is trying to protect you, even if it doesn't feel helpful.",
    "I notice you're feeling anxious. Anxiety often comes from our mind trying to solve problems that haven't happened yet. Let's bring you back to this present moment.",
    "That anxious feeling in your body is real and valid. Sometimes our nervous system gets activated even when we're physically safe. Let's help it settle.",
  ],
  sad: [
    "Sadness is one of the most human experiences we have. It shows that something mattered to you. It's okay to feel this deeply.",
    "I can sense the heaviness you're carrying. Sadness isn't something to fix or rush through - it's something to honor and hold gently.",
    "Your sadness is valid. Sometimes we need to feel our feelings fully before we can move through them. You don't have to be strong right now.",
  ],
  stressed: [
    "Stress is your body's way of saying 'this matters to me.' But you don't have to carry all of this tension in your body. Let's help you release some of it.",
    "I hear that you're feeling stressed. When we're stressed, everything can feel urgent. But most things can wait while you take care of yourself.",
    "Stress often comes from feeling like we have to do everything perfectly and immediately. What if you gave yourself permission to do just one thing at a time?",
  ],
  tired: [
    "Exhaustion is your body and mind asking for rest. This isn't weakness - it's wisdom. You've been working hard, and it's okay to pause.",
    "Being tired isn't just about sleep - sometimes we're emotionally or mentally exhausted. All forms of tiredness deserve compassion and rest.",
    "Your tiredness is telling you something important. In a world that glorifies being busy, choosing rest is a radical act of self-care.",
  ],
  neutral: [
    "Thank you for sharing with me. Whatever you're feeling right now is completely valid. You took a brave step by reaching out.",
    "I'm here with you in this moment. Sometimes we don't need to label our feelings - we just need to know we're not alone.",
    "It takes courage to pause and check in with yourself. That's exactly what you're doing right now, and that's beautiful.",
  ],
}

// Next step options based on emotional tone
const nextStepOptions = {
  overwhelmed: [
    { text: "Take a 5-minute walk outside", action: "walk" },
    { text: "Write down just 3 priorities for today", action: "prioritize" },
    { text: "Do gentle stretches for 2 minutes", action: "stretch" },
    { text: "Close this tab and rest", action: "rest" },
  ],
  anxious: [
    { text: "Try the 5-4-3-2-1 grounding technique", action: "ground" },
    { text: "Listen to calming music for 10 minutes", action: "music" },
    { text: "Call someone who makes you feel safe", action: "connect" },
    { text: "Take a warm shower or bath", action: "comfort" },
  ],
  sad: [
    { text: "Allow yourself to cry if you need to", action: "release" },
    { text: "Wrap yourself in a soft blanket", action: "comfort" },
    { text: "Write in a journal about your feelings", action: "journal" },
    { text: "Watch something that usually comforts you", action: "comfort" },
  ],
  stressed: [
    { text: "Do 10 shoulder rolls and neck stretches", action: "stretch" },
    { text: "Make a cup of tea and drink it slowly", action: "ritual" },
    { text: "Step away from your tasks for 15 minutes", action: "break" },
    { text: "Practice saying 'no' to one thing today", action: "boundaries" },
  ],
  tired: [
    { text: "Take a 20-minute power nap", action: "nap" },
    { text: "Go to bed 30 minutes earlier tonight", action: "sleep" },
    { text: "Cancel one non-essential commitment", action: "simplify" },
    { text: "Ask someone for help with one task", action: "support" },
  ],
  neutral: [
    { text: "Take a mindful walk", action: "walk" },
    { text: "Do something creative for 10 minutes", action: "create" },
    { text: "Reach out to a friend", action: "connect" },
    { text: "Practice gratitude - name 3 good things", action: "gratitude" },
  ],
}

// DOM Elements
const screens = {
  welcome: document.getElementById("welcomeScreen"),
  countdown: document.getElementById("countdownScreen"),
  breathing: document.getElementById("breathingScreen"),
  aiInput: document.getElementById("aiInputScreen"),
  nextSteps: document.getElementById("nextStepsScreen"),
}

const elements = {
  enterBtn: document.getElementById("enterBtn"),
  continueBtn: document.getElementById("continueBtn"),
  shareBtn: document.getElementById("shareBtn"),
  skipBtn: document.getElementById("skipBtn"),
  backToBreathingBtn: document.getElementById("backToBreathingBtn"),
  resetBtn: document.getElementById("resetBtn"),
  themeToggle: document.getElementById("themeToggle"),
  soundToggle: document.getElementById("soundToggle"),
  feelingInput: document.getElementById("feelingInput"),
  aiResponse: document.getElementById("aiResponse"),
  breathingText: document.getElementById("breathingText"),
  calmPhrase: document.getElementById("calmPhrase"),
  stepOptions: document.getElementById("stepOptions"),
  visitCounter: document.getElementById("visitCounter"),
  countdownNumber: document.getElementById("countdownNumber"),
}

// Initialize Application
function init() {
  loadState()
  setupEventListeners()
  updateVisitCounter()
  updateTheme()
  showRandomCalmPhrase()
}

// Load state from localStorage
function loadState() {
  const saved = localStorage.getItem("overwhelmModeState")
  if (saved) {
    const savedState = JSON.parse(saved)
    state.theme = savedState.theme || "light"
    state.visitCount = savedState.visitCount || 0
    state.lastFeeling = savedState.lastFeeling || ""
  }
  state.visitCount++
}

// Save state to localStorage
function saveState() {
  localStorage.setItem(
    "overwhelmModeState",
    JSON.stringify({
      theme: state.theme,
      visitCount: state.visitCount,
      lastFeeling: state.lastFeeling,
    }),
  )
}

// Setup event listeners
function setupEventListeners() {
  elements.enterBtn.addEventListener("click", startCountdown)
  elements.continueBtn.addEventListener("click", () => showScreen("aiInput"))
  elements.shareBtn.addEventListener("click", processFeeling)
  elements.skipBtn.addEventListener("click", () => showScreen("nextSteps"))
  elements.backToBreathingBtn.addEventListener("click", () => showScreen("breathing"))
  elements.resetBtn.addEventListener("click", resetSession)
  elements.themeToggle.addEventListener("click", toggleTheme)
  elements.soundToggle.addEventListener("click", toggleSound)

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyboard)
}

// Handle keyboard navigation
function handleKeyboard(e) {
  if (e.key === "Escape") {
    resetSession()
  }
  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
    const activeButton = document.activeElement
    if (activeButton.tagName === "BUTTON") {
      activeButton.click()
    }
  }
}

// Screen management
function showScreen(screenName) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"))
  screens[screenName].classList.add("active")
  state.currentScreen = screenName

  if (screenName === "breathing") {
    startBreathing()
  } else if (screenName === "nextSteps") {
    populateNextSteps()
  }
}

// Countdown functionality
function startCountdown() {
  showScreen("countdown")
  let count = 3
  elements.countdownNumber.textContent = count

  const countdownInterval = setInterval(() => {
    count--
    if (count > 0) {
      elements.countdownNumber.textContent = count
    } else {
      clearInterval(countdownInterval)
      showScreen("breathing")
    }
  }, 1000)
}

// Breathing functionality
function startBreathing() {
  state.breathingActive = true
  breathingCycle()
}

function breathingCycle() {
  if (!state.breathingActive) return

  // Inhale phase (4 seconds)
  elements.breathingText.textContent = "Breathe in..."
  elements.breathingText.style.color = "var(--accent-primary)"

  setTimeout(() => {
    if (!state.breathingActive) return
    // Hold phase (2 seconds)
    elements.breathingText.textContent = "Hold..."
    elements.breathingText.style.color = "var(--text-secondary)"

    setTimeout(() => {
      if (!state.breathingActive) return
      // Exhale phase (6 seconds)
      elements.breathingText.textContent = "Breathe out..."
      elements.breathingText.style.color = "var(--accent-secondary)"

      setTimeout(() => {
        if (state.breathingActive) {
          breathingCycle() // Continue the cycle
        }
      }, 6000)
    }, 2000)
  }, 4000)
}

// Show random calm phrase
function showRandomCalmPhrase() {
  const randomPhrase = calmPhrases[Math.floor(Math.random() * calmPhrases.length)]
  elements.calmPhrase.textContent = randomPhrase
}

// Process user's feeling input
function processFeeling() {
  const feeling = elements.feelingInput.value.trim()
  if (!feeling) return

  state.lastFeeling = feeling
  state.emotionalTone = analyzeEmotionalTone(feeling)

  // Show loading
  elements.aiResponse.innerHTML = '<div class="loading"></div> Processing your words...'
  elements.aiResponse.style.display = "block"

  // Simulate AI processing delay
  setTimeout(() => {
    const response = generateAIResponse(state.emotionalTone)
    elements.aiResponse.innerHTML = response

    // Optionally read response aloud
    if (state.soundEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(response)
      utterance.rate = 0.8
      utterance.pitch = 0.9
      speechSynthesis.speak(utterance)
    }

    setTimeout(() => {
      showScreen("nextSteps")
    }, 3000)
  }, 2000)

  saveState()
}

// Simple sentiment analysis
function analyzeEmotionalTone(text) {
  const lowerText = text.toLowerCase()

  const patterns = {
    overwhelmed: ["overwhelmed", "too much", "can't handle", "drowning", "swamped", "buried"],
    anxious: ["anxious", "worried", "nervous", "scared", "panic", "fear", "afraid"],
    sad: ["sad", "depressed", "down", "hopeless", "empty", "lonely", "grief"],
    stressed: ["stressed", "pressure", "tense", "deadline", "rush", "urgent"],
    tired: ["tired", "exhausted", "drained", "worn out", "fatigue", "weary"],
  }

  for (const [tone, keywords] of Object.entries(patterns)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      return tone
    }
  }

  return "neutral"
}

// Generate AI response based on emotional tone
function generateAIResponse(tone) {
  const responses = aiResponses[tone] || aiResponses.neutral
  return responses[Math.floor(Math.random() * responses.length)]
}

// Populate next steps based on emotional tone
function populateNextSteps() {
  const options = nextStepOptions[state.emotionalTone] || nextStepOptions.neutral
  elements.stepOptions.innerHTML = ""

  options.forEach((option) => {
    const button = document.createElement("button")
    button.className = "step-btn"
    button.textContent = option.text
    button.addEventListener("click", () => handleNextStep(option.action))
    elements.stepOptions.appendChild(button)
  })
}

// Handle next step selection
function handleNextStep(action) {
  const messages = {
    walk: "A gentle walk can help reset your nervous system. Even 5 minutes outside can make a difference.",
    stretch: "Movement helps release tension stored in your body. Listen to what feels good.",
    rest: "Rest is productive. Rest is necessary. You have permission to close this and simply be.",
    prioritize: "Focus on what truly needs your attention today. Everything else can wait.",
    ground: "5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
    music: "Let the music wash over you. You don't have to do anything but listen.",
    connect: "Reaching out takes courage. You deserve support and connection.",
    comfort: "Comfort isn't selfish - it's necessary. Wrap yourself in whatever feels soothing.",
    journal: "Your words matter. Your feelings matter. Write without judgment.",
    ritual: "Slow, mindful actions can help ground you in the present moment.",
    break: "Stepping away isn't giving up - it's giving yourself space to breathe.",
    boundaries: "Saying no to others means saying yes to yourself. You matter too.",
    nap: "Rest is not earned - it's needed. Your body is asking for what it needs.",
    sleep: "Good sleep is the foundation of emotional resilience. Prioritize it tonight.",
    simplify: "You don't have to do everything. Choose what truly matters today.",
    support: "Asking for help is a sign of wisdom, not weakness. You don't have to do this alone.",
    create: "Creativity is healing. Make something, anything, without pressure for perfection.",
    gratitude: "Gratitude doesn't dismiss your struggles - it adds light alongside them.",
  }

  alert(messages[action] || "Take care of yourself. You deserve kindness and compassion.")
}

// Theme management
function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light"
  updateTheme()
  saveState()
}

function updateTheme() {
  document.documentElement.setAttribute("data-theme", state.theme)
  document.getElementById("themeIcon").textContent = state.theme === "light" ? "🌙" : "☀️"
}

// Sound management
function toggleSound() {
  state.soundEnabled = !state.soundEnabled
  elements.soundToggle.classList.toggle("active", state.soundEnabled)
  document.getElementById("soundIcon").textContent = state.soundEnabled ? "🔊" : "🔇"
}

// Visit counter
function updateVisitCounter() {
  const messages = [
    `Day ${state.visitCount}: Welcome back.`,
    `Day ${state.visitCount}: You came back. We're glad you did.`,
    `Day ${state.visitCount}: Each visit is an act of self-care.`,
    `Day ${state.visitCount}: You're building a practice of presence.`,
  ]

  const message =
    state.visitCount === 1 ? "Welcome to your safe space." : messages[Math.floor(Math.random() * messages.length)]

  elements.visitCounter.textContent = message
}

// Reset session
function resetSession() {
  state.breathingActive = false
  state.currentScreen = "welcome"
  elements.feelingInput.value = ""
  elements.aiResponse.style.display = "none"
  showScreen("welcome")
  showRandomCalmPhrase()
}

// Initialize the application
init()
