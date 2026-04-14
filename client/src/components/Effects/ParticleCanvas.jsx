import { useEffect, useRef } from "react";

const COLORS = ["#386641", "#6a994e", "#a7c957", "#dde5b6", "#bc4749"];

function ParticleCanvas({ style = {}, mini = false }) {
    const canvasRef = useRef(null);
    const stateRef = useRef({ particles: [], mouse: { x: -9999, y: -9999 }, animId: null });

    useEffect(() => {
        const cv = canvasRef.current;
        if (!cv) return;
        const ctx = cv.getContext("2d");
        const state = stateRef.current;

        class Particle {
            constructor(W, H, rand = true) {
                this.W = W; this.H = H;
                this.reset(rand);
            }
            reset(rand) {
                this.x = Math.random() * this.W;
                this.y = rand ? Math.random() * this.H : this.H + 10;
                this.size = Math.random() * (mini ? 3 : 3.5) + 0.8;
                this.baseX = this.x; this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = -(Math.random() * 0.3 + 0.08);
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.alpha = Math.random() * 0.5 + 0.15;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.pulsePhase = Math.random() * Math.PI * 2;
                this.time = 0;
            }
            update(mx, my) {
                this.time += this.pulseSpeed;
                const dx = this.x - mx, dy = this.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const force = mini ? 90 : 140;
                if (dist < force) {
                    const ang = Math.atan2(dy, dx);
                    const push = (force - dist) / force;
                    this.x += Math.cos(ang) * push * 6;
                    this.y += Math.sin(ang) * push * 6;
                } else {
                    this.x += (this.baseX - this.x) * 0.04 + this.vx;
                    this.y += (this.baseY - this.y) * 0.04 + this.vy;
                    this.baseX += this.vx * 0.4;
                    this.baseY += this.vy * 0.4;
                }
                if (this.baseY < -10) this.reset(false);
            }
            draw(ctx) {
                ctx.save();
                // gentle pulsing alpha
                const pulse = Math.sin(this.time + this.pulsePhase) * 0.15;
                ctx.globalAlpha = Math.max(0.05, this.alpha + pulse);
                
                // soft glow
                ctx.shadowColor = this.color;
                ctx.shadowBlur = mini ? 6 : 10;
                
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function resize() {
            cv.width = cv.offsetWidth;
            cv.height = cv.offsetHeight;
            initParticles();
        }

        function initParticles() {
            const W = cv.width, H = cv.height;
            const count = mini
                ? Math.min(100, Math.floor(W * H / 3500))
                : Math.min(250, Math.floor(W * H / 5000));
            state.particles = Array.from({ length: count }, () => new Particle(W, H, true));
        }

        function drawConnections() {
            const threshold = mini ? 65 : 100;
            ctx.save();
            for (let i = 0; i < state.particles.length; i++) {
                for (let j = i + 1; j < state.particles.length; j++) {
                    const dx = state.particles[i].x - state.particles[j].x;
                    const dy = state.particles[i].y - state.particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < threshold) {
                        const opacity = (1 - d / threshold) * (mini ? 0.18 : 0.1);
                        ctx.globalAlpha = opacity;
                        // gradient line between connected particles
                        const grad = ctx.createLinearGradient(
                            state.particles[i].x, state.particles[i].y,
                            state.particles[j].x, state.particles[j].y
                        );
                        grad.addColorStop(0, state.particles[i].color);
                        grad.addColorStop(1, state.particles[j].color);
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(state.particles[i].x, state.particles[i].y);
                        ctx.lineTo(state.particles[j].x, state.particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();
        }

        function loop() {
            ctx.clearRect(0, 0, cv.width, cv.height);
            if (mini) {
                ctx.save();
                // soft gradient bg for mini canvas
                const bg = ctx.createLinearGradient(0, 0, cv.width, cv.height);
                bg.addColorStop(0, "#f2e8cf");
                bg.addColorStop(0.5, "#eae0c2");
                bg.addColorStop(1, "#f2e8cf");
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, cv.width, cv.height);
                ctx.restore();
            }
            drawConnections();
            state.particles.forEach(p => {
                p.W = cv.width; p.H = cv.height;
                p.update(state.mouse.x, state.mouse.y);
                p.draw(ctx);
            });
            state.animId = requestAnimationFrame(loop);
        }

        function onMouseMove(e) {
            const r = cv.getBoundingClientRect();
            state.mouse.x = e.clientX - r.left;
            state.mouse.y = e.clientY - r.top;
        }
        function onMouseLeave() { state.mouse.x = -9999; state.mouse.y = -9999; }
        function onClick(e) {
            if (mini) return;
            const r = cv.getBoundingClientRect();
            const mx = e.clientX - r.left, my = e.clientY - r.top;
            // burst effect on click
            for (let i = 0; i < 24; i++) {
                const p = new Particle(cv.width, cv.height, true);
                p.x = p.baseX = mx; p.y = p.baseY = my;
                const angle = (Math.PI * 2 * i) / 24;
                const speed = Math.random() * 3 + 1.5;
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
                p.size = Math.random() * 3 + 1;
                p.alpha = 0.8;
                state.particles.push(p);
            }
        }

        cv.addEventListener("mousemove", onMouseMove);
        cv.addEventListener("mouseleave", onMouseLeave);
        cv.addEventListener("click", onClick);
        window.addEventListener("resize", resize);

        resize();
        loop();

        return () => {
            cancelAnimationFrame(state.animId);
            cv.removeEventListener("mousemove", onMouseMove);
            cv.removeEventListener("mouseleave", onMouseLeave);
            cv.removeEventListener("click", onClick);
            window.removeEventListener("resize", resize);
        };
    }, [mini]);

    return (
        <canvas
            ref={canvasRef}
            id={mini ? "mini-canvas" : "particle-canvas"}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                display: "block",
                cursor: mini ? "crosshair" : "none",
                zIndex: 0,
                ...style,
            }}
        />
    );
}

export default ParticleCanvas;