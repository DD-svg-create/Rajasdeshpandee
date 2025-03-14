const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let score = 0;
let player = {
    x: 50,
    y: canvas.height - 50,
    aimAngle: 0, // Angle in radians
    bowLoaded: false,
    arrow: null
};
let target = {
    x: canvas.width - 60,
    y: canvas.height / 2,
    width: 20,
    height: 20
};
let arrows = [];
const GRAVITY = 0.3; // Reduced gravity for a stronger effect
const ARROW_SPEED = 20; // Increased speed for a stronger bow

// Update score display
function updateScore() {
    document.getElementById("score").textContent = score;
}

// Handle key presses
document.addEventListener("keydown", (e) => {
    switch (e.key.toLowerCase()) {
        case "g": // Load the bow
            if (!player.bowLoaded) {
                player.bowLoaded = true;
                player.arrow = { x: player.x + 30, y: player.y, angle: player.aimAngle };
            }
            break;
        case "s": // Aim up (decrease angle)
            if (player.aimAngle > -Math.PI / 4) {
                player.aimAngle -= Math.PI / 180 * 2;
            }
            break;
        case "w": // Aim down (increase angle)
            if (player.aimAngle < Math.PI / 4) {
                player.aimAngle += Math.PI / 180 * 2;
            }
            break;
        case "k": // Shoot
            if (player.bowLoaded && player.arrow) {
                arrows.push({
                    x: player.arrow.x,
                    y: player.arrow.y,
                    vx: Math.cos(player.aimAngle) * ARROW_SPEED,
                    vy: -Math.sin(player.aimAngle) * ARROW_SPEED
                });
                player.bowLoaded = false;
                player.arrow = null;
            }
            break;
    }
});

// Check for collision between arrow and target
function checkCollision(arrow, target) {
    return (
        arrow.x > target.x &&
        arrow.x < target.x + target.width &&
        arrow.y > target.y &&
        arrow.y < target.y + target.height
    );
}

// Randomize target position and size after hit
function randomizeTarget() {
    target.y = Math.random() * (canvas.height - 100) + 50;
    target.width = Math.random() * 20 + 10; // Width between 10 and 30
    target.height = Math.random() * 20 + 10; // Height between 10 and 30
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player (simple stick figure with bow)
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(player.x, player.y - 20, 10, 0, Math.PI * 2); // Head
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - 10);
    ctx.lineTo(player.x, player.y + 20); // Body
    ctx.stroke();

    // Draw bow
    ctx.beginPath();
    ctx.moveTo(player.x + 20, player.y);
    ctx.lineTo(player.x + 30, player.y - 10);
    ctx.lineTo(player.x + 30, player.y + 10);
    ctx.closePath();
    ctx.stroke();

    // Draw aim line
    ctx.beginPath();
    ctx.moveTo(player.x + 30, player.y);
    ctx.lineTo(player.x + 60, player.y - Math.tan(player.aimAngle) * 30);
    ctx.strokeStyle = "gray";
    ctx.stroke();
    ctx.strokeStyle = "black";

    // Draw loaded arrow
    if (player.bowLoaded && player.arrow) {
        ctx.beginPath();
        ctx.moveTo(player.arrow.x, player.arrow.y);
        ctx.lineTo(player.arrow.x + 20, player.arrow.y - Math.tan(player.aimAngle) * 10);
        ctx.stroke();
    }

    // Update and draw arrows
    for (let i = arrows.length - 1; i >= 0; i--) {
        let arrow = arrows[i];
        arrow.x += arrow.vx;
        arrow.y += arrow.vy;
        arrow.vy += GRAVITY; // Apply gravity

        // Draw arrow
        ctx.beginPath();
        ctx.moveTo(arrow.x, arrow.y);
        ctx.lineTo(arrow.x - 10, arrow.y);
        ctx.stroke();

        // Check collision with target
        if (checkCollision(arrow, target)) {
            score++;
            updateScore();
            randomizeTarget();
            arrows.splice(i, 1);
            continue;
        }

        // Remove arrow if it goes off-screen
        if (arrow.x > canvas.width || arrow.y > canvas.height) {
            arrows.splice(i, 1);
        }
    }

    // Draw target
    ctx.fillStyle = "red";
    ctx.fillRect(target.x, target.y, target.width, target.height);

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();