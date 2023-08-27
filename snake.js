const canvas = document.querySelector('canvas')
const canvasContext = canvas.getContext('2d')

canvas.width = 1250   //define width and height by calculation, they should be an factor of snake's dimensions
canvas.height = 625

let snake = [{ x: 250, y: 250 }, { x: 225, y: 250 }, { x: 200, y: 250 }]
let snakeMoveSpeed = 3

let reversed = {  // we create reversed object to prevent reversing moves  
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
}
let gameScore = 0

// function parameters setting to draw the snake 
function drawSnakePart(snakePart) {

    canvasContext.fillStyle = "white"
    canvasContext.strokeStyle = "red"
    canvasContext.fillRect(snakePart.x, snakePart.y, 25, 25)
    canvasContext.strokeRect(snakePart.x, snakePart.y, 25, 25)
}

// function to draw all parts of the snake
function drawSnake() {
    snake.forEach(drawSnakePart)
}

//function drawing game board
function gameBord() {
    canvasContext.fillStyle = "black"
    canvas.strokeStyle = "red"
    canvasContext.fillRect(canvas.clientLeft, canvas.clientTop, canvas.width, canvas.height)
    canvasContext.strokeRect(canvas.clientLeft, canvas.clientTop, canvas.width, canvas.height)
}

// function to animate the game
let timeout;
snakeAndBoard()
function snakeAndBoard() {

   timeout= setTimeout(() => { 
        gameBord()           // all call back functions should be listed efficiently to make the game reacts properly
        gameOver()
        instanceMoveSnake()
        snakeGrowth()
        drawSnake()
        snakeAndBoard()
        avoidReversingMove()
        snakeController()
        updateFood()
        makeFood()
        score()
    }, 1000 / snakeMoveSpeed) // 1000 divided by snakeMoveSpeed refreshes the game 7 times on a second and calling back snakeAndBoard() creates an infinite animation

}

//animate snake
let velocity = { x: 25, y: 0 }
function instanceMoveSnake() {

    const headSnake = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y }
    snake.unshift(headSnake); // push headSnake into snake array to be the first index
    snake.pop(); // remove the last index of snake array
}

// control the snake directions, adding reversed Object
function snakeController() {

    window.addEventListener('keydown', (event) => {

        if (event.key === "ArrowDown" && reversed.ArrowDown === false) {
            velocity.x = 0
            velocity.y = 25
        } else if (event.key === "ArrowLeft" && reversed.ArrowLeft === false) {
            velocity.x = -25
            velocity.y = 0
        } else if (event.key === "ArrowUp" && reversed.ArrowUp === false) {
            velocity.x = 0
            velocity.y = -25
        } else if (event.key === "ArrowRight" && reversed.ArrowRight === false) {
            velocity.x = 25
            velocity.y = 0
        }
    })
}

// to prevent reversing moves here !
function avoidReversingMove() {
    window.addEventListener('keydown', (event) => {

        if (velocity.x === -25) {
            if (event.key === "ArrowRight") {
                reversed.ArrowRight = true
                velocity.x = -25
            }
        } else {
            reversed.ArrowRight = false
        }
        if (velocity.x === 25) {
            if (event.key === "ArrowLeft") {
                reversed.ArrowLeft = true
                velocity.x = 25
            }
        } else {
            reversed.ArrowLeft = false
        }
        if (velocity.y === 25) {
            if (event.key === "ArrowUp") {
                reversed.ArrowUp = true
                velocity.y = 25
            }
        } else {
            reversed.ArrowUp = false
        }
        if (velocity.y === -25) {
            if (event.key === "ArrowDown") {
                reversed.ArrowDown = true
                velocity.y = -25
            }
        } else {
            reversed.ArrowDown = false
        }
    })
}

//make food with random positions
let food = {
    x: (Math.floor(Math.random() * 50)) * 25, y: (Math.floor(Math.random() * 25)) * 25
}

// to draw food into game board 
function makeFood() {
    canvasContext.fillStyle = "red"
    canvasContext.strokeStyle = "white"
    canvasContext.fillRect(food.x, food.y, 25, 25)
    canvasContext.strokeRect(food.x, food.y, 25, 25)
}

//update food when snake ate it
function updateFood() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        food.x = (Math.floor(Math.random() * 50)) * 25
        food.y = (Math.floor(Math.random() * 25)) * 25
    }
}

//snake growth after eating
function snakeGrowth() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        snake.push(food)
        snakeMoveSpeed += 0.1 // increases the speed of the snake
        gameScore++ // increases score when snake ate food
    } 
}

// Game Over
function gameOver() {

    for (let snakeSlice = 3; snakeSlice < snake.length; snakeSlice++) {
        if (snake[0].x === snake[snakeSlice].x && snake[0].y === snake[snakeSlice].y) {
            headCollidesBody()
        }
    }
    if (snake[0].x > canvas.width - 25 || snake[0].x < canvas.clientLeft || snake[0].y < canvas.clientTop || snake[0].y > canvas.clientHeight) {
        headCollidesBody()
    }
}

//function head coliides body snake game over
function headCollidesBody() {
    velocity.x = 0
    velocity.y = 0
    array = ["OOOps...Game Over", `        Score: ${gameScore}`]
    for (let i = 0; i < 2; i++) {
        canvasContext.strokeStyle = "red"
        canvasContext.fillStyle = 'white'
        canvasContext.font = "50px cursive"
        canvasContext.strokeText(array[i], 400, 300 + 70 * i)
    }
    food.x = {} // clear food and snake from the screen when game over
    snake = []
}

// add score 
function score() {
    canvasContext.strokeStyle = "red"
    canvasContext.font = "20px cursive"
    canvasContext.strokeText(`Score: ${gameScore}`, 1125, 30)
}

// to pause the game with Space button and make it play by the Enter one on the keyboard 
window.addEventListener('keydown', (e) => {
    let gameStatus = "paused"
    if(e.key === " " && gameStatus === "paused"){
        clearTimeout(timeout)
        canvasContext.fillStyle = 'red'
        canvasContext.strokeStyle = "white"
        canvasContext.font = "60px cursive"
        canvasContext.fillText('Game Paused', 440, 335)
        canvasContext.strokeText('Game Paused', 440, 335 )
    }else if(e.key === "Enter"){
        gameStatus = "playing"
       snakeAndBoard()
    }
})

//THANK YOU!!!