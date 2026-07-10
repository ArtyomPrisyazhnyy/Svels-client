module.exports = [
"[project]/src/shared/types/booking-settings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BOOKING_MODE_OPTIONS",
    ()=>BOOKING_MODE_OPTIONS,
    "DEFAULT_BOOKING_SETTINGS",
    ()=>DEFAULT_BOOKING_SETTINGS,
    "SLOT_MINUTES_OPTIONS",
    ()=>SLOT_MINUTES_OPTIONS
]);
const DEFAULT_BOOKING_SETTINGS = {
    bookingEnabled: false,
    mode: 'specific_table',
    depositScheme: 'no_deposit',
    depositAmount: 0,
    bookingDurationMinutes: 120,
    slotMinutes: 30,
    maxGuests: 8,
    advanceDays: 14,
    autoConfirm: false
};
const BOOKING_MODE_OPTIONS = [
    {
        value: 'specific_table',
        label: 'Конкретный стол',
        description: 'Гость выбирает стол на 2D-планировке заведения'
    },
    {
        value: 'by_seats',
        label: 'По количеству мест',
        description: 'Гость бронирует «стол на N мест», стол назначает заведение'
    }
];
const SLOT_MINUTES_OPTIONS = [
    15,
    20,
    30,
    45,
    60,
    90,
    120
];
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
"[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BookingSettingsAdminPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$booking$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/booking-settings.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$booking$2d$settings$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/booking-settings.api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/features/restaurants/actions/data:0f6329 [app-ssr] (ecmascript) <text/javascript>");
'use client';
;
;
;
;
;
;
;
;
function BookingSettingsAdminPage() {
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((s)=>s.user);
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((s)=>s.accessToken);
    const restaurantId = user?.restaurantId;
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!restaurantId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$booking$2d$settings$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBookingSettings"])(restaurantId);
            setSettings(data);
            setDraft({
                bookingEnabled: data.bookingEnabled,
                mode: data.mode,
                slotMinutes: data.slotMinutes,
                maxGuests: data.maxGuests,
                advanceDays: data.advanceDays,
                autoConfirm: data.autoConfirm
            });
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось загрузить настройки бронирования');
        } finally{
            setLoading(false);
        }
    }, [
        restaurantId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void loadSettings();
    }, [
        loadSettings
    ]);
    function updateDraft(patch) {
        setSuccess(null);
        setDraft((prev)=>({
                ...prev,
                ...patch
            }));
    }
    async function handleSave() {
        if (!restaurantId || !accessToken) return;
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$booking$2d$settings$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateBookingSettings"])(restaurantId, accessToken, draft);
            setSettings(updated);
            setDraft({
                bookingEnabled: updated.bookingEnabled,
                mode: updated.mode,
                slotMinutes: updated.slotMinutes,
                maxGuests: updated.maxGuests,
                advanceDays: updated.advanceDays,
                autoConfirm: updated.autoConfirm
            });
            setSuccess('Настройки сохранены');
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["revalidateRestaurantPublicPage"])(restaurantId);
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось сохранить настройки');
        } finally{
            setSaving(false);
        }
    }
    const hasChanges = settings !== null && (settings.bookingEnabled !== draft.bookingEnabled || settings.mode !== draft.mode || settings.slotMinutes !== draft.slotMinutes || settings.maxGuests !== draft.maxGuests || settings.advanceDays !== draft.advanceDays || settings.autoConfirm !== draft.autoConfirm);
    if (!restaurantId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "order-settings-admin__notice",
            children: "Заявка ещё на модерации или ресторан не привязан к аккаунту."
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
            lineNumber: 107,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "order-settings-admin",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "order-settings-admin__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Бронирование столов"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "order-settings-admin__intro",
                                children: "Включите бронирование для ресторана. Кофейням и небольшим заведениям бронирование можно оставить выключенным."
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "order-settings-admin__save",
                        disabled: saving || loading || !hasChanges,
                        onClick: ()=>void handleSave(),
                        children: saving ? 'Сохранение…' : 'Сохранить'
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "order-settings-admin__error",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                lineNumber: 132,
                columnNumber: 17
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "order-settings-admin__success",
                children: success
            }, void 0, false, {
                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                lineNumber: 133,
                columnNumber: 19
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "order-settings-admin__empty",
                children: "Загрузка…"
            }, void 0, false, {
                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                lineNumber: 136,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "order-settings-admin__grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "order-settings-admin__panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Статус"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "order-settings-admin__options",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "order-settings-admin__option",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "order-settings-admin__option-copy",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Бронирование включено"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Гости смогут бронировать стол через страницу заведения."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                        lineNumber: 145,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                lineNumber: 143,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                className: "order-settings-admin__toggle",
                                                checked: Boolean(draft.bookingEnabled),
                                                disabled: saving,
                                                onChange: (e)=>updateDraft({
                                                        bookingEnabled: e.target.checked
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                lineNumber: 147,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "order-settings-admin__option",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "order-settings-admin__option-copy",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Автоподтверждение"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Брони подтверждаются автоматически. Иначе ждут подтверждения в разделе «Брони»."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                        lineNumber: 158,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                lineNumber: 156,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                className: "order-settings-admin__toggle",
                                                checked: Boolean(draft.autoConfirm),
                                                disabled: saving || !draft.bookingEnabled,
                                                onChange: (e)=>updateDraft({
                                                        autoConfirm: e.target.checked
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "order-settings-admin__panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Режим выбора стола"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "order-settings-admin__hint",
                                children: "«Конкретный стол» требует планировки в разделе «Планировка»."
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "order-settings-admin__options",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$booking$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_MODE_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: `order-settings-admin__option${draft.mode === option.value ? ' order-settings-admin__option--active' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "radio",
                                                name: "booking-mode",
                                                value: option.value,
                                                checked: draft.mode === option.value,
                                                disabled: saving || !draft.bookingEnabled,
                                                onChange: ()=>updateDraft({
                                                        mode: option.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                lineNumber: 184,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "order-settings-admin__option-copy",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                        lineNumber: 194,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                lineNumber: 192,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, option.value, true, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                        lineNumber: 178,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                        lineNumber: 171,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "order-settings-admin__panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Параметры слотов"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 202,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "order-settings-admin__hint",
                                children: "Доступные времена брони генерируются из графика работы с указанным шагом."
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 203,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "order-settings-admin__field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Шаг слота"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                        lineNumber: 207,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: draft.slotMinutes,
                                        disabled: saving || !draft.bookingEnabled,
                                        onChange: (e)=>updateDraft({
                                                slotMinutes: Number(e.target.value)
                                            }),
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$booking$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SLOT_MINUTES_OPTIONS"].map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: value,
                                                children: [
                                                    value,
                                                    " мин"
                                                ]
                                            }, value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                                lineNumber: 214,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                        lineNumber: 208,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "order-settings-admin__field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Максимум гостей на бронь"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 1,
                                        max: 50,
                                        value: draft.maxGuests,
                                        disabled: saving || !draft.bookingEnabled,
                                        onChange: (e)=>updateDraft({
                                                maxGuests: Number(e.target.value)
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "order-settings-admin__field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Окно бронирования (дней вперёд)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                        lineNumber: 232,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 1,
                                        max: 90,
                                        value: draft.advanceDays,
                                        disabled: saving || !draft.bookingEnabled,
                                        onChange: (e)=>updateDraft({
                                                advanceDays: Number(e.target.value)
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                        lineNumber: 233,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                                lineNumber: 231,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                        lineNumber: 201,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurant-admin/pages/BookingSettingsAdminPage.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
const _appcallserver = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-call-server.js [app-ssr] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-find-source-map-url.js [app-ssr] (ecmascript)");
const _client = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-server-dom-turbopack-client.js [app-ssr] (ecmascript)"); //# sourceMappingURL=action-client-wrapper.js.map
}),
];

//# sourceMappingURL=_96e74d59._.js.map