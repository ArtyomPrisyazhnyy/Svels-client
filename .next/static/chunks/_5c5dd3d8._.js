(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/src/shared/config/currency.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Белорусский рубль (BYN) — официальный графический знак с 2026 года */ __turbopack_context__.s([
    "CURRENCY_CODE",
    ()=>CURRENCY_CODE,
    "CURRENCY_GLYPH",
    ()=>CURRENCY_GLYPH,
    "CURRENCY_MARKUP_CHAR",
    ()=>CURRENCY_MARKUP_CHAR
]);
const CURRENCY_CODE = 'BYN';
const CURRENCY_GLYPH = '\uE901';
const CURRENCY_MARKUP_CHAR = 'Б';
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/utils/currency.util.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatPrice",
    ()=>formatPrice,
    "formatPriceDelta",
    ()=>formatPriceDelta,
    "formatPricePlain",
    ()=>formatPricePlain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/currency.ts [app-client] (ecmascript)");
;
function formatPricePlain(price) {
    let fractionDigits = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return "".concat(Number(price).toFixed(fractionDigits), " BYN");
}
function formatPrice(price) {
    let fractionDigits = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return "".concat(Number(price).toFixed(fractionDigits), " ").concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENCY_GLYPH"]);
}
function formatPriceDelta(delta) {
    if (!delta) {
        return '';
    }
    const sign = delta > 0 ? '+' : '−';
    return " (".concat(sign).concat(Math.abs(delta).toFixed(0), " ").concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENCY_GLYPH"], ")");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/types/menu.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAX_MENU_ITEM_GALLERY_IMAGES",
    ()=>MAX_MENU_ITEM_GALLERY_IMAGES,
    "getMenuItemImages",
    ()=>getMenuItemImages,
    "resolveImageUrl",
    ()=>resolveImageUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$utils$2f$currency$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/utils/currency.util.ts [app-client] (ecmascript)");
const MAX_MENU_ITEM_GALLERY_IMAGES = 9;
function getMenuItemImages(item) {
    var _item_galleryUrls;
    return [
        item.imageUrl,
        ...(_item_galleryUrls = item.galleryUrls) !== null && _item_galleryUrls !== void 0 ? _item_galleryUrls : []
    ].filter((url)=>url.length > 0);
}
;
function resolveImageUrl(imageUrl) {
    if (imageUrl.startsWith('data:')) {
        return imageUrl;
    }
    if (imageUrl.startsWith('http')) {
        try {
            const { pathname } = new URL(imageUrl);
            if (pathname.startsWith('/uploads/')) {
                return pathname;
            }
        } catch (e) {
        // ignore invalid URL
        }
        return imageUrl;
    }
    return imageUrl.startsWith('/') ? imageUrl : "/".concat(imageUrl);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurant-admin/api/restaurant.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchRestaurant",
    ()=>fetchRestaurant,
    "updateRestaurant",
    ()=>updateRestaurant,
    "uploadRestaurantLogo",
    ()=>uploadRestaurantLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/env.ts [app-client] (ecmascript)");
;
;
function fetchRestaurant(restaurantId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId));
}
function updateRestaurant(restaurantId, token, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId), {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
async function uploadRestaurantLogo(restaurantId, token, file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch("".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveApiUrl"])(), "/restaurants/").concat(restaurantId, "/upload-logo"), {
        method: 'POST',
        headers: {
            Authorization: "Bearer ".concat(token)
        },
        body: formData
    });
    if (!response.ok) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertApiResponseOk"])(response, {
            authenticatedRequest: true
        });
    }
    return response.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrandingAdminPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/features/restaurants/actions/data:0f6329 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/shared/types/menu.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$restaurant$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/restaurant.api.ts [app-client] (ecmascript)");
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
function BrandingAdminPage() {
    _s();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "BrandingAdminPage.useAuthStore[user]": (s)=>s.user
    }["BrandingAdminPage.useAuthStore[user]"]);
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "BrandingAdminPage.useAuthStore[accessToken]": (s)=>s.accessToken
    }["BrandingAdminPage.useAuthStore[accessToken]"]);
    const restaurantId = user === null || user === void 0 ? void 0 : user.restaurantId;
    const [logoUrl, setLogoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewUrl, setPreviewUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadRestaurant = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BrandingAdminPage.useCallback[loadRestaurant]": async ()=>{
            if (!restaurantId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const restaurant = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$restaurant$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchRestaurant"])(restaurantId);
                var _restaurant_logoUrl;
                setLogoUrl((_restaurant_logoUrl = restaurant.logoUrl) !== null && _restaurant_logoUrl !== void 0 ? _restaurant_logoUrl : null);
                setPreviewUrl('');
            } catch (err) {
                setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось загрузить данные заведения');
            } finally{
                setLoading(false);
            }
        }
    }["BrandingAdminPage.useCallback[loadRestaurant]"], [
        restaurantId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrandingAdminPage.useEffect": ()=>{
            void loadRestaurant();
        }
    }["BrandingAdminPage.useEffect"], [
        loadRestaurant
    ]);
    async function handleFileChange(file) {
        if (!file || !restaurantId || !accessToken) return;
        setError(null);
        setSuccess(null);
        setUploading(true);
        setPreviewUrl(URL.createObjectURL(file));
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$restaurant$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadRestaurantLogo"])(restaurantId, accessToken, file);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$restaurant$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateRestaurant"])(restaurantId, accessToken, {
                logoUrl: result.logoUrl
            });
            setLogoUrl(result.logoUrl);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["revalidateRestaurantPublicPage"])(restaurantId);
            setSuccess('Логотип сохранён');
        } catch (err) {
            setPreviewUrl('');
            setError(err instanceof Error ? err.message : 'Не удалось загрузить логотип');
        } finally{
            setUploading(false);
        }
    }
    async function handleRemoveLogo() {
        if (!restaurantId || !accessToken || !logoUrl) return;
        if (!window.confirm('Удалить логотип?')) return;
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$restaurant$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateRestaurant"])(restaurantId, accessToken, {
                logoUrl: null
            });
            setLogoUrl(null);
            setPreviewUrl('');
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["revalidateRestaurantPublicPage"])(restaurantId);
            setSuccess('Логотип удалён');
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось удалить логотип');
        } finally{
            setSaving(false);
        }
    }
    if (!restaurantId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "branding-admin__notice",
            children: "Заявка ещё на модерации или ресторан не привязан к аккаунту."
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
            lineNumber: 97,
            columnNumber: 7
        }, this);
    }
    const displayUrl = previewUrl || (logoUrl ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["resolveImageUrl"])(logoUrl) : '');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "branding-admin",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "branding-admin__panel",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: "Логотип заведения"
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "branding-admin__hint",
                    children: "Загрузите квадратное или горизонтальное изображение в формате JPG, PNG или WebP до 5 МБ. Логотип отображается в шапке страницы заведения для гостей."
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                    lineNumber: 109,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "branding-admin__error",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                    lineNumber: 114,
                    columnNumber: 19
                }, this),
                success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "branding-admin__success",
                    children: success
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                    lineNumber: 115,
                    columnNumber: 21
                }, this),
                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "branding-admin__empty",
                    children: "Загрузка…"
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                    lineNumber: 118,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "branding-admin__preview-wrap",
                            children: displayUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                className: "branding-admin__preview",
                                src: displayUrl,
                                alt: "Логотип заведения"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                                lineNumber: 123,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "branding-admin__placeholder",
                                children: "Логотип не загружен"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                                lineNumber: 129,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "branding-admin__actions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "branding-admin__upload-btn",
                                    children: [
                                        uploading ? 'Загрузка…' : logoUrl ? 'Заменить логотип' : 'Загрузить логотип',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "file",
                                            accept: "image/jpeg,image/png,image/webp",
                                            disabled: uploading || saving,
                                            hidden: true,
                                            onChange: (e)=>{
                                                var _e_target_files;
                                                return void handleFileChange((_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0]);
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                                            lineNumber: 136,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, this),
                                logoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "branding-admin__remove",
                                    disabled: uploading || saving,
                                    onClick: ()=>void handleRemoveLogo(),
                                    children: saving ? 'Удаление…' : 'Удалить'
                                }, void 0, false, {
                                    fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                                    lineNumber: 146,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
                            lineNumber: 133,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
            lineNumber: 107,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/features/restaurant-admin/pages/BrandingAdminPage.tsx",
        lineNumber: 106,
        columnNumber: 5
    }, this);
}
_s(BrandingAdminPage, "1lOjYkgbr+2z61RAoKllfx76LuQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = BrandingAdminPage;
var _c;
__turbopack_context__.k.register(_c, "BrandingAdminPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This file must be bundled in the app's client layer, it shouldn't be directly
// imported by the server.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    callServer: null,
    createServerReference: null,
    findSourceMapURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    callServer: function() {
        return _appcallserver.callServer;
    },
    createServerReference: function() {
        return _client.createServerReference;
    },
    findSourceMapURL: function() {
        return _appfindsourcemapurl.findSourceMapURL;
    }
});
const _appcallserver = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-call-server.js [app-client] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-find-source-map-url.js [app-client] (ecmascript)");
const _client = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-server-dom-turbopack/client.js [app-client] (ecmascript)"); //# sourceMappingURL=action-client-wrapper.js.map
}),
]);

//# sourceMappingURL=_5c5dd3d8._.js.map