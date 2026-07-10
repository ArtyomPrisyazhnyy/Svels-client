(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/store/layout-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v7.js [app-client] (ecmascript) <export default as v7>");
var _s = __turbopack_context__.k.signature();
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
        var _t_positionX, _t_positionY;
        return {
            x: (_t_positionX = t.positionX) !== null && _t_positionX !== void 0 ? _t_positionX : 0,
            y: (_t_positionY = t.positionY) !== null && _t_positionY !== void 0 ? _t_positionY : 0,
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
        var _t_positionX, _t_positionY;
        return {
            kind: 'table',
            data: {
                ...t,
                positionX: ((_t_positionX = t.positionX) !== null && _t_positionX !== void 0 ? _t_positionX : 0) + dx,
                positionY: ((_t_positionY = t.positionY) !== null && _t_positionY !== void 0 ? _t_positionY : 0) + dy
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
const selectActiveZone = (s)=>{
    var _s_zones_find;
    return (_s_zones_find = s.zones.find((z)=>z.id === s.activeZoneId)) !== null && _s_zones_find !== void 0 ? _s_zones_find : null;
};
const selectActiveItems = (s)=>{
    var _zone_decorData;
    const zone = selectActiveZone(s);
    if (!zone) return [];
    var _zone_decorData_objects;
    const decor = ((_zone_decorData_objects = (_zone_decorData = zone.decorData) === null || _zone_decorData === void 0 ? void 0 : _zone_decorData.objects) !== null && _zone_decorData_objects !== void 0 ? _zone_decorData_objects : []).map((d)=>({
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
    _s();
    const zone = useLayoutStore(selectActiveZone);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useActiveItems.useMemo": ()=>{
            var _zone_decorData;
            if (!zone) return [];
            var _zone_decorData_objects;
            const decor = ((_zone_decorData_objects = (_zone_decorData = zone.decorData) === null || _zone_decorData === void 0 ? void 0 : _zone_decorData.objects) !== null && _zone_decorData_objects !== void 0 ? _zone_decorData_objects : []).map({
                "useActiveItems.useMemo.decor": (d)=>({
                        kind: 'decor',
                        data: d
                    })
            }["useActiveItems.useMemo.decor"]);
            const tables = zone.tables.map({
                "useActiveItems.useMemo.tables": (t)=>({
                        kind: 'table',
                        data: t
                    })
            }["useActiveItems.useMemo.tables"]);
            return [
                ...decor,
                ...tables
            ];
        }
    }["useActiveItems.useMemo"], [
        zone
    ]);
}
_s(useActiveItems, "g0X6Dka/QvJju8XH5hAASduMV5k=", false, function() {
    return [
        useLayoutStore
    ];
});
const useLayoutStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        zones: [],
        activeZoneId: null,
        depositScheme: 'no_deposit',
        globalDepositAmount: 0,
        bookingDurationMinutes: 120,
        mode: 'edit',
        tool: 'select',
        selectedIds: [],
        selectedSeatId: null,
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
        loadLayout: (zones)=>{
            var _zones_;
            var _zones__id;
            return set({
                zones: cloneZones(zones),
                activeZoneId: (_zones__id = (_zones_ = zones[0]) === null || _zones_ === void 0 ? void 0 : _zones_.id) !== null && _zones__id !== void 0 ? _zones__id : null,
                history: [],
                future: [],
                selectedIds: [],
                mode: 'edit'
            });
        },
        loadPublicLayout: (layout)=>{
            var _zones_;
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
            var _zones__id;
            set({
                zones,
                activeZoneId: (_zones__id = (_zones_ = zones[0]) === null || _zones_ === void 0 ? void 0 : _zones_.id) !== null && _zones__id !== void 0 ? _zones__id : null,
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
        removeZone: (zoneId)=>set((s)=>{
                var _s_zones_;
                var _s_zones__id;
                return {
                    ...recordHistory(s),
                    zones: s.zones.filter((z)=>z.id !== zoneId),
                    activeZoneId: s.activeZoneId === zoneId ? (_s_zones__id = (_s_zones_ = s.zones[0]) === null || _s_zones_ === void 0 ? void 0 : _s_zones_.id) !== null && _s_zones__id !== void 0 ? _s_zones__id : null : s.activeZoneId
                };
            }),
        setTool: (tool)=>set({
                tool
            }),
        select: (id)=>set({
                selectedIds: id ? [
                    id
                ] : [],
                selectedSeatId: null
            }),
        toggleSelection: (id)=>set((s)=>({
                    selectedIds: s.selectedIds.includes(id) ? s.selectedIds.filter((x)=>x !== id) : [
                        ...s.selectedIds,
                        id
                    ],
                    selectedSeatId: null
                })),
        selectAll: ()=>{
            const items = selectActiveItems(get());
            set({
                selectedIds: items.map((i)=>i.data.id),
                selectedSeatId: null
            });
        },
        clearSelection: ()=>set({
                selectedIds: [],
                selectedSeatId: null
            }),
        setSelectedSeatId: (seatId)=>set({
                selectedSeatId: seatId
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
                    zones: s.zones.map((z)=>{
                        var _z_decorData, _z_decorData1;
                        var _z_decorData_grid, _z_decorData_objects;
                        return z.id === zoneId ? {
                            ...z,
                            decorData: {
                                grid: (_z_decorData_grid = (_z_decorData = z.decorData) === null || _z_decorData === void 0 ? void 0 : _z_decorData.grid) !== null && _z_decorData_grid !== void 0 ? _z_decorData_grid : {
                                    size: 20,
                                    visible: true,
                                    color: '#e5e7eb'
                                },
                                objects: [
                                    ...(_z_decorData_objects = (_z_decorData1 = z.decorData) === null || _z_decorData1 === void 0 ? void 0 : _z_decorData1.objects) !== null && _z_decorData_objects !== void 0 ? _z_decorData_objects : [],
                                    {
                                        ...decor
                                    }
                                ]
                            }
                        } : z;
                    }),
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
                    const tables = z.tables.map((t)=>{
                        var _t_positionX, _t_positionY;
                        return selectedIds.includes(t.id) ? {
                            ...t,
                            positionX: ((_t_positionX = t.positionX) !== null && _t_positionX !== void 0 ? _t_positionX : 0) + dx,
                            positionY: ((_t_positionY = t.positionY) !== null && _t_positionY !== void 0 ? _t_positionY : 0) + dy
                        } : t;
                    });
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
                            var _t_positionX, _t_positionY;
                            return {
                                ...t,
                                positionX: ((_t_positionX = t.positionX) !== null && _t_positionX !== void 0 ? _t_positionX : 0) + d.dx,
                                positionY: ((_t_positionY = t.positionY) !== null && _t_positionY !== void 0 ? _t_positionY : 0) + d.dy
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
                const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
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
                    zones: s.zones.map((z)=>{
                        var _z_decorData, _z_decorData1;
                        var _z_decorData_grid, _z_decorData_objects;
                        return z.id === s.activeZoneId ? {
                            ...z,
                            decorData: {
                                grid: (_z_decorData_grid = (_z_decorData = z.decorData) === null || _z_decorData === void 0 ? void 0 : _z_decorData.grid) !== null && _z_decorData_grid !== void 0 ? _z_decorData_grid : {
                                    size: 20,
                                    visible: true,
                                    color: '#e5e7eb'
                                },
                                objects: [
                                    ...(_z_decorData_objects = (_z_decorData1 = z.decorData) === null || _z_decorData1 === void 0 ? void 0 : _z_decorData1.objects) !== null && _z_decorData_objects !== void 0 ? _z_decorData_objects : [],
                                    ...pasted
                                ]
                            }
                        } : z;
                    }),
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
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
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
            throw new Error("Unknown decor type: ".concat(type));
    }
}
function createNewTable(zoneId, restaurantId, index, defaults) {
    const now = new Date().toISOString();
    return {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])(),
        restaurantId,
        floorPlanId: zoneId,
        label: "Стол ".concat(index),
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
        cornerRadius: 6,
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
    var _zone_decorData;
    return (_zone_decorData = zone.decorData) !== null && _zone_decorData !== void 0 ? _zone_decorData : {
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
    var _zone_depositAmount;
    const zoneAmount = (_zone_depositAmount = zone === null || zone === void 0 ? void 0 : zone.depositAmount) !== null && _zone_depositAmount !== void 0 ? _zone_depositAmount : 0;
    if (scheme === 'per_zone') return zoneAmount || globalAmount;
    // per_table
    return table.depositAmount || zoneAmount || globalAmount;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurant-admin/api/floor-plans.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-client] (ecmascript)");
;
function fetchFloorPlans(restaurantId, token) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/floor-plans"), {
        token
    });
}
function createFloorPlan(restaurantId, token, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/floor-plans"), {
        method: 'POST',
        token,
        body: JSON.stringify(payload)
    });
}
function updateFloorPlan(restaurantId, token, floorPlanId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/floor-plans/").concat(floorPlanId), {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
function deleteFloorPlan(restaurantId, token, floorPlanId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/floor-plans/").concat(floorPlanId), {
        method: 'DELETE',
        token
    });
}
function saveLayout(restaurantId, token, floorPlanId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/floor-plans/").concat(floorPlanId, "/layout"), {
        method: 'PUT',
        token,
        body: JSON.stringify(payload)
    });
}
function createTable(restaurantId, token, floorPlanId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/floor-plans/").concat(floorPlanId, "/tables"), {
        method: 'POST',
        token,
        body: JSON.stringify(payload)
    });
}
function updateTable(restaurantId, token, tableId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/floor-plans/tables/").concat(tableId), {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
function deleteTable(restaurantId, token, tableId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/floor-plans/tables/").concat(tableId), {
        method: 'DELETE',
        token
    });
}
function setDepositScheme(restaurantId, token, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/booking-settings/deposit"), {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
function fetchPublicLayout(restaurantId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/floor-plans/public"));
}
function fetchTablesAvailability(restaurantId, date, time) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/tables/availability?date=").concat(encodeURIComponent(date), "&time=").concat(encodeURIComponent(time)));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/actions/data:0f6329 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40e63319c1430a1f9736cdfbfd5ee1c7064ae9cdc8":"revalidateRestaurantPublicPage"},"src/features/restaurants/actions/revalidate-restaurant-public-page.action.ts",""] */ __turbopack_context__.s([
    "revalidateRestaurantPublicPage",
    ()=>revalidateRestaurantPublicPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var revalidateRestaurantPublicPage = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40e63319c1430a1f9736cdfbfd5ee1c7064ae9cdc8", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "revalidateRestaurantPublicPage"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcmV2YWxpZGF0ZS1yZXN0YXVyYW50LXB1YmxpYy1wYWdlLmFjdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5cbmltcG9ydCB7IHJldmFsaWRhdGVSZXN0YXVyYW50UHVibGljUGFnZUNhY2hlIH0gZnJvbSAnQC9zaGFyZWQvY2FjaGUvcmV2YWxpZGF0ZS1yZXN0YXVyYW50LXB1YmxpYy1wYWdlJztcblxuZXhwb3J0IGludGVyZmFjZSBSZXZhbGlkYXRlUmVzdGF1cmFudFB1YmxpY1BhZ2VSZXN1bHQge1xuICBvazogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJldmFsaWRhdGVSZXN0YXVyYW50UHVibGljUGFnZShcbiAgcmVzdGF1cmFudElkOiBzdHJpbmcsXG4pOiBQcm9taXNlPFJldmFsaWRhdGVSZXN0YXVyYW50UHVibGljUGFnZVJlc3VsdD4ge1xuICBpZiAoIXJlc3RhdXJhbnRJZCkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSB9O1xuICB9XG5cbiAgcmV2YWxpZGF0ZVJlc3RhdXJhbnRQdWJsaWNQYWdlQ2FjaGUocmVzdGF1cmFudElkKTtcbiAgcmV0dXJuIHsgb2s6IHRydWUgfTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoib1dBUXNCIn0=
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    "SEAT_DEFAULT_SLOTS",
    ()=>SEAT_DEFAULT_SLOTS,
    "SEAT_SLOT_WIDTH",
    ()=>SEAT_SLOT_WIDTH,
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
const SEAT_SLOT_WIDTH = 26;
const SEAT_DEFAULT_SLOTS = {
    chair: 1,
    stool: 1,
    couch: 2,
    bench: 2
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
        return "".concat(String(d.getHours()).padStart(2, '0'), ":").concat(String(d.getMinutes()).padStart(2, '0'));
    } catch (e) {
        return '';
    }
}
function todayIso() {
    return new Date().toISOString().slice(0, 10);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DepositSettingsPanel",
    ()=>DepositSettingsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function DepositSettingsPanel(param) {
    let { restaurantId, token, onSetDeposit } = param;
    _s();
    const scheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "DepositSettingsPanel.useLayoutStore[scheme]": (s)=>s.depositScheme
    }["DepositSettingsPanel.useLayoutStore[scheme]"]);
    const globalAmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "DepositSettingsPanel.useLayoutStore[globalAmount]": (s)=>s.globalDepositAmount
    }["DepositSettingsPanel.useLayoutStore[globalAmount]"]);
    const zones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "DepositSettingsPanel.useLayoutStore[zones]": (s)=>s.zones
    }["DepositSettingsPanel.useLayoutStore[zones]"]);
    const updateZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "DepositSettingsPanel.useLayoutStore[updateZone]": (s)=>s.updateZone
    }["DepositSettingsPanel.useLayoutStore[updateZone]"]);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleSchemeChange(newScheme) {
        setSaving(true);
        setSaved(false);
        try {
            await onSetDeposit(restaurantId, token, {
                scheme: newScheme,
                amount: globalAmount
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"].setState({
                depositScheme: newScheme
            });
            setSaved(true);
            setTimeout(()=>setSaved(false), 1500);
        } finally{
            setSaving(false);
        }
    }
    async function handleGlobalAmountChange(amount) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"].setState({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "fp-deposit",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "fp-deposit__title",
                children: "Депозиты за бронирование"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-deposit__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Схема депозита"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: scheme,
                        disabled: saving,
                        onChange: (e)=>void handleSchemeChange(e.target.value),
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEPOSIT_SCHEMES"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
            scheme === 'global_deposit' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-deposit__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Глобальная сумма (BYN)"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            scheme === 'per_zone' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-deposit__zones",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "fp-deposit__hint",
                        children: "Депозит для каждой зоны:"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this),
                    zones.map((z)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "fp-deposit__field",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: z.name
                                }, void 0, false, {
                                    fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                                    lineNumber: 84,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            scheme === 'per_table' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-deposit__hint",
                children: "Депозит настраивается индивидуально для каждого стола в панели свойств стола. Если у стола 0 — наследует зону или глобальную сумму."
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 98,
                columnNumber: 9
            }, this),
            scheme === 'no_deposit' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-deposit__hint",
                children: "Депозит не требуется при бронировании."
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 105,
                columnNumber: 9
            }, this),
            saved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-deposit__saved",
                children: "✓ Сохранено"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx",
                lineNumber: 108,
                columnNumber: 17
            }, this),
            saving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s(DepositSettingsPanel, "R9oByQlAnevSzQAXV2unxaXAKwM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"]
    ];
});
_c = DepositSettingsPanel;
var _c;
__turbopack_context__.k.register(_c, "DepositSettingsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/DecorInspector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DecorInspector",
    ()=>DecorInspector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function DecorInspector() {
    _s();
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "DecorInspector.useLayoutStore[selectedIds]": (s)=>s.selectedIds
    }["DecorInspector.useLayoutStore[selectedIds]"]);
    const activeZoneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "DecorInspector.useLayoutStore[activeZoneId]": (s)=>s.activeZoneId
    }["DecorInspector.useLayoutStore[activeZoneId]"]);
    const updateDecor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "DecorInspector.useLayoutStore[updateDecor]": (s)=>s.updateDecor
    }["DecorInspector.useLayoutStore[updateDecor]"]);
    const removeDecor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "DecorInspector.useLayoutStore[removeDecor]": (s)=>s.removeDecor
    }["DecorInspector.useLayoutStore[removeDecor]"]);
    const decor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "DecorInspector.useLayoutStore[decor]": (s)=>{
            var _zone_decorData;
            if (selectedIds.length !== 1 || !s.activeZoneId) return null;
            const zone = s.zones.find({
                "DecorInspector.useLayoutStore[decor].zone": (z)=>z.id === s.activeZoneId
            }["DecorInspector.useLayoutStore[decor].zone"]);
            var _zone_decorData_objects_find;
            return (_zone_decorData_objects_find = zone === null || zone === void 0 ? void 0 : (_zone_decorData = zone.decorData) === null || _zone_decorData === void 0 ? void 0 : _zone_decorData.objects.find({
                "DecorInspector.useLayoutStore[decor]": (o)=>o.id === selectedIds[0]
            }["DecorInspector.useLayoutStore[decor]"])) !== null && _zone_decorData_objects_find !== void 0 ? _zone_decorData_objects_find : null;
        }
    }["DecorInspector.useLayoutStore[decor]"]);
    if (!decor || !activeZoneId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: "fp-inspector fp-inspector--empty",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
    var _pointBased_tension, _pointBased_tension1, _pointBased_cornerRadius, _pointBased_cornerRadius1, _decor_color;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "fp-inspector",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "fp-inspector__title",
                children: [
                    decor.type === 'line' && 'Линия (стена)',
                    decor.type === 'polyline' && 'Ломаная (стена)',
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
            (isPolyline || isZone) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-inspector__help",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Скругление:"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this),
                    " «Скругление углов» — закруглённые углы стен и барных стоек. «Сглаживание» — плавная дуга через точки (полукруглые перегородки)."
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this),
            isPolyline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-inspector__hint",
                children: "Для стен используйте «Ломаная» с 3+ точками, затем скруглите углы."
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, this),
            isPointBased && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Цвет контура"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: isZone ? decor.stroke : decor.color,
                                onChange: (e)=>patch(isZone ? {
                                        stroke: e.target.value
                                    } : {
                                        color: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Толщина (",
                                    decor.strokeWidth,
                                    "px)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this),
                    (isPolyline || isZone) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "fp-inspector__field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Сглаживание (сплайн): ",
                                            ((_pointBased_tension = pointBased.tension) !== null && _pointBased_tension !== void 0 ? _pointBased_tension : 0).toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 104,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 0,
                                        max: 0.6,
                                        step: 0.05,
                                        value: (_pointBased_tension1 = pointBased.tension) !== null && _pointBased_tension1 !== void 0 ? _pointBased_tension1 : 0,
                                        onChange: (e)=>patch({
                                                tension: Number(e.target.value)
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 105,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        className: "fp-inspector__hint",
                                        children: "0 — прямые сегменты, >0 — плавная кривая через точки"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 113,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 103,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "fp-inspector__field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Скругление углов: ",
                                            (_pointBased_cornerRadius = pointBased.cornerRadius) !== null && _pointBased_cornerRadius !== void 0 ? _pointBased_cornerRadius : 0,
                                            "px"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 117,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 0,
                                        max: 80,
                                        step: 1,
                                        value: (_pointBased_cornerRadius1 = pointBased.cornerRadius) !== null && _pointBased_cornerRadius1 !== void 0 ? _pointBased_cornerRadius1 : 0,
                                        onChange: (e)=>patch({
                                                cornerRadius: Number(e.target.value)
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        className: "fp-inspector__hint",
                                        children: "Закруглённые стены, барные стойки с поворотами"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                        lineNumber: 126,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 116,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    isZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Заливка"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 133,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: decor.fill,
                                onChange: (e)=>patch({
                                        fill: e.target.value
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
                    }, this),
                    isPolyline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field fp-inspector__field--row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Замкнуть"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 144,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: decor.closed,
                                onChange: (e)=>patch({
                                        closed: e.target.checked
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 145,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 143,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true),
            decor.type === 'text' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Текст"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: decor.text,
                                maxLength: 120,
                                onChange: (e)=>patch({
                                        text: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 157,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Размер шрифта (",
                                    decor.fontSize,
                                    "px)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                lineNumber: 168,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 166,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Цвет"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 178,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: decor.color,
                                onChange: (e)=>patch({
                                        color: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 177,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            decor.type === 'shape' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Заливка"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 187,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: decor.fill,
                                onChange: (e)=>patch({
                                        fill: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 186,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Контур"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: decor.stroke,
                                onChange: (e)=>patch({
                                        stroke: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 190,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Толщина (",
                                    decor.strokeWidth,
                                    "px)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                lineNumber: 196,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            decor.type === 'decor-icon' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Фон"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "color",
                        value: (_decor_color = decor.color) !== null && _decor_color !== void 0 ? _decor_color : '#f3f4f6',
                        onChange: (e)=>patch({
                                color: e.target.value
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                lineNumber: 209,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "fp-inspector__delete",
                onClick: ()=>removeDecor(activeZoneId, decor.id),
                children: "Удалить элемент"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-inspector__id",
                children: [
                    "ID: ",
                    decor.id.slice(0, 8),
                    "…"
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/floor-plan/components/DecorInspector.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(DecorInspector, "QN9E9fYqqFMCeenrWY3iMvffMGo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"]
    ];
});
_c = DecorInspector;
var _c;
__turbopack_context__.k.register(_c, "DecorInspector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/types/floor-plan.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SEAT_KINDS",
    ()=>SEAT_KINDS
]);
const SEAT_KINDS = [
    {
        value: 'chair',
        label: 'Стул'
    },
    {
        value: 'stool',
        label: 'Табурет'
    },
    {
        value: 'couch',
        label: 'Диван'
    },
    {
        value: 'bench',
        label: 'Скамейка'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/TableInspector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TableInspector",
    ()=>TableInspector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v7.js [app-client] (ecmascript) <export default as v7>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$floor$2d$plan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/floor-plan.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function TableInspector(param) {
    let { restaurantId, depositScheme } = param;
    var _table_seats, _table_seats1;
    _s();
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "TableInspector.useLayoutStore[selectedIds]": (s)=>s.selectedIds
    }["TableInspector.useLayoutStore[selectedIds]"]);
    const zones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "TableInspector.useLayoutStore[zones]": (s)=>s.zones
    }["TableInspector.useLayoutStore[zones]"]);
    const activeZoneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "TableInspector.useLayoutStore[activeZoneId]": (s)=>s.activeZoneId
    }["TableInspector.useLayoutStore[activeZoneId]"]);
    const updateTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "TableInspector.useLayoutStore[updateTable]": (s)=>s.updateTable
    }["TableInspector.useLayoutStore[updateTable]"]);
    const removeTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "TableInspector.useLayoutStore[removeTable]": (s)=>s.removeTable
    }["TableInspector.useLayoutStore[removeTable]"]);
    const selectedSeatId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "TableInspector.useLayoutStore[selectedSeatId]": (s)=>s.selectedSeatId
    }["TableInspector.useLayoutStore[selectedSeatId]"]);
    const setSelectedSeatId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "TableInspector.useLayoutStore[setSelectedSeatId]": (s)=>s.setSelectedSeatId
    }["TableInspector.useLayoutStore[setSelectedSeatId]"]);
    const table = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "TableInspector.useLayoutStore[table]": (s)=>{
            if (selectedIds.length !== 1) return null;
            const zone = s.zones.find({
                "TableInspector.useLayoutStore[table].zone": (z)=>z.id === s.activeZoneId
            }["TableInspector.useLayoutStore[table].zone"]);
            var _zone_tables_find;
            return (_zone_tables_find = zone === null || zone === void 0 ? void 0 : zone.tables.find({
                "TableInspector.useLayoutStore[table]": (t)=>t.id === selectedIds[0]
            }["TableInspector.useLayoutStore[table]"])) !== null && _zone_tables_find !== void 0 ? _zone_tables_find : null;
        }
    }["TableInspector.useLayoutStore[table]"]);
    if (!table || !activeZoneId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: "fp-inspector fp-inspector--empty",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Выберите стол, чтобы редактировать его свойства."
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, this);
    }
    function patch(p) {
        updateTable(table.id, p);
    }
    function addSeat(kind) {
        var _table_seats;
        const seats = [
            ...(_table_seats = table.seats) !== null && _table_seats !== void 0 ? _table_seats : []
        ];
        const w = table.width;
        const h = table.height;
        const idx = seats.length;
        const cx = w / 2 + (idx % 6 - 2.5) * 28;
        const cy = h + 28 + Math.floor(idx / 6) * 28;
        const slots = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_DEFAULT_SLOTS"][kind];
        const seat = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])(),
            kind,
            x: Math.round(cx),
            y: Math.round(cy),
            rotation: 0,
            slots,
            width: kind === 'couch' || kind === 'bench' ? slots * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_SLOT_WIDTH"] : undefined
        };
        seats.push(seat);
        patch({
            seats
        });
        setSelectedSeatId(seat.id);
    }
    function updateSeat(seatId, p) {
        var _table_seats;
        const seats = ((_table_seats = table.seats) !== null && _table_seats !== void 0 ? _table_seats : []).map((s)=>s.id === seatId ? {
                ...s,
                ...p
            } : s);
        patch({
            seats
        });
    }
    function removeSeat(seatId) {
        var _table_seats;
        const seats = ((_table_seats = table.seats) !== null && _table_seats !== void 0 ? _table_seats : []).filter((s)=>s.id !== seatId);
        patch({
            seats
        });
    }
    const zone = zones.find((z)=>z.id === activeZoneId);
    const showDepositField = depositScheme === 'per_table';
    const showCornerRadius = table.shape === 'rectangle' || table.shape === 'square';
    var _table_seats_find;
    const activeSeat = (_table_seats_find = (_table_seats = table.seats) === null || _table_seats === void 0 ? void 0 : _table_seats.find((s)=>s.id === selectedSeatId)) !== null && _table_seats_find !== void 0 ? _table_seats_find : null;
    var _zone_depositAmount, _table_description, _table_seats_length, _activeSeat_rotation, _activeSeat_slots, _activeSeat_slots1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "fp-inspector",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "fp-inspector__title",
                children: [
                    "Стол ",
                    table.label
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Название / номер"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: table.label,
                        maxLength: 60,
                        onChange: (e)=>patch({
                                label: e.target.value
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Тип объекта"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: table.objectType,
                        onChange: (e)=>patch({
                                objectType: e.target.value
                            }),
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_OBJECT_TYPES"].map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: o.value,
                                children: o.label
                            }, o.value, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Форма"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: table.shape,
                        onChange: (e)=>patch({
                                shape: e.target.value
                            }),
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_SHAPES"].map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: o.value,
                                children: o.label
                            }, o.value, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-inspector__row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Мин. мест"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                min: 1,
                                max: 50,
                                value: table.minCapacity,
                                onChange: (e)=>patch({
                                        minCapacity: Number(e.target.value)
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "fp-inspector__field",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Макс. мест"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                min: 1,
                                max: 50,
                                value: table.capacity,
                                onChange: (e)=>patch({
                                        capacity: Number(e.target.value)
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Поворот (°)"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        min: 0,
                        max: 359,
                        value: Math.round(table.rotation),
                        onChange: (e)=>patch({
                                rotation: Number(e.target.value)
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            showCornerRadius && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "Скругление углов: ",
                            table.cornerRadius,
                            "px"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: 0,
                        max: 40,
                        step: 1,
                        value: table.cornerRadius,
                        onChange: (e)=>patch({
                                cornerRadius: Number(e.target.value)
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 151,
                columnNumber: 9
            }, this),
            showDepositField && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Депозит за стол (BYN)"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 166,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "number",
                        min: 0,
                        step: 0.5,
                        value: table.depositAmount,
                        onChange: (e)=>patch({
                                depositAmount: Number(e.target.value)
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                        className: "fp-inspector__hint",
                        children: [
                            "0 = наследует зону (",
                            (_zone_depositAmount = zone === null || zone === void 0 ? void 0 : zone.depositAmount) !== null && _zone_depositAmount !== void 0 ? _zone_depositAmount : 0,
                            " BYN)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 165,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Описание (необязательно)"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: (_table_description = table.description) !== null && _table_description !== void 0 ? _table_description : '',
                        maxLength: 500,
                        onChange: (e)=>patch({
                                description: e.target.value || null
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-inspector__seats",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-inspector__seats-title",
                        children: "Места вокруг стола"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-inspector__seats-add",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$floor$2d$plan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_KINDS"].map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "fp-inspector__seats-add-btn",
                                onClick: ()=>addSeat(k.value),
                                children: [
                                    "+ ",
                                    k.label
                                ]
                            }, k.value, true, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    ((_table_seats_length = (_table_seats1 = table.seats) === null || _table_seats1 === void 0 ? void 0 : _table_seats1.length) !== null && _table_seats_length !== void 0 ? _table_seats_length : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "fp-inspector__seats-list",
                        children: table.seats.map((seat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: selectedSeatId === seat.id ? 'fp-inspector__seats-item fp-inspector__seats-item--active' : 'fp-inspector__seats-item',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "fp-inspector__seats-select",
                                        onClick: ()=>setSelectedSeatId(seat.id),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "fp-inspector__seats-index",
                                                children: i + 1
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                                lineNumber: 213,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: seat.kind,
                                                onClick: (e)=>e.stopPropagation(),
                                                onChange: (e)=>{
                                                    const kind = e.target.value;
                                                    const slots = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_DEFAULT_SLOTS"][kind];
                                                    updateSeat(seat.id, {
                                                        kind,
                                                        slots,
                                                        width: kind === 'couch' || kind === 'bench' ? slots * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_SLOT_WIDTH"] : undefined
                                                    });
                                                },
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$floor$2d$plan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_KINDS"].map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: k.value,
                                                        children: k.label
                                                    }, k.value, false, {
                                                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                                lineNumber: 214,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                        lineNumber: 208,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "fp-inspector__seats-del",
                                        onClick: ()=>{
                                            removeSeat(seat.id);
                                            if (selectedSeatId === seat.id) setSelectedSeatId(null);
                                        },
                                        title: "Удалить место",
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                        lineNumber: 232,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, seat.id, true, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 204,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "fp-inspector__hint",
                        children: "Нет мест. Кликните по месту на столе для поворота и изменения размера."
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, this),
                    activeSeat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-inspector__seat-detail",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "fp-inspector__seat-detail-title",
                                children: "Выбранное место"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 252,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "fp-inspector__field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Поворот (°)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 0,
                                        max: 359,
                                        value: Math.round((_activeSeat_rotation = activeSeat.rotation) !== null && _activeSeat_rotation !== void 0 ? _activeSeat_rotation : 0),
                                        onChange: (e)=>updateSeat(activeSeat.id, {
                                                rotation: Number(e.target.value)
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 253,
                                columnNumber: 13
                            }, this),
                            (activeSeat.kind === 'couch' || activeSeat.kind === 'bench') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "fp-inspector__field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Кол-во мест: ",
                                            (_activeSeat_slots = activeSeat.slots) !== null && _activeSeat_slots !== void 0 ? _activeSeat_slots : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_DEFAULT_SLOTS"][activeSeat.kind]
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                        lineNumber: 265,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 1,
                                        max: 8,
                                        step: 1,
                                        value: (_activeSeat_slots1 = activeSeat.slots) !== null && _activeSeat_slots1 !== void 0 ? _activeSeat_slots1 : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_DEFAULT_SLOTS"][activeSeat.kind],
                                        onChange: (e)=>{
                                            const slots = Number(e.target.value);
                                            updateSeat(activeSeat.id, {
                                                slots,
                                                width: slots * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEAT_SLOT_WIDTH"]
                                            });
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                        lineNumber: 266,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        className: "fp-inspector__hint",
                                        children: "Или потяните боковые якоря на холсте"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                        lineNumber: 277,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                                lineNumber: 264,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 251,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field fp-inspector__field--row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Доступен для брони"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        checked: table.isActive,
                        onChange: (e)=>patch({
                                isActive: e.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 284,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "fp-inspector__field fp-inspector__field--row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Виден гостям"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        checked: table.visibleToGuests,
                        onChange: (e)=>patch({
                                visibleToGuests: e.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "fp-inspector__delete",
                onClick: ()=>{
                    if (confirm("Удалить стол «".concat(table.label, "» полностью?"))) {
                        removeTable(table.id);
                    }
                },
                children: "Удалить стол"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                lineNumber: 314,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/floor-plan/components/TableInspector.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(TableInspector, "6nYd2hig5JZsaXxzBGBbHJ0ttpU=", false, function() {
    return [
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
_c = TableInspector;
var _c;
__turbopack_context__.k.register(_c, "TableInspector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/RightInspectorPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RightInspectorPanel",
    ()=>RightInspectorPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$DecorInspector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/DecorInspector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$TableInspector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/TableInspector.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function RightInspectorPanel(param) {
    let { restaurantId, depositScheme } = param;
    var _zone_decorData;
    _s();
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "RightInspectorPanel.useLayoutStore[selectedIds]": (s)=>s.selectedIds
    }["RightInspectorPanel.useLayoutStore[selectedIds]"]);
    const activeZoneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "RightInspectorPanel.useLayoutStore[activeZoneId]": (s)=>s.activeZoneId
    }["RightInspectorPanel.useLayoutStore[activeZoneId]"]);
    const zones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "RightInspectorPanel.useLayoutStore[zones]": (s)=>s.zones
    }["RightInspectorPanel.useLayoutStore[zones]"]);
    if (selectedIds.length !== 1 || !activeZoneId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: "fp-inspector fp-inspector--empty",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Выберите объект на холсте или в панели «Слои»."
                }, void 0, false, {
                    fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fp-inspector__help",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Скругления"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                lineNumber: 23,
                                columnNumber: 14
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                            lineNumber: 23,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Стены"
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                            lineNumber: 25,
                                            columnNumber: 17
                                        }, this),
                                        " — инструмент «Ломаная», затем в инспекторе: «Скругление углов»"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                    lineNumber: 25,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Зоны"
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                            lineNumber: 26,
                                            columnNumber: 17
                                        }, this),
                                        " — инструмент «Зона», затем «Скругление углов» или «Сглаживание»"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                    lineNumber: 26,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Столы"
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                            lineNumber: 27,
                                            columnNumber: 17
                                        }, this),
                                        " — выделить стол → «Скругление углов» (прямоугольные)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                    lineNumber: 27,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Круглый стол"
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                            lineNumber: 28,
                                            columnNumber: 17
                                        }, this),
                                        " — форма «Круглый» при добавлении"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                    lineNumber: 28,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Места (стулья/диваны)"
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                lineNumber: 30,
                                columnNumber: 14
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "Выделить стол → «+ Диван» → кликнуть по дивану на столе"
                                }, void 0, false, {
                                    fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                    lineNumber: 32,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "Поворот — якорь над рамкой или поле «Поворот»"
                                }, void 0, false, {
                                    fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "3 места на диване — ползунок «Кол-во мест» или боковые якоря"
                                }, void 0, false, {
                                    fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this);
    }
    const id = selectedIds[0];
    const zone = zones.find((z)=>z.id === activeZoneId);
    var _zone_tables_some;
    const isTable = (_zone_tables_some = zone === null || zone === void 0 ? void 0 : zone.tables.some((t)=>t.id === id)) !== null && _zone_tables_some !== void 0 ? _zone_tables_some : false;
    var _zone_decorData_objects_some;
    const isDecor = (_zone_decorData_objects_some = zone === null || zone === void 0 ? void 0 : (_zone_decorData = zone.decorData) === null || _zone_decorData === void 0 ? void 0 : _zone_decorData.objects.some((d)=>d.id === id)) !== null && _zone_decorData_objects_some !== void 0 ? _zone_decorData_objects_some : false;
    if (isTable) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$TableInspector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableInspector"], {
            restaurantId: restaurantId,
            depositScheme: depositScheme
        }, void 0, false, {
            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
            lineNumber: 47,
            columnNumber: 12
        }, this);
    }
    if (isDecor) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$DecorInspector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecorInspector"], {}, void 0, false, {
            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
            lineNumber: 50,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "fp-inspector fp-inspector--empty",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "Объект не найден в активном зале."
        }, void 0, false, {
            fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/features/floor-plan/components/RightInspectorPanel.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s(RightInspectorPanel, "BNTFDdMt3D4dK9YgSiuA767zpm8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"]
    ];
});
_c = RightInspectorPanel;
var _c;
__turbopack_context__.k.register(_c, "RightInspectorPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/LayersPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LayersPanel",
    ()=>LayersPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function LayersPanel(param) {
    let { collapsed } = param;
    _s();
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActiveItems"])();
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "LayersPanel.useLayoutStore[selectedIds]": (s)=>s.selectedIds
    }["LayersPanel.useLayoutStore[selectedIds]"]);
    const select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "LayersPanel.useLayoutStore[select]": (s)=>s.select
    }["LayersPanel.useLayoutStore[select]"]);
    const bringToFront = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "LayersPanel.useLayoutStore[bringToFront]": (s)=>s.bringToFront
    }["LayersPanel.useLayoutStore[bringToFront]"]);
    const sendToBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "LayersPanel.useLayoutStore[sendToBack]": (s)=>s.sendToBack
    }["LayersPanel.useLayoutStore[sendToBack]"]);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fp-layers",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "fp-layers__title",
                children: "Слои"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LayerGroup, {
                title: "Столы",
                entries: tables,
                selectedIds: selectedIds,
                onSelect: select
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LayerGroup, {
                title: "Декор",
                entries: decor,
                selectedIds: selectedIds,
                onSelect: select
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-layers__hint",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Ctrl+] — выше слоем"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Ctrl+[ — ниже слоем"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            selectedIds.length === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-layers__reorder",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>bringToFront(selectedIds[0]),
                        children: "Наверх"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(LayersPanel, "uUFZTrYUavP3uJ7t7nF9lCQbU/8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActiveItems"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"]
    ];
});
_c = LayersPanel;
function LayerGroup(param) {
    let { title, entries, selectedIds, onSelect } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fp-layers__group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            entries.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-layers__empty",
                children: "— пусто —"
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                lineNumber: 67,
                columnNumber: 32
            }, this),
            entries.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: selectedIds.includes(e.id) ? 'fp-layers__item fp-layers__item--active' : 'fp-layers__item',
                    onClick: ()=>onSelect(e.id),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "fp-layers__item-icon",
                            children: iconFor(e)
                        }, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/LayersPanel.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_c1 = LayerGroup;
function decorLabel(d) {
    switch(d.type){
        case 'line':
            return 'Линия';
        case 'polyline':
            return 'Ломаная';
        case 'zone':
            return 'Зона';
        case 'shape':
            return "Фигура (".concat(d.shape, ")");
        case 'text':
            return "Текст: ".concat(d.text.slice(0, 16));
        case 'decor-icon':
            return "Декор: ".concat(d.icon);
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
var _c, _c1;
__turbopack_context__.k.register(_c, "LayersPanel");
__turbopack_context__.k.register(_c1, "LayerGroup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/Toolbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toolbar",
    ()=>Toolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Toolbar(param) {
    let { onSave, saving, canSave, onAddZone, onRenameZone, onDeleteZone, onAddTable } = param;
    _s();
    const zones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[zones]": (s)=>s.zones
    }["Toolbar.useLayoutStore[zones]"]);
    const activeZoneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[activeZoneId]": (s)=>s.activeZoneId
    }["Toolbar.useLayoutStore[activeZoneId]"]);
    const setActiveZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[setActiveZone]": (s)=>s.setActiveZone
    }["Toolbar.useLayoutStore[setActiveZone]"]);
    const tool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[tool]": (s)=>s.tool
    }["Toolbar.useLayoutStore[tool]"]);
    const setTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[setTool]": (s)=>s.setTool
    }["Toolbar.useLayoutStore[setTool]"]);
    const zoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[zoom]": (s)=>s.zoom
    }["Toolbar.useLayoutStore[zoom]"]);
    const setZoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[setZoom]": (s)=>s.setZoom
    }["Toolbar.useLayoutStore[setZoom]"]);
    const setPan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[setPan]": (s)=>s.setPan
    }["Toolbar.useLayoutStore[setPan]"]);
    const undo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[undo]": (s)=>s.undo
    }["Toolbar.useLayoutStore[undo]"]);
    const redo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[redo]": (s)=>s.redo
    }["Toolbar.useLayoutStore[redo]"]);
    const historyLen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[historyLen]": (s)=>s.history.length
    }["Toolbar.useLayoutStore[historyLen]"]);
    const futureLen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[futureLen]": (s)=>s.future.length
    }["Toolbar.useLayoutStore[futureLen]"]);
    const toggleGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[toggleGrid]": (s)=>s.toggleGrid
    }["Toolbar.useLayoutStore[toggleGrid]"]);
    const gridVisible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "Toolbar.useLayoutStore[gridVisible]": (s)=>s.gridVisible
    }["Toolbar.useLayoutStore[gridVisible]"]);
    const [zoneMenuOpen, setZoneMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tableMenuOpen, setTableMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    var _zones_find;
    const activeZone = (_zones_find = zones.find((z)=>z.id === activeZoneId)) !== null && _zones_find !== void 0 ? _zones_find : null;
    var _activeZone_name;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fp-toolbar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__zones",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "fp-toolbar__zone-btn",
                        onClick: ()=>setZoneMenuOpen((v)=>!v),
                        title: "Выбрать зал",
                        children: [
                            (_activeZone_name = activeZone === null || activeZone === void 0 ? void 0 : activeZone.name) !== null && _activeZone_name !== void 0 ? _activeZone_name : 'Зал не выбран',
                            " ▾"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    zoneMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-toolbar__zone-menu",
                        children: [
                            zones.map((z)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fp-toolbar__zone-actions",
                                children: [
                                    onRenameZone && activeZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    onDeleteZone && activeZone && zones.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    onAddZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__add",
                children: onAddTable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fp-toolbar__add-table",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                        tableMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fp-toolbar__table-menu",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TABLE_SHAPES"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__tools",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOOLS"].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: tool === t.value ? 'fp-toolbar__tool fp-toolbar__tool--active' : 'fp-toolbar__tool',
                        onClick: ()=>setTool(t.value),
                        title: t.label,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "fp-toolbar__tool-icon",
                                children: t.icon
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__history",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__view",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setZoom(Math.max(0.2, zoom / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZOOM_STEP"])),
                        title: "Уменьшить",
                        children: "−"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setZoom(Math.min(3, zoom * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZOOM_STEP"])),
                        title: "Увеличить",
                        children: "+"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/Toolbar.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            onSave && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-toolbar__group fp-toolbar__save",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(Toolbar, "uOMrQnGM1uzurEc/LXFyhet/pJg=", false, function() {
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"]
    ];
});
_c = Toolbar;
var _c;
__turbopack_context__.k.register(_c, "Toolbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/useHotkeys.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useHotkeys",
    ()=>useHotkeys
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useHotkeys(param) {
    let { onSave, canSave } = param;
    _s();
    const selectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[selectAll]": (s)=>s.selectAll
    }["useHotkeys.useLayoutStore[selectAll]"]);
    const clearSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[clearSelection]": (s)=>s.clearSelection
    }["useHotkeys.useLayoutStore[clearSelection]"]);
    const deleteSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[deleteSelection]": (s)=>s.deleteSelection
    }["useHotkeys.useLayoutStore[deleteSelection]"]);
    const copySelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[copySelection]": (s)=>s.copySelection
    }["useHotkeys.useLayoutStore[copySelection]"]);
    const pasteSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[pasteSelection]": (s)=>s.pasteSelection
    }["useHotkeys.useLayoutStore[pasteSelection]"]);
    const duplicateSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[duplicateSelection]": (s)=>s.duplicateSelection
    }["useHotkeys.useLayoutStore[duplicateSelection]"]);
    const undo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[undo]": (s)=>s.undo
    }["useHotkeys.useLayoutStore[undo]"]);
    const redo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[redo]": (s)=>s.redo
    }["useHotkeys.useLayoutStore[redo]"]);
    const moveSelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[moveSelected]": (s)=>s.moveSelected
    }["useHotkeys.useLayoutStore[moveSelected]"]);
    const bringForward = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[bringForward]": (s)=>s.bringForward
    }["useHotkeys.useLayoutStore[bringForward]"]);
    const sendBackward = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[sendBackward]": (s)=>s.sendBackward
    }["useHotkeys.useLayoutStore[sendBackward]"]);
    const bringToFront = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[bringToFront]": (s)=>s.bringToFront
    }["useHotkeys.useLayoutStore[bringToFront]"]);
    const sendToBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[sendToBack]": (s)=>s.sendToBack
    }["useHotkeys.useLayoutStore[sendToBack]"]);
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[selectedIds]": (s)=>s.selectedIds
    }["useHotkeys.useLayoutStore[selectedIds]"]);
    const setTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "useHotkeys.useLayoutStore[setTool]": (s)=>s.setTool
    }["useHotkeys.useLayoutStore[setTool]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useHotkeys.useEffect": ()=>{
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
                    if (canSave !== false) onSave === null || onSave === void 0 ? void 0 : onSave();
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
            return ({
                "useHotkeys.useEffect": ()=>window.removeEventListener('keydown', handler)
            })["useHotkeys.useEffect"];
        }
    }["useHotkeys.useEffect"], [
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
_s(useHotkeys, "hU3+ZWzKBGa5XEBhbf8OaRhWwsc=", false, function() {
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/floor-plan/components/FloorPlanEditor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloorPlanEditor",
    ()=>FloorPlanEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/floor-plans.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/features/restaurants/actions/data:0f6329 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$DepositSettingsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/DepositSettingsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$RightInspectorPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/RightInspectorPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$LayersPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/LayersPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$Toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/Toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$useHotkeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/useHotkeys.ts [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
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
// Konva требует `window` — отключаем SSR для Stage.
const KonvaStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/features/floor-plan/components/KonvaStage.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((m)=>m.KonvaStage), {
    loadableGenerated: {
        modules: [
            "[project]/src/features/floor-plan/components/KonvaStage.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fp-editor__canvas-loading",
            children: "Загрузка холста…"
        }, void 0, false, {
            fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
            lineNumber: 26,
            columnNumber: 32
        }, ("TURBOPACK compile-time value", void 0))
});
_c = KonvaStage;
function FloorPlanEditor(param) {
    let { restaurantId, token } = param;
    _s();
    const zones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "FloorPlanEditor.useLayoutStore[zones]": (s)=>s.zones
    }["FloorPlanEditor.useLayoutStore[zones]"]);
    const activeZoneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "FloorPlanEditor.useLayoutStore[activeZoneId]": (s)=>s.activeZoneId
    }["FloorPlanEditor.useLayoutStore[activeZoneId]"]);
    const depositScheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "FloorPlanEditor.useLayoutStore[depositScheme]": (s)=>s.depositScheme
    }["FloorPlanEditor.useLayoutStore[depositScheme]"]);
    const loadLayout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "FloorPlanEditor.useLayoutStore[loadLayout]": (s)=>s.loadLayout
    }["FloorPlanEditor.useLayoutStore[loadLayout]"]);
    const addZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "FloorPlanEditor.useLayoutStore[addZone]": (s)=>s.addZone
    }["FloorPlanEditor.useLayoutStore[addZone]"]);
    const updateZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "FloorPlanEditor.useLayoutStore[updateZone]": (s)=>s.updateZone
    }["FloorPlanEditor.useLayoutStore[updateZone]"]);
    const removeZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "FloorPlanEditor.useLayoutStore[removeZone]": (s)=>s.removeZone
    }["FloorPlanEditor.useLayoutStore[removeZone]"]);
    const addTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "FloorPlanEditor.useLayoutStore[addTable]": (s)=>s.addTable
    }["FloorPlanEditor.useLayoutStore[addTable]"]);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastSavedAt, setLastSavedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const autoSaveTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dirtyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Подписка на изменения зон для auto-save
    const zonesJson = JSON.stringify(zones);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloorPlanEditor.useEffect": ()=>{
            if (!activeZoneId || zones.length === 0) return;
            dirtyRef.current = true;
            if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
            autoSaveTimer.current = setTimeout({
                "FloorPlanEditor.useEffect": ()=>{
                    void saveActiveZone();
                    dirtyRef.current = false;
                }
            }["FloorPlanEditor.useEffect"], 1500);
            return ({
                "FloorPlanEditor.useEffect": ()=>{
                    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
                }
            })["FloorPlanEditor.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["FloorPlanEditor.useEffect"], [
        zonesJson,
        activeZoneId
    ]);
    const saveActiveZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloorPlanEditor.useCallback[saveActiveZone]": async ()=>{
            if (!activeZoneId) return;
            const zone = zones.find({
                "FloorPlanEditor.useCallback[saveActiveZone].zone": (z)=>z.id === activeZoneId
            }["FloorPlanEditor.useCallback[saveActiveZone].zone"]);
            if (!zone) return;
            setSaving(true);
            setError(null);
            try {
                const tables = zone.tables.map({
                    "FloorPlanEditor.useCallback[saveActiveZone].tables": (t)=>{
                        var _t_positionX, _t_positionY, _t_points, _t_seats, _t_description;
                        return {
                            id: t.id,
                            label: t.label,
                            objectType: t.objectType,
                            shape: t.shape,
                            capacity: t.capacity,
                            minCapacity: t.minCapacity,
                            positionX: (_t_positionX = t.positionX) !== null && _t_positionX !== void 0 ? _t_positionX : 0,
                            positionY: (_t_positionY = t.positionY) !== null && _t_positionY !== void 0 ? _t_positionY : 0,
                            width: t.width,
                            height: t.height,
                            points: (_t_points = t.points) !== null && _t_points !== void 0 ? _t_points : undefined,
                            seats: (_t_seats = t.seats) !== null && _t_seats !== void 0 ? _t_seats : undefined,
                            rotation: t.rotation,
                            cornerRadius: t.cornerRadius,
                            depositAmount: t.depositAmount,
                            isActive: t.isActive,
                            visibleToGuests: t.visibleToGuests,
                            description: (_t_description = t.description) !== null && _t_description !== void 0 ? _t_description : undefined
                        };
                    }
                }["FloorPlanEditor.useCallback[saveActiveZone].tables"]);
                var _zone_decorData;
                const payload = {
                    decorData: (_zone_decorData = zone.decorData) !== null && _zone_decorData !== void 0 ? _zone_decorData : {
                        grid: {
                            size: 20,
                            visible: true,
                            color: '#e5e7eb'
                        },
                        objects: []
                    },
                    tables
                };
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveLayout"])(restaurantId, token, activeZoneId, payload);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["revalidateRestaurantPublicPage"])(restaurantId);
                setLastSavedAt(Date.now());
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Не удалось сохранить планировку');
            } finally{
                setSaving(false);
            }
        }
    }["FloorPlanEditor.useCallback[saveActiveZone]"], [
        activeZoneId,
        zones,
        restaurantId,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$useHotkeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHotkeys"])({
        onSave: {
            "FloorPlanEditor.useHotkeys": ()=>void saveActiveZone()
        }["FloorPlanEditor.useHotkeys"],
        canSave: true
    });
    async function handleAddZone() {
        const name = prompt('Название нового зала:', "Зал ".concat(zones.length + 1));
        if (!name) return;
        try {
            const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFloorPlan"])(restaurantId, token, {
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateFloorPlan"])(restaurantId, token, activeZoneId, {
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
        if (!confirm("Удалить зал «".concat(zone.name, "»?"))) return;
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteFloorPlan"])(restaurantId, token, activeZoneId);
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
        const table = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createNewTable"])(activeZoneId, restaurantId, index, {
            shape,
            width: isRound ? 96 : isSquare ? 80 : isPolygon ? 96 : 96,
            height: isRound ? 96 : isSquare ? 80 : isPolygon ? 96 : 80,
            points: polygonPoints
        });
        addTable(activeZoneId, table);
    }
    function handleDepositSet(restId, tok, payload) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDepositScheme"])(restId, tok, payload);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fp-editor",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$Toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toolbar"], {
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
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "fp-editor__error",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                lineNumber: 194,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fp-editor__body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-editor__left",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$LayersPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LayersPanel"], {}, void 0, false, {
                            fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-editor__canvas-wrap",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KonvaStage, {
                            width: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"],
                            height: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_HEIGHT"]
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fp-editor__right",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$RightInspectorPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RightInspectorPanel"], {
                                restaurantId: restaurantId,
                                depositScheme: depositScheme
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$DepositSettingsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DepositSettingsPanel"], {
                                restaurantId: restaurantId,
                                token: token,
                                onSetDeposit: handleDepositSet
                            }, void 0, false, {
                                fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                                lineNumber: 207,
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "fp-editor__footer",
                children: [
                    saving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Сохранение…"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                        lineNumber: 216,
                        columnNumber: 20
                    }, this),
                    !saving && lastSavedAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "✓ Сохранено ",
                            new Date(lastSavedAt).toLocaleTimeString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                        lineNumber: 217,
                        columnNumber: 36
                    }, this),
                    !saving && !lastSavedAt && dirtyRef.current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "• Есть несохранённые изменения"
                    }, void 0, false, {
                        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                        lineNumber: 218,
                        columnNumber: 57
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/floor-plan/components/FloorPlanEditor.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
_s(FloorPlanEditor, "/gstBOen3/h3ZaM0mrPKyuwFTQg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$useHotkeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHotkeys"]
    ];
});
_c1 = FloorPlanEditor;
var _c, _c1;
__turbopack_context__.k.register(_c, "KonvaStage");
__turbopack_context__.k.register(_c1, "FloorPlanEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurant-admin/api/booking-settings.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchBookingSettings",
    ()=>fetchBookingSettings,
    "updateBookingSettings",
    ()=>updateBookingSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-client] (ecmascript)");
;
function fetchBookingSettings(restaurantId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/booking-settings"));
}
function updateBookingSettings(restaurantId, token, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/booking-settings"), {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FloorPlanAdminPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/layout-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/floor-plans.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$FloorPlanEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/floor-plan/components/FloorPlanEditor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$booking$2d$settings$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/booking-settings.api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function FloorPlanAdminPage() {
    _s();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "FloorPlanAdminPage.useAuthStore[user]": (s)=>s.user
    }["FloorPlanAdminPage.useAuthStore[user]"]);
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "FloorPlanAdminPage.useAuthStore[accessToken]": (s)=>s.accessToken
    }["FloorPlanAdminPage.useAuthStore[accessToken]"]);
    const restaurantId = user === null || user === void 0 ? void 0 : user.restaurantId;
    const loadLayout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"])({
        "FloorPlanAdminPage.useLayoutStore[loadLayout]": (s)=>s.loadLayout
    }["FloorPlanAdminPage.useLayoutStore[loadLayout]"]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloorPlanAdminPage.useEffect": ()=>{
            let cancelled = false;
            if (!restaurantId || !accessToken) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$floor$2d$plans$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFloorPlans"])(restaurantId, accessToken),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$booking$2d$settings$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBookingSettings"])(restaurantId)
            ]).then({
                "FloorPlanAdminPage.useEffect": (param)=>{
                    let [layout, settings] = param;
                    if (cancelled) return;
                    loadLayout(layout.zones);
                    if (settings) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"].setState({
                            depositScheme: settings.depositScheme,
                            globalDepositAmount: settings.depositAmount,
                            bookingDurationMinutes: settings.bookingDurationMinutes
                        });
                    }
                }
            }["FloorPlanAdminPage.useEffect"]).catch({
                "FloorPlanAdminPage.useEffect": (err)=>{
                    if (!cancelled) {
                        setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось загрузить планировку');
                    }
                }
            }["FloorPlanAdminPage.useEffect"]).finally({
                "FloorPlanAdminPage.useEffect": ()=>{
                    if (!cancelled) setLoading(false);
                }
            }["FloorPlanAdminPage.useEffect"]);
            return ({
                "FloorPlanAdminPage.useEffect": ()=>{
                    cancelled = true;
                }
            })["FloorPlanAdminPage.useEffect"];
        }
    }["FloorPlanAdminPage.useEffect"], [
        restaurantId,
        accessToken,
        loadLayout
    ]);
    if (!restaurantId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "floor-plan-admin__notice",
            children: "Заявка ещё на модерации или ресторан не привязан к аккаунту."
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this);
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "floor-plan-admin__notice",
            children: "Загрузка конструктора планировки…"
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx",
            lineNumber: 65,
            columnNumber: 12
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "floor-plan-admin__notice floor-plan-admin__notice--error",
            children: error
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx",
            lineNumber: 69,
            columnNumber: 12
        }, this);
    }
    if (!accessToken) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "floor-plan-admin__notice",
            children: "Требуется авторизация."
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx",
            lineNumber: 73,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$floor$2d$plan$2f$components$2f$FloorPlanEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloorPlanEditor"], {
        restaurantId: restaurantId,
        token: accessToken
    }, void 0, false, {
        fileName: "[project]/src/features/restaurant-admin/pages/FloorPlanAdminPage.tsx",
        lineNumber: 76,
        columnNumber: 10
    }, this);
}
_s(FloorPlanAdminPage, "qFAW4wsxHpNY9UufulvejrtZBK4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$layout$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutStore"]
    ];
});
_c = FloorPlanAdminPage;
var _c;
__turbopack_context__.k.register(_c, "FloorPlanAdminPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_fb33d5ce._.js.map