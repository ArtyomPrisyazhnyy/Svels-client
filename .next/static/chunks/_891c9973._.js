(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/shared/components/SocialIcon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SocialIcon",
    ()=>SocialIcon,
    "socialIconClassName",
    ()=>socialIconClassName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function SocialIcon(param) {
    let { platform, className, title } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        width: "24",
        height: "24",
        "aria-hidden": title ? undefined : true,
        role: title ? 'img' : 'presentation',
        children: [
            title ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: title
            }, void 0, false, {
                fileName: "[project]/src/shared/components/SocialIcon.tsx",
                lineNumber: 19,
                columnNumber: 16
            }, this) : null,
            renderIconPath(platform)
        ]
    }, void 0, true, {
        fileName: "[project]/src/shared/components/SocialIcon.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = SocialIcon;
function renderIconPath(platform) {
    switch(platform){
        case 'telegram':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "currentColor",
                d: "M9.04 15.314 8.664 20.616c.538 0 .77-.231 1.049-.508l2.517-2.405 5.216 3.817c.957.527 1.637.252 1.898-.871l3.412-16.089h-.001c.305-1.418-.512-2.044-1.421-1.691L2.337 9.854C.968 10.381.987 11.143 2.09 11.483l4.918 1.531 11.398-7.191c.537-.328 1.025-.146.623.19"
            }, void 0, false, {
                fileName: "[project]/src/shared/components/SocialIcon.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this);
        case 'instagram':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "3.5",
                        y: "3.5",
                        width: "17",
                        height: "17",
                        rx: "5",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/src/shared/components/SocialIcon.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "12",
                        cy: "12",
                        r: "4.2",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/src/shared/components/SocialIcon.tsx",
                        lineNumber: 38,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "17.4",
                        cy: "6.6",
                        r: "1.2",
                        fill: "currentColor"
                    }, void 0, false, {
                        fileName: "[project]/src/shared/components/SocialIcon.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true);
        case 'vk':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "currentColor",
                d: "M19.376 17.123h-1.744c-.66 0-.862-.525-2.049-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.254.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"
            }, void 0, false, {
                fileName: "[project]/src/shared/components/SocialIcon.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this);
        case 'facebook':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "currentColor",
                d: "M13.5 8.5V6.8c0-.8.2-1.2 1.2-1.2H16V3h-2.1C11 3 9.5 4.4 9.5 7v1.5H8v2.8h1.5V21h4V11.3h2.7l.3-2.8H13.5Z"
            }, void 0, false, {
                fileName: "[project]/src/shared/components/SocialIcon.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this);
        case 'youtube':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "currentColor",
                d: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C17.8 5 12 5 12 5s-5.8 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C6.2 19 12 19 12 19s5.8 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"
            }, void 0, false, {
                fileName: "[project]/src/shared/components/SocialIcon.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, this);
        case 'tiktok':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "currentColor",
                d: "M16.5 4.2c.8 1.1 1.8 1.9 3.2 2v3.1c-1.2 0-2.3-.4-3.2-1v6.4a5.7 5.7 0 1 1-5.7-5.7c.3 0 .7 0 1 .1v3.2a2.5 2.5 0 1 0 2 2.4V4.2h2.7Z"
            }, void 0, false, {
                fileName: "[project]/src/shared/components/SocialIcon.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, this);
        case 'twitter':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "currentColor",
                d: "M17.7 4H20l-6.2 7.1L21 20h-5.4l-4.2-5.5L6.4 20H4l6.6-7.5L3 4h5.5l3.8 5L17.7 4Zm-1.9 14.3h1.5L7.8 5.6H6.2l9.6 12.7Z"
            }, void 0, false, {
                fileName: "[project]/src/shared/components/SocialIcon.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this);
        case 'whatsapp':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "currentColor",
                d: "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Zm0 16.2c-1.4 0-2.7-.4-3.8-1.1l-.3-.2-2.8.7.7-2.7-.2-.3A7.2 7.2 0 1 1 12 19.2Zm4-5.4c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.6.1-.2.2-.7.8-.9 1-.2.2-.3.2-.6.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.4.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.1 0-.2 0-.3 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2 0 1.2.8 2.4 1 2.5.1.2 1.7 2.6 4.1 3.6.6.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.2-.1-.4-.2Z"
            }, void 0, false, {
                fileName: "[project]/src/shared/components/SocialIcon.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "12",
                        cy: "12",
                        r: "9",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/src/shared/components/SocialIcon.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        d: "M8.5 12h7M12 8.5v7"
                    }, void 0, false, {
                        fileName: "[project]/src/shared/components/SocialIcon.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true);
    }
}
function socialIconClassName(platform) {
    return "social-icon social-icon--".concat(platform);
}
var _c;
__turbopack_context__.k.register(_c, "SocialIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/social/detect-social-platform.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "detectSocialPlatform",
    ()=>detectSocialPlatform,
    "normalizeSocialUrlForSubmit",
    ()=>normalizeSocialUrlForSubmit
]);
function normalizeSocialUrl(input) {
    const trimmed = input.trim();
    if (!trimmed) {
        return null;
    }
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : "https://".concat(trimmed);
    try {
        const parsed = new URL(withProtocol);
        if (![
            'http:',
            'https:'
        ].includes(parsed.protocol)) {
            return null;
        }
        return parsed.toString();
    } catch (e) {
        return null;
    }
}
function detectSocialPlatform(url) {
    const normalized = normalizeSocialUrl(url);
    if (!normalized) {
        return 'other';
    }
    const hostname = new URL(normalized).hostname.replace(/^www\./i, '').toLowerCase();
    if (hostname === 't.me' || hostname === 'telegram.me' || hostname.endsWith('.t.me')) {
        return 'telegram';
    }
    if (hostname === 'instagram.com' || hostname.endsWith('.instagram.com')) {
        return 'instagram';
    }
    if (hostname === 'vk.com' || hostname === 'vk.ru' || hostname.endsWith('.vk.com') || hostname.endsWith('.vk.ru')) {
        return 'vk';
    }
    if (hostname === 'facebook.com' || hostname === 'fb.com' || hostname.endsWith('.facebook.com')) {
        return 'facebook';
    }
    if (hostname === 'youtube.com' || hostname === 'youtu.be' || hostname.endsWith('.youtube.com')) {
        return 'youtube';
    }
    if (hostname === 'tiktok.com' || hostname.endsWith('.tiktok.com')) {
        return 'tiktok';
    }
    if (hostname === 'twitter.com' || hostname === 'x.com' || hostname.endsWith('.twitter.com') || hostname.endsWith('.x.com')) {
        return 'twitter';
    }
    if (hostname === 'wa.me' || hostname === 'whatsapp.com' || hostname.endsWith('.whatsapp.com')) {
        return 'whatsapp';
    }
    return 'other';
}
function normalizeSocialUrlForSubmit(input) {
    return normalizeSocialUrl(input);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/types/social-link.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SOCIAL_PLATFORM_LABELS",
    ()=>SOCIAL_PLATFORM_LABELS,
    "getSocialLinkDisplayLabel",
    ()=>getSocialLinkDisplayLabel
]);
const SOCIAL_PLATFORM_LABELS = {
    telegram: 'Telegram',
    instagram: 'Instagram',
    vk: 'ВКонтакте',
    facebook: 'Facebook',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    twitter: 'X (Twitter)',
    whatsapp: 'WhatsApp',
    other: 'Ссылка'
};
function getSocialLinkDisplayLabel(link) {
    var _link_label;
    return ((_link_label = link.label) === null || _link_label === void 0 ? void 0 : _link_label.trim()) || SOCIAL_PLATFORM_LABELS[link.platform];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurant-admin/api/social-links.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSocialLink",
    ()=>createSocialLink,
    "deleteSocialLink",
    ()=>deleteSocialLink,
    "fetchSocialLinks",
    ()=>fetchSocialLinks,
    "updateSocialLink",
    ()=>updateSocialLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-client] (ecmascript)");
;
function fetchSocialLinks(restaurantId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/social-links"));
}
function createSocialLink(restaurantId, token, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/social-links"), {
        method: 'POST',
        token,
        body: JSON.stringify(payload)
    });
}
function updateSocialLink(restaurantId, token, linkId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/social-links/").concat(linkId), {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
function deleteSocialLink(restaurantId, token, linkId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/social-links/").concat(linkId), {
        method: 'DELETE',
        token
    });
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
"[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SocialLinksAdminPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$SocialIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/components/SocialIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$social$2f$detect$2d$social$2d$platform$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/social/detect-social-platform.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$social$2d$link$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/social-link.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$social$2d$links$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/social-links.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/features/restaurants/actions/data:0f6329 [app-client] (ecmascript) <text/javascript>");
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
const FORM_FIELD_IDS = [
    'social-link-label',
    'social-link-url'
];
function handleEnterNavigation(event) {
    if (event.key !== 'Enter') {
        return;
    }
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.type === 'submit') {
        return;
    }
    event.preventDefault();
    const index = FORM_FIELD_IDS.indexOf(target.id);
    if (index >= 0 && index < FORM_FIELD_IDS.length - 1) {
        var _document_getElementById;
        (_document_getElementById = document.getElementById(FORM_FIELD_IDS[index + 1])) === null || _document_getElementById === void 0 ? void 0 : _document_getElementById.focus();
        return;
    }
    if (index === FORM_FIELD_IDS.length - 1) {
        var _event_currentTarget_querySelector;
        (_event_currentTarget_querySelector = event.currentTarget.querySelector('.social-links-admin__submit')) === null || _event_currentTarget_querySelector === void 0 ? void 0 : _event_currentTarget_querySelector.focus();
    }
}
function SocialLinksAdminPage() {
    _s();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "SocialLinksAdminPage.useAuthStore[user]": (s)=>s.user
    }["SocialLinksAdminPage.useAuthStore[user]"]);
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "SocialLinksAdminPage.useAuthStore[accessToken]": (s)=>s.accessToken
    }["SocialLinksAdminPage.useAuthStore[accessToken]"]);
    const restaurantId = user === null || user === void 0 ? void 0 : user.restaurantId;
    const [links, setLinks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [label, setLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [url, setUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [editingLink, setEditingLink] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const detectedPlatform = url.trim() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$social$2f$detect$2d$social$2d$platform$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["detectSocialPlatform"])(url) : null;
    const labelPlaceholder = detectedPlatform ? "Например: наш ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$social$2d$link$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL_PLATFORM_LABELS"][detectedPlatform]) : 'Например: мы в Instagram';
    const loadLinks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SocialLinksAdminPage.useCallback[loadLinks]": async ()=>{
            if (!restaurantId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$social$2d$links$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSocialLinks"])(restaurantId);
                setLinks(data);
            } catch (err) {
                setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось загрузить ссылки');
            } finally{
                setLoading(false);
            }
        }
    }["SocialLinksAdminPage.useCallback[loadLinks]"], [
        restaurantId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SocialLinksAdminPage.useEffect": ()=>{
            void loadLinks();
        }
    }["SocialLinksAdminPage.useEffect"], [
        loadLinks
    ]);
    function resetForm() {
        setLabel('');
        setUrl('');
        setEditingLink(null);
        setError(null);
    }
    function handleEdit(link) {
        setEditingLink(link);
        var _link_label;
        setLabel((_link_label = link.label) !== null && _link_label !== void 0 ? _link_label : '');
        setUrl(link.url);
        setError(null);
    }
    async function handleSubmit(event) {
        event.preventDefault();
        if (!restaurantId || !accessToken) return;
        const normalizedUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$social$2f$detect$2d$social$2d$platform$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeSocialUrlForSubmit"])(url);
        if (!normalizedUrl) {
            setError('Укажите корректную ссылку (например, https://t.me/your_channel)');
            return;
        }
        const trimmedLabel = label.trim();
        setSaving(true);
        setError(null);
        try {
            if (editingLink) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$social$2d$links$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateSocialLink"])(restaurantId, accessToken, editingLink.id, {
                    url: normalizedUrl,
                    label: trimmedLabel || null
                });
            } else {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$social$2d$links$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSocialLink"])(restaurantId, accessToken, {
                    url: normalizedUrl,
                    ...trimmedLabel ? {
                        label: trimmedLabel
                    } : {}
                });
            }
            resetForm();
            await loadLinks();
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["revalidateRestaurantPublicPage"])(restaurantId);
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : editingLink ? 'Не удалось сохранить изменения' : 'Не удалось добавить ссылку');
        } finally{
            setSaving(false);
        }
    }
    async function handleDelete(linkId) {
        if (!restaurantId || !accessToken) return;
        if (!window.confirm('Удалить ссылку?')) return;
        setError(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$social$2d$links$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteSocialLink"])(restaurantId, accessToken, linkId);
            if ((editingLink === null || editingLink === void 0 ? void 0 : editingLink.id) === linkId) {
                resetForm();
            }
            await loadLinks();
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["revalidateRestaurantPublicPage"])(restaurantId);
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось удалить ссылку');
        }
    }
    if (!restaurantId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "social-links-admin__notice",
            children: "Заявка ещё на модерации или ресторан не привязан к аккаунту."
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
            lineNumber: 169,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "social-links-admin",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "social-links-admin__panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: editingLink ? 'Редактирование ссылки' : 'Добавить ссылку'
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "social-links-admin__hint",
                        children: "Укажите ссылку и подпись, которую увидят гости — например «наш Instagram» или просто «Telegram». Иконка подставится автоматически по адресу ссылки."
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "social-links-admin__error",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                        lineNumber: 184,
                        columnNumber: 19
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        className: "social-links-admin__form",
                        onSubmit: handleSubmit,
                        onKeyDown: handleEnterNavigation,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "social-links-admin__field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "social-link-label",
                                        children: "Подпись"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                        lineNumber: 192,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "social-link-label",
                                        type: "text",
                                        maxLength: 120,
                                        placeholder: labelPlaceholder,
                                        value: label,
                                        onChange: (e)=>setLabel(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                        lineNumber: 193,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                lineNumber: 191,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "social-links-admin__field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "social-link-url",
                                        children: "Ссылка *"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "social-links-admin__input-row",
                                        children: [
                                            detectedPlatform && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$SocialIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialIconClassName"])(detectedPlatform),
                                                "aria-hidden": "true",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$SocialIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SocialIcon"], {
                                                    platform: detectedPlatform
                                                }, void 0, false, {
                                                    fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                                lineNumber: 207,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                id: "social-link-url",
                                                type: "url",
                                                inputMode: "url",
                                                placeholder: "https://t.me/your_channel",
                                                value: url,
                                                onChange: (e)=>setUrl(e.target.value),
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                                lineNumber: 211,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            detectedPlatform && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "social-links-admin__detected",
                                children: [
                                    "Определено: ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$social$2d$link$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL_PLATFORM_LABELS"][detectedPlatform],
                                    !label.trim() && " · подпись по умолчанию: ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$social$2d$link$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL_PLATFORM_LABELS"][detectedPlatform])
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                lineNumber: 224,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "social-links-admin__actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "social-links-admin__submit",
                                        type: "submit",
                                        disabled: saving,
                                        children: saving ? 'Сохранение…' : editingLink ? 'Сохранить' : 'Добавить'
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                        lineNumber: 231,
                                        columnNumber: 13
                                    }, this),
                                    editingLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "social-links-admin__cancel",
                                        type: "button",
                                        disabled: saving,
                                        onClick: resetForm,
                                        children: "Отмена"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                        lineNumber: 235,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "social-links-admin__list-panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Ваши соцсети"
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "social-links-admin__empty",
                        children: "Загрузка…"
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                        lineNumber: 252,
                        columnNumber: 11
                    }, this) : links.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "social-links-admin__empty",
                        children: "Пока нет добавленных ссылок."
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                        lineNumber: 254,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "social-links-admin__list",
                        children: links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "social-links-admin__item".concat((editingLink === null || editingLink === void 0 ? void 0 : editingLink.id) === link.id ? ' social-links-admin__item--editing' : ''),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$SocialIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialIconClassName"])(link.platform),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$SocialIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SocialIcon"], {
                                            platform: link.platform,
                                            title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$social$2d$link$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSocialLinkDisplayLabel"])(link)
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                            lineNumber: 265,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                        lineNumber: 264,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "social-links-admin__item-body",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$social$2d$link$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSocialLinkDisplayLabel"])(link)
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                                lineNumber: 271,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: link.url,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                children: link.url
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                                lineNumber: 272,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                        lineNumber: 270,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "social-links-admin__item-actions",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleEdit(link),
                                                children: "Изменить"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                                lineNumber: 277,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "social-links-admin__delete",
                                                onClick: ()=>void handleDelete(link.id),
                                                children: "Удалить"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                                lineNumber: 280,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                        lineNumber: 276,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, link.id, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                                lineNumber: 258,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                        lineNumber: 256,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurant-admin/pages/SocialLinksAdminPage.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
}
_s(SocialLinksAdminPage, "++Vw4mTAyvLS46LebJCQHx1JynY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = SocialLinksAdminPage;
var _c;
__turbopack_context__.k.register(_c, "SocialLinksAdminPage");
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

//# sourceMappingURL=_891c9973._.js.map