module.exports = [
"[project]/src/store/layout-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDecorObject",
    ()=>createDecorObject,
    "createNewTable",
    ()=>createNewTable,
    "decorLayoutOf",
    ()=>decorLayoutOf,
    "resolveTableDeposit",
    ()=>resolveTableDeposit,
    "selectActiveItems",
    ()=>selectActiveItems,
    "selectActiveZone",
    ()=>selectActiveZone,
    "useActiveItems",
    ()=>useActiveItems,
    "useLayoutStore",
    ()=>useLayoutStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v7.js [app-ssr] (ecmascript) <export default as v7>");
;
;
;
const HISTORY_LIMIT = 50;
/**
 * Атомарно добавить снимок текущего состояния в history и очистить future.
 * Используется внутри мутаций в одном `set`-вызове, чтобы история и изменение
 * применялись вместе (без гонок между двумя раздельными set).
 */ function recordHistory(s) {
    const snapshot = {
        zones: cloneZones(s.zones),
        activeZoneId: s.activeZoneId
    };
    return {
        history: [
            ...s.history,
            snapshot
        ].slice(-HISTORY_LIMIT),
        future: []
    };
}
function itemBounds(item) {
    if (item.kind === 'table') {
        const t = item.data;
        return {
            x: t.positionX ?? 0,
            y: t.positionY ?? 0,
            width: t.width,
            height: t.height
        };
    }
    const d = item.data;
    if (d.type === 'line' || d.type === 'polyline' || d.type === 'zone') {
        const xs = d.points.filter((_, i)=>i % 2 === 0);
        const ys = d.points.filter((_, i)=>i % 2 === 1);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
    if (d.type === 'text') {
        const approxWidth = d.text.length * d.fontSize * 0.6;
        return {
            x: d.x,
            y: d.y,
            width: approxWidth,
            height: d.fontSize
        };
    }
    return {
        x: d.x,
        y: d.y,
        width: d.width,
        height: d.height
    };
}
function moveBounds(item, dx, dy) {
    if (item.kind === 'table') {
        const t = item.data;
        return {
            kind: 'table',
            data: {
                ...t,
                positionX: (t.positionX ?? 0) + dx,
                positionY: (t.positionY ?? 0) + dy
            }
        };
    }
    const d = item.data;
    if (d.type === 'line' || d.type === 'polyline' || d.type === 'zone') {
        const points = d.points.map((p, i)=>i % 2 === 0 ? p + dx : p + dy);
        return {
            kind: 'decor',
            data: {
                ...d,
                points
            }
        };
    }
    return {
        kind: 'decor',
        data: {
            ...d,
            x: d.x + dx,
            y: d.y + dy
        }
    };
}
function cloneZone(zone) {
    return {
        ...zone,
        decorData: zone.decorData ? {
            grid: {
                ...zone.decorData.grid
            },
            objects: zone.decorData.objects.map((o)=>({
                    ...o
                }))
        } : null,
        tables: zone.tables.map((t)=>({
                ...t
            }))
    };
}
function cloneZones(zones) {
    return zones.map(cloneZone);
}
const selectActiveZone = (s)=>s.zones.find((z)=>z.id === s.activeZoneId) ?? null;
const selectActiveItems = (s)=>{
    const zone = selectActiveZone(s);
    if (!zone) return [];
    const decor = (zone.decorData?.objects ?? []).map((d)=>({
            kind: 'decor',
            data: d
        }));
    const tables = zone.tables.map((t)=>({
            kind: 'table',
            data: t
        }));
    // Столы поверх decor (decor = фон/стены), порядок внутри — по индексу.
    return [
        ...decor,
        ...tables
    ];
};
function useActiveItems() {
    const zone = useLayoutStore(selectActiveZone);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!zone) return [];
        const decor = (zone.decorData?.objects ?? []).map((d)=>({
                kind: 'decor',
                data: d
            }));
        const tables = zone.tables.map((t)=>({
                kind: 'table',
                data: t
            }));
        return [
            ...decor,
            ...tables
        ];
    }, [
        zone
    ]);
}
const useLayoutStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        zones: [],
        activeZoneId: null,
        depositScheme: 'no_deposit',
        globalDepositAmount: 0,
        bookingDurationMinutes: 120,
        mode: 'edit',
        tool: 'select',
        selectedIds: [],
        zoom: 1,
        pan: {
            x: 0,
            y: 0
        },
        gridVisible: true,
        history: [],
        future: [],
        clipboard: [],
        availability: new Map(),
        selectedTableIdForBooking: null,
        loadLayout: (zones)=>set({
                zones: cloneZones(zones),
                activeZoneId: zones[0]?.id ?? null,
                history: [],
                future: [],
                selectedIds: [],
                mode: 'edit'
            }),
        loadPublicLayout: (layout)=>{
            // В guest-режиме зоны содержат только публичные столы; приводим к FloorPlanZone-форме.
            const zones = layout.zones.map((z)=>({
                    id: z.id,
                    restaurantId: '',
                    name: z.name,
                    sortOrder: z.sortOrder,
                    depositAmount: z.depositAmount,
                    decorData: z.decorData,
                    createdAt: '',
                    updatedAt: '',
                    tables: z.tables.map((t)=>({
                            ...t,
                            restaurantId: '',
                            isActive: true,
                            visibleToGuests: true,
                            createdAt: '',
                            updatedAt: ''
                        }))
                }));
            set({
                zones,
                activeZoneId: zones[0]?.id ?? null,
                depositScheme: layout.depositScheme,
                globalDepositAmount: layout.globalDepositAmount,
                bookingDurationMinutes: layout.bookingDurationMinutes,
                mode: 'guest',
                selectedIds: [],
                availability: new Map(),
                selectedTableIdForBooking: null,
                history: [],
                future: []
            });
        },
        setMode: (mode)=>set({
                mode
            }),
        setActiveZone: (zoneId)=>set({
                activeZoneId: zoneId,
                selectedIds: []
            }),
        addZone: (zone)=>set((s)=>({
                    ...recordHistory(s),
                    zones: [
                        ...s.zones,
                        cloneZone(zone)
                    ],
                    activeZoneId: zone.id
                })),
        updateZone: (zoneId, patch)=>set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.map((z)=>z.id === zoneId ? {
                            ...z,
                            ...patch
                        } : z)
                })),
        removeZone: (zoneId)=>set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.filter((z)=>z.id !== zoneId),
                    activeZoneId: s.activeZoneId === zoneId ? s.zones[0]?.id ?? null : s.activeZoneId
                })),
        setTool: (tool)=>set({
                tool
            }),
        select: (id)=>set({
                selectedIds: id ? [
                    id
                ] : []
            }),
        toggleSelection: (id)=>set((s)=>({
                    selectedIds: s.selectedIds.includes(id) ? s.selectedIds.filter((x)=>x !== id) : [
                        ...s.selectedIds,
                        id
                    ]
                })),
        selectAll: ()=>{
            const items = selectActiveItems(get());
            set({
                selectedIds: items.map((i)=>i.data.id)
            });
        },
        clearSelection: ()=>set({
                selectedIds: []
            }),
        addTable: (zoneId, table)=>set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.map((z)=>z.id === zoneId ? {
                            ...z,
                            tables: [
                                ...z.tables,
                                {
                                    ...table
                                }
                            ]
                        } : z),
                    selectedIds: [
                        table.id
                    ]
                })),
        updateTable: (tableId, patch)=>set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.map((z)=>({
                            ...z,
                            tables: z.tables.map((t)=>t.id === tableId ? {
                                    ...t,
                                    ...patch
                                } : t)
                        }))
                })),
        removeTable: (tableId)=>set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.map((z)=>({
                            ...z,
                            tables: z.tables.filter((t)=>t.id !== tableId)
                        })),
                    selectedIds: s.selectedIds.filter((id)=>id !== tableId)
                })),
        addDecor: (zoneId, decor)=>set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.map((z)=>z.id === zoneId ? {
                            ...z,
                            decorData: {
                                grid: z.decorData?.grid ?? {
                                    size: 20,
                                    visible: true,
                                    color: '#e5e7eb'
                                },
                                objects: [
                                    ...z.decorData?.objects ?? [],
                                    {
                                        ...decor
                                    }
                                ]
                            }
                        } : z),
                    selectedIds: [
                        decor.id
                    ]
                })),
        updateDecor: (zoneId, decorId, patch)=>set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.map((z)=>z.id === zoneId ? {
                            ...z,
                            decorData: z.decorData ? {
                                grid: z.decorData.grid,
                                objects: z.decorData.objects.map((o)=>o.id === decorId ? {
                                        ...o,
                                        ...patch
                                    } : o)
                            } : z.decorData
                        } : z)
                })),
        removeDecor: (zoneId, decorId)=>set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.map((z)=>z.id === zoneId ? {
                            ...z,
                            decorData: z.decorData ? {
                                grid: z.decorData.grid,
                                objects: z.decorData.objects.filter((o)=>o.id !== decorId)
                            } : null
                        } : z),
                    selectedIds: s.selectedIds.filter((id)=>id !== decorId)
                })),
        moveSelected: (dx, dy)=>{
            if (dx === 0 && dy === 0) return;
            const { selectedIds } = get();
            if (selectedIds.length === 0) return;
            set((s)=>{
                const zones = s.zones.map((z)=>{
                    const tables = z.tables.map((t)=>selectedIds.includes(t.id) ? {
                            ...t,
                            positionX: (t.positionX ?? 0) + dx,
                            positionY: (t.positionY ?? 0) + dy
                        } : t);
                    const decorData = z.decorData ? {
                        grid: z.decorData.grid,
                        objects: z.decorData.objects.map((o)=>{
                            if (!selectedIds.includes(o.id)) return o;
                            if (o.type === 'line' || o.type === 'polyline' || o.type === 'zone') {
                                const points = o.points.map((p, i)=>i % 2 === 0 ? p + dx : p + dy);
                                return {
                                    ...o,
                                    points
                                };
                            }
                            return {
                                ...o,
                                x: o.x + dx,
                                y: o.y + dy
                            };
                        })
                    } : null;
                    return {
                        ...z,
                        tables,
                        decorData
                    };
                });
                return {
                    ...recordHistory(s),
                    zones
                };
            });
        },
        rotateSelected: (deg)=>{
            const { selectedIds } = get();
            if (selectedIds.length === 0) return;
            set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.map((z)=>({
                            ...z,
                            tables: z.tables.map((t)=>selectedIds.includes(t.id) ? {
                                    ...t,
                                    rotation: ((t.rotation + deg) % 360 + 360) % 360
                                } : t),
                            decorData: z.decorData ? {
                                grid: z.decorData.grid,
                                objects: z.decorData.objects.map((o)=>selectedIds.includes(o.id) && (o.type === 'shape' || o.type === 'text' || o.type === 'decor-icon') ? {
                                        ...o,
                                        rotation: ((o.rotation + deg) % 360 + 360) % 360
                                    } : o)
                            } : z.decorData
                        }))
                }));
        },
        alignSelected: (kind)=>{
            const state = get();
            const items = selectActiveItems(state).filter((i)=>state.selectedIds.includes(i.data.id));
            if (items.length < 2) return;
            const bounds = items.map((i)=>({
                    id: i.data.id,
                    b: itemBounds(i)
                }));
            const deltas = new Map();
            if (kind === 'distribute-h' || kind === 'distribute-v') {
                if (items.length < 3) return;
                const sorted = [
                    ...bounds
                ].sort((a, b)=>kind === 'distribute-h' ? a.b.x - b.b.x : a.b.y - b.b.y);
                const first = sorted[0].b;
                const last = sorted[sorted.length - 1].b;
                const span = kind === 'distribute-h' ? last.x - first.x : last.y - first.y;
                const step = span / (sorted.length - 1);
                sorted.forEach((entry, idx)=>{
                    const target = first.x + step * idx;
                    const dx = kind === 'distribute-h' ? target - entry.b.x : 0;
                    const dy = kind === 'distribute-v' ? first.y + step * idx - entry.b.y : 0;
                    if (dx !== 0 || dy !== 0) deltas.set(entry.id, {
                        dx,
                        dy
                    });
                });
            } else {
                const ref = bounds[0].b;
                bounds.forEach((entry)=>{
                    let dx = 0;
                    let dy = 0;
                    switch(kind){
                        case 'left':
                            dx = ref.x - entry.b.x;
                            break;
                        case 'right':
                            dx = ref.x + ref.width - (entry.b.x + entry.b.width);
                            break;
                        case 'top':
                            dy = ref.y - entry.b.y;
                            break;
                        case 'bottom':
                            dy = ref.y + ref.height - (entry.b.y + entry.b.height);
                            break;
                        case 'center-h':
                            dx = ref.x + ref.width / 2 - (entry.b.x + entry.b.width / 2);
                            break;
                        case 'center-v':
                            dy = ref.y + ref.height / 2 - (entry.b.y + entry.b.height / 2);
                            break;
                    }
                    if (dx !== 0 || dy !== 0) deltas.set(entry.id, {
                        dx,
                        dy
                    });
                });
            }
            if (deltas.size === 0) return;
            set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.map((z)=>{
                        const tables = z.tables.map((t)=>{
                            const d = deltas.get(t.id);
                            if (!d) return t;
                            return {
                                ...t,
                                positionX: (t.positionX ?? 0) + d.dx,
                                positionY: (t.positionY ?? 0) + d.dy
                            };
                        });
                        const decorData = z.decorData ? {
                            grid: z.decorData.grid,
                            objects: z.decorData.objects.map((o)=>{
                                const d = deltas.get(o.id);
                                if (!d) return o;
                                if (o.type === 'line' || o.type === 'polyline' || o.type === 'zone') {
                                    const points = o.points.map((p, i)=>i % 2 === 0 ? p + d.dx : p + d.dy);
                                    return {
                                        ...o,
                                        points
                                    };
                                }
                                return {
                                    ...o,
                                    x: o.x + d.dx,
                                    y: o.y + d.dy
                                };
                            })
                        } : z.decorData;
                        return {
                            ...z,
                            tables,
                            decorData
                        };
                    })
                }));
        },
        bringForward: (id)=>reorderObject(set, get, id, 1),
        sendBackward: (id)=>reorderObject(set, get, id, -1),
        bringToFront: (id)=>reorderObject(set, get, id, 'front'),
        sendToBack: (id)=>reorderObject(set, get, id, 'back'),
        copySelection: ()=>{
            const state = get();
            const decor = selectActiveItems(state).filter((i)=>i.kind === 'decor' && state.selectedIds.includes(i.data.id)).map((i)=>({
                    ...i.data
                }));
            set({
                clipboard: decor
            });
        },
        pasteSelection: ()=>{
            const state = get();
            if (state.clipboard.length === 0 || !state.activeZoneId) return;
            const newIds = [];
            const pasted = state.clipboard.map((d)=>{
                const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
                newIds.push(id);
                return {
                    ...d,
                    id,
                    x: d.type === 'shape' || d.type === 'text' || d.type === 'decor-icon' ? d.x + 20 : d.x,
                    y: d.type === 'shape' || d.type === 'text' || d.type === 'decor-icon' ? d.y + 20 : d.y
                };
            });
            set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.map((z)=>z.id === s.activeZoneId ? {
                            ...z,
                            decorData: {
                                grid: z.decorData?.grid ?? {
                                    size: 20,
                                    visible: true,
                                    color: '#e5e7eb'
                                },
                                objects: [
                                    ...z.decorData?.objects ?? [],
                                    ...pasted
                                ]
                            }
                        } : z),
                    selectedIds: newIds
                }));
        },
        duplicateSelection: ()=>{
            get().copySelection();
            get().pasteSelection();
        },
        deleteSelection: ()=>{
            const state = get();
            if (state.selectedIds.length === 0) return;
            const ids = new Set(state.selectedIds);
            set((s)=>({
                    ...recordHistory(s),
                    zones: s.zones.map((z)=>({
                            ...z,
                            tables: z.tables.filter((t)=>!ids.has(t.id)),
                            decorData: z.decorData ? {
                                grid: z.decorData.grid,
                                objects: z.decorData.objects.filter((o)=>!ids.has(o.id))
                            } : null
                        })),
                    selectedIds: []
                }));
        },
        pushHistory: ()=>set((s)=>{
                const snapshot = {
                    zones: cloneZones(s.zones),
                    activeZoneId: s.activeZoneId
                };
                const history = [
                    ...s.history,
                    snapshot
                ].slice(-HISTORY_LIMIT);
                return {
                    history,
                    future: []
                };
            }),
        undo: ()=>set((s)=>{
                if (s.history.length === 0) return s;
                const previous = s.history[s.history.length - 1];
                const future = {
                    zones: cloneZones(s.zones),
                    activeZoneId: s.activeZoneId
                };
                return {
                    zones: previous.zones,
                    activeZoneId: previous.activeZoneId,
                    history: s.history.slice(0, -1),
                    future: [
                        future,
                        ...s.future
                    ].slice(0, HISTORY_LIMIT),
                    selectedIds: []
                };
            }),
        redo: ()=>set((s)=>{
                if (s.future.length === 0) return s;
                const next = s.future[0];
                const history = {
                    zones: cloneZones(s.zones),
                    activeZoneId: s.activeZoneId
                };
                return {
                    zones: next.zones,
                    activeZoneId: next.activeZoneId,
                    history: [
                        ...s.history,
                        history
                    ].slice(-HISTORY_LIMIT),
                    future: s.future.slice(1),
                    selectedIds: []
                };
            }),
        setZoom: (zoom)=>set({
                zoom: Math.max(0.2, Math.min(3, zoom))
            }),
        setPan: (pan)=>set({
                pan
            }),
        toggleGrid: ()=>set((s)=>({
                    gridVisible: !s.gridVisible
                })),
        setAvailability: (busy)=>set({
                availability: new Map(busy.map((b)=>[
                        b.tableId,
                        b.busyUntil
                    ]))
            }),
        selectTableForBooking: (tableId)=>set({
                selectedTableIdForBooking: tableId
            }),
        getActiveZone: ()=>selectActiveZone(get()),
        getActiveItems: ()=>selectActiveItems(get())
    }));
function reorderObject(set, get, id, direction) {
    const state = get();
    if (!state.activeZoneId) return;
    set((s)=>({
            ...recordHistory(s),
            zones: s.zones.map((z)=>{
                if (z.id !== s.activeZoneId || !z.decorData) return z;
                const objs = [
                    ...z.decorData.objects
                ];
                const idx = objs.findIndex((o)=>o.id === id);
                if (idx === -1) return z;
                const [item] = objs.splice(idx, 1);
                if (direction === 'front') objs.push(item);
                else if (direction === 'back') objs.unshift(item);
                else {
                    const newIdx = Math.max(0, Math.min(objs.length, idx + direction));
                    objs.splice(newIdx, 0, item);
                }
                return {
                    ...z,
                    decorData: {
                        grid: z.decorData.grid,
                        objects: objs
                    }
                };
            })
        }));
}
function createDecorObject(type, x, y) {
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
    switch(type){
        case 'line':
            return {
                id,
                type: 'line',
                points: [
                    x,
                    y,
                    x + 100,
                    y
                ],
                strokeWidth: 3,
                color: '#374151'
            };
        case 'polyline':
            return {
                id,
                type: 'polyline',
                points: [
                    x,
                    y,
                    x + 100,
                    y,
                    x + 100,
                    y + 80
                ],
                strokeWidth: 3,
                color: '#374151',
                closed: false
            };
        case 'zone':
            return {
                id,
                type: 'zone',
                points: [
                    x,
                    y,
                    x + 160,
                    y,
                    x + 160,
                    y + 100,
                    x,
                    y + 100
                ],
                fill: '#dbeafe',
                stroke: '#3b82f6',
                strokeWidth: 2
            };
        case 'shape':
            return {
                id,
                type: 'shape',
                shape: 'rect',
                x,
                y,
                width: 120,
                height: 80,
                rotation: 0,
                fill: '#f3f4f6',
                stroke: '#9ca3af',
                strokeWidth: 2
            };
        case 'text':
            return {
                id,
                type: 'text',
                x,
                y,
                rotation: 0,
                text: 'Текст',
                fontSize: 24,
                color: '#111827'
            };
        case 'decor-icon':
            return {
                id,
                type: 'decor-icon',
                x,
                y,
                rotation: 0,
                icon: 'plant',
                width: 48,
                height: 48,
                color: '#16a34a'
            };
        default:
            throw new Error(`Unknown decor type: ${type}`);
    }
}
function createNewTable(zoneId, restaurantId, index, defaults) {
    const now = new Date().toISOString();
    return {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])(),
        restaurantId,
        floorPlanId: zoneId,
        label: `Стол ${index}`,
        objectType: 'table',
        capacity: 4,
        minCapacity: 1,
        positionX: 40 + (index - 1) % 6 * 24,
        positionY: 40 + Math.floor((index - 1) / 6) * 24,
        width: 96,
        height: 80,
        rotation: 0,
        shape: 'rectangle',
        points: null,
        seats: null,
        depositAmount: 0,
        isActive: true,
        visibleToGuests: true,
        description: null,
        createdAt: now,
        updatedAt: now,
        ...defaults
    };
}
function decorLayoutOf(zone) {
    return zone.decorData ?? {
        grid: {
            size: 20,
            visible: true,
            color: '#e5e7eb'
        },
        objects: []
    };
}
function resolveTableDeposit(scheme, globalAmount, zone, table) {
    if (scheme === 'no_deposit') return 0;
    if (scheme === 'global_deposit') return globalAmount;
    const zoneAmount = zone?.depositAmount ?? 0;
    if (scheme === 'per_zone') return zoneAmount || globalAmount;
    // per_table
    return table.depositAmount || zoneAmount || globalAmount;
}
}),
"[project]/src/features/restaurant-admin/api/floor-plans.api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createFloorPlan",
    ()=>createFloorPlan,
    "createTable",
    ()=>createTable,
    "deleteFloorPlan",
    ()=>deleteFloorPlan,
    "deleteTable",
    ()=>deleteTable,
    "fetchFloorPlans",
    ()=>fetchFloorPlans,
    "fetchPublicLayout",
    ()=>fetchPublicLayout,
    "fetchTablesAvailability",
    ()=>fetchTablesAvailability,
    "saveLayout",
    ()=>saveLayout,
    "setDepositScheme",
    ()=>setDepositScheme,
    "updateFloorPlan",
    ()=>updateFloorPlan,
    "updateTable",
    ()=>updateTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-ssr] (ecmascript)");
;
function fetchFloorPlans(restaurantId, token) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/floor-plans`, {
        token
    });
}
function createFloorPlan(restaurantId, token, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/floor-plans`, {
        method: 'POST',
        token,
        body: JSON.stringify(payload)
    });
}
function updateFloorPlan(restaurantId, token, floorPlanId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/floor-plans/${floorPlanId}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
function deleteFloorPlan(restaurantId, token, floorPlanId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/floor-plans/${floorPlanId}`, {
        method: 'DELETE',
        token
    });
}
function saveLayout(restaurantId, token, floorPlanId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/floor-plans/${floorPlanId}/layout`, {
        method: 'PUT',
        token,
        body: JSON.stringify(payload)
    });
}
function createTable(restaurantId, token, floorPlanId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/floor-plans/${floorPlanId}/tables`, {
        method: 'POST',
        token,
        body: JSON.stringify(payload)
    });
}
function updateTable(restaurantId, token, tableId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/floor-plans/tables/${tableId}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
function deleteTable(restaurantId, token, tableId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/floor-plans/tables/${tableId}`, {
        method: 'DELETE',
        token
    });
}
function setDepositScheme(restaurantId, token, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/booking-settings/deposit`, {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
function fetchPublicLayout(restaurantId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/floor-plans/public`);
}
function fetchTablesAvailability(restaurantId, date, time) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/tables/availability?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
}
}),
"[project]/src/features/restaurants/actions/data:0f6329 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40e63319c1430a1f9736cdfbfd5ee1c7064ae9cdc8":"revalidateRestaurantPublicPage"},"src/features/restaurants/actions/revalidate-restaurant-public-page.action.ts",""] */ __turbopack_context__.s([
    "revalidateRestaurantPublicPage",
    ()=>revalidateRestaurantPublicPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var revalidateRestaurantPublicPage = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40e63319c1430a1f9736cdfbfd5ee1c7064ae9cdc8", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "revalidateRestaurantPublicPage"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcmV2YWxpZGF0ZS1yZXN0YXVyYW50LXB1YmxpYy1wYWdlLmFjdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5cbmltcG9ydCB7IHJldmFsaWRhdGVSZXN0YXVyYW50UHVibGljUGFnZUNhY2hlIH0gZnJvbSAnQC9zaGFyZWQvY2FjaGUvcmV2YWxpZGF0ZS1yZXN0YXVyYW50LXB1YmxpYy1wYWdlJztcblxuZXhwb3J0IGludGVyZmFjZSBSZXZhbGlkYXRlUmVzdGF1cmFudFB1YmxpY1BhZ2VSZXN1bHQge1xuICBvazogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJldmFsaWRhdGVSZXN0YXVyYW50UHVibGljUGFnZShcbiAgcmVzdGF1cmFudElkOiBzdHJpbmcsXG4pOiBQcm9taXNlPFJldmFsaWRhdGVSZXN0YXVyYW50UHVibGljUGFnZVJlc3VsdD4ge1xuICBpZiAoIXJlc3RhdXJhbnRJZCkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSB9O1xuICB9XG5cbiAgcmV2YWxpZGF0ZVJlc3RhdXJhbnRQdWJsaWNQYWdlQ2FjaGUocmVzdGF1cmFudElkKTtcbiAgcmV0dXJuIHsgb2s6IHRydWUgfTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoib1dBUXNCIn0=
}),
"[project]/src/features/floor-plan/components/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DECOR_DEFAULTS",
    ()=>DECOR_DEFAULTS,
    "DECOR_ICONS",
    ()=>DECOR_ICONS,
    "DEFAULT_GRID_SIZE",
    ()=>DEFAULT_GRID_SIZE,
    "DEPOSIT_SCHEMES",
    ()=>DEPOSIT_SCHEMES,
    "MAX_ZOOM",
    ()=>MAX_ZOOM,
    "MIN_ZOOM",
    ()=>MIN_ZOOM,
    "SEAT_COLORS",
    ()=>SEAT_COLORS,
    "STAGE_HEIGHT",
    ()=>STAGE_HEIGHT,
    "STAGE_WIDTH",
    ()=>STAGE_WIDTH,
    "TABLE_COLORS",
    ()=>TABLE_COLORS,
    "TABLE_OBJECT_TYPES",
    ()=>TABLE_OBJECT_TYPES,
    "TABLE_SHAPES",
    ()=>TABLE_SHAPES,
    "TOOLS",
    ()=>TOOLS,
    "ZOOM_STEP",
    ()=>ZOOM_STEP,
    "formatBusyUntil",
    ()=>formatBusyUntil,
    "todayIso",
    ()=>todayIso
]);
const STAGE_WIDTH = 1100;
const STAGE_HEIGHT = 620;
const DEFAULT_GRID_SIZE = 20;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const ZOOM_STEP = 1.1;
const TABLE_COLORS = {
    active: '#22c55e',
    inactive: '#9ca3af',
    selected: '#2563eb',
    busy: '#ef4444',
    booked: '#f97316',
    fill: '#ffffff',
    label: '#111827',
    capacity: '#6b7280'
};
const SEAT_COLORS = {
    fill: '#f9fafb',
    stroke: '#9ca3af',
    back: '#e5e7eb',
    selected: '#2563eb'
};
const DECOR_DEFAULTS = {
    stroke: '#374151',
    fill: '#f3f4f6',
    zoneFill: '#dbeafe',
    zoneStroke: '#3b82f6',
    textColor: '#111827'
};
const TABLE_SHAPES = [
    {
        value: 'rectangle',
        label: 'Прямоугольный'
    },
    {
        value: 'round',
        label: 'Круглый'
    },
    {
        value: 'square',
        label: 'Квадратный'
    },
    {
        value: 'oval',
        label: 'Овальный'
    },
    {
        value: 'polygon',
        label: 'Произвольный'
    }
];
const TABLE_OBJECT_TYPES = [
    {
        value: 'table',
        label: 'Стол'
    },
    {
        value: 'bar',
        label: 'Бар'
    },
    {
        value: 'billiard',
        label: 'Бильярд'
    },
    {
        value: 'cabana',
        label: 'Беседка'
    },
    {
        value: 'room',
        label: 'Комната'
    },
    {
        value: 'lounger',
        label: 'Лежак'
    }
];
const DEPOSIT_SCHEMES = [
    {
        value: 'no_deposit',
        label: 'Без депозита'
    },
    {
        value: 'global_deposit',
        label: 'Глобальный депозит'
    },
    {
        value: 'per_zone',
        label: 'По зонам'
    },
    {
        value: 'per_table',
        label: 'По столам'
    }
];
const TOOLS = [
    {
        value: 'select',
        label: 'Выделить',
        icon: '↖'
    },
    {
        value: 'line',
        label: 'Линия',
        icon: '╱'
    },
    {
        value: 'polyline',
        label: 'Ломаная',
        icon: '⌐'
    },
    {
        value: 'zone',
        label: 'Зона',
        icon: '▱'
    },
    {
        value: 'rect',
        label: 'Прямоуг.',
        icon: '▭'
    },
    {
        value: 'circle',
        label: 'Круг',
        icon: '○'
    },
    {
        value: 'text',
        label: 'Текст',
        icon: 'T'
    },
    {
        value: 'decor-icon',
        label: 'Декор',
        icon: '✦'
    }
];
const DECOR_ICONS = [
    {
        value: 'plant',
        label: 'Растение',
        emoji: '🪴'
    },
    {
        value: 'tv',
        label: 'ТВ',
        emoji: '📺'
    },
    {
        value: 'lamp',
        label: 'Светильник',
        emoji: '💡'
    },
    {
        value: 'curtain',
        label: 'Шторы',
        emoji: '🪟'
    },
    {
        value: 'stairs',
        label: 'Лестница',
        emoji: '🪜'
    },
    {
        value: 'entrance',
        label: 'Вход',
        emoji: '🚪'
    },
    {
        value: 'wc',
        label: 'Туалет',
        emoji: '🚻'
    },
    {
        value: 'stage',
        label: 'Сцена',
        emoji: '🎤'
    },
    {
        value: 'bar',
        label: 'Бар',
        emoji: '🍹'
    },
    {
        value: 'kitchen',
        label: 'Кухня',
        emoji: '🍽'
    }
];
function formatBusyUntil(iso) {
    try {
        const d = new Date(iso);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch  {
        return '';
    }
}
function todayIso() {
    return new Date().toISOString().slice(0, 10);
}
}),
"[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DepositSettingsPanel",
    ()=>DepositSettingsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/constants.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function DepositSettingsPanel({ restaurantId, token, onSetDeposit }) {
    const scheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.depositScheme);
    const globalAmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.globalDepositAmount);
    const zones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.zones);
    const updateZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.updateZone);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleSchemeChange(newScheme) {
        setSaving(true);
        setSaved(false);
        try {
            await onSetDeposit(restaurantId, token, {
                scheme: newScheme,
                amount: globalAmount
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"].setState({
                depositScheme: newScheme
            });
            setSaved(true);
            setTimeout(()=>setSaved(false), 1500);
        } finally{
            setSaving(false);
        }
    }
    async function handleGlobalAmountChange(amount) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"].setState({
            globalDepositAmount: amount
        });
        setSaving(true);
        setSaved(false);
        try {
            await onSetDeposit(restaurantId, token, {
                scheme,
                amount
            });
            setSaved(true);
            setTimeout(()=>setSaved(false), 1500);
        } finally{
            setSaving(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "fp-deposit",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "fp-deposit__title",
                children: "Депозиты за бронирование"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-deposit__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Схема депозита"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: scheme,
                        disabled: saving,
                        onChange: (e)=>void handleSchemeChange(e.target.value),
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEPOSIT_SCHEMES"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: s.value,
                                children: s.label
                            }, s.value, false, {
                                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                                lineNumber: 60,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            scheme === 'global_deposit' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-deposit__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Глобальная сумма (BYN)"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        min: 0,
                        step: 0.5,
                        value: globalAmount,
                        disabled: saving,
                        onChange: (e)=>void handleGlobalAmountChange(Number(e.target.value))
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this),
            scheme === 'per_zone' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-deposit__zones",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "fp-deposit__hint",
                        children: "Депозит для каждой зоны:"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this),
                    zones.map((z)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "fp-deposit__field",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: z.name
                                }, void 0, false, {
                                    fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                                    lineNumber: 84,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    min: 0,
                                    step: 0.5,
                                    value: z.depositAmount,
                                    onChange: (e)=>updateZone(z.id, {
                                            depositAmount: Number(e.target.value)
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                                    lineNumber: 85,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, z.id, true, {
                            fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 80,
                columnNumber: 9
            }, this),
            scheme === 'per_table' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-deposit__hint",
                children: "Депозит настраивается индивидуально для каждого стола в панели свойств стола. Если у стола 0 — наследует зону или глобальную сумму."
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 98,
                columnNumber: 9
            }, this),
            scheme === 'no_deposit' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-deposit__hint",
                children: "Депозит не требуется при бронировании."
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 105,
                columnNumber: 9
            }, this),
            saved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-deposit__saved",
                children: "✓ Сохранено"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 108,
                columnNumber: 17
            }, this),
            saving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-deposit__saving",
                children: "Сохранение…"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 109,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/features/floor-plan/components/DecorInspector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DecorInspector",
    ()=>DecorInspector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-ssr] (ecmascript)");
'use client';
;
;
function DecorInspector() {
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.selectedIds);
    const activeZoneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.activeZoneId);
    const updateDecor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.updateDecor);
    const removeDecor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.removeDecor);
    const decor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>{
        if (selectedIds.length !== 1 || !s.activeZoneId) return null;
        const zone = s.zones.find((z)=>z.id === s.activeZoneId);
        return zone?.decorData?.objects.find((o)=>o.id === selectedIds[0]) ?? null;
    });
    if (!decor || !activeZoneId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: "fp-inspector fp-inspector--empty",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Выберите элемент декора, чтобы изменить его свойства."
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                lineNumber: 36,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this);
    }
    function patch(p) {
        updateDecor(activeZoneId, decor.id, p);
    }
    const isPolyline = decor.type === 'polyline';
    const isZone = decor.type === 'zone';
    const isPointBased = isPolyline || isZone || decor.type === 'line';
    const pointBased = decor;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "fp-inspector",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "fp-inspector__title",
                children: [
                    decor.type === 'line' && 'Линия',
                    decor.type === 'polyline' && 'Ломаная',
                    decor.type === 'zone' && 'Зона',
                    decor.type === 'shape' && 'Фигура',
                    decor.type === 'text' && 'Текст',
                    decor.type === 'decor-icon' && 'Иконка'
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            isPointBased && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Цвет контура"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: isZone ? decor.stroke : decor.color,
                                onChange: (e)=>patch(isZone ? {
                                        stroke: e.target.value
                                    } : {
                                        color: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Толщина (",
                                    decor.strokeWidth,
                                    "px)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: 1,
                                max: 20,
                                step: 1,
                                value: decor.strokeWidth,
                                onChange: (e)=>patch({
                                        strokeWidth: Number(e.target.value)
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 80,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this),
                    (isPolyline || isZone) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "fp-inspector__field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Сглаживание (сплайн): ",
                                            (pointBased.tension ?? 0).toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 93,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 0,
                                        max: 0.6,
                                        step: 0.05,
                                        value: pointBased.tension ?? 0,
                                        onChange: (e)=>patch({
                                                tension: Number(e.target.value)
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 94,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        className: "fp-inspector__hint",
                                        children: "0 — прямые сегменты, >0 — плавная кривая через точки"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 102,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 92,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "fp-inspector__field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Скругление углов: ",
                                            pointBased.cornerRadius ?? 0,
                                            "px"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 106,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 0,
                                        max: 80,
                                        step: 1,
                                        value: pointBased.cornerRadius ?? 0,
                                        onChange: (e)=>patch({
                                                cornerRadius: Number(e.target.value)
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 107,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        className: "fp-inspector__hint",
                                        children: "Закруглённые стены, барные стойки с поворотами"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 115,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 105,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    isZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Заливка"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 122,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: decor.fill,
                                onChange: (e)=>patch({
                                        fill: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 123,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 121,
                        columnNumber: 13
                    }, this),
                    isPolyline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field fp-inspector__field--row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Замкнуть"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 133,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: decor.closed,
                                onChange: (e)=>patch({
                                        closed: e.target.checked
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 134,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 132,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true),
            decor.type === 'text' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Текст"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: decor.text,
                                maxLength: 120,
                                onChange: (e)=>patch({
                                        text: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 146,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Размер шрифта (",
                                    decor.fontSize,
                                    "px)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: 8,
                                max: 96,
                                step: 1,
                                value: decor.fontSize,
                                onChange: (e)=>patch({
                                        fontSize: Number(e.target.value)
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Цвет"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: decor.color,
                                onChange: (e)=>patch({
                                        color: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 166,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            decor.type === 'shape' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Заливка"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: decor.fill,
                                onChange: (e)=>patch({
                                        fill: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 177,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Контур"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: decor.stroke,
                                onChange: (e)=>patch({
                                        stroke: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 179,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Толщина (",
                                    decor.strokeWidth,
                                    "px)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 184,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: 1,
                                max: 20,
                                step: 1,
                                value: decor.strokeWidth,
                                onChange: (e)=>patch({
                                        strokeWidth: Number(e.target.value)
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            decor.type === 'decor-icon' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Фон"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 199,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "color",
                        value: decor.color ?? '#f3f4f6',
                        onChange: (e)=>patch({
                                color: e.target.value
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                lineNumber: 198,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "fp-inspector__delete",
                onClick: ()=>removeDecor(activeZoneId, decor.id),
                children: "Удалить элемент"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-inspector__id",
                children: [
                    "ID: ",
                    decor.id.slice(0, 8),
                    "…"
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/features/floor-plan/components/LayersPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LayersPanel",
    ()=>LayersPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-ssr] (ecmascript)");
'use client';
;
;
function LayersPanel({ collapsed }) {
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useActiveItems"])();
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.selectedIds);
    const select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.select);
    const bringToFront = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.bringToFront);
    const sendToBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.sendToBack);
    const tables = items.filter((i)=>i.kind === 'table').map((i)=>({
            id: i.data.id,
            label: i.data.label,
            type: 'table'
        }));
    const decor = items.filter((i)=>i.kind === 'decor').map((i)=>({
            id: i.data.id,
            label: decorLabel(i.data),
            type: 'decor',
            decorType: i.data.type
        }));
    if (collapsed) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fp-layers",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "fp-layers__title",
                children: "Слои"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LayerGroup, {
                title: "Столы",
                entries: tables,
                selectedIds: selectedIds,
                onSelect: select
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LayerGroup, {
                title: "Декор",
                entries: decor,
                selectedIds: selectedIds,
                onSelect: select
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-layers__hint",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Ctrl+] — выше слоем"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Ctrl+[ — ниже слоем"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "] — наверх · [ — вниз"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            selectedIds.length === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-layers__reorder",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>bringToFront(selectedIds[0]),
                        children: "Наверх"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>sendToBack(selectedIds[0]),
                        children: "Вниз"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
function LayerGroup({ title, entries, selectedIds, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fp-layers__group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-layers__group-title",
                children: [
                    title,
                    " (",
                    entries.length,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            entries.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-layers__empty",
                children: "— пусто —"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                lineNumber: 67,
                columnNumber: 32
            }, this),
            entries.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: selectedIds.includes(e.id) ? 'fp-layers__item fp-layers__item--active' : 'fp-layers__item',
                    onClick: ()=>onSelect(e.id),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "fp-layers__item-icon",
                            children: iconFor(e)
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "fp-layers__item-label",
                            children: e.label
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this)
                    ]
                }, e.id, true, {
                    fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
function decorLabel(d) {
    switch(d.type){
        case 'line':
            return 'Линия';
        case 'polyline':
            return 'Ломаная';
        case 'zone':
            return 'Зона';
        case 'shape':
            return `Фигура (${d.shape})`;
        case 'text':
            return `Текст: ${d.text.slice(0, 16)}`;
        case 'decor-icon':
            return `Декор: ${d.icon}`;
    }
}
function iconFor(e) {
    if (e.type === 'table') return '🪑';
    switch(e.decorType){
        case 'line':
            return '╱';
        case 'polyline':
            return '⌐';
        case 'zone':
            return '▱';
        case 'shape':
            return '▭';
        case 'text':
            return 'T';
        case 'decor-icon':
            return '✦';
        default:
            return '•';
    }
}
}),
"[project]/src/features/floor-plan/components/TableInspector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TableInspector",
    ()=>TableInspector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v7.js [app-ssr] (ecmascript) <export default as v7>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/constants.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function TableInspector({ restaurantId, depositScheme }) {
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.selectedIds);
    const zones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.zones);
    const activeZoneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.activeZoneId);
    const updateTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.updateTable);
    const removeTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.removeTable);
    const table = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>{
        if (selectedIds.length !== 1) return null;
        const zone = s.zones.find((z)=>z.id === s.activeZoneId);
        return zone?.tables.find((t)=>t.id === selectedIds[0]) ?? null;
    });
    if (!table || !activeZoneId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: "fp-inspector fp-inspector--empty",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Выберите стол, чтобы редактировать его свойства."
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this);
    }
    function patch(p) {
        updateTable(table.id, p);
    }
    function addSeat(kind) {
        const seats = [
            ...table.seats ?? []
        ];
        // Размещаем новое место у нижней кромки стола, смещая по горизонтали,
        // чтобы новые места не накладывались друг на друга.
        const w = table.width;
        const h = table.height;
        const idx = seats.length;
        const cx = w / 2 + (idx % 6 - 2.5) * 28;
        const cy = h + 28 + Math.floor(idx / 6) * 28;
        const seat = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])(),
            kind,
            x: Math.round(cx),
            y: Math.round(cy),
            rotation: 0
        };
        seats.push(seat);
        patch({
            seats
        });
    }
    function updateSeat(seatId, p) {
        const seats = (table.seats ?? []).map((s)=>s.id === seatId ? {
                ...s,
                ...p
            } : s);
        patch({
            seats
        });
    }
    function removeSeat(seatId) {
        const seats = (table.seats ?? []).filter((s)=>s.id !== seatId);
        patch({
            seats
        });
    }
    const zone = zones.find((z)=>z.id === activeZoneId);
    const showDepositField = depositScheme === 'per_table';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "fp-inspector",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "fp-inspector__title",
                children: [
                    "Стол ",
                    table.label
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Название / номер"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: table.label,
                        maxLength: 60,
                        onChange: (e)=>patch({
                                label: e.target.value
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Тип объекта"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: table.objectType,
                        onChange: (e)=>patch({
                                objectType: e.target.value
                            }),
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TABLE_OBJECT_TYPES"].map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: o.value,
                                children: o.label
                            }, o.value, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Форма"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: table.shape,
                        onChange: (e)=>patch({
                                shape: e.target.value
                            }),
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TABLE_SHAPES"].map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: o.value,
                                children: o.label
                            }, o.value, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-inspector__row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Мин. мест"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                min: 1,
                                max: 50,
                                value: table.minCapacity,
                                onChange: (e)=>patch({
                                        minCapacity: Number(e.target.value)
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Макс. мест"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                min: 1,
                                max: 50,
                                value: table.capacity,
                                onChange: (e)=>patch({
                                        capacity: Number(e.target.value)
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Поворот (°)"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        min: 0,
                        max: 359,
                        value: Math.round(table.rotation),
                        onChange: (e)=>patch({
                                rotation: Number(e.target.value)
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            showDepositField && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Депозит за стол (BYN)"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        min: 0,
                        step: 0.5,
                        value: table.depositAmount,
                        onChange: (e)=>patch({
                                depositAmount: Number(e.target.value)
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                        className: "fp-inspector__hint",
                        children: [
                            "0 = наследует зону (",
                            zone?.depositAmount ?? 0,
                            " BYN)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Описание (необязательно)"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: table.description ?? '',
                        maxLength: 500,
                        onChange: (e)=>patch({
                                description: e.target.value || null
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-inspector__seats",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-inspector__seats-title",
                        children: "Места вокруг стола"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-inspector__seats-add",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SEAT_KINDS"].map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "fp-inspector__seats-add-btn",
                                onClick: ()=>addSeat(k.value),
                                children: [
                                    "+ ",
                                    k.label
                                ]
                            }, k.value, true, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this),
                    (table.seats?.length ?? 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "fp-inspector__seats-list",
                        children: table.seats.map((seat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "fp-inspector__seats-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "fp-inspector__seats-index",
                                        children: i + 1
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                        lineNumber: 178,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: seat.kind,
                                        onChange: (e)=>updateSeat(seat.id, {
                                                kind: e.target.value
                                            }),
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SEAT_KINDS"].map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: k.value,
                                                children: k.label
                                            }, k.value, false, {
                                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                                lineNumber: 184,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                        lineNumber: 179,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "fp-inspector__seats-del",
                                        onClick: ()=>removeSeat(seat.id),
                                        title: "Удалить место",
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                        lineNumber: 187,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, seat.id, true, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 177,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "fp-inspector__hint",
                        children: "Нет добавленных мест. Места двигаются вместе со столом."
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 199,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field fp-inspector__field--row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Доступен для брони"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        checked: table.isActive,
                        onChange: (e)=>patch({
                                isActive: e.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field fp-inspector__field--row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Виден гостям"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        checked: table.visibleToGuests,
                        onChange: (e)=>patch({
                                visibleToGuests: e.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "fp-inspector__delete",
                onClick: ()=>{
                    if (confirm(`Удалить стол «${table.label}» полностью?`)) {
                        removeTable(table.id);
                    }
                },
                children: "Удалить стол"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-inspector__id",
                children: [
                    "ID: ",
                    table.id.slice(0, 8),
                    "… · ресторан ",
                    restaurantId.slice(0, 8),
                    "…"
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/features/floor-plan/components/Toolbar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toolbar",
    ()=>Toolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/constants.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Toolbar({ onSave, saving, canSave, onAddZone, onRenameZone, onDeleteZone, onAddTable }) {
    const zones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.zones);
    const activeZoneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.activeZoneId);
    const setActiveZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.setActiveZone);
    const tool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.tool);
    const setTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.setTool);
    const zoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.zoom);
    const setZoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.setZoom);
    const setPan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.setPan);
    const undo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.undo);
    const redo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.redo);
    const historyLen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.history.length);
    const futureLen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.future.length);
    const toggleGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.toggleGrid);
    const gridVisible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.gridVisible);
    const [zoneMenuOpen, setZoneMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tableMenuOpen, setTableMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const activeZone = zones.find((z)=>z.id === activeZoneId) ?? null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fp-toolbar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__zones",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "fp-toolbar__zone-btn",
                        onClick: ()=>setZoneMenuOpen((v)=>!v),
                        title: "Выбрать зал",
                        children: [
                            activeZone?.name ?? 'Зал не выбран',
                            " ▾"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    zoneMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-toolbar__zone-menu",
                        children: [
                            zones.map((z)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: z.id === activeZoneId ? 'fp-toolbar__zone-item fp-toolbar__zone-item--active' : 'fp-toolbar__zone-item',
                                    onClick: ()=>{
                                        setActiveZone(z.id);
                                        setZoneMenuOpen(false);
                                    },
                                    children: z.name
                                }, z.id, false, {
                                    fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                                    lineNumber: 51,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fp-toolbar__zone-actions",
                                children: [
                                    onRenameZone && activeZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            onRenameZone();
                                            setZoneMenuOpen(false);
                                        },
                                        children: "✎ Переименовать"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                                        lineNumber: 62,
                                        columnNumber: 17
                                    }, this),
                                    onDeleteZone && activeZone && zones.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            onDeleteZone();
                                            setZoneMenuOpen(false);
                                        },
                                        children: "🗑 Удалить зал"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                                        lineNumber: 67,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                                lineNumber: 60,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this),
                    onAddZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "fp-toolbar__add-zone",
                        onClick: onAddZone,
                        title: "Добавить зал",
                        children: "+ Зал"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__add",
                children: onAddTable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fp-toolbar__add-table",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "fp-toolbar__add-table-btn",
                            onClick: ()=>setTableMenuOpen((v)=>!v),
                            disabled: !activeZoneId,
                            title: "Добавить стол",
                            children: "+ Стол ▾"
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                            lineNumber: 84,
                            columnNumber: 13
                        }, this),
                        tableMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fp-toolbar__table-menu",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TABLE_SHAPES"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "fp-toolbar__table-item",
                                    onClick: ()=>{
                                        onAddTable(s.value);
                                        setTableMenuOpen(false);
                                    },
                                    children: s.label
                                }, s.value, false, {
                                    fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                                    lineNumber: 96,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                            lineNumber: 94,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                    lineNumber: 83,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__tools",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TOOLS"].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: tool === t.value ? 'fp-toolbar__tool fp-toolbar__tool--active' : 'fp-toolbar__tool',
                        onClick: ()=>setTool(t.value),
                        title: t.label,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "fp-toolbar__tool-icon",
                                children: t.icon
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "fp-toolbar__tool-label",
                                children: t.label
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this)
                        ]
                    }, t.value, true, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__history",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: historyLen === 0,
                        onClick: undo,
                        title: "Отменить (Ctrl+Z)",
                        children: "↶"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: futureLen === 0,
                        onClick: redo,
                        title: "Повторить (Ctrl+Y)",
                        children: "↷"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__view",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: gridVisible ? 'fp-toolbar__toggle--active' : '',
                        onClick: toggleGrid,
                        title: "Сетка",
                        children: "#"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setZoom(Math.max(0.2, zoom / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ZOOM_STEP"])),
                        title: "Уменьшить",
                        children: "−"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "fp-toolbar__zoom",
                        children: [
                            Math.round(zoom * 100),
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setZoom(Math.min(3, zoom * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ZOOM_STEP"])),
                        title: "Увеличить",
                        children: "+"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>{
                            setZoom(1);
                            setPan({
                                x: 0,
                                y: 0
                            });
                        },
                        title: "Центр",
                        children: "⊕"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            onSave && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__save",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "fp-toolbar__save-btn",
                    disabled: saving || canSave === false,
                    onClick: onSave,
                    children: saving ? 'Сохранение…' : 'Сохранить (Ctrl+S)'
                }, void 0, false, {
                    fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                    lineNumber: 166,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                lineNumber: 165,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/features/floor-plan/components/useHotkeys.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useHotkeys",
    ()=>useHotkeys
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-ssr] (ecmascript)");
'use client';
;
;
function useHotkeys({ onSave, canSave }) {
    const selectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.selectAll);
    const clearSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.clearSelection);
    const deleteSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.deleteSelection);
    const copySelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.copySelection);
    const pasteSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.pasteSelection);
    const duplicateSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.duplicateSelection);
    const undo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.undo);
    const redo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.redo);
    const moveSelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.moveSelected);
    const bringForward = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.bringForward);
    const sendBackward = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.sendBackward);
    const bringToFront = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.bringToFront);
    const sendToBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.sendToBack);
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.selectedIds);
    const setTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.setTool);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function isInputTarget(target) {
            const el = target;
            if (!el) return false;
            const tag = el.tagName;
            return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
        }
        function handler(e) {
            if (isInputTarget(e.target)) return;
            const ctrl = e.ctrlKey || e.metaKey;
            const code = e.code;
            if (ctrl && code === 'KeyS') {
                e.preventDefault();
                if (canSave !== false) onSave?.();
                return;
            }
            if (ctrl && code === 'KeyA') {
                e.preventDefault();
                selectAll();
                return;
            }
            if (ctrl && code === 'KeyC') {
                copySelection();
                return;
            }
            if (ctrl && code === 'KeyV') {
                e.preventDefault();
                pasteSelection();
                return;
            }
            if (ctrl && code === 'KeyD') {
                e.preventDefault();
                duplicateSelection();
                return;
            }
            if (ctrl && !e.shiftKey && code === 'KeyZ') {
                e.preventDefault();
                undo();
                return;
            }
            if (ctrl && code === 'KeyY' || ctrl && e.shiftKey && code === 'KeyZ') {
                e.preventDefault();
                redo();
                return;
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedIds.length > 0) {
                    e.preventDefault();
                    deleteSelection();
                }
                return;
            }
            if (e.key === 'Escape') {
                clearSelection();
                setTool('select');
                return;
            }
            if (ctrl && e.key === ']') {
                if (selectedIds.length === 1) bringForward(selectedIds[0]);
                return;
            }
            if (ctrl && e.key === '[') {
                if (selectedIds.length === 1) sendBackward(selectedIds[0]);
                return;
            }
            if (!ctrl && e.key === ']') {
                if (selectedIds.length === 1) bringToFront(selectedIds[0]);
                return;
            }
            if (!ctrl && e.key === '[') {
                if (selectedIds.length === 1) sendToBack(selectedIds[0]);
                return;
            }
            const step = e.shiftKey ? 10 : 5;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                moveSelected(-step, 0);
                return;
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                moveSelected(step, 0);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                moveSelected(0, -step);
                return;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                moveSelected(0, step);
                return;
            }
        }
        window.addEventListener('keydown', handler);
        return ()=>window.removeEventListener('keydown', handler);
    }, [
        onSave,
        canSave,
        selectAll,
        clearSelection,
        deleteSelection,
        copySelection,
        pasteSelection,
        duplicateSelection,
        undo,
        redo,
        moveSelected,
        bringForward,
        sendBackward,
        bringToFront,
        sendToBack,
        selectedIds,
        setTool
    ]);
}
}),
"[project]/src/features/floor-plan/components/FloorPlanEditor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloorPlanEditor",
    ()=>FloorPlanEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/floor-plans.api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/features/restaurants/actions/data:0f6329 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$DepositSettingsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$DecorInspector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/DecorInspector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$LayersPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/LayersPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$TableInspector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/TableInspector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$Toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/Toolbar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$useHotkeys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/useHotkeys.ts [app-ssr] (ecmascript)");
;
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// Konva требует `window` — отключаем SSR для Stage.
const KonvaStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/src/features/floor-plan/components/KonvaStage.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fp-editor__canvas-loading",
            children: "Загрузка холста…"
        }, void 0, false, {
            fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
            lineNumber: 27,
            columnNumber: 32
        }, ("TURBOPACK compile-time value", void 0))
});
function FloorPlanEditor({ restaurantId, token }) {
    const zones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.zones);
    const activeZoneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.activeZoneId);
    const depositScheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.depositScheme);
    const loadLayout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.loadLayout);
    const addZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.addZone);
    const updateZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.updateZone);
    const removeZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.removeZone);
    const addTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.addTable);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastSavedAt, setLastSavedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const autoSaveTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dirtyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Подписка на изменения зон для auto-save
    const zonesJson = JSON.stringify(zones);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!activeZoneId || zones.length === 0) return;
        dirtyRef.current = true;
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(()=>{
            void saveActiveZone();
            dirtyRef.current = false;
        }, 1500);
        return ()=>{
            if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        zonesJson,
        activeZoneId
    ]);
    const saveActiveZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!activeZoneId) return;
        const zone = zones.find((z)=>z.id === activeZoneId);
        if (!zone) return;
        setSaving(true);
        setError(null);
        try {
            const tables = zone.tables.map((t)=>({
                    id: t.id,
                    label: t.label,
                    objectType: t.objectType,
                    shape: t.shape,
                    capacity: t.capacity,
                    minCapacity: t.minCapacity,
                    positionX: t.positionX ?? 0,
                    positionY: t.positionY ?? 0,
                    width: t.width,
                    height: t.height,
                    points: t.points ?? undefined,
                    seats: t.seats ?? undefined,
                    rotation: t.rotation,
                    depositAmount: t.depositAmount,
                    isActive: t.isActive,
                    visibleToGuests: t.visibleToGuests,
                    description: t.description ?? undefined
                }));
            const payload = {
                decorData: zone.decorData ?? {
                    grid: {
                        size: 20,
                        visible: true,
                        color: '#e5e7eb'
                    },
                    objects: []
                },
                tables
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveLayout"])(restaurantId, token, activeZoneId, payload);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["revalidateRestaurantPublicPage"])(restaurantId);
            setLastSavedAt(Date.now());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось сохранить планировку');
        } finally{
            setSaving(false);
        }
    }, [
        activeZoneId,
        zones,
        restaurantId,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$useHotkeys$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useHotkeys"])({
        onSave: ()=>void saveActiveZone(),
        canSave: true
    });
    async function handleAddZone() {
        const name = prompt('Название нового зала:', `Зал ${zones.length + 1}`);
        if (!name) return;
        try {
            const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createFloorPlan"])(restaurantId, token, {
                name,
                sortOrder: zones.length
            });
            const zone = {
                ...created,
                tables: []
            };
            addZone(zone);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось создать зал');
        }
    }
    async function handleRenameZone() {
        if (!activeZoneId) return;
        const zone = zones.find((z)=>z.id === activeZoneId);
        if (!zone) return;
        const name = prompt('Новое название зала:', zone.name);
        if (!name || name === zone.name) return;
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateFloorPlan"])(restaurantId, token, activeZoneId, {
                name
            });
            updateZone(activeZoneId, {
                name
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось переименовать зал');
        }
    }
    async function handleDeleteZone() {
        if (!activeZoneId) return;
        const zone = zones.find((z)=>z.id === activeZoneId);
        if (!zone) return;
        if (zone.tables.length > 0) {
            setError('Нельзя удалить зал со столами. Сначала удалите столы.');
            return;
        }
        if (!confirm(`Удалить зал «${zone.name}»?`)) return;
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteFloorPlan"])(restaurantId, token, activeZoneId);
            removeZone(activeZoneId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось удалить зал');
        }
    }
    function handleAddTable(shape) {
        if (!activeZoneId) return;
        const zone = zones.find((z)=>z.id === activeZoneId);
        if (!zone) return;
        const index = zone.tables.length + 1;
        const isRound = shape === 'round' || shape === 'oval';
        const isSquare = shape === 'square';
        const isPolygon = shape === 'polygon';
        // Полигон по умолчанию — шестиугольник 96×96, точки в локальных координатах стола.
        const polygonPoints = isPolygon ? [
            48,
            0,
            96,
            24,
            96,
            72,
            48,
            96,
            0,
            72,
            0,
            24
        ] : undefined;
        const table = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createNewTable"])(activeZoneId, restaurantId, index, {
            shape,
            width: isRound ? 96 : isSquare ? 80 : isPolygon ? 96 : 96,
            height: isRound ? 96 : isSquare ? 80 : isPolygon ? 96 : 80,
            points: polygonPoints
        });
        addTable(activeZoneId, table);
    }
    function handleDepositSet(restId, tok, payload) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDepositScheme"])(restId, tok, payload);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fp-editor",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$Toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toolbar"], {
                onSave: ()=>void saveActiveZone(),
                saving: saving,
                onAddZone: handleAddZone,
                onRenameZone: handleRenameZone,
                onDeleteZone: handleDeleteZone,
                onAddTable: handleAddTable
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-editor__error",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                lineNumber: 194,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-editor__body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-editor__left",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$LayersPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LayersPanel"], {}, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-editor__canvas-wrap",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KonvaStage, {
                            width: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STAGE_WIDTH"],
                            height: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STAGE_HEIGHT"]
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                            lineNumber: 202,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-editor__right",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$TableInspector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableInspector"], {
                                restaurantId: restaurantId,
                                depositScheme: depositScheme
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$DecorInspector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DecorInspector"], {}, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$DepositSettingsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DepositSettingsPanel"], {
                                restaurantId: restaurantId,
                                token: token,
                                onSetDeposit: handleDepositSet
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "fp-editor__footer",
                children: [
                    saving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Сохранение…"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                        lineNumber: 217,
                        columnNumber: 20
                    }, this),
                    !saving && lastSavedAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "✓ Сохранено ",
                            new Date(lastSavedAt).toLocaleTimeString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                        lineNumber: 218,
                        columnNumber: 36
                    }, this),
                    !saving && !lastSavedAt && dirtyRef.current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "• Есть несохранённые изменения"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                        lineNumber: 219,
                        columnNumber: 57
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/features/restaurant-admin/api/booking-settings.api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchBookingSettings",
    ()=>fetchBookingSettings,
    "updateBookingSettings",
    ()=>updateBookingSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-ssr] (ecmascript)");
;
function fetchBookingSettings(restaurantId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/booking-settings`);
}
function updateBookingSettings(restaurantId, token, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/booking-settings`, {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
}),
"[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FloorPlanAdminPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/floor-plans.api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$FloorPlanEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/FloorPlanEditor.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$booking$2d$settings$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/booking-settings.api.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
function FloorPlanAdminPage() {
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((s)=>s.user);
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((s)=>s.accessToken);
    const restaurantId = user?.restaurantId;
    const loadLayout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"])((s)=>s.loadLayout);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        if (!restaurantId || !accessToken) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchFloorPlans"])(restaurantId, accessToken),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$booking$2d$settings$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBookingSettings"])(restaurantId)
        ]).then(([layout, settings])=>{
            if (cancelled) return;
            loadLayout(layout.zones);
            if (settings) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutStore"].setState({
                    depositScheme: settings.depositScheme,
                    globalDepositAmount: settings.depositAmount,
                    bookingDurationMinutes: settings.bookingDurationMinutes
                });
            }
        }).catch((err)=>{
            if (!cancelled) {
                setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось загрузить планировку');
            }
        }).finally(()=>{
            if (!cancelled) setLoading(false);
        });
        return ()=>{
            cancelled = true;
        };
    }, [
        restaurantId,
        accessToken,
        loadLayout
    ]);
    if (!restaurantId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "floor-plan-admin__notice",
            children: "Заявка ещё на модерации или ресторан не привязан к аккаунту."
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this);
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "floor-plan-admin__notice",
            children: "Загрузка конструктора планировки…"
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx",
            lineNumber: 65,
            columnNumber: 12
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "floor-plan-admin__notice floor-plan-admin__notice--error",
            children: error
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx",
            lineNumber: 69,
            columnNumber: 12
        }, this);
    }
    if (!accessToken) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "floor-plan-admin__notice",
            children: "Требуется авторизация."
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx",
            lineNumber: 73,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$FloorPlanEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FloorPlanEditor"], {
        restaurantId: restaurantId,
        token: accessToken
    }, void 0, false, {
        fileName: "[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx",
        lineNumber: 76,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=src_a4887cb6._.js.map