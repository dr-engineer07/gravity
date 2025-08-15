try {
    const canvas1 = document.getElementById('canvas1');
    const ctx1 = canvas1 ? canvas1.getContext('2d') : null;
    const canvas2 = document.getElementById('canvas2');
    const ctx2 = canvas2 ? canvas2.getContext('2d') : null;
    const heightInput = document.getElementById('height');
    const planet1Select = document.getElementById('planet1');
    const planet2Select = document.getElementById('planet2');
    const errorDiv = document.getElementById('error');
    const label1 = document.getElementById('label1');
    const label2 = document.getElementById('label2');

    if (!ctx1 || !ctx2) {
        alert('Error: Canvas context not supported. Ensure your browser supports HTML5 canvas.');
        throw new Error('Canvas context initialization failed');
    }

    console.log('Canvas contexts initialized successfully');

    let animationFrameId;
    let ball1, ball2;

    const planets = {
        sun: 274,
        mercury: 3.7,
        venus: 8.87,
        earth: 9.81,
        moon: 1.625,
        mars: 3.71,
        jupiter: 24.79,
        saturn: 10.44,
        uranus: 8.69,
        neptune: 11.15
    };

    class Ball {
        constructor(x, y, radius, dy, g, canvas) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.dy = dy;
            this.g = g;
            this.canvas = canvas;
            this.color = '#fff'; // White ball
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }

        update() {
            this.dy += this.g * 0.016; // Approximate frame time (60 FPS)
            this.y += this.dy;

            // Bounce off ground
            if (this.y + this.radius > this.canvas.height) {
                this.y = this.canvas.height - this.radius;
                this.dy = -this.dy * 0.8; // Simple damping
            }
        }
    }

    window.startSimulation = function () {
        try {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            const height = parseFloat(heightInput.value);
            if (isNaN(height) || height < 1) {
                errorDiv.style.display = 'block';
                return;
            }
            errorDiv.style.display = 'none';

            const planet1 = planet1Select.value;
            const planet2 = planet2Select.value;
            const g1 = planets[planet1];
            const g2 = planets[planet2];

            label1.textContent = planet1.charAt(0).toUpperCase() + planet1.slice(1);
            label2.textContent = planet2.charAt(0).toUpperCase() + planet2.slice(1);

            const scale = (canvas1.height - 40) / height; // 40 for 2 * radius
            const startY = canvas1.height - 20 - (height * scale);

            ball1 = new Ball(canvas1.width / 2, startY, 20, 0, g1, canvas1);
            ball2 = new Ball(canvas2.width / 2, startY, 20, 0, g2, canvas2);

            console.log('Starting animation with height:', height, 'Planets:', planet1, planet2);
            animate();
        } catch (error) {
            console.error('Error in startSimulation:', error);
            alert('Failed to start simulation: ' + error.message);
        }
    };

    function animate() {
        try {
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

            [ctx1, ctx2].forEach((ctx, index) => {
                ctx.beginPath();
                ctx.moveTo(0, ctx.canvas.height);
                ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
                ctx.strokeStyle = '#fff'; // White ground line for space theme
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            ball1.update();
            ball1.draw(ctx1);
            ball2.update();
            ball2.draw(ctx2);

            animationFrameId = requestAnimationFrame(animate);
        } catch (error) {
            console.error('Error in animation loop:', error);
            alert('Animation error: ' + error.message);
        }
    }
} catch (error) {
    console.error('Initialization error:', error);
    alert('Failed to initialize simulation: ' + error.message);
}
