const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas1.getContext('2d');
const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
const heightInput = document.getElementById('height');
const planet1Select = document.getElementById('planet1');
const planet2Select = document.getElementById('planet2');
const errorDiv = document.getElementById('error');
const label1 = document.getElementById('label1');
const label2 = document.getElementById('label2');
let animationFrameId;
let lastTime = 0;
let y1, v1, g1, y2, v2, g2, height, scale, e = 0.8; // coefficient of restitution
let ballRadius = 20;
let isRunning1 = false;
let isRunning2 = false;

const planets = {
    mercury: 3.7,
    venus: 8.87,
    earth: 9.81,
    mars: 3.71,
    jupiter: 24.79,
    saturn: 10.44,
    uranus: 8.69,
    neptune: 11.15
};

function startSimulation() {
    // Stop previous animation
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    // Validate input
    height = parseFloat(heightInput.value);
    if (isNaN(height) || height < 1) {
        errorDiv.style.display = 'block';
        return;
    }
    errorDiv.style.display = 'none';

    // Get planets
    const planet1 = planet1Select.value;
    const planet2 = planet2Select.value;
    g1 = planets[planet1];
    g2 = planets[planet2];

    // Set labels
    label1.textContent = planet1.charAt(0).toUpperCase() + planet1.slice(1);
    label2.textContent = planet2.charAt(0).toUpperCase() + planet2.slice(1);

    // Initialize simulations
    y1 = height;
    v1 = 0;
    y2 = height;
    v2 = 0;
    scale = (canvas1.height - 2 * ballRadius) / height;

    // Start animation
    isRunning1 = true;
    isRunning2 = true;
    lastTime = performance.now();
    animate();
}

function animate(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.033); // delta time in seconds, cap at 30fps
    lastTime = now;

    // Update simulation 1
    if (isRunning1) {
        v1 += -g1 * dt;
        y1 += v1 * dt;
        if (y1 <= 0) {
            y1 = 0;
            v1 = -e * v1;
            if (Math.abs(v1) < 0.1) {
                isRunning1 = false;
            }
        }
    }

    // Update simulation 2
    if (isRunning2) {
        v2 += -g2 * dt;
        y2 += v2 * dt;
        if (y2 <= 0) {
            y2 = 0;
            v2 = -e * v2;
            if (Math.abs(v2) < 0.1) {
                isRunning2 = false;
            }
        }
    }

    // Clear canvases
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    // Draw grounds
    [ctx1, ctx2].forEach(ctx => {
        ctx.beginPath();
        ctx.moveTo(0, ctx.canvas.height);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Draw ball 1 with shadow
    const canvasY1 = canvas1.height - ballRadius - (y1 * scale);
    ctx1.beginPath();
    ctx1.arc(canvas1.width / 2 + 2, canvasY1 + 2, ballRadius, 0, Math.PI * 2);
    ctx1.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Shadow
    ctx1.fill();
    ctx1.beginPath();
    ctx1.arc(canvas1.width / 2, canvasY1, ballRadius, 0, Math.PI * 2);
    ctx1.fillStyle = 'blue';
    ctx1.fill();
    ctx1.closePath();

    // Draw ball 2 with shadow
    const canvasY2 = canvas2.height - ballRadius - (y2 * scale);
    ctx2.beginPath();
    ctx2.arc(canvas2.width / 2 + 2, canvasY2 + 2, ballRadius, 0, Math.PI * 2);
    ctx2.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Shadow
    ctx2.fill();
    ctx2.beginPath();
    ctx2.arc(canvas2.width / 2, canvasY2, ballRadius, 0, Math.PI * 2);
    ctx2.fillStyle = 'blue';
    ctx2.fill();
    ctx2.closePath();

    // Continue if either is running
    if (isRunning1 || isRunning2) {
        animationFrameId = requestAnimationFrame(animate);
    }
}