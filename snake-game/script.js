document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas')
  const ctx = canvas.getContext('2d')
  const scoreElement = document.getElementById('score')
  const gameOverElement = document.getElementById('gameOver')

  const gridSize = 20 // Size of each grid cell
  const canvasSize = 400 // Must match canvas width/height
  const tileCount = canvasSize / gridSize // How many cells fit

  // Game variables
  let snake = [{ x: 10, y: 10 }] // Initial snake position (middle)
  let food = { x: 15, y: 15 }
  let dx = 0 // Horizontal velocity
  let dy = 0 // Vertical velocity
  let score = 0
  let changingDirection = false // Prevent rapid 180 turns
  let gameLoopTimeout
  let isGameOver = false

  function gameLoop() {
    if (isGameOver) return

    changingDirection = false // Reset direction lock

    // Use setTimeout for consistent speed regardless of processing time
    gameLoopTimeout = setTimeout(() => {
      clearCanvas()
      moveSnake()
      drawFood()
      drawSnake()
      gameLoop() // Loop
    }, 100) // Adjust for game speed (lower is faster)
  }

  function clearCanvas() {
    ctx.fillStyle = '#e0f2e9' // Match CSS background
    ctx.fillRect(0, 0, canvasSize, canvasSize)
  }

  function drawSnakePart(snakePart) {
    ctx.fillStyle = '#4CAF50' // Green snake
    ctx.strokeStyle = '#388E3C' // Darker border
    ctx.fillRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize)
    ctx.strokeRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize)
  }

  function drawSnake() {
    snake.forEach(drawSnakePart)
  }

  function moveSnake() {
    // Create new head position based on velocity
    const head = { x: snake[0].x + dx, y: snake[0].y + dy }
    snake.unshift(head) // Add new head to the beginning

    // Check for collisions
    if (checkCollision(head)) {
      gameOver()
      return
    }

    // Check if snake ate food
    const didEatFood = head.x === food.x && head.y === food.y
    if (didEatFood) {
      score += 10
      scoreElement.textContent = score
      generateFood() // Place new food
    } else {
      snake.pop() // Remove tail segment if no food was eaten
    }
  }

  function generateFood() {
    // Find a random position not occupied by the snake
    while (true) {
      food.x = Math.floor(Math.random() * tileCount)
      food.y = Math.floor(Math.random() * tileCount)

      let collisionWithSnake = false
      for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
          collisionWithSnake = true
          break
        }
      }
      if (!collisionWithSnake) break // Found a valid spot
    }
  }

  function drawFood() {
    ctx.fillStyle = '#F44336' // Red food
    ctx.strokeStyle = '#D32F2F' // Darker red border
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize)
    ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize)
  }

  function changeDirection(event) {
    if (changingDirection || isGameOver) return // Prevent multiple direction changes per tick or after game over
    changingDirection = true

    const LEFT_KEY = 37
    const RIGHT_KEY = 39
    const UP_KEY = 38
    const DOWN_KEY = 40

    const keyPressed = event.keyCode

    // Prevent moving directly opposite
    const goingUp = dy === -1
    const goingDown = dy === 1
    const goingRight = dx === 1
    const goingLeft = dx === -1

    if (keyPressed === LEFT_KEY && !goingRight) {
      dx = -1
      dy = 0
    }
    if (keyPressed === UP_KEY && !goingDown) {
      dx = 0
      dy = -1
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
      dx = 1
      dy = 0
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
      dx = 0
      dy = 1
    }
  }

  function checkCollision(head) {
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      return true
    }
    // Self collision (check if head hits any part of the body)
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true
      }
    }
    return false
  }

  function gameOver() {
    isGameOver = true
    clearTimeout(gameLoopTimeout) // Stop the game loop
    gameOverElement.style.display = 'block' // Show game over message
  }

  function restartGame(event) {
    if (event.key.toLowerCase() === 'r' && isGameOver) {
      // Reset game state
      snake = [{ x: 10, y: 10 }]
      food = { x: 15, y: 15 }
      dx = 0
      dy = 0
      score = 0
      scoreElement.textContent = score
      isGameOver = false
      gameOverElement.style.display = 'none'
      changingDirection = false

      // Start the game loop again
      gameLoop()
    }
  }

  // Start game
  generateFood() // Place initial food
  document.addEventListener('keydown', changeDirection)
  document.addEventListener('keydown', restartGame) // Listener for restart
  gameLoop() // Start the main loop
})
