const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const particleCountSlider = document.getElementById('particleCount');
const speedSlider = document.getElementById('speed');
const particleCountValue = document.getElementById('particleCountValue');
const speedValue = document.getElementById('speedValue');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
class Particle {
    constructor(x, y, radius, speed, angle, delay) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.angle = angle;
        this.opacity = 1;
        this.delay = delay;
        this.time = 0;
        this.hue = Math.random() * 360;
    }
    update(particles) {
        if (this.time >= this.delay) {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.02;
            this.radius *= 0.98;
            for (let other of particles) {
                if (other !== this && this.time >=
                    this.delay && other.time >= other.delay) {
                        const dx = this.x - other.x;
                        const dy = this.y - other.y;
                        const distance = Math.hypot(dx, dy);
                        const minDistance = this.radius + other.radius;
                        if (distance < minDistance && distance > 0) {
                            const angleBetween = Math.atan2(dy, dx);
                            this.angle = 2 * angleBetween -
                            this.angle + Math.PI;
                            other.angle = 2 * angleBetween - other.angle;
                            this.speed *= 0.9;
                            other.speed *= 0.9;
                        }
                    }
            }
        }
        this.time++;
    }
    draw() {
        if (this.time < this.delay) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue + (this.time % 360)}, 70%, 50%)`;
        ctx.fill();
        ctx.closePath();
    }
}
const particles = [];
function createChainReaction(x, y) {
    const particleCount = parseInt(particleCountSlider.value);
    const baseSpeed = parseFloat(speedSlider.value);
    const angleStep = (Math.PI * 2) / particleCount;
    for (let i = 0; i < particleCount; i++) {
        const angle = i * angleStep;
        const speed = baseSpeed + Math.random() * 1.5;
        const radius = 5 + Math.random() * 5;
        const delay = i * 10;
        particles.push(new Particle(x, y, radius, speed, angle, delay));
    }
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
        particle.update(particles);
        particle.draw();
        if (particle.opacity <= 0 || particle.radius <= 0.1) {
            particles.splice(index, 1);
        }
    });
    requestAnimationFrame(animate);
}
canvas.addEventListener('click', (e) => {
    createChainReaction(e.clientX, e.clientY);
});
particleCountSlider.addEventListener('input', () => {
    particleCountValue.textContent = particleCountSlider.value;
});
speedSlider.addEventListener('input', () => {
    speedValue.textContent = speedSlider.value;
});
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
animate();