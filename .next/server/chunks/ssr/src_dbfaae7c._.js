module.exports = [
"[project]/src/components/ClientOnly.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientOnly",
    ()=>ClientOnly
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function ClientOnly({ children, fallback = null }) {
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    if (!mounted) {
        return fallback;
    }
    return children;
}
}),
"[project]/src/hooks/useAuthHydrated.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthHydrated",
    ()=>useAuthHydrated
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)");
'use client';
;
;
function useAuthHydrated() {
    const [hydrated, setHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const { persist } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"];
        if (!persist?.hasHydrated) {
            setHydrated(true);
            return;
        }
        if (persist.hasHydrated()) {
            setHydrated(true);
            return;
        }
        return persist.onFinishHydration(()=>{
            setHydrated(true);
        });
    }, []);
    return hydrated;
}
}),
"[project]/src/shared/tenant/platform-hosts.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPlatformHosts",
    ()=>getPlatformHosts,
    "isPlatformHost",
    ()=>isPlatformHost,
    "normalizeHost",
    ()=>normalizeHost
]);
const DEFAULT_PLATFORM_HOSTS = [
    'localhost',
    '127.0.0.1',
    'svels.by',
    'www.svels.by'
];
function parsePlatformHosts(raw) {
    if (!raw?.trim()) {
        return DEFAULT_PLATFORM_HOSTS;
    }
    return raw.split(',').map((item)=>item.trim().toLowerCase()).filter(Boolean);
}
function getPlatformHosts() {
    return parsePlatformHosts(process.env.NEXT_PUBLIC_PLATFORM_HOSTS ?? process.env.PLATFORM_HOSTS);
}
function normalizeHost(raw) {
    let host = raw.trim().toLowerCase();
    host = host.split(':')[0] ?? host;
    if (host.startsWith('www.')) {
        host = host.slice(4);
    }
    return host;
}
function isPlatformHost(rawHost) {
    const host = normalizeHost(rawHost);
    const platformHosts = getPlatformHosts();
    if (platformHosts.includes(host)) {
        return true;
    }
    // LAN IP during local development
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
        return true;
    }
    return false;
}
}),
"[project]/src/shared/routing/restaurant-guest-path.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildRestaurantGuestPath",
    ()=>buildRestaurantGuestPath,
    "useIsTenantDomain",
    ()=>useIsTenantDomain,
    "useRestaurantGuestPaths",
    ()=>useRestaurantGuestPaths
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$tenant$2f$platform$2d$hosts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/tenant/platform-hosts.ts [app-ssr] (ecmascript)");
'use client';
;
;
function buildRestaurantGuestPath(restaurantId, segment, options) {
    const tenantMode = options?.tenantMode ?? false;
    if (segment === 'auth') {
        const base = tenantMode ? '/auth' : `/restaurants/${restaurantId}/auth`;
        if (options?.from) {
            return `${base}?from=${encodeURIComponent(options.from)}`;
        }
        return base;
    }
    if (tenantMode) {
        return segment === 'home' ? '/' : `/${segment}`;
    }
    return segment === 'home' ? `/restaurants/${restaurantId}` : `/restaurants/${restaurantId}/${segment}`;
}
function useIsTenantDomain() {
    const [tenantMode, setTenantMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setTenantMode(!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$tenant$2f$platform$2d$hosts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPlatformHost"])(window.location.hostname));
    }, []);
    return tenantMode;
}
function useRestaurantGuestPaths(restaurantId, forcePlatformPaths = false) {
    const tenantMode = useIsTenantDomain();
    const useTenantPaths = tenantMode && !forcePlatformPaths;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            tenantMode: useTenantPaths,
            home: buildRestaurantGuestPath(restaurantId, 'home', {
                tenantMode: useTenantPaths
            }),
            booking: buildRestaurantGuestPath(restaurantId, 'booking', {
                tenantMode: useTenantPaths
            }),
            preOrder: buildRestaurantGuestPath(restaurantId, 'pre-order', {
                tenantMode: useTenantPaths
            }),
            account: buildRestaurantGuestPath(restaurantId, 'account', {
                tenantMode: useTenantPaths
            }),
            auth: (from)=>buildRestaurantGuestPath(restaurantId, 'auth', {
                    tenantMode: useTenantPaths,
                    from
                })
        }), [
        restaurantId,
        useTenantPaths
    ]);
}
}),
"[project]/src/shared/routing/get-post-auth-path.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPostAuthPath",
    ()=>getPostAuthPath,
    "restaurantAuthPath",
    ()=>restaurantAuthPath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/routing/restaurant-guest-path.ts [app-ssr] (ecmascript)");
;
function getPostAuthPath(role, redirectFrom, restaurantId, tenantMode = false) {
    switch(role){
        case 'super_admin':
            return '/admin';
        case 'restaurant_admin':
            return '/restaurant-admin/menu';
        default:
            if (redirectFrom) {
                return redirectFrom;
            }
            if (restaurantId) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildRestaurantGuestPath"])(restaurantId, 'home', {
                    tenantMode
                });
            }
            return '/';
    }
}
function restaurantAuthPath(restaurantId, from, tenantMode = false) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildRestaurantGuestPath"])(restaurantId, 'auth', {
        tenantMode,
        from
    });
}
}),
"[project]/src/components/RestaurantGuestProtectedRoute.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantGuestProtectedRoute",
    ()=>RestaurantGuestProtectedRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ClientOnly$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ClientOnly.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuthHydrated$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAuthHydrated.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$get$2d$post$2d$auth$2d$path$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/routing/get-post-auth-path.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/routing/restaurant-guest-path.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
function AuthCheckingFallback() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        suppressHydrationWarning: true,
        style: {
            minHeight: '40vh',
            display: 'grid',
            placeItems: 'center',
            color: '#64748b'
        },
        children: "Проверка доступа…"
    }, void 0, false, {
        fileName: "[project]/src/components/RestaurantGuestProtectedRoute.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
function canAccessRestaurantGuestArea(user, restaurantId) {
    if (user.role === 'user') {
        return user.restaurantId === restaurantId;
    }
    if (user.role === 'restaurant_admin') {
        return user.restaurantId === restaurantId;
    }
    return false;
}
function RestaurantGuestProtectedRouteInner({ restaurantId, children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const hydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuthHydrated$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthHydrated"])();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((s)=>s.user);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((s)=>s.logout);
    const paths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRestaurantGuestPaths"])(restaurantId);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hydrated) {
            return;
        }
        if (!user) {
            const query = searchParams.toString();
            const from = `${pathname}${query ? `?${query}` : ''}`;
            router.replace(paths.auth(from));
            return;
        }
        if (user.role === 'super_admin') {
            router.replace((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$get$2d$post$2d$auth$2d$path$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPostAuthPath"])(user.role));
            return;
        }
        if (user.role === 'restaurant_admin' && user.restaurantId !== restaurantId) {
            router.replace((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$get$2d$post$2d$auth$2d$path$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPostAuthPath"])(user.role, undefined, user.restaurantId));
            return;
        }
        if (user.role === 'user' && user.restaurantId !== restaurantId) {
            logout();
            router.replace(paths.auth(pathname));
        }
    }, [
        hydrated,
        user,
        router,
        pathname,
        searchParams,
        restaurantId,
        logout,
        paths
    ]);
    if (!hydrated || !user || !canAccessRestaurantGuestArea(user, restaurantId)) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthCheckingFallback, {}, void 0, false, {
            fileName: "[project]/src/components/RestaurantGuestProtectedRoute.tsx",
            lineNumber: 81,
            columnNumber: 12
        }, this);
    }
    return children;
}
function RestaurantGuestProtectedRoute({ restaurantId, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ClientOnly$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClientOnly"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthCheckingFallback, {}, void 0, false, {
            fileName: "[project]/src/components/RestaurantGuestProtectedRoute.tsx",
            lineNumber: 92,
            columnNumber: 27
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RestaurantGuestProtectedRouteInner, {
            restaurantId: restaurantId,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/RestaurantGuestProtectedRoute.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/RestaurantGuestProtectedRoute.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/shared/utils/phone.util.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatPhoneDisplay",
    ()=>formatPhoneDisplay
]);
function formatPhoneDisplay(normalized) {
    const digits = normalized.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('375')) {
        return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10)}`;
    }
    return normalized;
}
}),
"[project]/src/features/restaurants/api/bookings.api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cancelBooking",
    ()=>cancelBooking,
    "createBooking",
    ()=>createBooking,
    "fetchBookingAvailability",
    ()=>fetchBookingAvailability,
    "fetchMyBookings",
    ()=>fetchMyBookings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-ssr] (ecmascript)");
;
function fetchBookingAvailability(restaurantId, date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/bookings/availability?date=${encodeURIComponent(date)}`);
}
function createBooking(restaurantId, token, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/bookings`, {
        method: 'POST',
        token,
        body: JSON.stringify(payload)
    });
}
function fetchMyBookings(token) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/users/me/bookings', {
        token
    });
}
function cancelBooking(token, bookingId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/users/me/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        token
    });
}
}),
"[project]/src/shared/types/booking.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BOOKING_STATUS_LABELS",
    ()=>BOOKING_STATUS_LABELS,
    "BOOKING_STATUS_OPTIONS",
    ()=>BOOKING_STATUS_OPTIONS
]);
const BOOKING_STATUS_LABELS = {
    pending: 'Ожидает подтверждения',
    confirmed: 'Подтверждено',
    cancelled: 'Отменено',
    completed: 'Завершено'
};
const BOOKING_STATUS_OPTIONS = [
    'pending',
    'confirmed',
    'cancelled',
    'completed'
];
}),
"[project]/src/views/RestaurantGuestAccountPage.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantGuestAccountPage",
    ()=>RestaurantGuestAccountPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/routing/restaurant-guest-path.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$utils$2f$phone$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/utils/phone.util.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$api$2f$bookings$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/api/bookings.api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$booking$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/booking.ts [app-ssr] (ecmascript)");
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
const STATUS_BADGE = {
    pending: 'home__booking-badge--pending',
    confirmed: 'home__booking-badge--confirmed',
    cancelled: 'home__booking-badge--cancelled',
    completed: 'home__booking-badge--completed'
};
function RestaurantGuestAccountPage({ restaurantId, restaurantName }) {
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((s)=>s.user);
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((s)=>s.accessToken);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((s)=>s.logout);
    const paths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRestaurantGuestPaths"])(restaurantId);
    const [bookings, setBookings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadBookings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!accessToken) {
            setLoading(false);
            return;
        }
        try {
            setBookings(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$api$2f$bookings$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchMyBookings"])(accessToken));
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось загрузить брони');
        } finally{
            setLoading(false);
        }
    }, [
        accessToken
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void loadBookings();
    }, [
        loadBookings
    ]);
    async function handleCancel(bookingId) {
        if (!accessToken) return;
        try {
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$api$2f$bookings$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancelBooking"])(accessToken, bookingId);
            setBookings((prev)=>prev.map((b)=>b.id === updated.id ? updated : b));
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось отменить бронь');
        }
    }
    if (!user) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "home",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "glass-header home__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: paths.home,
                        className: "glass-header__link glass-header__link--accent home__back",
                        children: [
                            "← ",
                            restaurantName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "glass-header__title",
                        children: "Личный кабинет"
                    }, void 0, false, {
                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "glass-header__link home__logout",
                        onClick: logout,
                        children: "Выйти"
                    }, void 0, false, {
                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "home__main",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "home__greeting",
                        children: [
                            "Здравствуйте, ",
                            user.firstName,
                            " ",
                            user.lastName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "home__email",
                        children: user.phone ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$utils$2f$phone$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatPhoneDisplay"])(user.phone) : user.email
                    }, void 0, false, {
                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "home__hint",
                        children: [
                            "Аккаунт зарегистрирован в «",
                            restaurantName,
                            "»."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "home__section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Действия"
                            }, void 0, false, {
                                fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "home__links",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: paths.booking,
                                        children: "Бронирование"
                                    }, void 0, false, {
                                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                        lineNumber: 101,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: paths.preOrder,
                                        children: "Предзаказ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                        lineNumber: 102,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "home__section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Мои брони"
                            }, void 0, false, {
                                fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "home__hint",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                lineNumber: 108,
                                columnNumber: 21
                            }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "home__hint",
                                children: "Загрузка…"
                            }, void 0, false, {
                                fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this) : bookings.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "home__hint",
                                children: "Пока нет бронирований."
                            }, void 0, false, {
                                fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "home__bookings",
                                children: bookings.map((booking)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "home__booking",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "home__booking-info",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            booking.bookingDate,
                                                            " в ",
                                                            booking.bookingTime.slice(0, 5)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                                        lineNumber: 118,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Гостей: ",
                                                            booking.guestCount
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `home__booking-badge ${STATUS_BADGE[booking.status]}`,
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$booking$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS_LABELS"][booking.status]
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                                lineNumber: 117,
                                                columnNumber: 19
                                            }, this),
                                            (booking.status === 'pending' || booking.status === 'confirmed') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "home__booking-cancel",
                                                onClick: ()=>void handleCancel(booking.id),
                                                children: "Отменить"
                                            }, void 0, false, {
                                                fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                                lineNumber: 127,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, booking.id, true, {
                                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                        lineNumber: 116,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/views/RestaurantGuestAccountPage.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_dbfaae7c._.js.map