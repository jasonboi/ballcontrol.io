const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, color: 'blue' };
let targets = [];
const targetCount = 4;
const targetRadius = 15;

// Initialize 4 random targets
function generateTargets() {
    targets = [];
    for (let i = 0; i < targetCount; i++) {
        targets.push({
            x: Math.random() * (canvas.width - 2 * targetRadius) + targetRadius,
            y: Math.random() * (canvas.height - 2 * targetRadius) + targetRadius,
            radius: targetRadius,
            color: 'red',
        });
    }
}

// Draw ball and targets
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    // Draw targets
    targets.forEach(target => {
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fillStyle = target.color;
        ctx.fill();
        ctx.closePath();
    });

    // Display score
    document.getElementById('score').innerText = 'Score: ' + score;
}

// Check if ball hits any target
function checkCollision() {
    targets = targets.filter(target => {
        const dist = Math.hypot(ball.x - target.x, ball.y - target.y);
        if (dist < ball.radius + target.radius) {
            score++;
            return false;  // Target disappears after hit
        }
        return true;
    });

    // If all targets are hit, regenerate new targets
    if (targets.length === 0) {
        generateTargets();
    }
}

// Handle device orientation event to move the ball
window.addEventListener('deviceorientation', event => {
    const tiltX = event.beta;  // Front-to-back tilt in degrees
    const tiltY = event.gamma; // Left-to-right tilt in degrees

    // Adjust ball position based on tilt
    ball.x += tiltY / 5;
    ball.y += tiltX / 5;

    // Prevent ball from moving out of bounds
    if (ball.x < ball.radius) ball.x = ball.radius;
    if (ball.x > canvas.width - ball.radius) ball.x = canvas.width - ball.radius;
    if (ball.y < ball.radius) ball.y = ball.radius;
    if (ball.y > canvas.height - ball.radius) ball.y = canvas.height - ball.radius;
});

// Main game loop
function gameLoop() {
    draw();
    checkCollision();
    requestAnimationFrame(gameLoop);
}

// Start the game
generateTargets();
gameLoop();
