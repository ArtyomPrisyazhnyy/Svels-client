module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/shared/config/env.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_URL",
    ()=>API_URL,
    "GOOGLE_CLIENT_ID",
    ()=>GOOGLE_CLIENT_ID,
    "resolveApiUrl",
    ()=>resolveApiUrl
]);
const DEFAULT_API_PORT = process.env.NEXT_PUBLIC_API_PORT ?? '3000';
function resolveApiUrl() {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return `http://localhost:${DEFAULT_API_PORT}`;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:${DEFAULT_API_PORT}`;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
}),
"[project]/src/store/auth.store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        accessToken: null,
        user: null,
        setAuth: (accessToken, user)=>set({
                accessToken,
                user
            }),
        updateUser: (user)=>set({
                user
            }),
        logout: ()=>set({
                accessToken: null,
                user: null
            })
    }), {
    name: 'svels-auth',
    skipHydration: true
}));
}),
"[project]/src/shared/api/api-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "SESSION_EXPIRED_MESSAGE",
    ()=>SESSION_EXPIRED_MESSAGE,
    "apiRequest",
    ()=>apiRequest,
    "assertApiResponseOk",
    ()=>assertApiResponseOk,
    "clearAuthSessionOnUnauthorized",
    ()=>clearAuthSessionOnUnauthorized
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/env.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)");
;
;
const SESSION_EXPIRED_MESSAGE = 'Сессия истекла. Войдите снова.';
class ApiError extends Error {
    status;
    constructor(status, message){
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}
async function parseErrorMessage(response) {
    try {
        const body = await response.json();
        if (Array.isArray(body.message)) {
            return body.message.join(', ');
        }
        if (typeof body.message === 'string') {
            return body.message;
        }
    } catch  {
    // ignore JSON parse errors
    }
    return response.statusText || 'Ошибка запроса';
}
function clearAuthSessionOnUnauthorized() {
    const { accessToken, logout } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"].getState();
    if (accessToken) {
        logout();
    }
}
async function assertApiResponseOk(response, options = {}) {
    if (response.ok) {
        return;
    }
    const authenticatedRequest = options.authenticatedRequest ?? false;
    if (response.status === 401 && authenticatedRequest) {
        clearAuthSessionOnUnauthorized();
        throw new ApiError(401, SESSION_EXPIRED_MESSAGE);
    }
    throw new ApiError(response.status, await parseErrorMessage(response));
}
async function apiRequest(path, options = {}) {
    const { token, headers, body, ...rest } = options;
    const response = await fetch(`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveApiUrl"])()}${path}`, {
        ...rest,
        body,
        headers: {
            // Fastify отклоняет запросы без тела, если указан application/json,
            // поэтому заголовок ставим только при наличии body.
            ...body != null ? {
                'Content-Type': 'application/json'
            } : {},
            ...token ? {
                Authorization: `Bearer ${token}`
            } : {},
            ...headers
        }
    });
    if (!response.ok) {
        await assertApiResponseOk(response, {
            authenticatedRequest: Boolean(token)
        });
    }
    if (response.status === 204) {
        return undefined;
    }
    return response.json();
}
}),
"[project]/src/features/auth/api/users.api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchProfile",
    ()=>fetchProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-ssr] (ecmascript)");
;
function fetchProfile(token) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/users/me', {
        token
    });
}
}),
"[project]/src/hooks/useAuthProfileSync.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthProfileSync",
    ()=>useAuthProfileSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$api$2f$users$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/api/users.api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
async function syncProfileFromStore() {
    const { accessToken, updateUser } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"].getState();
    if (!accessToken) {
        return;
    }
    try {
        const profile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$api$2f$users$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProfile"])(accessToken);
        updateUser(profile);
    } catch  {
    // ignore — stale token handled on next protected request
    }
}
function runAfterHydration(callback) {
    const { persist } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"];
    if (!persist?.hasHydrated) {
        callback();
        return;
    }
    if (persist.hasHydrated()) {
        callback();
        return;
    }
    persist.onFinishHydration(callback);
}
function useAuthProfileSync() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        runAfterHydration(()=>{
            void syncProfileFromStore();
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"].subscribe((state, prevState)=>{
            if (state.accessToken !== prevState.accessToken) {
                void syncProfileFromStore();
            }
        });
    }, []);
}
}),
"[project]/src/shared/utils/uuid.util.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateUuidV7",
    ()=>generateUuidV7
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v7.js [app-ssr] (ecmascript) <export default as v7>");
;
function generateUuidV7() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
}
}),
"[project]/src/features/restaurants/utils/menu-modifiers.util.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateModifierUnitPrice",
    ()=>calculateModifierUnitPrice,
    "createEmptyModifierSelections",
    ()=>createEmptyModifierSelections,
    "getModifierGroupKey",
    ()=>getModifierGroupKey,
    "getModifierOptionKey",
    ()=>getModifierOptionKey,
    "getValidModifierGroups",
    ()=>getValidModifierGroups,
    "hasPriceAffectingModifiers",
    ()=>hasPriceAffectingModifiers,
    "isModifierSelectionComplete",
    ()=>isModifierSelectionComplete
]);
function getModifierGroupKey(group, groupIndex) {
    return group.id ?? `group-${groupIndex}`;
}
function getModifierOptionKey(option, optionIndex) {
    return option.id ?? `option-${optionIndex}`;
}
function getValidModifierGroups(groups) {
    return groups.map((group)=>({
            ...group,
            options: group.options.filter((option)=>option.name.trim().length > 0)
        })).filter((group)=>group.options.length > 0);
}
function createEmptyModifierSelections(groups) {
    const selections = {};
    groups.forEach((group, groupIndex)=>{
        const groupKey = getModifierGroupKey(group, groupIndex);
        // Для обязательной группы с одиночным выбором предвыбираем первый вариант,
        // чтобы пользователь сразу видел корректную цену и мог добавить товар без
        // лишнего клика.
        if (group.required && group.selectionType === 'single' && group.options.length > 0) {
            selections[groupKey] = [
                getModifierOptionKey(group.options[0], 0)
            ];
            return;
        }
        selections[groupKey] = [];
    });
    return selections;
}
function calculateModifierUnitPrice(basePrice, groups, selections) {
    let total = Number(basePrice) || 0;
    groups.forEach((group, groupIndex)=>{
        const groupKey = getModifierGroupKey(group, groupIndex);
        const selectedKeys = selections[groupKey] ?? [];
        group.options.forEach((option, optionIndex)=>{
            const optionKey = getModifierOptionKey(option, optionIndex);
            if (selectedKeys.includes(optionKey)) {
                total += Number(option.priceDelta) || 0;
            }
        });
    });
    return total;
}
function hasPriceAffectingModifiers(groups) {
    return getValidModifierGroups(groups ?? []).some((group)=>group.options.some((option)=>(Number(option.priceDelta) || 0) !== 0));
}
function isModifierSelectionComplete(groups, selections) {
    return groups.every((group, groupIndex)=>{
        if (group.selectionType !== 'single' || !group.required) {
            return true;
        }
        const groupKey = getModifierGroupKey(group, groupIndex);
        return (selections[groupKey]?.length ?? 0) > 0;
    });
}
}),
"[project]/src/features/restaurants/utils/cart.util.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildCartLineItem",
    ()=>buildCartLineItem,
    "buildCartLineKey",
    ()=>buildCartLineKey,
    "getCartTotals",
    ()=>getCartTotals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$utils$2f$uuid$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/utils/uuid.util.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/menu-modifiers.util.ts [app-ssr] (ecmascript)");
;
;
function buildModifierLines(groups, selections) {
    const lines = [];
    groups.forEach((group, groupIndex)=>{
        const groupKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getModifierGroupKey"])(group, groupIndex);
        const selectedKeys = selections[groupKey] ?? [];
        group.options.forEach((option, optionIndex)=>{
            const optionKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getModifierOptionKey"])(option, optionIndex);
            if (!selectedKeys.includes(optionKey)) {
                return;
            }
            lines.push({
                groupName: group.name,
                optionName: option.name,
                priceDelta: Number(option.priceDelta) || 0
            });
        });
    });
    return lines;
}
function buildCartLineKey(menuItemId, selections) {
    const normalizedEntries = Object.entries(selections).sort(([a], [b])=>a.localeCompare(b)).map(([groupKey, optionKeys])=>[
            groupKey,
            [
                ...optionKeys
            ].sort()
        ]);
    return `${menuItemId}:${JSON.stringify(normalizedEntries)}`;
}
function buildCartLineItem(item, quantity, modifierGroups, modifierSelections) {
    const modifiers = buildModifierLines(modifierGroups, modifierSelections);
    const lineKey = buildCartLineKey(item.id, modifierSelections);
    return {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$utils$2f$uuid$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateUuidV7"])(),
        lineKey,
        menuItemId: item.id,
        name: item.name,
        variantLabel: item.variantLabel,
        imageUrl: item.imageUrl,
        quantity,
        unitPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateModifierUnitPrice"])(item.price, modifierGroups, modifierSelections),
        modifiers,
        modifierSelections
    };
}
function getCartTotals(items) {
    const itemCount = items.reduce((sum, line)=>sum + line.quantity, 0);
    const totalAmount = items.reduce((sum, line)=>sum + line.unitPrice * line.quantity, 0);
    return {
        itemCount,
        totalAmount
    };
}
}),
"[project]/src/store/cart.store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCartStore",
    ()=>useCartStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$cart$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/cart.util.ts [app-ssr] (ecmascript)");
;
;
;
const useCartStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        restaurantId: null,
        items: [],
        addLine: (restaurantId, line)=>{
            const state = get();
            const isSameRestaurant = !state.restaurantId || state.restaurantId === restaurantId;
            const currentItems = isSameRestaurant ? state.items : [];
            const existingIndex = currentItems.findIndex((item)=>item.lineKey === line.lineKey);
            if (existingIndex >= 0) {
                const nextItems = currentItems.map((item, index)=>index === existingIndex ? {
                        ...item,
                        quantity: item.quantity + line.quantity
                    } : item);
                set({
                    restaurantId,
                    items: nextItems
                });
                return;
            }
            set({
                restaurantId,
                items: [
                    ...currentItems,
                    line
                ]
            });
        },
        removeLine: (lineId)=>{
            const nextItems = get().items.filter((item)=>item.id !== lineId);
            set({
                items: nextItems,
                restaurantId: nextItems.length ? get().restaurantId : null
            });
        },
        updateLineQuantity: (lineId, quantity)=>{
            if (quantity < 1) {
                get().removeLine(lineId);
                return;
            }
            set({
                items: get().items.map((item)=>item.id === lineId ? {
                        ...item,
                        quantity
                    } : item)
            });
        },
        clearCart: ()=>set({
                restaurantId: null,
                items: []
            }),
        getRestaurantItems: (restaurantId)=>{
            const state = get();
            if (state.restaurantId !== restaurantId) {
                return [];
            }
            return state.items;
        },
        getRestaurantTotals: (restaurantId)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$cart$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCartTotals"])(get().getRestaurantItems(restaurantId));
        }
    }), {
    name: 'svels-cart',
    skipHydration: true
}));
}),
"[project]/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-oauth/google/dist/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuthProfileSync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAuthProfileSync.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/env.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cart.store.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function AuthProfileSync({ children }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuthProfileSync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthProfileSync"])();
    return children;
}
function Providers({ children }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"].persist.rehydrate();
        void __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCartStore"].persist.rehydrate();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GoogleOAuthProvider"], {
        clientId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GOOGLE_CLIENT_ID"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthProfileSync, {
            children: children
        }, void 0, false, {
            fileName: "[project]/app/providers.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__eb06f358._.js.map