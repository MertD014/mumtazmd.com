document.addEventListener('DOMContentLoaded', () => {
  const locations = [
    { emojis: ['🍕', '🏛️', '🛵'], answer: 'Italy' },
    { emojis: ['🌸', '🏯', '🍣'], answer: 'Japan' },
    { emojis: ['☀️', '🏖️', '🍊'], answer: 'Turkey' },
    { emojis: ['🍎', '⭐', '🦅'], answer: 'USA' },
    { emojis: ['🥐', '🍷', '🎨'], answer: 'France' },
    { emojis: ['🎡', '💂', '👑'], answer: 'UK' },
    { emojis: ['🌮', '🎸', '🌵'], answer: 'Mexico' },
    { emojis: ['🐪', '🛕', '🏜️'], answer: 'Egypt' },
    { emojis: ['🌉', '🕌', '☕'], answer: 'Turkey' },
    { emojis: ['🍁', '🏒', '🐻'], answer: 'Canada' },
    { emojis: ['🐼', '🧱', '🍚'], answer: 'China' },
    { emojis: ['⚽', '🌴', '🎉'], answer: 'Brazil' },
    { emojis: ['🐨', '🌊', '🪃'], answer: 'Australia' },
    { emojis: ['🌭', '🍺', '🏰'], answer: 'Germany' },
    { emojis: ['🐘', '🙏', '🍛'], answer: 'India' },
    { emojis: ['🍷', '💃', '🐃'], answer: 'Spain' },
    { emojis: ['🦓', '🦁', '🏞️'], answer: 'South Africa' },
    { emojis: ['📱', '🎎', '🍜'], answer: 'South Korea' },
    { emojis: ['🥝', '🐑', '⛰️'], answer: 'New Zealand' },
    { emojis: ['❄️', '🐻‍❄️', '🪆'], answer: 'Russia' },
    { emojis: ['⛰️', '🍫', '⌚'], answer: 'Switzerland' },
    { emojis: ['🏺', '🌊', '🏛️'], answer: 'Greece' },
    { emojis: ['🪓', '🚢', '🦌'], answer: 'Norway' },
    { emojis: ['🐪', '💰', '🌴'], answer: 'Saudi Arabia' },
    { emojis: ['🍀', '🍺', '🎻'], answer: 'Ireland' },
    { emojis: ['🌷', '🚲', '🧀'], answer: 'Netherlands' },
    { emojis: ['💃', '🥩', '☀️'], answer: 'Argentina' },
    { emojis: ['🗿', '🌋', '🌊'], answer: 'Chile' },
    { emojis: ['🐅', '🌴', '🍜'], answer: 'Thailand' }
  ]

  // --- DOM Elements ---
  const emojiCluesElement = document.getElementById('emoji-clues')
  const guessInputElement = document.getElementById('guess-input')
  const submitButton = document.getElementById('submit-guess')
  const feedbackMessageElement = document.getElementById('feedback-message')
  const scoreElement = document.getElementById('score')

  // --- Game State ---
  let currentQuestion = null
  let score = 0
  let questionsAsked = [] // Keep track of asked questions to avoid repeats
  let availableQuestions = [...locations] // Create a copy to modify

  // --- Functions ---

  function getRandomLocation() {
    if (availableQuestions.length === 0) {
      // Optional: Reset if all questions asked once
      if (locations.length > 0) {
        // Check if there were questions to begin with
        feedbackMessageElement.textContent = 'Restarting questions! Keep going!'
        feedbackMessageElement.className = 'feedback'
        availableQuestions = [...locations] // Refill available questions
        // Short delay before showing the first reset question
        setTimeout(() => {
          if (availableQuestions.length > 0) {
            // Double check
            const randomIndex = Math.floor(Math.random() * availableQuestions.length)
            currentQuestion = availableQuestions.splice(randomIndex, 1)[0] // Select and remove
            displayQuestion()
          }
        }, 1500)
        return null // Indicate reset is happening
      } else {
        feedbackMessageElement.textContent = 'No questions loaded!'
        feedbackMessageElement.className = 'feedback'
        submitButton.disabled = true
        return null
      }
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    return availableQuestions.splice(randomIndex, 1)[0] // Select and remove question
  }

  function displayQuestion() {
    if (currentQuestion) {
      emojiCluesElement.textContent = currentQuestion.emojis.join(' ')
      guessInputElement.value = '' // Clear input field
      feedbackMessageElement.textContent = '' // Clear feedback
      feedbackMessageElement.className = 'feedback' // Reset feedback class
      guessInputElement.focus() // Focus on input for better UX
      submitButton.disabled = false // Ensure button is enabled
    } else {
      // Handle case where no question could be loaded (e.g., initial state or after reset failed)
      emojiCluesElement.textContent = '...'
      feedbackMessageElement.textContent = 'Loading...'
    }
  }

  function loadNextQuestion() {
    currentQuestion = getRandomLocation()
    displayQuestion()
  }

  function checkAnswer() {
    if (!currentQuestion) return // No question loaded

    const userAnswer = guessInputElement.value.trim()
    const correctAnswer = currentQuestion.answer

    // Case-insensitive comparison
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      feedbackMessageElement.textContent = 'Correct!'
      feedbackMessageElement.className = 'feedback correct'
      score++
      scoreElement.textContent = score
    } else {
      feedbackMessageElement.textContent = `Incorrect! The answer was ${correctAnswer}.`
      feedbackMessageElement.className = 'feedback incorrect'
    }

    // Disable button temporarily to prevent multiple submissions
    submitButton.disabled = true

    // Load next question after a short delay
    setTimeout(() => {
      loadNextQuestion()
    }, 2000) // 2-second delay
  }

  // --- Event Listeners ---
  submitButton.addEventListener('click', checkAnswer)

  // Allow submitting with Enter key in the input field
  guessInputElement.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      // Prevent submitting if button is disabled (e.g., during feedback delay)
      if (!submitButton.disabled) {
        checkAnswer()
      }
    }
  })

  // --- Initial Load ---
  loadNextQuestion() // Load the first question
})
