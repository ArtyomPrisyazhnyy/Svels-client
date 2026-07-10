(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/features/floor-plan/components/path-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Утилиты геометрии для рендера decor/столов на Konva.
 */ __turbopack_context__.s([
    "buildRoundedPath",
    ()=>buildRoundedPath
]);
function toPoints(flat) {
    const pts = [];
    for(let i = 0; i < flat.length; i += 2)pts.push({
        x: flat[i],
        y: flat[i + 1]
    });
    return pts;
}
function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}
function buildRoundedPath(flatPoints, radius, closed) {
    const pts = toPoints(flatPoints);
    if (pts.length < 2) return '';
    const r = Math.max(0, radius);
    if (r === 0 || pts.length < 3) {
        const d = pts.map((p, i)=>"".concat(i === 0 ? 'M' : 'L', " ").concat(p.x, " ").concat(p.y)).join(' ');
        return closed ? "".concat(d, " Z") : d;
    }
    const n = pts.length;
    const segments = [];
    const segCount = closed ? n : n - 1;
    for(let i = 0; i < segCount; i++){
        const from = pts[i];
        const to = pts[(i + 1) % n];
        const len = dist(from, to) || 1e-6;
        segments.push({
            from,
            to,
            len,
            ux: (to.x - from.x) / len,
            uy: (to.y - from.y) / len
        });
    }
    // Для каждой вершины считаем допустимый радиус = min(r, len(prev)/2, len(next)/2).
    function cornerRadius(i) {
        const prev = segments[(i - 1 + segCount) % segCount];
        const next = segments[i % segCount];
        const isEndpoint = !closed && (i === 0 || i === n - 1);
        if (isEndpoint) return 0;
        return Math.min(r, prev.len / 2, next.len / 2);
    }
    // Точка начала дуги (отступ от вершины назад по предыдущему сегменту)
    // и конца дуги (отступ вперёд по следующему сегменту).
    function arcPoints(i) {
        const cr = cornerRadius(i);
        if (cr <= 0) return null;
        const prev = segments[(i - 1 + segCount) % segCount];
        const next = segments[i % segCount];
        const v = pts[i];
        // p1 = v - prevDir * cr  (вдоль предыдущего сегмента к вершине)
        const p1 = {
            x: v.x - prev.ux * cr,
            y: v.y - prev.uy * cr
        };
        // p2 = v + nextDir * cr
        const p2 = {
            x: v.x + next.ux * cr,
            y: v.y + next.uy * cr
        };
        return {
            p1,
            p2,
            cr
        };
    }
    const parts = [];
    // Старт — в начале первой дуги (или в первой вершине, если угла нет).
    const firstArc = arcPoints(0);
    if (firstArc) {
        parts.push("M ".concat(firstArc.p1.x, " ").concat(firstArc.p1.y));
    } else {
        parts.push("M ".concat(pts[0].x, " ").concat(pts[0].y));
    }
    for(let i = 0; i < n; i++){
        const cur = pts[i];
        const arc = arcPoints(i);
        if (arc) {
            // дуга из p1 в p2 с радиусом cr
            parts.push("A ".concat(arc.cr, " ").concat(arc.cr, " 0 0 1 ").concat(arc.p2.x, " ").concat(arc.p2.y));
            // далее линия до начала следующей дуги (или до следующей вершины)
            const nextIdx = (i + 1) % n;
            if (nextIdx !== 0 || closed) {
                const nextArc = arcPoints(nextIdx);
                const target = nextArc ? nextArc.p1 : pts[nextIdx];
                // не дублируем нулевую линию
                if (dist(arc.p2, target) > 1e-6) {
                    parts.push("L ".concat(target.x, " ").concat(target.y));
                }
            }
        } else {
            // без скругления — линия до следующей точки/дуги
            const nextIdx = (i + 1) % n;
            if (nextIdx !== 0 || closed) {
                const nextArc = arcPoints(nextIdx);
                const target = nextArc ? nextArc.p1 : pts[nextIdx];
                if (dist(cur, target) > 1e-6) {
                    parts.push("L ".concat(target.x, " ").concat(target.y));
                }
            }
        }
    }
    if (closed) parts.push('Z');
    return parts.join(' ');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/DecorNode.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DecorNode",
    ()=>DecorNode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonva$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-konva/es/ReactKonva.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-konva/es/ReactKonvaCore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$path$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/path-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
/** Внутренний рендер point-based decor (line/polyline/zone) с учётом spline и скругления. */ function renderPointBasedInner(decor) {
    var _decor_tension;
    const tension = (_decor_tension = decor.tension) !== null && _decor_tension !== void 0 ? _decor_tension : 0;
    var _decor_cornerRadius;
    const cornerRadius = (_decor_cornerRadius = decor.cornerRadius) !== null && _decor_cornerRadius !== void 0 ? _decor_cornerRadius : 0;
    const closed = decor.type === 'zone' ? true : decor.closed;
    const isZone = decor.type === 'zone';
    const hitProps = {
        hitStrokeWidth: isZone ? 0 : Math.max(12, decor.strokeWidth * 2),
        perfectDrawEnabled: false
    };
    if (tension > 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
            ...hitProps,
            points: decor.points,
            closed: closed,
            tension: tension,
            lineCap: "round",
            lineJoin: "round",
            stroke: isZone ? decor.stroke : decor.color,
            strokeWidth: decor.strokeWidth,
            fill: isZone ? decor.fill : undefined
        }, void 0, false, {
            fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this);
    }
    if (cornerRadius > 0 && decor.points.length >= 6) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Path"], {
            ...hitProps,
            data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$path$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildRoundedPath"])(decor.points, cornerRadius, closed),
            stroke: isZone ? decor.stroke : decor.color,
            strokeWidth: decor.strokeWidth,
            fill: isZone ? decor.fill : undefined,
            lineJoin: "round",
            lineCap: "round"
        }, void 0, false, {
            fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            isZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: decor.points,
                closed: true,
                fill: decor.fill,
                strokeWidth: 0,
                listening: true,
                perfectDrawEnabled: false
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                ...hitProps,
                points: decor.points,
                closed: closed,
                stroke: isZone ? decor.stroke : decor.color,
                strokeWidth: decor.strokeWidth,
                fill: isZone ? undefined : undefined,
                lineCap: "round",
                lineJoin: "round"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function decorIconLabel(icon) {
    const found = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DECOR_ICONS"].find((i)=>i.value === icon);
    var _found_emoji;
    return (_found_emoji = found === null || found === void 0 ? void 0 : found.emoji) !== null && _found_emoji !== void 0 ? _found_emoji : '✦';
}
const TRANSFORMER_ANCHORS = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'middle-left',
    'middle-right',
    'top-center',
    'bottom-center'
];
const DecorNode = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(function DecorNode(param, _ref) {
    let { decor, selected, editable, onSelect, onCommit } = param;
    _s();
    const groupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const transformerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // (Пере)привязываем Transformer к узлу при выборе и при любом изменении decor,
    // чтобы рамка следовала за новой геометрией после коммита drag/transform.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DecorNode.DecorNode.useEffect": ()=>{
            if (editable && selected && transformerRef.current && groupRef.current) {
                var _transformerRef_current_getLayer;
                transformerRef.current.nodes([
                    groupRef.current
                ]);
                (_transformerRef_current_getLayer = transformerRef.current.getLayer()) === null || _transformerRef_current_getLayer === void 0 ? void 0 : _transformerRef_current_getLayer.batchDraw();
            }
        }
    }["DecorNode.DecorNode.useEffect"], [
        editable,
        selected,
        decor
    ]);
    function handleClick(e) {
        if (!editable) return;
        e.cancelBubble = true;
        const additive = 'ctrlKey' in e.evt && (e.evt.ctrlKey || e.evt.metaKey);
        onSelect(decor.id, additive);
    }
    /**
   * Применить текущую матрицу трансформации узла к точкам line/polyline/zone
   * и закоммитить в store. После — сбросить узел к тождеству (точки теперь абсолютные).
   */ function commitPointBasedTransform(node) {
        const t = node.getTransform();
        const src = decor.points;
        const newPoints = new Array(src.length);
        for(let i = 0; i < src.length; i += 2){
            const p = t.point({
                x: src[i],
                y: src[i + 1]
            });
            newPoints[i] = Math.round(p.x);
            newPoints[i + 1] = Math.round(p.y);
        }
        onCommit(decor.id, {
            points: newPoints
        });
        node.x(0);
        node.y(0);
        node.scaleX(1);
        node.scaleY(1);
        node.rotation(0);
    }
    function handleDragEnd() {
        const node = groupRef.current;
        if (!node) return;
        if (decor.type === 'line' || decor.type === 'polyline' || decor.type === 'zone') {
            commitPointBasedTransform(node);
        } else {
            onCommit(decor.id, {
                x: Math.round(node.x()),
                y: Math.round(node.y())
            });
        }
    }
    function handleTransformEnd() {
        const node = groupRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const rotation = Math.round((node.rotation() % 360 + 360) % 360);
        if (decor.type === 'line' || decor.type === 'polyline' || decor.type === 'zone') {
            commitPointBasedTransform(node);
            return;
        }
        if (decor.type === 'shape' || decor.type === 'decor-icon') {
            onCommit(decor.id, {
                x: Math.round(node.x()),
                y: Math.round(node.y()),
                width: Math.max(10, Math.round(decor.width * scaleX)),
                height: Math.max(10, Math.round(decor.height * scaleY)),
                rotation
            });
        } else if (decor.type === 'text') {
            onCommit(decor.id, {
                x: Math.round(node.x()),
                y: Math.round(node.y()),
                rotation,
                fontSize: Math.max(8, Math.round(decor.fontSize * Math.max(scaleX, scaleY)))
            });
        }
        node.scaleX(1);
        node.scaleY(1);
    }
    const isPointBased = decor.type === 'line' || decor.type === 'polyline' || decor.type === 'zone';
    const isBoxBased = decor.type === 'shape' || decor.type === 'text' || decor.type === 'decor-icon';
    const transformerProps = {
        rotateEnabled: true,
        rotationSnaps: [
            0,
            90,
            180,
            270
        ],
        rotationSnapTolerance: 5,
        enabledAnchors: isPointBased ? [] : [
            ...TRANSFORMER_ANCHORS
        ],
        anchorSize: 8,
        borderStroke: '#2563eb',
        borderDash: isPointBased ? [
            4,
            4
        ] : undefined,
        rotateAnchorOffset: 24
    };
    var _decor_color;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            decor.type === 'line' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                ref: groupRef,
                name: decor.id,
                draggable: editable,
                onClick: handleClick,
                onTap: handleClick,
                onDragend: handleDragEnd,
                onTransformend: handleTransformEnd,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                    points: decor.points,
                    stroke: decor.color,
                    strokeWidth: decor.strokeWidth,
                    lineCap: "round",
                    hitStrokeWidth: Math.max(12, decor.strokeWidth * 2)
                }, void 0, false, {
                    fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                    lineNumber: 210,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                lineNumber: 201,
                columnNumber: 9
            }, this),
            decor.type === 'polyline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                ref: groupRef,
                name: decor.id,
                draggable: editable,
                onClick: handleClick,
                onTap: handleClick,
                onDragend: handleDragEnd,
                onTransformend: handleTransformEnd,
                children: renderPointBasedInner(decor)
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                lineNumber: 220,
                columnNumber: 9
            }, this),
            decor.type === 'zone' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                ref: groupRef,
                name: decor.id,
                draggable: editable,
                onClick: handleClick,
                onTap: handleClick,
                onDragend: handleDragEnd,
                onTransformend: handleTransformEnd,
                children: renderPointBasedInner(decor)
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                lineNumber: 233,
                columnNumber: 9
            }, this),
            decor.type === 'shape' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                ref: groupRef,
                name: decor.id,
                x: decor.x,
                y: decor.y,
                rotation: decor.rotation,
                draggable: editable,
                onClick: handleClick,
                onTap: handleClick,
                onDragend: handleDragEnd,
                onTransformend: handleTransformEnd,
                children: [
                    decor.shape === 'rect' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                        width: decor.width,
                        height: decor.height,
                        fill: decor.fill,
                        stroke: decor.stroke,
                        strokeWidth: decor.strokeWidth
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                        lineNumber: 259,
                        columnNumber: 13
                    }, this),
                    decor.shape === 'circle' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Circle"], {
                        x: decor.width / 2,
                        y: decor.height / 2,
                        radius: Math.min(decor.width, decor.height) / 2,
                        fill: decor.fill,
                        stroke: decor.stroke,
                        strokeWidth: decor.strokeWidth
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                        lineNumber: 268,
                        columnNumber: 13
                    }, this),
                    decor.shape === 'oval' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Ellipse"], {
                        x: decor.width / 2,
                        y: decor.height / 2,
                        radiusX: decor.width / 2,
                        radiusY: decor.height / 2,
                        fill: decor.fill,
                        stroke: decor.stroke,
                        strokeWidth: decor.strokeWidth
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                        lineNumber: 278,
                        columnNumber: 13
                    }, this),
                    decor.shape === 'triangle' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Path"], {
                        data: "M ".concat(decor.width / 2, " 0 L ").concat(decor.width, " ").concat(decor.height, " L 0 ").concat(decor.height, " Z"),
                        fill: decor.fill,
                        stroke: decor.stroke,
                        strokeWidth: decor.strokeWidth
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                        lineNumber: 289,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                lineNumber: 246,
                columnNumber: 9
            }, this),
            decor.type === 'text' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                ref: groupRef,
                name: decor.id,
                x: decor.x,
                y: decor.y,
                rotation: decor.rotation,
                draggable: editable,
                onClick: handleClick,
                onTap: handleClick,
                onDragend: handleDragEnd,
                onTransformend: handleTransformEnd,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                    text: decor.text,
                    fontSize: decor.fontSize,
                    fill: decor.color
                }, void 0, false, {
                    fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                    lineNumber: 311,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                lineNumber: 299,
                columnNumber: 9
            }, this),
            decor.type === 'decor-icon' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                ref: groupRef,
                name: decor.id,
                x: decor.x,
                y: decor.y,
                rotation: decor.rotation,
                draggable: editable,
                onClick: handleClick,
                onTap: handleClick,
                onDragend: handleDragEnd,
                onTransformend: handleTransformEnd,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                        width: decor.width,
                        height: decor.height,
                        fill: (_decor_color = decor.color) !== null && _decor_color !== void 0 ? _decor_color : '#f3f4f6',
                        cornerRadius: 6,
                        opacity: 0.85
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                        lineNumber: 331,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                        text: decorIconLabel(decor.icon),
                        fontSize: decor.width * 0.6,
                        width: decor.width,
                        height: decor.height,
                        align: "center",
                        verticalAlign: "middle",
                        listening: false
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                        lineNumber: 338,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                lineNumber: 319,
                columnNumber: 9
            }, this),
            editable && selected && isBoxBased && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transformer"], {
                ref: transformerRef,
                ...transformerProps
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                lineNumber: 349,
                columnNumber: 46
            }, this),
            editable && selected && isPointBased && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transformer"], {
                ref: transformerRef,
                ...transformerProps
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorNode.tsx",
                lineNumber: 350,
                columnNumber: 48
            }, this)
        ]
    }, void 0, true);
}, "nLs8uEO8H0IwAFrqY2dVg+tAYdk=")), "nLs8uEO8H0IwAFrqY2dVg+tAYdk=");
_c1 = DecorNode;
var _c, _c1;
__turbopack_context__.k.register(_c, "DecorNode$forwardRef");
__turbopack_context__.k.register(_c1, "DecorNode");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/TableNode.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TableNode",
    ()=>TableNode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonva$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-konva/es/ReactKonva.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-konva/es/ReactKonvaCore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function shapeProps(shape, width, height) {
    if (shape === 'round') {
        const r = Math.min(width, height) / 2;
        return {
            kind: 'circle',
            w: width,
            h: height,
            radiusX: r,
            radiusY: r
        };
    }
    if (shape === 'oval') {
        return {
            kind: 'ellipse',
            w: width,
            h: height,
            radiusX: width / 2,
            radiusY: height / 2
        };
    }
    if (shape === 'square') {
        const side = Math.min(width, height);
        return {
            kind: 'rect',
            w: side,
            h: side,
            radiusX: 0,
            radiusY: 0
        };
    }
    return {
        kind: 'rect',
        w: width,
        h: height,
        radiusX: 0,
        radiusY: 0
    };
}
function tableFillColor(table, selected, busyUntil) {
    if (busyUntil) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].busy;
    if (selected) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].selected;
    if (!table.isActive) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].inactive;
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].fill;
}
function polygonBbox(points) {
    if (!points || points.length < 4) return {
        w: 0,
        h: 0
    };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for(let i = 0; i < points.length; i += 2){
        minX = Math.min(minX, points[i]);
        maxX = Math.max(maxX, points[i]);
        minY = Math.min(minY, points[i + 1]);
        maxY = Math.max(maxY, points[i + 1]);
    }
    return {
        w: Math.max(1, maxX - minX),
        h: Math.max(1, maxY - minY)
    };
}
/** Ширина посадочного места с учётом slots/width. */ function seatWidth(seat) {
    if (seat.width != null && seat.width > 0) return seat.width;
    var _seat_slots;
    const slots = (_seat_slots = seat.slots) !== null && _seat_slots !== void 0 ? _seat_slots : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_DEFAULT_SLOTS"][seat.kind];
    if (seat.kind === 'couch' || seat.kind === 'bench') return slots * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_SLOT_WIDTH"];
    return 22;
}
function seatSlots(seat) {
    if (seat.slots != null && seat.slots > 0) return seat.slots;
    if (seat.width != null && seat.width > 0 && (seat.kind === 'couch' || seat.kind === 'bench')) {
        return Math.max(1, Math.round(seat.width / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_SLOT_WIDTH"]));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_DEFAULT_SLOTS"][seat.kind];
}
/** Внутренние фигуры посадочного места в локальных координатах (центр = 0,0). */ function renderSeatInner(seat) {
    const { kind } = seat;
    const w = seatWidth(seat);
    const slots = seatSlots(seat);
    const fill = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_COLORS"].fill;
    const stroke = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_COLORS"].stroke;
    const back = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_COLORS"].back;
    const half = w / 2;
    if (kind === 'stool') {
        const r = Math.max(8, w / 2);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Circle"], {
            radius: r,
            fill: fill,
            stroke: stroke,
            strokeWidth: 1.5
        }, void 0, false, {
            fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
            lineNumber: 91,
            columnNumber: 12
        }, this);
    }
    if (kind === 'couch') {
        const dividers = Array.from({
            length: Math.max(0, slots - 1)
        }).map((_, i)=>{
            const t = (i + 1) / slots;
            const x = -half + t * w;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    x,
                    -11,
                    x,
                    11
                ],
                stroke: stroke,
                strokeWidth: 1
            }, "d".concat(i), false, {
                fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                lineNumber: 97,
                columnNumber: 14
            }, this);
        });
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                    x: -half,
                    y: -11,
                    width: w,
                    height: 22,
                    rx: 6,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: 1.5
                }, void 0, false, {
                    fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                    x: -half,
                    y: -17,
                    width: w,
                    height: 7,
                    rx: 3,
                    fill: back,
                    stroke: stroke,
                    strokeWidth: 1.5
                }, void 0, false, {
                    fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this),
                dividers
            ]
        }, void 0, true);
    }
    if (kind === 'bench') {
        const dividers = Array.from({
            length: Math.max(0, slots - 1)
        }).map((_, i)=>{
            const t = (i + 1) / slots;
            const x = -half + t * w;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    x,
                    -8,
                    x,
                    8
                ],
                stroke: stroke,
                strokeWidth: 1
            }, "d".concat(i), false, {
                fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                lineNumber: 111,
                columnNumber: 14
            }, this);
        });
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                    x: -half,
                    y: -8,
                    width: w,
                    height: 16,
                    rx: 3,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: 1.5
                }, void 0, false, {
                    fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                    lineNumber: 115,
                    columnNumber: 9
                }, this),
                dividers
            ]
        }, void 0, true);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                x: -half,
                y: -9,
                width: w,
                height: 18,
                rx: 4,
                fill: fill,
                stroke: stroke,
                strokeWidth: 1.5
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                x: -half,
                y: -15,
                width: w,
                height: 6,
                rx: 2,
                fill: back,
                stroke: stroke,
                strokeWidth: 1.5
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
const TableNode = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(function TableNode(param, _ref) {
    let { table, selected, busyUntil, editable, onSelect, onCommit, onBookingSelect } = param;
    var _table_points, _table_seats, _table_seats1;
    _s();
    var _table_points_length;
    const isPolygon = table.shape === 'polygon' && Array.isArray(table.points) && ((_table_points_length = (_table_points = table.points) === null || _table_points === void 0 ? void 0 : _table_points.length) !== null && _table_points_length !== void 0 ? _table_points_length : 0) >= 6;
    const shape = shapeProps(table.shape, table.width, table.height);
    const polyBbox = isPolygon ? polygonBbox(table.points) : {
        w: shape.w,
        h: shape.h
    };
    const shapeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const transformerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const seatNodeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const seatTransformerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const selectedSeatId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "TableNode.TableNode.useLayoutStore[selectedSeatId]": (s)=>s.selectedSeatId
    }["TableNode.TableNode.useLayoutStore[selectedSeatId]"]);
    const setSelectedSeatId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "TableNode.TableNode.useLayoutStore[setSelectedSeatId]": (s)=>s.setSelectedSeatId
    }["TableNode.TableNode.useLayoutStore[setSelectedSeatId]"]);
    const isSelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "TableNode.TableNode.useLayoutStore[isSelected]": (s)=>s.selectedTableIdForBooking === table.id
    }["TableNode.TableNode.useLayoutStore[isSelected]"]);
    var _table_seats_find;
    const selectedSeat = selected ? (_table_seats_find = (_table_seats = table.seats) === null || _table_seats === void 0 ? void 0 : _table_seats.find((s)=>s.id === selectedSeatId)) !== null && _table_seats_find !== void 0 ? _table_seats_find : null : null;
    const seatResizable = (selectedSeat === null || selectedSeat === void 0 ? void 0 : selectedSeat.kind) === 'couch' || (selectedSeat === null || selectedSeat === void 0 ? void 0 : selectedSeat.kind) === 'bench';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableNode.TableNode.useEffect": ()=>{
            if (editable && selected && transformerRef.current && shapeRef.current) {
                var _transformerRef_current_getLayer;
                transformerRef.current.nodes([
                    shapeRef.current
                ]);
                (_transformerRef_current_getLayer = transformerRef.current.getLayer()) === null || _transformerRef_current_getLayer === void 0 ? void 0 : _transformerRef_current_getLayer.batchDraw();
            }
        }
    }["TableNode.TableNode.useEffect"], [
        editable,
        selected,
        table
    ]);
    // Под-выделение места: прикрепляем Transformer к выбранному месту для вращения/размера.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableNode.TableNode.useEffect": ()=>{
            if (editable && selected && selectedSeat && seatTransformerRef.current && seatNodeRef.current) {
                var _seatTransformerRef_current_getLayer;
                seatTransformerRef.current.nodes([
                    seatNodeRef.current
                ]);
                (_seatTransformerRef_current_getLayer = seatTransformerRef.current.getLayer()) === null || _seatTransformerRef_current_getLayer === void 0 ? void 0 : _seatTransformerRef_current_getLayer.batchDraw();
            } else if (seatTransformerRef.current) {
                seatTransformerRef.current.nodes([]);
            }
        }
    }["TableNode.TableNode.useEffect"], [
        editable,
        selected,
        selectedSeatId,
        table,
        selectedSeat
    ]);
    var _table_positionX;
    const x = (_table_positionX = table.positionX) !== null && _table_positionX !== void 0 ? _table_positionX : 0;
    var _table_positionY;
    const y = (_table_positionY = table.positionY) !== null && _table_positionY !== void 0 ? _table_positionY : 0;
    const fill = tableFillColor(table, selected, busyUntil);
    const stroke = selected ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].selected : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].active;
    const labelColor = selected ? '#ffffff' : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].label;
    const capacityColor = selected ? '#e5e7eb' : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].capacity;
    function handleClick(e) {
        if (!editable) {
            if (!busyUntil && onBookingSelect) {
                onBookingSelect(table.id);
            }
            return;
        }
        setSelectedSeatId(null);
        const additive = 'ctrlKey' in e.evt && (e.evt.ctrlKey || e.evt.metaKey);
        onSelect(table.id, additive);
    }
    function handleDragEnd() {
        const node = shapeRef.current;
        if (!node) return;
        onCommit(table.id, {
            positionX: Math.round(node.x()),
            positionY: Math.round(node.y())
        });
    }
    function handleTransformEnd() {
        const node = shapeRef.current;
        if (!node) return;
        if (isPolygon) {
            // Для полигона Transformer не используется (только бордюр); на всякий случай сброс.
            node.scaleX(1);
            node.scaleY(1);
            return;
        }
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const newWidth = Math.max(20, Math.round(table.width * scaleX));
        const newHeight = Math.max(20, Math.round(table.height * scaleY));
        const rotation = Math.round((node.rotation() % 360 + 360) % 360);
        node.scaleX(1);
        node.scaleY(1);
        onCommit(table.id, {
            positionX: Math.round(node.x()),
            positionY: Math.round(node.y()),
            width: newWidth,
            height: newHeight,
            rotation
        });
    }
    function handleVertexDragEnd(index, node) {
        if (!table.points) return;
        const points = [
            ...table.points
        ];
        points[index] = Math.round(node.x());
        points[index + 1] = Math.round(node.y());
        onCommit(table.id, {
            points
        });
    }
    function handleSeatDragEnd(seatId, node) {
        var _table_seats;
        const seats = ((_table_seats = table.seats) !== null && _table_seats !== void 0 ? _table_seats : []).map((s)=>s.id === seatId ? {
                ...s,
                x: Math.round(node.x()),
                y: Math.round(node.y())
            } : s);
        onCommit(table.id, {
            seats
        });
    }
    function handleSeatTransformEnd(seatId, node) {
        var _table_seats;
        const seat = (_table_seats = table.seats) === null || _table_seats === void 0 ? void 0 : _table_seats.find((s)=>s.id === seatId);
        if (!seat) return;
        const rotation = Math.round((node.rotation() % 360 + 360) % 360);
        const scaleX = node.scaleX();
        let width = seatWidth(seat);
        let slots = seatSlots(seat);
        if (seat.kind === 'couch' || seat.kind === 'bench') {
            width = Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_SLOT_WIDTH"], Math.round(width * scaleX));
            slots = Math.max(1, Math.min(8, Math.round(width / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_SLOT_WIDTH"])));
            width = slots * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_SLOT_WIDTH"];
        }
        node.scaleX(1);
        node.scaleY(1);
        node.rotation(rotation);
        var _table_seats1;
        const seats = ((_table_seats1 = table.seats) !== null && _table_seats1 !== void 0 ? _table_seats1 : []).map((s)=>s.id === seatId ? {
                ...s,
                x: Math.round(node.x()),
                y: Math.round(node.y()),
                rotation,
                width,
                slots
            } : s);
        onCommit(table.id, {
            seats
        });
    }
    function handleSeatClick(e, seatId) {
        if (!editable) return;
        e.cancelBubble = true;
        if (!selected) {
            onSelect(table.id, false);
        }
        setSelectedSeatId(seatId);
    }
    var _table_cornerRadius;
    const commonShapeProps = {
        width: shape.w,
        height: shape.h,
        fill,
        stroke,
        strokeWidth: selected ? 3 : 2,
        cornerRadius: (_table_cornerRadius = table.cornerRadius) !== null && _table_cornerRadius !== void 0 ? _table_cornerRadius : 6,
        shadowColor: 'rgba(0,0,0,0.15)',
        shadowBlur: 6,
        shadowOffset: {
            x: 0,
            y: 2
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                ref: shapeRef,
                name: table.id,
                x: x,
                y: y,
                rotation: table.rotation,
                draggable: editable,
                onClick: handleClick,
                onTap: handleClick,
                onDragend: handleDragEnd,
                onTransformend: handleTransformEnd,
                opacity: busyUntil ? 0.55 : 1,
                style: {
                    cursor: busyUntil ? 'not-allowed' : 'pointer'
                },
                children: [
                    isPolygon && table.points && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                        points: table.points,
                        closed: true,
                        fill: fill,
                        stroke: stroke,
                        strokeWidth: selected ? 3 : 2,
                        lineJoin: "round",
                        shadowColor: "rgba(0,0,0,0.15)",
                        shadowBlur: 6,
                        shadowOffset: {
                            x: 0,
                            y: 2
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                        lineNumber: 301,
                        columnNumber: 11
                    }, this),
                    !isPolygon && shape.kind === 'rect' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                        ...commonShapeProps,
                        width: shape.w,
                        height: shape.h
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                        lineNumber: 314,
                        columnNumber: 11
                    }, this),
                    !isPolygon && shape.kind === 'circle' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Circle"], {
                        x: shape.w / 2,
                        y: shape.h / 2,
                        radius: shape.radiusX,
                        fill: fill,
                        stroke: stroke,
                        strokeWidth: selected ? 3 : 2,
                        shadowColor: "rgba(0,0,0,0.15)",
                        shadowBlur: 6,
                        shadowOffset: {
                            x: 0,
                            y: 2
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                        lineNumber: 317,
                        columnNumber: 11
                    }, this),
                    !isPolygon && shape.kind === 'ellipse' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Ellipse"], {
                        x: shape.w / 2,
                        y: shape.h / 2,
                        radiusX: shape.radiusX,
                        radiusY: shape.radiusY,
                        fill: fill,
                        stroke: stroke,
                        strokeWidth: selected ? 3 : 2,
                        shadowColor: "rgba(0,0,0,0.15)",
                        shadowBlur: 6,
                        shadowOffset: {
                            x: 0,
                            y: 2
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                        lineNumber: 330,
                        columnNumber: 11
                    }, this),
                    (_table_seats1 = table.seats) === null || _table_seats1 === void 0 ? void 0 : _table_seats1.map((seat)=>{
                        const isSeatSelected = (selectedSeat === null || selectedSeat === void 0 ? void 0 : selectedSeat.id) === seat.id;
                        var _seat_rotation;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                            ref: isSeatSelected ? (node)=>{
                                seatNodeRef.current = node;
                            } : undefined,
                            x: seat.x,
                            y: seat.y,
                            rotation: (_seat_rotation = seat.rotation) !== null && _seat_rotation !== void 0 ? _seat_rotation : 0,
                            draggable: editable && selected,
                            onClick: (e)=>handleSeatClick(e, seat.id),
                            onTap: (e)=>handleSeatClick(e, seat.id),
                            onDragend: (e)=>handleSeatDragEnd(seat.id, e.target),
                            onTransformend: (e)=>handleSeatTransformEnd(seat.id, e.target),
                            children: renderSeatInner(seat)
                        }, seat.id, false, {
                            fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                            lineNumber: 346,
                            columnNumber: 13
                        }, this);
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                        text: table.label,
                        fontSize: 14,
                        fontStyle: "bold",
                        fill: labelColor,
                        width: polyBbox.w,
                        height: polyBbox.h - 18,
                        align: "center",
                        verticalAlign: "middle",
                        listening: false
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                        lineNumber: 366,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                        text: busyUntil ? "до ".concat(busyUntil.slice(11, 16)) : "".concat(table.capacity, " мест"),
                        fontSize: 11,
                        fill: capacityColor,
                        width: polyBbox.w,
                        y: polyBbox.h - 16,
                        align: "center",
                        listening: false
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                        lineNumber: 377,
                        columnNumber: 9
                    }, this),
                    isPolygon && table.points && editable && selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: Array.from({
                            length: table.points.length / 2
                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Circle"], {
                                x: table.points[i * 2],
                                y: table.points[i * 2 + 1],
                                radius: 6,
                                fill: "#ffffff",
                                stroke: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].selected,
                                strokeWidth: 2,
                                draggable: true,
                                onDragend: (e)=>handleVertexDragEnd(i * 2, e.target)
                            }, "v".concat(i), false, {
                                fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                                lineNumber: 389,
                                columnNumber: 15
                            }, this))
                    }, void 0, false),
                    !editable && isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                        width: polyBbox.w,
                        height: polyBbox.h,
                        stroke: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].booked,
                        strokeWidth: 3,
                        dash: [
                            6,
                            4
                        ],
                        listening: false
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                        lineNumber: 406,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                lineNumber: 286,
                columnNumber: 7
            }, this),
            editable && selected && !selectedSeat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transformer"], {
                ref: transformerRef,
                rotateEnabled: !isPolygon,
                rotationSnaps: [
                    0,
                    90,
                    180,
                    270
                ],
                rotationSnapTolerance: 5,
                enabledAnchors: isPolygon ? [] : [
                    'top-left',
                    'top-right',
                    'bottom-left',
                    'bottom-right',
                    'middle-left',
                    'middle-right',
                    'top-center',
                    'bottom-center'
                ],
                anchorSize: 8,
                borderStroke: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].selected,
                rotateAnchorOffset: 24
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                lineNumber: 417,
                columnNumber: 9
            }, this),
            editable && selected && selectedSeat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transformer"], {
                ref: seatTransformerRef,
                rotateEnabled: true,
                rotationSnaps: [
                    0,
                    90,
                    180,
                    270
                ],
                rotationSnapTolerance: 5,
                enabledAnchors: seatResizable ? [
                    'middle-left',
                    'middle-right'
                ] : [],
                anchorSize: 8,
                borderStroke: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_COLORS"].selected,
                borderDash: [
                    4,
                    4
                ],
                rotateAnchorOffset: 20
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/TableNode.tsx",
                lineNumber: 432,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}, "vt4VJOV/VpE6jzn4r6+EK27tf9k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"]
    ];
})), "vt4VJOV/VpE6jzn4r6+EK27tf9k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"]
    ];
});
_c1 = TableNode;
var _c, _c1;
__turbopack_context__.k.register(_c, "TableNode$forwardRef");
__turbopack_context__.k.register(_c1, "TableNode");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/KonvaStage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KonvaStage",
    ()=>KonvaStage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonva$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-konva/es/ReactKonva.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-konva/es/ReactKonvaCore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$DecorNode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/DecorNode.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$TableNode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/TableNode.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
/** Убрать подряд идущие дублирующиеся вершины из массива [x1,y1,x2,y2,...]. */ function dedupAdjacentPoints(points) {
    if (points.length < 4) return points;
    const result = [
        points[0],
        points[1]
    ];
    for(let i = 2; i < points.length; i += 2){
        const x = points[i];
        const y = points[i + 1];
        const lastX = result[result.length - 2];
        const lastY = result[result.length - 1];
        if (Math.hypot(x - lastX, y - lastY) > 1) {
            result.push(x, y);
        }
    }
    return result;
}
function KonvaStage(param) {
    let { width, height } = param;
    var _activeZone_decorData;
    _s();
    const stageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [lasso, setLasso] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [drawing, setDrawing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        type: null,
        points: []
    });
    const [livePoint, setLivePoint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const mode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[mode]": (s)=>s.mode
    }["KonvaStage.useLayoutStore[mode]"]);
    const tool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[tool]": (s)=>s.tool
    }["KonvaStage.useLayoutStore[tool]"]);
    const zoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[zoom]": (s)=>s.zoom
    }["KonvaStage.useLayoutStore[zoom]"]);
    const pan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[pan]": (s)=>s.pan
    }["KonvaStage.useLayoutStore[pan]"]);
    const gridVisible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[gridVisible]": (s)=>s.gridVisible && mode === 'edit'
    }["KonvaStage.useLayoutStore[gridVisible]"]);
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[selectedIds]": (s)=>s.selectedIds
    }["KonvaStage.useLayoutStore[selectedIds]"]);
    const availability = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[availability]": (s)=>s.availability
    }["KonvaStage.useLayoutStore[availability]"]);
    const activeZoneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[activeZoneId]": (s)=>s.activeZoneId
    }["KonvaStage.useLayoutStore[activeZoneId]"]);
    const activeZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[activeZone]": (s)=>{
            var _s_zones_find;
            return (_s_zones_find = s.zones.find({
                "KonvaStage.useLayoutStore[activeZone]": (z)=>z.id === s.activeZoneId
            }["KonvaStage.useLayoutStore[activeZone]"])) !== null && _s_zones_find !== void 0 ? _s_zones_find : null;
        }
    }["KonvaStage.useLayoutStore[activeZone]"]);
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActiveItems"])();
    const setZoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[setZoom]": (s)=>s.setZoom
    }["KonvaStage.useLayoutStore[setZoom]"]);
    const setPan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[setPan]": (s)=>s.setPan
    }["KonvaStage.useLayoutStore[setPan]"]);
    const setTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[setTool]": (s)=>s.setTool
    }["KonvaStage.useLayoutStore[setTool]"]);
    const select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[select]": (s)=>s.select
    }["KonvaStage.useLayoutStore[select]"]);
    const toggleSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[toggleSelection]": (s)=>s.toggleSelection
    }["KonvaStage.useLayoutStore[toggleSelection]"]);
    const clearSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[clearSelection]": (s)=>s.clearSelection
    }["KonvaStage.useLayoutStore[clearSelection]"]);
    const selectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[selectAll]": (s)=>s.selectAll
    }["KonvaStage.useLayoutStore[selectAll]"]);
    const addDecor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[addDecor]": (s)=>s.addDecor
    }["KonvaStage.useLayoutStore[addDecor]"]);
    const updateDecor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[updateDecor]": (s)=>s.updateDecor
    }["KonvaStage.useLayoutStore[updateDecor]"]);
    const updateTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[updateTable]": (s)=>s.updateTable
    }["KonvaStage.useLayoutStore[updateTable]"]);
    const selectTableForBooking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "KonvaStage.useLayoutStore[selectTableForBooking]": (s)=>s.selectTableForBooking
    }["KonvaStage.useLayoutStore[selectTableForBooking]"]);
    const editable = mode === 'edit';
    var _activeZone_decorData_grid_size;
    const gridSize = (_activeZone_decorData_grid_size = activeZone === null || activeZone === void 0 ? void 0 : (_activeZone_decorData = activeZone.decorData) === null || _activeZone_decorData === void 0 ? void 0 : _activeZone_decorData.grid.size) !== null && _activeZone_decorData_grid_size !== void 0 ? _activeZone_decorData_grid_size : 20;
    // Сброс незавершённого рисования при смене инструмента/зала/режима.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KonvaStage.useEffect": ()=>{
            resetDrawing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["KonvaStage.useEffect"], [
        tool,
        activeZoneId,
        mode
    ]);
    function pointerPosition() {
        const stage = stageRef.current;
        if (!stage) return null;
        const pos = stage.getPointerPosition();
        if (!pos) return null;
        return {
            x: (pos.x - pan.x) / zoom,
            y: (pos.y - pan.y) / zoom
        };
    }
    function handleWheel(e) {
        if (!editable && mode !== 'guest') return;
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;
        const oldZoom = zoom;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const newZoom = Math.max(0.2, Math.min(3, direction > 0 ? oldZoom * 1.1 : oldZoom / 1.1));
        const mousePointTo = {
            x: (pointer.x - pan.x) / oldZoom,
            y: (pointer.y - pan.y) / oldZoom
        };
        setZoom(newZoom);
        setPan({
            x: pointer.x - mousePointTo.x * newZoom,
            y: pointer.y - mousePointTo.y * newZoom
        });
    }
    function resolveItemIdFromTarget(target) {
        const stage = stageRef.current;
        let node = target;
        while(node && node !== stage){
            const itemName = node.name();
            if (itemName && items.some((i)=>i.data.id === itemName)) {
                return itemName;
            }
            node = node.parent;
        }
        return null;
    }
    function handleMouseDown(e) {
        const pos = pointerPosition();
        if (!pos) return;
        const clickedEmpty = e.target === e.target.getStage();
        const additive = e.evt.ctrlKey || e.evt.metaKey;
        // Режим рисования decor
        if (editable && (tool === 'line' || tool === 'polyline' || tool === 'zone')) {
            // Клик по существующему объекту — выделить и переключиться на «Выделить»
            const hitId = resolveItemIdFromTarget(e.target);
            if (hitId && drawing.type === null) {
                if (additive) toggleSelection(hitId);
                else select(hitId);
                setTool('select');
                return;
            }
            if (drawing.type === null) {
                // первый клик — ставим первую точку, за курсором будет «резиновая» линия
                setDrawing({
                    type: tool,
                    points: [
                        pos.x,
                        pos.y
                    ]
                });
                setLivePoint({
                    x: pos.x,
                    y: pos.y
                });
                return;
            }
            if (drawing.type === tool) {
                if (tool === 'line') {
                    // линия — два клика, завершаем на втором
                    finishLine([
                        drawing.points[0],
                        drawing.points[1],
                        pos.x,
                        pos.y
                    ]);
                    return;
                }
                // polyline/zone: клик близко к первой вершине — замкнуть и завершить
                const firstX = drawing.points[0];
                const firstY = drawing.points[1];
                const distToFirst = Math.hypot(pos.x - firstX, pos.y - firstY);
                if (drawing.points.length >= 4 && distToFirst < 10) {
                    finishDrawing();
                    return;
                }
                // иначе добавляем зафиксированную точку
                setDrawing((prev)=>prev.type === tool ? {
                        ...prev,
                        points: [
                            ...prev.points,
                            pos.x,
                            pos.y
                        ]
                    } : prev);
                setLivePoint({
                    x: pos.x,
                    y: pos.y
                });
            }
            return;
        }
        if (editable && tool !== 'select') {
            // Создание shape/text/decor-icon по клику
            const decorType = tool === 'rect' ? 'shape' : tool === 'circle' ? 'shape' : tool === 'text' ? 'text' : 'decor-icon';
            const obj = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDecorObject"])(decorType, pos.x, pos.y);
            if (decorType === 'shape') {
                if (tool === 'circle') obj.shape = 'circle';
            }
            if (activeZoneId) addDecor(activeZoneId, obj);
            select(obj.id);
            return;
        }
        // Pan по пустому месту в select-режиме
        if (clickedEmpty && !additive) {
            clearSelection();
        }
        // Lasso-выделение (Ctrl+drag по пустому)
        if (editable && clickedEmpty && additive) {
            setLasso({
                x1: pos.x,
                y1: pos.y,
                x2: pos.x,
                y2: pos.y
            });
        }
    }
    function handleMouseMove() {
        if (lasso) {
            const pos = pointerPosition();
            if (pos) setLasso((prev)=>prev ? {
                    ...prev,
                    x2: pos.x,
                    y2: pos.y
                } : prev);
        }
        if (drawing.type !== null) {
            const pos = pointerPosition();
            if (pos) setLivePoint({
                x: pos.x,
                y: pos.y
            });
        }
    }
    function handleMouseUp() {
        if (drawing.type === 'polyline' || drawing.type === 'zone') {
            // завершаем по двойному клику (handleDblClick); здесь ничего
            return;
        }
        if (lasso) {
            const { x1, y1, x2, y2 } = lasso;
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);
            if (Math.abs(maxX - minX) > 5 && Math.abs(maxY - minY) > 5) {
                const hitIds = items.filter((i)=>{
                    if (i.kind === 'table') {
                        const t = i.data;
                        var _t_positionX;
                        const cx = (_t_positionX = t.positionX) !== null && _t_positionX !== void 0 ? _t_positionX : 0;
                        var _t_positionY;
                        const cy = (_t_positionY = t.positionY) !== null && _t_positionY !== void 0 ? _t_positionY : 0;
                        return cx >= minX && cx <= maxX && cy >= minY && cy <= maxY;
                    }
                    const d = i.data;
                    if (d.type === 'line' || d.type === 'polyline' || d.type === 'zone') {
                        return d.points.some((p, idx)=>idx % 2 === 0 ? p >= minX && p <= maxX : p >= minY && p <= maxY);
                    }
                    return d.x >= minX && d.x <= maxX && d.y >= minY && d.y <= maxY;
                }).map((i)=>i.data.id);
                hitIds.forEach((id)=>toggleSelection(id));
            }
            setLasso(null);
        }
    }
    function handleDblClick() {
        finishDrawing();
    }
    /** Завершить линию (2 клика) с явно переданными точками. */ function finishLine(points) {
        if (!activeZoneId) {
            resetDrawing();
            return;
        }
        const obj = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDecorObject"])('line', 0, 0);
        obj.points = points;
        addDecor(activeZoneId, obj);
        select(obj.id);
        setTool('select');
        resetDrawing();
    }
    /** Завершить polyline/zone по двойному клику / Enter / клику на первую вершину. */ function finishDrawing() {
        if (!drawing.type || drawing.type === 'line' || drawing.points.length < 4) {
            resetDrawing();
            return;
        }
        if (!activeZoneId) {
            resetDrawing();
            return;
        }
        // Убираем подряд идущие дублирующиеся вершины (бывают от dblclick).
        const cleaned = dedupAdjacentPoints(drawing.points);
        if (cleaned.length < 4) {
            resetDrawing();
            return;
        }
        const obj = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDecorObject"])(drawing.type, 0, 0);
        let points = [
            ...cleaned
        ];
        if (drawing.type === 'zone') {
            // замкнуть контур автоматически
            points = [
                ...points,
                points[0],
                points[1]
            ];
        }
        obj.points = points;
        addDecor(activeZoneId, obj);
        select(obj.id);
        setTool('select');
        resetDrawing();
    }
    function resetDrawing() {
        setDrawing({
            type: null,
            points: []
        });
        setLivePoint(null);
    }
    // Клавиатура во время рисования: Enter — завершить, Escape — отменить.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KonvaStage.useEffect": ()=>{
            if (drawing.type === null) return;
            function onKey(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (drawing.type === 'line') {
                        if (livePoint) {
                            finishLine([
                                drawing.points[0],
                                drawing.points[1],
                                livePoint.x,
                                livePoint.y
                            ]);
                        } else {
                            resetDrawing();
                        }
                    } else {
                        finishDrawing();
                    }
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    resetDrawing();
                }
            }
            window.addEventListener('keydown', onKey);
            return ({
                "KonvaStage.useEffect": ()=>window.removeEventListener('keydown', onKey)
            })["KonvaStage.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["KonvaStage.useEffect"], [
        drawing,
        livePoint
    ]);
    function handleSelect(id, additive) {
        if (additive) {
            toggleSelection(id);
        } else {
            select(id);
        }
    }
    function handleCommit(id, patch) {
        const item = items.find((i)=>i.data.id === id);
        if (!item) return;
        if (item.kind === 'table') {
            updateTable(id, patch);
        } else if (activeZoneId) {
            updateDecor(activeZoneId, id, patch);
        }
    }
    function handleBookingSelect(tableId) {
        selectTableForBooking(tableId);
        select(tableId);
    }
    // Сетка
    const gridLines = [];
    if (gridVisible) {
        var _activeZone_decorData1;
        var _activeZone_decorData_grid_color;
        const gridColor = (_activeZone_decorData_grid_color = activeZone === null || activeZone === void 0 ? void 0 : (_activeZone_decorData1 = activeZone.decorData) === null || _activeZone_decorData1 === void 0 ? void 0 : _activeZone_decorData1.grid.color) !== null && _activeZone_decorData_grid_color !== void 0 ? _activeZone_decorData_grid_color : '#e5e7eb';
        for(let x = 0; x <= width / zoom; x += gridSize){
            gridLines.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    x,
                    0,
                    x,
                    height / zoom
                ],
                stroke: gridColor,
                strokeWidth: 0.5,
                listening: false
            }, "v".concat(x), false, {
                fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                lineNumber: 347,
                columnNumber: 9
            }, this));
        }
        for(let y = 0; y <= height / zoom; y += gridSize){
            gridLines.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: [
                    0,
                    y,
                    width / zoom,
                    y
                ],
                stroke: gridColor,
                strokeWidth: 0.5,
                listening: false
            }, "h".concat(y), false, {
                fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                lineNumber: 352,
                columnNumber: 9
            }, this));
        }
    }
    // Превью «резиновой» линии/ломаной/зоны: зафиксированные точки + текущая позиция курсора.
    const previewLine = drawing.type === 'line' && drawing.points.length >= 2 && livePoint ? [
        drawing.points[0],
        drawing.points[1],
        livePoint.x,
        livePoint.y
    ] : null;
    const previewPolyline = (drawing.type === 'polyline' || drawing.type === 'zone') && drawing.points.length >= 2 && livePoint ? [
        ...drawing.points,
        livePoint.x,
        livePoint.y
    ] : null;
    const previewZoneClosed = drawing.type === 'zone';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "fp-stage-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stage"], {
                ref: stageRef,
                width: width,
                height: height,
                scaleX: zoom,
                scaleY: zoom,
                x: pan.x,
                y: pan.y,
                draggable: editable && tool === 'select' && !lasso,
                onWheel: handleWheel,
                onMouseDown: handleMouseDown,
                onMouseMove: handleMouseMove,
                onMouseUp: handleMouseUp,
                onDblclick: handleDblClick,
                onClick: (e)=>{
                    // Ctrl+A обрабатывается в useHotkeys; здесь клик по пустому — снять выделение
                    if (e.target === e.target.getStage() && !(e.evt.ctrlKey || e.evt.metaKey)) {
                        clearSelection();
                    }
                    void selectAll;
                },
                onDragEnd: (e)=>{
                    if (e.target === e.target.getStage()) {
                        setPan({
                            x: e.target.x(),
                            y: e.target.y()
                        });
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Layer"], {
                    children: [
                        gridLines,
                        items.map((item)=>{
                            const isSelected = selectedIds.includes(item.data.id);
                            if (item.kind === 'table') {
                                const busyUntil = mode === 'guest' ? availability.get(item.data.id) : undefined;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$TableNode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableNode"], {
                                    table: item.data,
                                    selected: isSelected,
                                    busyUntil: busyUntil,
                                    editable: editable,
                                    onSelect: handleSelect,
                                    onCommit: handleCommit,
                                    onBookingSelect: mode === 'guest' ? handleBookingSelect : undefined
                                }, item.data.id, false, {
                                    fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                                    lineNumber: 404,
                                    columnNumber: 17
                                }, this);
                            }
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$DecorNode$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecorNode"], {
                                decor: item.data,
                                selected: isSelected,
                                editable: editable,
                                onSelect: handleSelect,
                                onCommit: handleCommit
                            }, item.data.id, false, {
                                fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                                lineNumber: 417,
                                columnNumber: 15
                            }, this);
                        }),
                        previewLine && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                            points: previewLine,
                            stroke: "#374151",
                            strokeWidth: 3,
                            dash: [
                                6,
                                4
                            ],
                            listening: false
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                            lineNumber: 430,
                            columnNumber: 13
                        }, this),
                        previewPolyline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                            points: previewPolyline,
                            stroke: previewZoneClosed ? '#3b82f6' : '#374151',
                            fill: previewZoneClosed ? '#dbeafe' : undefined,
                            strokeWidth: 2,
                            closed: previewZoneClosed,
                            dash: [
                                6,
                                4
                            ],
                            listening: false
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                            lineNumber: 433,
                            columnNumber: 13
                        }, this),
                        lasso && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                            x: Math.min(lasso.x1, lasso.x2),
                            y: Math.min(lasso.y1, lasso.y2),
                            width: Math.abs(lasso.x2 - lasso.x1),
                            height: Math.abs(lasso.y2 - lasso.y1),
                            stroke: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_COLORS"].selected,
                            strokeWidth: 1,
                            dash: [
                                4,
                                4
                            ],
                            fill: "rgba(37, 99, 235, 0.08)",
                            listening: false
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                            lineNumber: 446,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                    lineNumber: 397,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                lineNumber: 370,
                columnNumber: 7
            }, this),
            drawing.type !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-stage-hint",
                children: drawing.type === 'line' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        "Кликните вторую точку · ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            children: "Enter"
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                            lineNumber: 463,
                            columnNumber: 39
                        }, this),
                        " — завершить · ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            children: "Esc"
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                            lineNumber: 463,
                            columnNumber: 66
                        }, this),
                        " — отмена"
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        "Кликайте вершины · клик по первой вершине замкнёт · ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            children: "Enter"
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                            lineNumber: 465,
                            columnNumber: 67
                        }, this),
                        " — завершить · ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            children: "Esc"
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                            lineNumber: 465,
                            columnNumber: 94
                        }, this),
                        " — отмена"
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
                lineNumber: 461,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/floor-plan/components/KonvaStage.tsx",
        lineNumber: 369,
        columnNumber: 5
    }, this);
}
_s(KonvaStage, "FZuHuz77ussQCauUDKrII8el5U0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActiveItems"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"]
    ];
});
_c = KonvaStage;
var _c;
__turbopack_context__.k.register(_c, "KonvaStage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/KonvaStage.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/features/floor-plan/components/KonvaStage.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_features_floor-plan_components_ffbc91c4._.js.map