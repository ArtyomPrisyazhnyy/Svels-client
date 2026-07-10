(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/shared/config/env.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_URL",
    ()=>API_URL,
    "GOOGLE_CLIENT_ID",
    ()=>GOOGLE_CLIENT_ID,
    "resolveApiUrl",
    ()=>resolveApiUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var _process_env_NEXT_PUBLIC_API_PORT;
const DEFAULT_API_PORT = (_process_env_NEXT_PUBLIC_API_PORT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_PORT) !== null && _process_env_NEXT_PUBLIC_API_PORT !== void 0 ? _process_env_NEXT_PUBLIC_API_PORT : '3000';
function resolveApiUrl() {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL;
    }
    if ("TURBOPACK compile-time truthy", 1) {
        return "http://".concat(window.location.hostname, ":").concat(DEFAULT_API_PORT);
    }
    //TURBOPACK unreachable
    ;
}
var _process_env_NEXT_PUBLIC_API_URL;
const API_URL = (_process_env_NEXT_PUBLIC_API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL) !== null && _process_env_NEXT_PUBLIC_API_URL !== void 0 ? _process_env_NEXT_PUBLIC_API_URL : "http://localhost:".concat(DEFAULT_API_PORT);
var _process_env_NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_ID = (_process_env_NEXT_PUBLIC_GOOGLE_CLIENT_ID = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) !== null && _process_env_NEXT_PUBLIC_GOOGLE_CLIENT_ID !== void 0 ? _process_env_NEXT_PUBLIC_GOOGLE_CLIENT_ID : '';
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/auth.store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/api/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/env.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-client] (ecmascript)");
;
;
;
const SESSION_EXPIRED_MESSAGE = 'Сессия истекла. Войдите снова.';
class ApiError extends Error {
    constructor(status, message){
        super(message), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "status", void 0);
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
    } catch (e) {
    // ignore JSON parse errors
    }
    return response.statusText || 'Ошибка запроса';
}
function clearAuthSessionOnUnauthorized() {
    const { accessToken, logout } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState();
    if (accessToken) {
        logout();
    }
}
async function assertApiResponseOk(response) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (response.ok) {
        return;
    }
    var _options_authenticatedRequest;
    const authenticatedRequest = (_options_authenticatedRequest = options.authenticatedRequest) !== null && _options_authenticatedRequest !== void 0 ? _options_authenticatedRequest : false;
    if (response.status === 401 && authenticatedRequest) {
        clearAuthSessionOnUnauthorized();
        throw new ApiError(401, SESSION_EXPIRED_MESSAGE);
    }
    throw new ApiError(response.status, await parseErrorMessage(response));
}
async function apiRequest(path) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const { token, headers, body, ...rest } = options;
    const response = await fetch("".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveApiUrl"])()).concat(path), {
        ...rest,
        body,
        headers: {
            // Fastify отклоняет запросы без тела, если указан application/json,
            // поэтому заголовок ставим только при наличии body.
            ...body != null ? {
                'Content-Type': 'application/json'
            } : {},
            ...token ? {
                Authorization: "Bearer ".concat(token)
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/auth/api/users.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchProfile",
    ()=>fetchProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-client] (ecmascript)");
;
function fetchProfile(token) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])('/users/me', {
        token
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useAuthProfileSync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthProfileSync",
    ()=>useAuthProfileSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$api$2f$users$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/auth/api/users.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
async function syncProfileFromStore() {
    const { accessToken, updateUser } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState();
    if (!accessToken) {
        return;
    }
    try {
        const profile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$auth$2f$api$2f$users$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProfile"])(accessToken);
        updateUser(profile);
    } catch (e) {
    // ignore — stale token handled on next protected request
    }
}
function runAfterHydration(callback) {
    const { persist } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"];
    if (!(persist === null || persist === void 0 ? void 0 : persist.hasHydrated)) {
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
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuthProfileSync.useEffect": ()=>{
            runAfterHydration({
                "useAuthProfileSync.useEffect": ()=>{
                    void syncProfileFromStore();
                }
            }["useAuthProfileSync.useEffect"]);
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].subscribe({
                "useAuthProfileSync.useEffect": (state, prevState)=>{
                    if (state.accessToken !== prevState.accessToken) {
                        void syncProfileFromStore();
                    }
                }
            }["useAuthProfileSync.useEffect"]);
        }
    }["useAuthProfileSync.useEffect"], []);
}
_s(useAuthProfileSync, "OD7bBpZva5O2jO+Puf00hKivP7c=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/utils/uuid.util.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateUuidV7",
    ()=>generateUuidV7
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v7.js [app-client] (ecmascript) <export default as v7>");
;
function generateUuidV7() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/utils/menu-modifiers.util.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    var _group_id;
    return (_group_id = group.id) !== null && _group_id !== void 0 ? _group_id : "group-".concat(groupIndex);
}
function getModifierOptionKey(option, optionIndex) {
    var _option_id;
    return (_option_id = option.id) !== null && _option_id !== void 0 ? _option_id : "option-".concat(optionIndex);
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
        var _selections_groupKey;
        const selectedKeys = (_selections_groupKey = selections[groupKey]) !== null && _selections_groupKey !== void 0 ? _selections_groupKey : [];
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
    return getValidModifierGroups(groups !== null && groups !== void 0 ? groups : []).some((group)=>group.options.some((option)=>(Number(option.priceDelta) || 0) !== 0));
}
function isModifierSelectionComplete(groups, selections) {
    return groups.every((group, groupIndex)=>{
        var _selections_groupKey;
        if (group.selectionType !== 'single' || !group.required) {
            return true;
        }
        const groupKey = getModifierGroupKey(group, groupIndex);
        var _selections_groupKey_length;
        return ((_selections_groupKey_length = (_selections_groupKey = selections[groupKey]) === null || _selections_groupKey === void 0 ? void 0 : _selections_groupKey.length) !== null && _selections_groupKey_length !== void 0 ? _selections_groupKey_length : 0) > 0;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/utils/cart.util.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildCartLineItem",
    ()=>buildCartLineItem,
    "buildCartLineKey",
    ()=>buildCartLineKey,
    "getCartTotals",
    ()=>getCartTotals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$utils$2f$uuid$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/utils/uuid.util.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/menu-modifiers.util.ts [app-client] (ecmascript)");
;
;
function buildModifierLines(groups, selections) {
    const lines = [];
    groups.forEach((group, groupIndex)=>{
        const groupKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModifierGroupKey"])(group, groupIndex);
        var _selections_groupKey;
        const selectedKeys = (_selections_groupKey = selections[groupKey]) !== null && _selections_groupKey !== void 0 ? _selections_groupKey : [];
        group.options.forEach((option, optionIndex)=>{
            const optionKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModifierOptionKey"])(option, optionIndex);
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
    const normalizedEntries = Object.entries(selections).sort((param, param1)=>{
        let [a] = param, [b] = param1;
        return a.localeCompare(b);
    }).map((param)=>{
        let [groupKey, optionKeys] = param;
        return [
            groupKey,
            [
                ...optionKeys
            ].sort()
        ];
    });
    return "".concat(menuItemId, ":").concat(JSON.stringify(normalizedEntries));
}
function buildCartLineItem(item, quantity, modifierGroups, modifierSelections) {
    const modifiers = buildModifierLines(modifierGroups, modifierSelections);
    const lineKey = buildCartLineKey(item.id, modifierSelections);
    return {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$utils$2f$uuid$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateUuidV7"])(),
        lineKey,
        menuItemId: item.id,
        name: item.name,
        variantLabel: item.variantLabel,
        imageUrl: item.imageUrl,
        quantity,
        unitPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateModifierUnitPrice"])(item.price, modifierGroups, modifierSelections),
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/cart.store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCartStore",
    ()=>useCartStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$cart$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/cart.util.ts [app-client] (ecmascript)");
;
;
;
const useCartStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$cart$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCartTotals"])(get().getRestaurantItems(restaurantId));
        }
    }), {
    name: 'svels-cart',
    skipHydration: true
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-oauth/google/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuthProfileSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAuthProfileSync.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/env.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cart.store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function AuthProfileSync(param) {
    let { children } = param;
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuthProfileSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthProfileSync"])();
    return children;
}
_s(AuthProfileSync, "Ow1XVQeeDz/1FhpLew7E2Gix0dM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuthProfileSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthProfileSync"]
    ];
});
_c = AuthProfileSync;
function Providers(param) {
    let { children } = param;
    _s1();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Providers.useEffect": ()=>{
            void __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].persist.rehydrate();
            void __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"].persist.rehydrate();
        }
    }["Providers.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleOAuthProvider"], {
        clientId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GOOGLE_CLIENT_ID"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthProfileSync, {
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
_s1(Providers, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c1 = Providers;
var _c, _c1;
__turbopack_context__.k.register(_c, "AuthProfileSync");
__turbopack_context__.k.register(_c1, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_f66c8d20._.js.map