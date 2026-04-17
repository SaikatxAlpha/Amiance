import { useEffect } from "react";

const SEGMENTS = 22;

function TubeCursor() {
    useEffect(() => {
        document.body.style.cursor = "none";

        const style = document.createElement("style");
        style.textContent = `
            * { cursor: none !important; }
            .tube-seg {
                position: fixed;
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                will-change: transform, left, top, opacity;
                mix-blend-mode: screen;
                z-index: 999999;
            }
            .tube-head {
                position: fixed;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                background: #a7c957;
                box-shadow: 0 0 12px #a7c957, 0 0 24px rgba(167,201,87,0.6);
                z-index: 999999;
                will-change: left, top;
                transition: width 0.2s, height 0.2s;
            }
            .tube-ring {
                position: fixed;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                border: 1px solid rgba(167,201,87,0.4);
                z-index: 999998;
                will-change: left, top;
                transition: width 0.3s, height 0.3s, border-color 0.3s;
            }
            body:has(a:hover) .tube-head,
            body:has(button:hover) .tube-head { width: 14px; height: 14px; }
            body:has(a:hover) .tube-ring,
            body:has(button:hover) .tube-ring { width: 52px; height: 52px; border-color: rgba(167,201,87,0.7); }
        `;
        document.head.appendChild(style);

        const container = document.createElement("div");
        container.id = "__tube_cursor__";
        container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:999997;overflow:hidden;";
        document.body.appendChild(container);

        /* head dot */
        const head = document.createElement("div");
        head.className = "tube-head";
        document.body.appendChild(head);

        /* ring */
        const ring = document.createElement("div");
        ring.className = "tube-ring";
        document.body.appendChild(ring);

        /* tube segments */
        const segs = Array.from({ length: SEGMENTS }, (_, i) => {
            const progress = 1 - i / SEGMENTS;
            const size = Math.max(3, progress * 16);
            const el = document.createElement("div");
            el.className = "tube-seg";
            el.style.width = size + "px";
            el.style.height = size + "px";
            container.appendChild(el);
            return { el, x: -200, y: -200, size };
        });

        const mouse = { x: -200, y: -200 };
        const ringPos = { x: -200, y: -200 };

        const onMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            head.style.left = e.clientX + "px";
            head.style.top = e.clientY + "px";
        };
        document.addEventListener("mousemove", onMove);

        let raf;
        const animate = () => {
            /* ring lerp */
            ringPos.x += (mouse.x - ringPos.x) * 0.1;
            ringPos.y += (mouse.y - ringPos.y) * 0.1;
            ring.style.left = ringPos.x + "px";
            ring.style.top = ringPos.y + "px";

            /* tube segments */
            segs.forEach((seg, i) => {
                const target = i === 0 ? mouse : segs[i - 1];
                const ease = Math.max(0.07, 0.38 - i * 0.014);
                seg.x += (target.x - seg.x) * ease;
                seg.y += (target.y - seg.y) * ease;

                const progress = 1 - i / SEGMENTS;
                const alpha = 0.08 + progress * 0.75;
                /* hue shifts slightly: green → lime */
                const hue = 80 + progress * 30;
                const sat = 55 + progress * 20;
                const lit = 42 + progress * 18;

                const el = seg.el;
                el.style.left = seg.x + "px";
                el.style.top = seg.y + "px";
                el.style.background = `hsla(${hue},${sat}%,${lit}%,${alpha})`;
                el.style.boxShadow = `0 0 ${seg.size * 1.8}px hsla(${hue},${sat}%,${lit + 10}%,${alpha * 0.55})`;
            });

            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener("mousemove", onMove);
            document.body.style.cursor = "";
            style.remove();
            head.remove();
            ring.remove();
            container.remove();
        };
    }, []);

    return null;
}

export default TubeCursor;