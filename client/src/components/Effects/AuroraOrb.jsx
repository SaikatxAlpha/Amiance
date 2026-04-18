import { useEffect, useRef } from "react";

const lerp = (a, b, t) => a + (b - a) * t;

export default function AuroraOrb() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let W, H, rafId, time = 0;
        const mouse = { x: 0, y: 0 };
        const sm = { x: 0, y: 0 };

        const resize = () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const onMove = (e) => {
            mouse.x = e.clientX / window.innerWidth - 0.5;
            mouse.y = e.clientY / window.innerHeight - 0.5;
        };
        window.addEventListener("mousemove", onMove);

        /* ── Rotation helpers ── */
        const rotX = (p, a) => ({
            x: p.x,
            y: p.y * Math.cos(a) - p.z * Math.sin(a),
            z: p.y * Math.sin(a) + p.z * Math.cos(a),
        });
        const rotY = (p, a) => ({
            x: p.x * Math.cos(a) + p.z * Math.sin(a),
            y: p.y,
            z: -p.x * Math.sin(a) + p.z * Math.cos(a),
        });

        /* ── Perspective projection ── */
        const project = (p, cx, cy, fov) => {
            const z = p.z + fov;
            const s = fov / z;
            return { x: cx + p.x * s, y: cy + p.y * s, s, z: p.z };
        };

        /* ── Generate sphere wireframe as edge pairs ── */
        const buildWireframe = (R, latDiv, lonDiv) => {
            const edges = [];
            // latitude circles
            for (let i = 1; i < latDiv; i++) {
                const phi = (i / latDiv) * Math.PI;
                for (let j = 0; j < lonDiv; j++) {
                    const t0 = (j / lonDiv) * Math.PI * 2;
                    const t1 = ((j + 1) / lonDiv) * Math.PI * 2;
                    edges.push([
                        { x: R * Math.sin(phi) * Math.cos(t0), y: R * Math.cos(phi), z: R * Math.sin(phi) * Math.sin(t0) },
                        { x: R * Math.sin(phi) * Math.cos(t1), y: R * Math.cos(phi), z: R * Math.sin(phi) * Math.sin(t1) },
                    ]);
                }
            }
            // longitude arcs
            for (let j = 0; j < lonDiv; j++) {
                const theta = (j / lonDiv) * Math.PI * 2;
                for (let i = 0; i < latDiv; i++) {
                    const p0 = (i / latDiv) * Math.PI;
                    const p1 = ((i + 1) / latDiv) * Math.PI;
                    edges.push([
                        { x: R * Math.sin(p0) * Math.cos(theta), y: R * Math.cos(p0), z: R * Math.sin(p0) * Math.sin(theta) },
                        { x: R * Math.sin(p1) * Math.cos(theta), y: R * Math.cos(p1), z: R * Math.sin(p1) * Math.sin(theta) },
                    ]);
                }
            }
            return edges;
        };

        /* ── Evenly distributed surface dots (Fibonacci sphere) ── */
        const buildDots = (R, n) =>
            Array.from({ length: n }, (_, i) => {
                const phi = Math.acos(1 - 2 * (i + 0.5) / n);
                const theta = Math.PI * (1 + Math.sqrt(5)) * i;
                return {
                    x: R * Math.sin(phi) * Math.cos(theta),
                    y: R * Math.cos(phi),
                    z: R * Math.sin(phi) * Math.sin(theta),
                    pulse: Math.random() * Math.PI * 2,
                    sz: 1.0 + Math.random() * 1.8,
                };
            });

        /* ── Floating orbit debris ── */
        const debris = Array.from({ length: 140 }, () => {
            const mul = 1.05 + Math.random() * 1.55;
            return {
                phi: Math.random() * Math.PI,
                theta: Math.random() * Math.PI * 2,
                r: mul,
                dphi: (Math.random() - 0.5) * 0.003,
                dtheta: (Math.random() - 0.5) * 0.005 + 0.002,
                sz: 0.5 + Math.random() * 1.8,
                alpha: 0.15 + Math.random() * 0.45,
                phase: Math.random() * Math.PI * 2,
                col: [
                    [167, 201, 87],
                    [221, 229, 182],
                    [106, 153, 78],
                    [200, 230, 110],
                ][Math.floor(Math.random() * 4)],
            };
        });

        /* ── Energy arc: a travelling spark along a geodesic ── */
        const makeArcPath = (R, steps = 50) => {
            const sPhi = Math.random() * Math.PI;
            const sTheta = Math.random() * Math.PI * 2;
            const dPhi = (Math.random() - 0.5) * Math.PI * 0.8;
            const dTheta = (Math.random() - 0.5) * Math.PI * 1.2;
            return Array.from({ length: steps }, (_, i) => {
                const t = i / (steps - 1);
                const phi = sPhi + dPhi * t;
                const theta = sTheta + dTheta * t;
                const bulge = 1 + Math.sin(t * Math.PI) * 0.08;
                return {
                    x: R * bulge * Math.sin(phi) * Math.cos(theta),
                    y: R * bulge * Math.cos(phi),
                    z: R * bulge * Math.sin(phi) * Math.sin(theta),
                };
            });
        };

        const NUM_ARCS = 7;
        const arcPaths = Array.from({ length: NUM_ARCS }, () => makeArcPath(1.0, 60));
        const arcState = Array.from({ length: NUM_ARCS }, (_, i) => ({
            speed: 0.28 + Math.random() * 0.35,
            offset: i / NUM_ARCS,
            tailLen: 12 + Math.floor(Math.random() * 10),
            col: Math.random() > 0.4 ? [167, 201, 87] : [221, 229, 182],
            width: 1.5 + Math.random() * 1.5,
        }));

        const render = () => {
            time += 0.011;
            sm.x = lerp(sm.x, mouse.x, 0.055);
            sm.y = lerp(sm.y, mouse.y, 0.055);

            ctx.clearRect(0, 0, W, H);

            const R = Math.min(W, H) * 0.29;
            const cx = W * 0.5 + sm.x * 35;
            const cy = H * 0.5 + sm.y * 22;
            const fov = R * 3.8;

            const ry = time * 0.16 + sm.x * 0.55;
            const rx = time * 0.065 + sm.y * 0.35;

            const xform = (p) => rotX(rotY(p, ry), rx);

            /* ── Subtle ambient depth glow ── */
            const ag = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.8);
            ag.addColorStop(0, 'rgba(90, 150, 40, 0.055)');
            ag.addColorStop(0.6, 'rgba(50, 100, 25, 0.02)');
            ag.addColorStop(1, 'transparent');
            ctx.fillStyle = ag;
            ctx.fillRect(0, 0, W, H);

            /* ── Debris (draw before sphere so it layers naturally) ── */
            debris.forEach(p => {
                p.phi += p.dphi;
                p.theta += p.dtheta;
                const r3 = R * p.r;
                const raw = {
                    x: r3 * Math.sin(p.phi) * Math.cos(p.theta),
                    y: r3 * Math.cos(p.phi),
                    z: r3 * Math.sin(p.phi) * Math.sin(p.theta),
                };
                const q = xform(raw);
                const pp = project(q, cx, cy, fov);
                const depth = Math.max(0, (q.z / r3 + 1) * 0.5);
                const pulse = Math.sin(time * 2.1 + p.phase) * 0.5 + 0.5;
                const a = p.alpha * depth * (0.35 + 0.65 * pulse);
                if (a < 0.01) return;
                const [r, g, b] = p.col;
                ctx.beginPath();
                ctx.arc(pp.x, pp.y, p.sz * pp.s * 1.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
                ctx.fill();
            });

            /* ── Wireframe ── */
            const edges = buildWireframe(R, 10, 14);
            edges.forEach(([a, b]) => {
                const qa = xform(a), qb = xform(b);
                const pa = project(qa, cx, cy, fov);
                const pb = project(qb, cx, cy, fov);
                const frontA = qa.z > 0, frontB = qb.z > 0;
                const isFront = frontA && frontB;
                const depthAvg = ((qa.z + qb.z) / 2 / R + 1) * 0.5;

                const alpha = isFront
                    ? 0.18 + depthAvg * 0.65
                    : 0.04 + depthAvg * 0.08;

                const r = isFront
                    ? Math.round(56 + depthAvg * 111)   // 56→167
                    : 56;
                const g = isFront
                    ? Math.round(80 + depthAvg * 121)   // 80→201 ish
                    : 90;
                const bv = isFront
                    ? Math.round(30 + depthAvg * 57)    // 30→87
                    : 40;

                ctx.beginPath();
                ctx.moveTo(pa.x, pa.y);
                ctx.lineTo(pb.x, pb.y);
                ctx.strokeStyle = `rgba(${r},${g},${bv},${alpha})`;
                ctx.lineWidth = isFront ? 0.85 : 0.35;
                ctx.stroke();
            });

            /* ── Surface glow nodes ── */
            const dots = buildDots(R, 90);
            dots.forEach(d => {
                const q = xform(d);
                if (q.z < -R * 0.15) return;
                const pp = project(q, cx, cy, fov);
                const depth = (q.z / R + 1) * 0.5;
                const pulse = Math.sin(time * 2.4 + d.pulse) * 0.5 + 0.5;
                const a = depth * (0.25 + 0.55 * pulse);
                if (a < 0.04) return;

                // core dot
                ctx.beginPath();
                ctx.arc(pp.x, pp.y, d.sz * depth, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(210, 240, 110, ${a})`;
                ctx.fill();

                // halo on bright ones
                if (pulse > 0.7 && depth > 0.55) {
                    ctx.beginPath();
                    ctx.arc(pp.x, pp.y, d.sz * depth * 3.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(167, 201, 87, ${a * 0.12})`;
                    ctx.fill();
                }
            });

            /* ── Energy arcs ── */
            arcs: for (let ai = 0; ai < NUM_ARCS; ai++) {
                const path = arcPaths[ai];
                const st = arcState[ai];
                const prog = ((time * st.speed + st.offset) % 1);
                const headIdx = Math.floor(prog * path.length);
                const [ar, ag2, ab] = st.col;

                for (let i = Math.max(0, headIdx - st.tailLen); i < headIdx - 1; i++) {
                    const p0 = path[i], p1 = path[i + 1];
                    const scale = R;
                    const q0 = xform({ x: p0.x * scale, y: p0.y * scale, z: p0.z * scale });
                    const q1 = xform({ x: p1.x * scale, y: p1.y * scale, z: p1.z * scale });

                    // skip backface
                    if (q0.z < -R * 0.3 && q1.z < -R * 0.3) continue;

                    const pp0 = project(q0, cx, cy, fov);
                    const pp1 = project(q1, cx, cy, fov);

                    const tFrac = (i - (headIdx - st.tailLen)) / st.tailLen;
                    ctx.beginPath();
                    ctx.moveTo(pp0.x, pp0.y);
                    ctx.lineTo(pp1.x, pp1.y);
                    ctx.strokeStyle = `rgba(${ar},${ag2},${ab},${tFrac * 0.85})`;
                    ctx.lineWidth = tFrac * st.width;
                    ctx.lineCap = 'round';
                    ctx.stroke();

                    // bright spark head
                    if (i === headIdx - 2) {
                        ctx.beginPath();
                        ctx.arc(pp1.x, pp1.y, 2.8, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${ar},${ag2},${ab},1)`;
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(pp1.x, pp1.y, 7, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${ar},${ag2},${ab},0.18)`;
                        ctx.fill();
                    }
                }
            }

            /* ── Equatorial pulse ring ── */
            const ringSegs = 72;
            for (let i = 0; i < ringSegs; i++) {
                const theta = (i / ringSegs) * Math.PI * 2;
                const p = { x: R * 1.04 * Math.cos(theta), y: 0, z: R * 1.04 * Math.sin(theta) };
                const q = xform(p);
                if (q.z < 0) continue;
                const pp = project(q, cx, cy, fov);
                const depth = (q.z / (R * 1.04) + 1) * 0.5;
                const pulse = Math.sin(time * 1.6 + theta * 4) * 0.5 + 0.5;
                const a = depth * 0.65 * pulse;
                if (a < 0.02) continue;
                ctx.beginPath();
                ctx.arc(pp.x, pp.y, 1.2 + pulse * 1.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(167,201,87,${a})`;
                ctx.fill();
            }

            /* ── Brand mark ── */
            const ba = 0.09 + Math.sin(time * 0.38) * 0.03;
            ctx.save();
            ctx.globalAlpha = ba;
            ctx.font = `700 ${R * 0.27}px 'Bebas Neue', sans-serif`;
            ctx.fillStyle = '#dde5b6';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('AMIANCE', cx, cy);
            ctx.restore();

            rafId = requestAnimationFrame(render);
        };

        rafId = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                display: "block",
                cursor: "none",
            }}
        />
    );
}