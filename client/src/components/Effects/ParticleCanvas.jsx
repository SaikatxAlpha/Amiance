import { useEffect, useRef } from "react";

const COLORS = ["#386641", "#6a994e", "#a7c957", "#dde5b6", "#f2e8cf", "#bc4749"];

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
                this.size = Math.random() * (mini ? 2 : 2.5) + 0.5;
                this.baseX = this.x; this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = -(Math.random() * 0.4 + 0.1);
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.alpha = Math.random() * 0.7 + 0.2;
            }
            update(mx, my) {
                const dx = this.x - mx, dy = this.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const force = mini ? 80 : 120;
                if (dist < force) {
                    const ang = Math.atan2(dy, dx);
                    const push = (force - dist) / force;
                    this.x += Math.cos(ang) * push * (mini ? 5 : 5);
                    this.y += Math.sin(ang) * push * (mini ? 5 : 5);
                } else {
                    this.x += (this.baseX - this.x) * 0.05 + this.vx;
                    this.y += (this.baseY - this.y) * 0.05 + this.vy;
                    this.baseX += this.vx * 0.5;
                    this.baseY += this.vy * 0.5;
                }
                if (this.baseY < -10) this.reset(false);
            }
            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.alpha;
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
                ? Math.min(120, Math.floor(W * H / 3000))
                : Math.min(300, Math.floor(W * H / 4000));
            state.particles = Array.from({ length: count }, () => new Particle(W, H, true));
        }

        function drawConnections() {
            const threshold = mini ? 55 : 90;
            ctx.save();
            for (let i = 0; i < state.particles.length; i++) {
                for (let j = i + 1; j < state.particles.length; j++) {
                    const dx = state.particles[i].x - state.particles[j].x;
                    const dy = state.particles[i].y - state.particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < threshold) {
                        ctx.globalAlpha = (1 - d / threshold) * (mini ? 0.2 : 0.12);
                        ctx.strokeStyle = "#6a994e";
                        ctx.lineWidth = 0.5;
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
                ctx.fillStyle = "#f2e8cf";
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
            for (let i = 0; i < 18; i++) {
                const p = new Particle(cv.width, cv.height, true);
                p.x = p.baseX = mx; p.y = p.baseY = my;
                p.vx = (Math.random() - 0.5) * 3;
                p.vy = (Math.random() - 0.5) * 3;
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
                position: mini ? "absolute" : "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                display: "block",
                cursor: mini ? "crosshair" : "none",
                zIndex: mini ? 0 : 0,
                ...style,
            }}
        />
    );
}

export default ParticleCanvas;