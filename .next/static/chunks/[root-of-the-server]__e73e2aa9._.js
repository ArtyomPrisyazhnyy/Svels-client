(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/src/shared/types/restaurant-styling.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_RESTAURANT_STYLING",
    ()=>DEFAULT_RESTAURANT_STYLING,
    "MAGAZINE_CARD_LAYOUT_OPTIONS",
    ()=>MAGAZINE_CARD_LAYOUT_OPTIONS,
    "RESTAURANT_BUTTON_SHAPE_OPTIONS",
    ()=>RESTAURANT_BUTTON_SHAPE_OPTIONS,
    "RESTAURANT_BUTTON_VARIANT_OPTIONS",
    ()=>RESTAURANT_BUTTON_VARIANT_OPTIONS,
    "RESTAURANT_CARD_STYLE_OPTIONS",
    ()=>RESTAURANT_CARD_STYLE_OPTIONS,
    "RESTAURANT_COLOR_THEME_OPTIONS",
    ()=>RESTAURANT_COLOR_THEME_OPTIONS,
    "RESTAURANT_CURRENCY_OPTIONS",
    ()=>RESTAURANT_CURRENCY_OPTIONS,
    "RESTAURANT_FONT_OPTIONS",
    ()=>RESTAURANT_FONT_OPTIONS,
    "RESTAURANT_FOOTER_ACCENT_OPTIONS",
    ()=>RESTAURANT_FOOTER_ACCENT_OPTIONS,
    "RESTAURANT_FOOTER_LAYOUT_OPTIONS",
    ()=>RESTAURANT_FOOTER_LAYOUT_OPTIONS,
    "RESTAURANT_HEADER_BEHAVIOR_OPTIONS",
    ()=>RESTAURANT_HEADER_BEHAVIOR_OPTIONS,
    "RESTAURANT_HEADER_STYLE_OPTIONS",
    ()=>RESTAURANT_HEADER_STYLE_OPTIONS,
    "RESTAURANT_SWITCHER_STYLE_OPTIONS",
    ()=>RESTAURANT_SWITCHER_STYLE_OPTIONS,
    "createDefaultRestaurantStyling",
    ()=>createDefaultRestaurantStyling
]);
const DEFAULT_RESTAURANT_STYLING = {
    fontFamily: 'system',
    colorTheme: 'classic',
    currencyDisplay: 'byn_glyph',
    buttonShape: 'rounded',
    buttonVariant: 'filled',
    switcherStyle: 'pill',
    cardStyle: 'classic',
    magazineCardLayout: 'content_left',
    menuCategoryNavEnabled: false,
    headerStyle: 'glass',
    headerBehavior: 'sticky',
    footerLayout: 'columns',
    footerAccent: 'flat'
};
const RESTAURANT_FONT_OPTIONS = [
    {
        value: 'system',
        label: 'Системный',
        sample: 'Aa Бb 123'
    },
    {
        value: 'inter',
        label: 'Inter',
        sample: 'Aa Бb 123'
    },
    {
        value: 'georgia',
        label: 'Georgia',
        sample: 'Aa Бb 123'
    },
    {
        value: 'montserrat',
        label: 'Montserrat',
        sample: 'Aa Бb 123'
    },
    {
        value: 'playfair',
        label: 'Playfair Display',
        sample: 'Aa Бb 123'
    },
    {
        value: 'gothic60',
        label: 'Gothic №60',
        sample: 'Aa Бb 123'
    },
    {
        value: 'marmelad',
        label: 'Marmelad',
        sample: 'Aa Бb 123'
    },
    {
        value: 'comfortaa',
        label: 'Comfortaa',
        sample: 'Aa Бb 123'
    },
    {
        value: 'comicRelief',
        label: 'Comic Relief',
        sample: 'Aa Бb 123'
    },
    {
        value: 'roboto',
        label: 'Roboto',
        sample: 'Aa Бb 123'
    }
];
const RESTAURANT_COLOR_THEME_OPTIONS = [
    {
        value: 'classic',
        label: 'Классическая',
        description: 'Текущее оформление — бирюзовые акценты и синие кнопки',
        swatches: [
            '#0f766e',
            '#2563eb',
            '#f8fafc'
        ]
    },
    {
        value: 'ocean',
        label: 'Океан',
        description: 'Спокойные синие оттенки',
        swatches: [
            '#0369a1',
            '#0284c7',
            '#f0f9ff'
        ]
    },
    {
        value: 'forest',
        label: 'Лес',
        description: 'Натуральные зелёные тона',
        swatches: [
            '#15803d',
            '#16a34a',
            '#f0fdf4'
        ]
    },
    {
        value: 'warm',
        label: 'Тёплая',
        description: 'Янтарные и терракотовые акценты',
        swatches: [
            '#c2410c',
            '#ea580c',
            '#fff7ed'
        ]
    },
    {
        value: 'berry',
        label: 'Ягодная',
        description: 'Бордовые и розовые акценты',
        swatches: [
            '#be123c',
            '#e11d48',
            '#fff1f2'
        ]
    },
    {
        value: 'lavender',
        label: 'Лавандовая',
        description: 'Мягкие фиолетовые оттенки',
        swatches: [
            '#7c3aed',
            '#8b5cf6',
            '#faf5ff'
        ]
    },
    {
        value: 'midnight',
        label: 'Полночь',
        description: 'Тёмное оформление с синими акцентами',
        swatches: [
            '#38bdf8',
            '#3b82f6',
            '#0f172a'
        ]
    },
    {
        value: 'ember',
        label: 'Угли',
        description: 'Тёплый тёмный фон с янтарными акцентами',
        swatches: [
            '#fb923c',
            '#f97316',
            '#1c1917'
        ]
    },
    {
        value: 'obsidian',
        label: 'Обсидиан',
        description: 'Глубокий чёрный с фиолетовыми акцентами',
        swatches: [
            '#a78bfa',
            '#8b5cf6',
            '#09090b'
        ]
    },
    {
        value: 'moss',
        label: 'Ночной лес',
        description: 'Тёмно-зелёное оформление с изумрудными акцентами',
        swatches: [
            '#34d399',
            '#10b981',
            '#052e16'
        ]
    },
    {
        value: 'wine',
        label: 'Винная',
        description: 'Бордовый тёмный фон с розовыми акцентами',
        swatches: [
            '#fb7185',
            '#f43f5e',
            '#1a0a0f'
        ]
    },
    {
        value: 'sand',
        label: 'Песочная',
        description: 'Нейтральные бежевые и кофейные тона',
        swatches: [
            '#92400e',
            '#b45309',
            '#faf8f5'
        ]
    },
    {
        value: 'citrus',
        label: 'Цитрус',
        description: 'Солнечные жёлтые акценты',
        swatches: [
            '#ca8a04',
            '#eab308',
            '#fefce8'
        ]
    },
    {
        value: 'graphite',
        label: 'Графит',
        description: 'Сдержанная серая палитра',
        swatches: [
            '#52525b',
            '#3f3f46',
            '#f4f4f5'
        ]
    },
    {
        value: 'neon',
        label: 'Неон',
        description: 'Глубокий чёрный фон с яркими неоновыми розовыми акцентами',
        swatches: [
            '#ff3d8b',
            '#ec4899',
            '#06040a'
        ]
    }
];
const RESTAURANT_CURRENCY_OPTIONS = [
    {
        value: 'byn_glyph',
        label: 'Знак BYN',
        description: 'Официальный графический знак белорусского рубля'
    },
    {
        value: 'byn',
        label: 'BYN',
        description: 'Текстовое обозначение BYN'
    },
    {
        value: 'r',
        label: 'р',
        description: 'Краткое «р» после суммы'
    },
    {
        value: 'rub',
        label: 'руб',
        description: 'Полное «руб» после суммы'
    }
];
const RESTAURANT_BUTTON_SHAPE_OPTIONS = [
    {
        value: 'rounded',
        label: 'Скруглённые',
        description: 'Умеренное скругление углов'
    },
    {
        value: 'pill',
        label: 'Капсула',
        description: 'Полностью скруглённые кнопки'
    }
];
const RESTAURANT_BUTTON_VARIANT_OPTIONS = [
    {
        value: 'filled',
        label: 'Заливка',
        description: 'Яркие кнопки с цветным фоном'
    },
    {
        value: 'outline',
        label: 'Контур',
        description: 'Прозрачный фон и цветная обводка'
    },
    {
        value: 'soft',
        label: 'Мягкие',
        description: 'Светлый фон и цветной текст'
    }
];
const RESTAURANT_SWITCHER_STYLE_OPTIONS = [
    {
        value: 'pill',
        label: 'Капсула',
        description: 'Плавающий индикатор, как в iOS'
    },
    {
        value: 'segmented',
        label: 'Сегменты',
        description: 'Отдельные блоки с заливкой активного пункта'
    },
    {
        value: 'tabs',
        label: 'Вкладки',
        description: 'Подчёркивание активного способа получения'
    }
];
const RESTAURANT_CARD_STYLE_OPTIONS = [
    {
        value: 'classic',
        label: 'Классическая',
        description: 'Вертикальная карточка с рамкой и тенью на hover'
    },
    {
        value: 'elevated',
        label: 'Парящая',
        description: 'Без рамки, мягкая тень всегда, скруглённое фото'
    },
    {
        value: 'overlay',
        label: 'Поверх фото',
        description: 'Текст поверх изображения с градиентным затемнением'
    },
    {
        value: 'minimal',
        label: 'Минимальная',
        description: 'Без рамки и тени, максимум воздуха, акцент на типографике'
    },
    {
        value: 'glass',
        label: 'Стекло',
        description: 'Полупрозрачный фон с размытием, тонкая рамка'
    },
    {
        value: 'magazine',
        label: 'Журнальная',
        description: 'Горизонтальная компоновка, крупный заголовок'
    }
];
const MAGAZINE_CARD_LAYOUT_OPTIONS = [
    {
        value: 'content_left',
        label: 'Текст слева, фото справа',
        description: 'Текущий вид: название и цена слева, изображение справа'
    },
    {
        value: 'media_left',
        label: 'Фото слева, текст справа',
        description: 'Изображение слева, название и цена справа'
    }
];
const RESTAURANT_HEADER_STYLE_OPTIONS = [
    {
        value: 'glass',
        label: 'Стекло',
        description: 'Полупрозрачный размытый фон (matte glass)'
    },
    {
        value: 'solid',
        label: 'Плотный',
        description: 'Непрозрачный фон с лёгкой тенью снизу'
    },
    {
        value: 'bordered',
        label: 'С рамкой',
        description: 'Прозрачный фон, только тонкая нижняя разделительная линия'
    }
];
const RESTAURANT_HEADER_BEHAVIOR_OPTIONS = [
    {
        value: 'sticky',
        label: 'Закреплённый',
        description: 'Шапка всегда видна и приклеена к верху при прокрутке'
    },
    {
        value: 'hide-on-scroll',
        label: 'Скрывается при прокрутке',
        description: 'Уходит вверх при прокрутке вниз, возвращается при прокрутке вверх'
    }
];
const RESTAURANT_FOOTER_LAYOUT_OPTIONS = [
    {
        value: 'columns',
        label: 'Колонки',
        description: 'Бренд слева, навигация и соцсети колонками справа'
    },
    {
        value: 'centered',
        label: 'По центру',
        description: 'Все блоки выровнены по центру, одна колонка'
    },
    {
        value: 'minimal',
        label: 'Минималистичный',
        description: 'Только бренд и нижняя строка, без колонок навигации'
    }
];
const RESTAURANT_FOOTER_ACCENT_OPTIONS = [
    {
        value: 'flat',
        label: 'Плоский',
        description: 'Нейтральный фон, тонкая разделительная линия'
    },
    {
        value: 'tinted',
        label: 'Тонированный',
        description: 'Фон с лёгким оттенком акцентного цвета'
    },
    {
        value: 'top-border',
        label: 'Акцентная полоса',
        description: 'Яркая полоса акцентного цвета сверху футера'
    }
];
function createDefaultRestaurantStyling(restaurantId) {
    return {
        restaurantId,
        ...DEFAULT_RESTAURANT_STYLING,
        updatedAt: new Date().toISOString()
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/utils/restaurant-styling.util.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildRestaurantStylingVars",
    ()=>buildRestaurantStylingVars,
    "getFontStack",
    ()=>getFontStack,
    "getGoogleFontHref",
    ()=>getGoogleFontHref,
    "getRestaurantStylingDomProps",
    ()=>getRestaurantStylingDomProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/restaurant-styling.ts [app-client] (ecmascript)");
;
const FONT_STACKS = {
    system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    inter: 'var(--font-rs-inter), system-ui, sans-serif',
    georgia: 'Georgia, "Times New Roman", serif',
    montserrat: 'var(--font-rs-montserrat), system-ui, sans-serif',
    playfair: 'var(--font-rs-playfair), Georgia, serif',
    gothic60: '"Gothic №60", system-ui, sans-serif',
    marmelad: 'var(--font-rs-marmelad), system-ui, sans-serif',
    comfortaa: 'var(--font-rs-comfortaa), system-ui, sans-serif',
    comicRelief: 'var(--font-rs-comic-relief), "Comic Sans MS", system-ui, sans-serif',
    roboto: 'var(--font-rs-roboto), system-ui, sans-serif'
};
const COLOR_THEMES = {
    classic: {
        bg: '#f8fafc',
        text: '#0f172a',
        textMuted: '#64748b',
        textSoft: '#94a3b8',
        accent: '#0f766e',
        primary: '#2563eb',
        primaryHover: '#1d4ed8',
        primarySoft: '#eff6ff',
        border: '#e2e8f0',
        surface: '#ffffff'
    },
    ocean: {
        bg: '#f0f9ff',
        text: '#0c4a6e',
        textMuted: '#0369a1',
        textSoft: '#7dd3fc',
        accent: '#0369a1',
        primary: '#0284c7',
        primaryHover: '#0369a1',
        primarySoft: '#e0f2fe',
        border: '#bae6fd',
        surface: '#ffffff'
    },
    forest: {
        bg: '#f0fdf4',
        text: '#14532d',
        textMuted: '#166534',
        textSoft: '#86efac',
        accent: '#15803d',
        primary: '#16a34a',
        primaryHover: '#15803d',
        primarySoft: '#dcfce7',
        border: '#bbf7d0',
        surface: '#ffffff'
    },
    warm: {
        bg: '#fff7ed',
        text: '#7c2d12',
        textMuted: '#9a3412',
        textSoft: '#fdba74',
        accent: '#c2410c',
        primary: '#ea580c',
        primaryHover: '#c2410c',
        primarySoft: '#ffedd5',
        border: '#fed7aa',
        surface: '#ffffff'
    },
    berry: {
        bg: '#fff1f2',
        text: '#881337',
        textMuted: '#be123c',
        textSoft: '#fda4af',
        accent: '#be123c',
        primary: '#e11d48',
        primaryHover: '#be123c',
        primarySoft: '#ffe4e6',
        border: '#fecdd3',
        surface: '#ffffff'
    },
    lavender: {
        bg: '#faf5ff',
        text: '#581c87',
        textMuted: '#7e22ce',
        textSoft: '#c4b5fd',
        accent: '#7c3aed',
        primary: '#8b5cf6',
        primaryHover: '#7c3aed',
        primarySoft: '#ede9fe',
        border: '#ddd6fe',
        surface: '#ffffff'
    },
    midnight: {
        bg: '#0f172a',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        textSoft: '#64748b',
        accent: '#38bdf8',
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        primarySoft: '#1e293b',
        border: '#334155',
        surface: '#1e293b'
    },
    ember: {
        bg: '#1c1917',
        text: '#fafaf9',
        textMuted: '#a8a29e',
        textSoft: '#78716c',
        accent: '#fb923c',
        primary: '#f97316',
        primaryHover: '#ea580c',
        primarySoft: '#292524',
        border: '#44403c',
        surface: '#292524'
    },
    obsidian: {
        bg: '#09090b',
        text: '#fafafa',
        textMuted: '#a1a1aa',
        textSoft: '#71717a',
        accent: '#a78bfa',
        primary: '#8b5cf6',
        primaryHover: '#7c3aed',
        primarySoft: '#18181b',
        border: '#3f3f46',
        surface: '#18181b'
    },
    moss: {
        bg: '#052e16',
        text: '#ecfdf5',
        textMuted: '#86efac',
        textSoft: '#4ade80',
        accent: '#34d399',
        primary: '#10b981',
        primaryHover: '#059669',
        primarySoft: '#064e3b',
        border: '#166534',
        surface: '#064e3b'
    },
    wine: {
        bg: '#1a0a0f',
        text: '#fdf2f8',
        textMuted: '#f9a8d4',
        textSoft: '#f472b6',
        accent: '#fb7185',
        primary: '#f43f5e',
        primaryHover: '#e11d48',
        primarySoft: '#2d0a14',
        border: '#4c0519',
        surface: '#2d0a14'
    },
    sand: {
        bg: '#faf8f5',
        text: '#44403c',
        textMuted: '#78716c',
        textSoft: '#a8a29e',
        accent: '#92400e',
        primary: '#b45309',
        primaryHover: '#92400e',
        primarySoft: '#fef3c7',
        border: '#e7e5e4',
        surface: '#ffffff'
    },
    citrus: {
        bg: '#fefce8',
        text: '#713f12',
        textMuted: '#a16207',
        textSoft: '#fde047',
        accent: '#ca8a04',
        primary: '#eab308',
        primaryHover: '#ca8a04',
        primarySoft: '#fef9c3',
        border: '#fde68a',
        surface: '#ffffff'
    },
    graphite: {
        bg: '#f4f4f5',
        text: '#18181b',
        textMuted: '#52525b',
        textSoft: '#a1a1aa',
        accent: '#52525b',
        primary: '#3f3f46',
        primaryHover: '#27272a',
        primarySoft: '#e4e4e7',
        border: '#d4d4d8',
        surface: '#ffffff'
    },
    neon: {
        bg: '#06040a',
        text: '#fdf2f8',
        textMuted: '#f9a8d4',
        textSoft: '#9d174d',
        accent: '#ff3d8b',
        primary: '#ec4899',
        primaryHover: '#db2777',
        primarySoft: '#1f0814',
        border: '#4a0e2e',
        surface: '#120818'
    }
};
function getGoogleFontHref(_fontFamily) {
    // Шрифты теперь само-хостятся через next/font (см. fonts/restaurant-fonts.ts).
    // Функция оставлена для обратной совместимости, но более не используется.
    return null;
}
function resolveFontFamily(fontFamily) {
    if (fontFamily && fontFamily in FONT_STACKS) {
        return fontFamily;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].fontFamily;
}
function resolveColorTheme(colorTheme) {
    if (colorTheme && colorTheme in COLOR_THEMES) {
        return colorTheme;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].colorTheme;
}
function buildRestaurantStylingVars(styling) {
    const fontFamily = resolveFontFamily(styling.fontFamily);
    const colorTheme = resolveColorTheme(styling.colorTheme);
    var _styling_buttonShape;
    const buttonShape = (_styling_buttonShape = styling.buttonShape) !== null && _styling_buttonShape !== void 0 ? _styling_buttonShape : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].buttonShape;
    const theme = COLOR_THEMES[colorTheme];
    return {
        ['--rs-font']: FONT_STACKS[fontFamily],
        ['--rs-btn-radius']: buttonShape === 'pill' ? '999px' : '0.625rem',
        ['--rs-bg']: theme.bg,
        ['--rs-text']: theme.text,
        ['--rs-text-muted']: theme.textMuted,
        ['--rs-text-soft']: theme.textSoft,
        ['--rs-accent']: theme.accent,
        ['--rs-primary']: theme.primary,
        ['--rs-primary-hover']: theme.primaryHover,
        ['--rs-primary-soft']: theme.primarySoft,
        ['--rs-border']: theme.border,
        ['--rs-surface']: theme.surface
    };
}
function getFontStack(fontFamily) {
    return FONT_STACKS[fontFamily];
}
function getRestaurantStylingDomProps(styling) {
    var _styling_buttonShape, _styling_buttonVariant, _styling_switcherStyle, _styling_cardStyle, _styling_magazineCardLayout, _styling_menuCategoryNavEnabled, _styling_headerStyle, _styling_headerBehavior, _styling_footerLayout, _styling_footerAccent;
    return {
        'data-rs-button-shape': (_styling_buttonShape = styling.buttonShape) !== null && _styling_buttonShape !== void 0 ? _styling_buttonShape : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].buttonShape,
        'data-rs-button-variant': (_styling_buttonVariant = styling.buttonVariant) !== null && _styling_buttonVariant !== void 0 ? _styling_buttonVariant : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].buttonVariant,
        'data-rs-switcher-style': (_styling_switcherStyle = styling.switcherStyle) !== null && _styling_switcherStyle !== void 0 ? _styling_switcherStyle : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].switcherStyle,
        'data-rs-card-style': (_styling_cardStyle = styling.cardStyle) !== null && _styling_cardStyle !== void 0 ? _styling_cardStyle : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].cardStyle,
        'data-rs-magazine-layout': (_styling_magazineCardLayout = styling.magazineCardLayout) !== null && _styling_magazineCardLayout !== void 0 ? _styling_magazineCardLayout : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].magazineCardLayout,
        'data-rs-menu-category-nav': ((_styling_menuCategoryNavEnabled = styling.menuCategoryNavEnabled) !== null && _styling_menuCategoryNavEnabled !== void 0 ? _styling_menuCategoryNavEnabled : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].menuCategoryNavEnabled) ? 'true' : 'false',
        'data-rs-header-style': (_styling_headerStyle = styling.headerStyle) !== null && _styling_headerStyle !== void 0 ? _styling_headerStyle : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].headerStyle,
        'data-rs-header-behavior': (_styling_headerBehavior = styling.headerBehavior) !== null && _styling_headerBehavior !== void 0 ? _styling_headerBehavior : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].headerBehavior,
        'data-rs-footer-layout': (_styling_footerLayout = styling.footerLayout) !== null && _styling_footerLayout !== void 0 ? _styling_footerLayout : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].footerLayout,
        'data-rs-footer-accent': (_styling_footerAccent = styling.footerAccent) !== null && _styling_footerAccent !== void 0 ? _styling_footerAccent : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].footerAccent
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/internal/font/google/inter_578afd2f.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "inter_578afd2f-module__YD-fLW__className",
  "variable": "inter_578afd2f-module__YD-fLW__variable",
});
}),
"[next]/internal/font/google/inter_578afd2f.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_578afd2f.module.css [app-client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Inter', 'Inter Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/montserrat_f41b021f.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "montserrat_f41b021f-module__GYCYbW__className",
  "variable": "montserrat_f41b021f-module__GYCYbW__variable",
});
}),
"[next]/internal/font/google/montserrat_f41b021f.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/montserrat_f41b021f.module.css [app-client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Montserrat', 'Montserrat Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/playfair_display_7054ecc7.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "playfair_display_7054ecc7-module__Zv7Hga__className",
  "variable": "playfair_display_7054ecc7-module__Zv7Hga__variable",
});
}),
"[next]/internal/font/google/playfair_display_7054ecc7.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/playfair_display_7054ecc7.module.css [app-client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Playfair Display', 'Playfair Display Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/marmelad_f3798ee2.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "marmelad_f3798ee2-module__DC3Y-q__className",
  "variable": "marmelad_f3798ee2-module__DC3Y-q__variable",
});
}),
"[next]/internal/font/google/marmelad_f3798ee2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/marmelad_f3798ee2.module.css [app-client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Marmelad', 'Marmelad Fallback'",
        fontWeight: 400,
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/comfortaa_3495221b.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "comfortaa_3495221b-module__VNfz6W__className",
  "variable": "comfortaa_3495221b-module__VNfz6W__variable",
});
}),
"[next]/internal/font/google/comfortaa_3495221b.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/comfortaa_3495221b.module.css [app-client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Comfortaa', 'Comfortaa Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/comic_relief_727f76c1.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "comic_relief_727f76c1-module__FzFZ4a__className",
  "variable": "comic_relief_727f76c1-module__FzFZ4a__variable",
});
}),
"[next]/internal/font/google/comic_relief_727f76c1.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/comic_relief_727f76c1.module.css [app-client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Comic Relief'",
        fontWeight: 400,
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/roboto_a670f2f1.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "roboto_a670f2f1-module__LKQl7q__className",
  "variable": "roboto_a670f2f1-module__LKQl7q__variable",
});
}),
"[next]/internal/font/google/roboto_a670f2f1.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/roboto_a670f2f1.module.css [app-client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Roboto', 'Roboto Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/src/features/restaurants/fonts/restaurant-fonts.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RESTAURANT_FONT_CLASSES",
    ()=>RESTAURANT_FONT_CLASSES
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_578afd2f.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/montserrat_f41b021f.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/playfair_display_7054ecc7.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/marmelad_f3798ee2.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/comfortaa_3495221b.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/comic_relief_727f76c1.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/roboto_a670f2f1.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
const RESTAURANT_FONT_CLASSES = [
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].variable
].filter(Boolean).join(' ');
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
;
;
;
;
;
;
;
}),
"[project]/src/features/restaurants/context/RestaurantStylingContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantStylingPortalRoot",
    ()=>RestaurantStylingPortalRoot,
    "RestaurantStylingShell",
    ()=>RestaurantStylingShell,
    "useRestaurantStylingOptional",
    ()=>useRestaurantStylingOptional
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/restaurant-styling.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$restaurant$2d$styling$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/restaurant-styling.util.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$fonts$2f$restaurant$2d$fonts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/restaurants/fonts/restaurant-fonts.ts [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const RestaurantStylingContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function RestaurantStylingRoot(param) {
    let { styling, className, children } = param;
    const cssVars = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$restaurant$2d$styling$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildRestaurantStylingVars"])(styling);
    const domProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$restaurant$2d$styling$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRestaurantStylingDomProps"])(styling);
    const rootClassName = [
        'restaurant-styled',
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$fonts$2f$restaurant$2d$fonts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["RESTAURANT_FONT_CLASSES"],
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: rootClassName,
        style: cssVars,
        ...domProps,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/context/RestaurantStylingContext.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_c = RestaurantStylingRoot;
function RestaurantStylingShell(param) {
    let { styling, children, className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RestaurantStylingContext.Provider, {
        value: {
            styling,
            currencyDisplay: styling.currencyDisplay
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RestaurantStylingRoot, {
            styling: styling,
            className: className,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/features/restaurants/context/RestaurantStylingContext.tsx",
            lineNumber: 64,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/context/RestaurantStylingContext.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c1 = RestaurantStylingShell;
function RestaurantStylingPortalRoot(param) {
    let { children } = param;
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(RestaurantStylingContext);
    if (!context) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RestaurantStylingRoot, {
        styling: context.styling,
        className: "restaurant-styled--portal",
        children: children
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/context/RestaurantStylingContext.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(RestaurantStylingPortalRoot, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
_c2 = RestaurantStylingPortalRoot;
function useRestaurantStylingOptional() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(RestaurantStylingContext);
    return context !== null && context !== void 0 ? context : {
        styling: {
            restaurantId: '',
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"],
            updatedAt: ''
        },
        currencyDisplay: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].currencyDisplay
    };
}
_s1(useRestaurantStylingOptional, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "RestaurantStylingRoot");
__turbopack_context__.k.register(_c1, "RestaurantStylingShell");
__turbopack_context__.k.register(_c2, "RestaurantStylingPortalRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/utils/menu-category-nav.util.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMenuCategoryHeaderOffset",
    ()=>getMenuCategoryHeaderOffset,
    "resolveActiveMenuCategoryId",
    ()=>resolveActiveMenuCategoryId,
    "scrollMenuCategoryNavButtonIntoView",
    ()=>scrollMenuCategoryNavButtonIntoView
]);
function getCategoryElementId(categoryId) {
    return "menu-category-".concat(categoryId);
}
function getMenuCategoryHeaderOffset() {
    const stack = document.querySelector('.restaurant-public__header-stack');
    if (stack instanceof HTMLElement) {
        return stack.getBoundingClientRect().height;
    }
    const header = document.querySelector('.glass-header');
    if (header instanceof HTMLElement) {
        return header.getBoundingClientRect().height;
    }
    return 68;
}
function resolveActiveMenuCategoryId(categories) {
    let headerOffset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getMenuCategoryHeaderOffset();
    var _categories_;
    const marker = headerOffset + 24;
    var _categories__id;
    let activeId = (_categories__id = (_categories_ = categories[0]) === null || _categories_ === void 0 ? void 0 : _categories_.id) !== null && _categories__id !== void 0 ? _categories__id : '';
    for (const category of categories){
        const element = document.getElementById(getCategoryElementId(category.id));
        if (!element) {
            continue;
        }
        if (element.getBoundingClientRect().top <= marker) {
            activeId = category.id;
        }
    }
    return activeId;
}
function scrollMenuCategoryNavButtonIntoView(inner, activeId) {
    const activeButton = inner.querySelector('[data-category-id="'.concat(activeId, '"]'));
    if (!(activeButton instanceof HTMLElement)) {
        return;
    }
    const buttonLeft = activeButton.offsetLeft;
    const buttonWidth = activeButton.offsetWidth;
    const containerWidth = inner.clientWidth;
    const scrollTarget = buttonLeft - (containerWidth - buttonWidth) / 2;
    inner.scrollTo({
        left: Math.max(0, scrollTarget),
        behavior: 'smooth'
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/context/MenuCategoryNavContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MenuCategoryNavProvider",
    ()=>MenuCategoryNavProvider,
    "useMenuCategoryNav",
    ()=>useMenuCategoryNav,
    "useMenuCategoryNavOptional",
    ()=>useMenuCategoryNavOptional
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$category$2d$nav$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/menu-category-nav.util.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
const MenuCategoryNavContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function getCategoryElementId(categoryId) {
    return "menu-category-".concat(categoryId);
}
function updateHeaderStackHeight() {
    const stack = document.querySelector('.restaurant-public__header-stack');
    if (!(stack instanceof HTMLElement)) {
        return;
    }
    document.documentElement.style.setProperty('--rs-header-stack-height', "".concat(stack.getBoundingClientRect().height, "px"));
}
function MenuCategoryNavProvider(param) {
    let { categories, mode, children } = param;
    var _categories_;
    _s();
    var _categories__id;
    const [activeId, setActiveId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((_categories__id = (_categories_ = categories[0]) === null || _categories_ === void 0 ? void 0 : _categories_.id) !== null && _categories__id !== void 0 ? _categories__id : '');
    const [docked, setDocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const inlineAnchorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inlineNavInnerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollToCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MenuCategoryNavProvider.useCallback[scrollToCategory]": (categoryId)=>{
            const element = document.getElementById(getCategoryElementId(categoryId));
            if (!element) {
                return;
            }
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setActiveId(categoryId);
        }
    }["MenuCategoryNavProvider.useCallback[scrollToCategory]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuCategoryNavProvider.useEffect": ()=>{
            setActiveId({
                "MenuCategoryNavProvider.useEffect": (current)=>{
                    var _categories_;
                    if (categories.some({
                        "MenuCategoryNavProvider.useEffect": (category)=>category.id === current
                    }["MenuCategoryNavProvider.useEffect"])) {
                        return current;
                    }
                    var _categories__id;
                    return (_categories__id = (_categories_ = categories[0]) === null || _categories_ === void 0 ? void 0 : _categories_.id) !== null && _categories__id !== void 0 ? _categories__id : '';
                }
            }["MenuCategoryNavProvider.useEffect"]);
        }
    }["MenuCategoryNavProvider.useEffect"], [
        categories
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuCategoryNavProvider.useEffect": ()=>{
            if (categories.length === 0) {
                return;
            }
            const updateActiveId = {
                "MenuCategoryNavProvider.useEffect.updateActiveId": ()=>{
                    setActiveId({
                        "MenuCategoryNavProvider.useEffect.updateActiveId": (current)=>{
                            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$category$2d$nav$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveActiveMenuCategoryId"])(categories);
                            return next === current ? current : next;
                        }
                    }["MenuCategoryNavProvider.useEffect.updateActiveId"]);
                }
            }["MenuCategoryNavProvider.useEffect.updateActiveId"];
            updateActiveId();
            window.addEventListener('scroll', updateActiveId, {
                passive: true
            });
            window.addEventListener('resize', updateActiveId);
            return ({
                "MenuCategoryNavProvider.useEffect": ()=>{
                    window.removeEventListener('scroll', updateActiveId);
                    window.removeEventListener('resize', updateActiveId);
                }
            })["MenuCategoryNavProvider.useEffect"];
        }
    }["MenuCategoryNavProvider.useEffect"], [
        categories
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuCategoryNavProvider.useEffect": ()=>{
            if (mode !== 'dock_in_header') {
                setDocked(false);
                return;
            }
            const updateDocked = {
                "MenuCategoryNavProvider.useEffect.updateDocked": ()=>{
                    const anchor = inlineAnchorRef.current;
                    if (!anchor) {
                        setDocked(false);
                        return;
                    }
                    const headerHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$category$2d$nav$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMenuCategoryHeaderOffset"])();
                    setDocked(anchor.getBoundingClientRect().top <= headerHeight + 1);
                }
            }["MenuCategoryNavProvider.useEffect.updateDocked"];
            updateDocked();
            window.addEventListener('scroll', updateDocked, {
                passive: true
            });
            window.addEventListener('resize', updateDocked);
            return ({
                "MenuCategoryNavProvider.useEffect": ()=>{
                    window.removeEventListener('scroll', updateDocked);
                    window.removeEventListener('resize', updateDocked);
                }
            })["MenuCategoryNavProvider.useEffect"];
        }
    }["MenuCategoryNavProvider.useEffect"], [
        mode,
        categories.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuCategoryNavProvider.useEffect": ()=>{
            updateHeaderStackHeight();
            const stack = document.querySelector('.restaurant-public__header-stack');
            if (!(stack instanceof HTMLElement)) {
                return;
            }
            const observer = new ResizeObserver({
                "MenuCategoryNavProvider.useEffect": ()=>{
                    updateHeaderStackHeight();
                }
            }["MenuCategoryNavProvider.useEffect"]);
            observer.observe(stack);
            window.addEventListener('resize', updateHeaderStackHeight);
            return ({
                "MenuCategoryNavProvider.useEffect": ()=>{
                    observer.disconnect();
                    window.removeEventListener('resize', updateHeaderStackHeight);
                }
            })["MenuCategoryNavProvider.useEffect"];
        }
    }["MenuCategoryNavProvider.useEffect"], [
        docked,
        categories.length,
        mode
    ]);
    const value = {
        categories,
        mode,
        activeId,
        docked,
        inlineAnchorRef,
        inlineNavInnerRef,
        scrollToCategory
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuCategoryNavContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/context/MenuCategoryNavContext.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
_s(MenuCategoryNavProvider, "wsVEnhU967ZsD+x62Az7LP2XNFc=");
_c = MenuCategoryNavProvider;
function useMenuCategoryNav() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(MenuCategoryNavContext);
    if (!context) {
        throw new Error('useMenuCategoryNav must be used within MenuCategoryNavProvider');
    }
    return context;
}
_s1(useMenuCategoryNav, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function useMenuCategoryNavOptional() {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(MenuCategoryNavContext);
}
_s2(useMenuCategoryNavOptional, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "MenuCategoryNavProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/utils/menu-catalog.util.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TEMP_CATEGORY_NAV_FLATMAP_COPIES",
    ()=>TEMP_CATEGORY_NAV_FLATMAP_COPIES,
    "getAvailableMenuCategories",
    ()=>getAvailableMenuCategories,
    "tempExpandMenuCategoryNavItems",
    ()=>tempExpandMenuCategoryNavItems,
    "toMenuCategoryNavItems",
    ()=>toMenuCategoryNavItems
]);
function getAvailableMenuCategories(categories) {
    return categories.map((category)=>({
            ...category,
            items: category.items.filter((item)=>item.isAvailable)
        })).filter((category)=>category.items.length > 0);
}
function toMenuCategoryNavItems(categories) {
    return categories.map((category)=>({
            id: category.id,
            name: category.name
        }));
}
const TEMP_CATEGORY_NAV_FLATMAP_COPIES = 8;
function tempExpandMenuCategoryNavItems(items) {
    if (TEMP_CATEGORY_NAV_FLATMAP_COPIES <= 1) {
        return items;
    }
    return items.flatMap((item)=>Array.from({
            length: TEMP_CATEGORY_NAV_FLATMAP_COPIES
        }, (_, index)=>({
                id: index === 0 ? item.id : "".concat(item.id, "-temp-").concat(index),
                name: index === 0 ? item.name : "".concat(item.name, " ").concat(index + 1)
            })));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/components/CurrencySign.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CurrencySign",
    ()=>CurrencySign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/currency.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/RestaurantStylingContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function renderCurrencyText(display) {
    switch(display){
        case 'byn':
            return ' BYN';
        case 'r':
            return ' р';
        case 'rub':
            return ' руб';
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENCY_GLYPH"];
    }
}
function CurrencySign(param) {
    let { className } = param;
    _s();
    const { currencyDisplay } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantStylingOptional"])();
    if (currencyDisplay === 'byn_glyph') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: className ? "byn-sign ".concat(className) : 'byn-sign',
            role: "img",
            "aria-label": "белорусский рубль",
            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENCY_GLYPH"]
        }, void 0, false, {
            fileName: "[project]/src/shared/components/CurrencySign.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className ? "currency-text ".concat(className) : 'currency-text',
        children: renderCurrencyText(currencyDisplay)
    }, void 0, false, {
        fileName: "[project]/src/shared/components/CurrencySign.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_s(CurrencySign, "fWTDYlkHt88nEK0lNazgu+X9BN0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantStylingOptional"]
    ];
});
_c = CurrencySign;
var _c;
__turbopack_context__.k.register(_c, "CurrencySign");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/components/CurrencyAmount.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CurrencyAmount",
    ()=>CurrencyAmount,
    "PriceDelta",
    ()=>PriceDelta
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencySign$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/components/CurrencySign.tsx [app-client] (ecmascript)");
'use client';
;
;
function CurrencyAmount(param) {
    let { amount, fractionDigits = 0, className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className ? "byn-price ".concat(className) : 'byn-price',
        children: [
            Number(amount).toFixed(fractionDigits),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencySign$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CurrencySign"], {}, void 0, false, {
                fileName: "[project]/src/shared/components/CurrencyAmount.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/shared/components/CurrencyAmount.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = CurrencyAmount;
function PriceDelta(param) {
    let { delta } = param;
    if (!delta) {
        return null;
    }
    const sign = delta > 0 ? '+' : '−';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "byn-price",
        children: [
            ' (',
            sign,
            Math.abs(delta).toFixed(0),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencySign$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CurrencySign"], {}, void 0, false, {
                fileName: "[project]/src/shared/components/CurrencyAmount.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            ')'
        ]
    }, void 0, true, {
        fileName: "[project]/src/shared/components/CurrencyAmount.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c1 = PriceDelta;
var _c, _c1;
__turbopack_context__.k.register(_c, "CurrencyAmount");
__turbopack_context__.k.register(_c1, "PriceDelta");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useScrollLock.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useScrollLock",
    ()=>useScrollLock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
let lockCount = 0;
let savedScrollY = 0;
let releaseLock = null;
function lockScroll() {
    if (lockCount === 0) {
        savedScrollY = window.scrollY;
        const body = document.body;
        const frozenWidth = "".concat(body.getBoundingClientRect().width, "px");
        const saved = {
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            width: body.style.width,
            overflow: body.style.overflow
        };
        body.style.position = 'fixed';
        body.style.top = "-".concat(savedScrollY, "px");
        body.style.left = '0';
        body.style.width = frozenWidth;
        body.style.overflow = 'hidden';
        releaseLock = ()=>{
            body.style.position = saved.position;
            body.style.top = saved.top;
            body.style.left = saved.left;
            body.style.width = saved.width;
            body.style.overflow = saved.overflow;
            window.scrollTo(0, savedScrollY);
        };
    }
    lockCount += 1;
}
function unlockScroll() {
    if (lockCount === 0) {
        return;
    }
    lockCount -= 1;
    if (lockCount === 0 && releaseLock) {
        releaseLock();
        releaseLock = null;
    }
}
function useScrollLock(active) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "useScrollLock.useLayoutEffect": ()=>{
            if (!active) {
                return;
            }
            lockScroll();
            return ({
                "useScrollLock.useLayoutEffect": ()=>{
                    unlockScroll();
                }
            })["useScrollLock.useLayoutEffect"];
        }
    }["useScrollLock.useLayoutEffect"], [
        active
    ]);
}
_s(useScrollLock, "n7/vCynhJvM+pLkyL2DMQUF0odM=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/types/order-settings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FULFILLMENT_OPTIONS",
    ()=>FULFILLMENT_OPTIONS,
    "PAYMENT_OPTIONS",
    ()=>PAYMENT_OPTIONS,
    "getDefaultFulfillment",
    ()=>getDefaultFulfillment,
    "getDefaultPayment",
    ()=>getDefaultPayment,
    "getEnabledFulfillmentOptions",
    ()=>getEnabledFulfillmentOptions,
    "getEnabledPaymentOptions",
    ()=>getEnabledPaymentOptions
]);
const FULFILLMENT_OPTIONS = [
    {
        key: 'fulfillmentDelivery',
        title: 'Доставка',
        description: 'Клиент получает заказ по указанному адресу.'
    },
    {
        key: 'fulfillmentTakeaway',
        title: 'Самовывоз',
        description: 'Клиент забирает заказ и уносит с собой — как кофе в бумажном стаканчике.'
    },
    {
        key: 'fulfillmentDineIn',
        title: 'На месте',
        description: 'Клиент потребляет заказ в заведении — как кофе в стеклянной кружке.'
    }
];
function getEnabledFulfillmentOptions(settings) {
    return FULFILLMENT_OPTIONS.filter((option)=>settings[option.key]);
}
function getDefaultFulfillment(settings) {
    var _enabled_;
    const enabled = getEnabledFulfillmentOptions(settings);
    var _enabled__key;
    return (_enabled__key = (_enabled_ = enabled[0]) === null || _enabled_ === void 0 ? void 0 : _enabled_.key) !== null && _enabled__key !== void 0 ? _enabled__key : 'fulfillmentTakeaway';
}
const PAYMENT_OPTIONS = [
    {
        key: 'paymentCash',
        title: 'Наличными',
        description: 'Оплата наличными при получении заказа.'
    },
    {
        key: 'paymentCardOnSite',
        title: 'Картой на месте',
        description: 'Оплата картой при получении — в зале или на кассе.'
    },
    {
        key: 'paymentOnline',
        title: 'Онлайн',
        description: 'Предоплата или оплата картой через приложение до получения.'
    }
];
function getEnabledPaymentOptions(settings) {
    return PAYMENT_OPTIONS.filter((option)=>settings[option.key]);
}
function getDefaultPayment(settings) {
    var _enabled_;
    const enabled = getEnabledPaymentOptions(settings);
    var _enabled__key;
    return (_enabled__key = (_enabled_ = enabled[0]) === null || _enabled_ === void 0 ? void 0 : _enabled_.key) !== null && _enabled__key !== void 0 ? _enabled__key : null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/SegmentedSwitcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SegmentedSwitcher",
    ()=>SegmentedSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function SegmentedSwitcher(param) {
    let { options, value, onChange, ariaLabel } = param;
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const optionRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const [thumb, setThumb] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [thumbAnimated, setThumbAnimated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const activeIndex = options.findIndex((option)=>option.key === value);
    const updateThumb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SegmentedSwitcher.useCallback[updateThumb]": ()=>{
            const activeEl = optionRefs.current[activeIndex];
            if (!activeEl || activeIndex < 0) {
                setThumb(null);
                return;
            }
            setThumb({
                width: activeEl.offsetWidth,
                height: activeEl.offsetHeight,
                transform: "translate(".concat(activeEl.offsetLeft, "px, ").concat(activeEl.offsetTop, "px)")
            });
        }
    }["SegmentedSwitcher.useCallback[updateThumb]"], [
        activeIndex
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "SegmentedSwitcher.useLayoutEffect": ()=>{
            updateThumb();
        }
    }["SegmentedSwitcher.useLayoutEffect"], [
        updateThumb,
        options.length,
        value
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "SegmentedSwitcher.useLayoutEffect": ()=>{
            setThumbAnimated(false);
            const frameId = requestAnimationFrame({
                "SegmentedSwitcher.useLayoutEffect.frameId": ()=>{
                    setThumbAnimated(true);
                }
            }["SegmentedSwitcher.useLayoutEffect.frameId"]);
            return ({
                "SegmentedSwitcher.useLayoutEffect": ()=>cancelAnimationFrame(frameId)
            })["SegmentedSwitcher.useLayoutEffect"];
        }
    }["SegmentedSwitcher.useLayoutEffect"], [
        options.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "SegmentedSwitcher.useLayoutEffect": ()=>{
            const container = containerRef.current;
            if (!container) {
                return;
            }
            const observer = new ResizeObserver({
                "SegmentedSwitcher.useLayoutEffect": ()=>{
                    updateThumb();
                }
            }["SegmentedSwitcher.useLayoutEffect"]);
            observer.observe(container);
            window.addEventListener('resize', updateThumb);
            return ({
                "SegmentedSwitcher.useLayoutEffect": ()=>{
                    observer.disconnect();
                    window.removeEventListener('resize', updateThumb);
                }
            })["SegmentedSwitcher.useLayoutEffect"];
        }
    }["SegmentedSwitcher.useLayoutEffect"], [
        updateThumb
    ]);
    if (options.length <= 1) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "fulfillment-selector",
        role: "tablist",
        "aria-label": ariaLabel,
        children: [
            thumb && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fulfillment-selector__thumb".concat(thumbAnimated ? ' fulfillment-selector__thumb--animated' : ''),
                style: thumb,
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/SegmentedSwitcher.tsx",
                lineNumber: 97,
                columnNumber: 9
            }, this),
            options.map((option, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    ref: (element)=>{
                        optionRefs.current[index] = element;
                    },
                    type: "button",
                    role: "tab",
                    "aria-selected": value === option.key,
                    className: "fulfillment-selector__option",
                    onClick: ()=>onChange(option.key),
                    children: option.title
                }, option.key, false, {
                    fileName: "[project]/src/features/restaurants/components/SegmentedSwitcher.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurants/components/SegmentedSwitcher.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_s(SegmentedSwitcher, "nhfHbEjsEQsNh6xd6BYF+RyZrlc=");
_c = SegmentedSwitcher;
var _c;
__turbopack_context__.k.register(_c, "SegmentedSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/FulfillmentSelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FulfillmentSelector",
    ()=>FulfillmentSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$order$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/order-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$SegmentedSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/SegmentedSwitcher.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function FulfillmentSelector(param) {
    let { settings, value, onChange } = param;
    const options = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$order$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FULFILLMENT_OPTIONS"].filter((option)=>settings[option.key]);
    if (options.length <= 1) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$SegmentedSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentedSwitcher"], {
        options: options,
        value: value,
        onChange: onChange,
        ariaLabel: "Способ получения заказа"
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/FulfillmentSelector.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = FulfillmentSelector;
var _c;
__turbopack_context__.k.register(_c, "FulfillmentSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/PaymentSelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PaymentSelector",
    ()=>PaymentSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$order$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/order-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$SegmentedSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/SegmentedSwitcher.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function PaymentSelector(param) {
    let { settings, value, onChange } = param;
    const options = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$order$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYMENT_OPTIONS"].filter((option)=>settings[option.key]);
    if (options.length <= 1) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$SegmentedSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentedSwitcher"], {
        options: options,
        value: value,
        onChange: onChange,
        ariaLabel: "Способ оплаты"
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/PaymentSelector.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = PaymentSelector;
var _c;
__turbopack_context__.k.register(_c, "PaymentSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/RestaurantCartModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantCartModal",
    ()=>RestaurantCartModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencyAmount$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/components/CurrencyAmount.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollLock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useScrollLock.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/shared/types/menu.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cart.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$FulfillmentSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/FulfillmentSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$PaymentSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/PaymentSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$order$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/order-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/routing/restaurant-guest-path.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/RestaurantStylingContext.tsx [app-client] (ecmascript)");
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
;
const MODAL_ANIMATION_MS = 200;
function normalizePhone(value) {
    return value.replace(/\D/g, '');
}
const EMPTY_CART_ITEMS = [];
function RestaurantCartModal(param) {
    let { restaurantId, orderSettings, bookingEnabled = false, onClose } = param;
    _s();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "RestaurantCartModal.useAuthStore[user]": (s)=>s.user
    }["RestaurantCartModal.useAuthStore[user]"]);
    const paths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantGuestPaths"])(restaurantId);
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "RestaurantCartModal.useCartStore[items]": (s)=>s.restaurantId === restaurantId ? s.items : EMPTY_CART_ITEMS
    }["RestaurantCartModal.useCartStore[items]"]);
    const removeLine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "RestaurantCartModal.useCartStore[removeLine]": (s)=>s.removeLine
    }["RestaurantCartModal.useCartStore[removeLine]"]);
    const updateLineQuantity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "RestaurantCartModal.useCartStore[updateLineQuantity]": (s)=>s.updateLineQuantity
    }["RestaurantCartModal.useCartStore[updateLineQuantity]"]);
    const clearCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "RestaurantCartModal.useCartStore[clearCart]": (s)=>s.clearCart
    }["RestaurantCartModal.useCartStore[clearCart]"]);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isActive, setIsActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fulfillment, setFulfillment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "RestaurantCartModal.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$order$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultFulfillment"])(orderSettings)
    }["RestaurantCartModal.useState"]);
    const [payment, setPayment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "RestaurantCartModal.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$order$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultPayment"])(orderSettings)
    }["RestaurantCartModal.useState"]);
    const [customerName, setCustomerName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const isGuestOfRestaurant = (user === null || user === void 0 ? void 0 : user.role) === 'user' && user.restaurantId === restaurantId;
    const totalAmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RestaurantCartModal.useMemo[totalAmount]": ()=>items.reduce({
                "RestaurantCartModal.useMemo[totalAmount]": (sum, line)=>sum + line.unitPrice * line.quantity
            }["RestaurantCartModal.useMemo[totalAmount]"], 0)
    }["RestaurantCartModal.useMemo[totalAmount]"], [
        items
    ]);
    const enabledFulfillment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RestaurantCartModal.useMemo[enabledFulfillment]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$order$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEnabledFulfillmentOptions"])(orderSettings)
    }["RestaurantCartModal.useMemo[enabledFulfillment]"], [
        orderSettings
    ]);
    const enabledPayments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RestaurantCartModal.useMemo[enabledPayments]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$order$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEnabledPaymentOptions"])(orderSettings)
    }["RestaurantCartModal.useMemo[enabledPayments]"], [
        orderSettings
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollLock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"])(mounted);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RestaurantCartModal.useEffect": ()=>{
            setMounted(true);
        }
    }["RestaurantCartModal.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RestaurantCartModal.useEffect": ()=>{
            if (!mounted) {
                return;
            }
            const frame = requestAnimationFrame({
                "RestaurantCartModal.useEffect.frame": ()=>{
                    requestAnimationFrame({
                        "RestaurantCartModal.useEffect.frame": ()=>setIsActive(true)
                    }["RestaurantCartModal.useEffect.frame"]);
                }
            }["RestaurantCartModal.useEffect.frame"]);
            return ({
                "RestaurantCartModal.useEffect": ()=>cancelAnimationFrame(frame)
            })["RestaurantCartModal.useEffect"];
        }
    }["RestaurantCartModal.useEffect"], [
        mounted
    ]);
    const handleClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RestaurantCartModal.useCallback[handleClose]": ()=>{
            setIsActive(false);
            window.setTimeout(onClose, MODAL_ANIMATION_MS);
        }
    }["RestaurantCartModal.useCallback[handleClose]"], [
        onClose
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RestaurantCartModal.useEffect": ()=>{
            const handleKeyDown = {
                "RestaurantCartModal.useEffect.handleKeyDown": (event)=>{
                    if (event.key === 'Escape') {
                        handleClose();
                    }
                }
            }["RestaurantCartModal.useEffect.handleKeyDown"];
            document.addEventListener('keydown', handleKeyDown);
            return ({
                "RestaurantCartModal.useEffect": ()=>{
                    document.removeEventListener('keydown', handleKeyDown);
                }
            })["RestaurantCartModal.useEffect"];
        }
    }["RestaurantCartModal.useEffect"], [
        handleClose
    ]);
    function handleSubmit() {
        setError(null);
        if (items.length === 0) {
            setError('Корзина пуста');
            return;
        }
        if (!enabledFulfillment.some((option)=>option.key === fulfillment)) {
            setError('Выберите способ получения заказа');
            return;
        }
        if (enabledPayments.length > 0 && !payment) {
            setError('Выберите способ оплаты');
            return;
        }
        if (!isGuestOfRestaurant) {
            if (!customerName.trim()) {
                setError('Укажите имя');
                return;
            }
            const normalizedPhone = normalizePhone(phone);
            if (normalizedPhone.length < 9) {
                setError('Укажите корректный номер телефона');
                return;
            }
        }
        setSuccess('Заказ принят. Мы свяжемся с вами для подтверждения.');
        clearCart();
        window.setTimeout(handleClose, 1200);
    }
    if (!mounted) {
        return null;
    }
    const activeClass = isActive ? ' restaurant-cart-modal--active' : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantStylingPortalRoot"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "restaurant-cart-modal__backdrop".concat(activeClass),
                    onClick: handleClose,
                    "aria-label": "Закрыть"
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "restaurant-cart-modal".concat(activeClass),
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": "restaurant-cart-modal-title",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "restaurant-cart-modal__panel".concat(activeClass),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "restaurant-cart-modal__close",
                                onClick: handleClose,
                                "aria-label": "Закрыть",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                className: "restaurant-cart-modal__header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        id: "restaurant-cart-modal-title",
                                        children: "Корзина"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 193,
                                        columnNumber: 13
                                    }, this),
                                    isGuestOfRestaurant && user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "restaurant-cart-modal__guest",
                                        children: [
                                            "Заказ от ",
                                            user.firstName,
                                            " ",
                                            user.lastName
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "restaurant-cart-modal__body",
                                children: [
                                    !isGuestOfRestaurant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "restaurant-cart-modal__section",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "restaurant-cart-modal__section-title",
                                                children: "Контакты"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 204,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "restaurant-cart-modal__field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Имя"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        autoComplete: "name",
                                                        value: customerName,
                                                        onChange: (e)=>setCustomerName(e.target.value),
                                                        placeholder: "Как к вам обращаться"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 205,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "restaurant-cart-modal__field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Телефон"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                        lineNumber: 216,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "tel",
                                                        autoComplete: "tel",
                                                        inputMode: "tel",
                                                        value: phone,
                                                        onChange: (e)=>setPhone(e.target.value),
                                                        placeholder: "+375 XX XXX-XX-XX"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                        lineNumber: 217,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 215,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 203,
                                        columnNumber: 15
                                    }, this),
                                    enabledFulfillment.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "restaurant-cart-modal__section",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "restaurant-cart-modal__section-title",
                                                children: "Способ получения"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 231,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "restaurant-cart-modal__fulfillment",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$FulfillmentSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FulfillmentSelector"], {
                                                    settings: orderSettings,
                                                    value: fulfillment,
                                                    onChange: setFulfillment
                                                }, void 0, false, {
                                                    fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 232,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 230,
                                        columnNumber: 15
                                    }, this),
                                    enabledFulfillment.length === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "restaurant-cart-modal__section",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "restaurant-cart-modal__section-title",
                                                children: "Способ получения"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 244,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "restaurant-cart-modal__fulfillment-single",
                                                children: enabledFulfillment[0].title
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 245,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 243,
                                        columnNumber: 15
                                    }, this),
                                    fulfillment === 'fulfillmentDineIn' && bookingEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "restaurant-cart-modal__cross-sell",
                                        children: [
                                            "Планируете прийти?",
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: paths.booking,
                                                className: "restaurant-cart-modal__cross-sell-link",
                                                children: "Забронировать стол"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 254,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 252,
                                        columnNumber: 15
                                    }, this),
                                    enabledPayments.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "restaurant-cart-modal__section",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "restaurant-cart-modal__section-title",
                                                children: "Способ оплаты"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 262,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "restaurant-cart-modal__fulfillment",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$PaymentSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PaymentSelector"], {
                                                    settings: orderSettings,
                                                    value: payment !== null && payment !== void 0 ? payment : enabledPayments[0].key,
                                                    onChange: setPayment
                                                }, void 0, false, {
                                                    fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 263,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 261,
                                        columnNumber: 15
                                    }, this),
                                    enabledPayments.length === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "restaurant-cart-modal__section",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "restaurant-cart-modal__section-title",
                                                children: "Способ оплаты"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 275,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "restaurant-cart-modal__fulfillment-single",
                                                children: enabledPayments[0].title
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 276,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 274,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "restaurant-cart-modal__section",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "restaurant-cart-modal__section-title",
                                                children: "Ваш заказ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 283,
                                                columnNumber: 15
                                            }, this),
                                            items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "restaurant-cart-modal__empty",
                                                children: "Корзина пуста"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 285,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "restaurant-cart-modal__list",
                                                children: items.map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "restaurant-cart-modal__item".concat(line.imageUrl ? ' restaurant-cart-modal__item--with-image' : ''),
                                                        children: [
                                                            line.imageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "restaurant-cart-modal__item-media",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["resolveImageUrl"])(line.imageUrl),
                                                                    alt: ""
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                    lineNumber: 297,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                lineNumber: 296,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "restaurant-cart-modal__item-main",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "restaurant-cart-modal__item-title",
                                                                        children: [
                                                                            line.name,
                                                                            line.variantLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "restaurant-cart-modal__item-variant",
                                                                                children: [
                                                                                    ' ',
                                                                                    line.variantLabel
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                                lineNumber: 305,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                        lineNumber: 302,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    line.modifiers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                        className: "restaurant-cart-modal__modifiers",
                                                                        children: line.modifiers.map((modifier)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    modifier.groupName,
                                                                                    ": ",
                                                                                    modifier.optionName
                                                                                ]
                                                                            }, "".concat(modifier.groupName, "-").concat(modifier.optionName), true, {
                                                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                                lineNumber: 315,
                                                                                columnNumber: 31
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                        lineNumber: 313,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "restaurant-cart-modal__item-price",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencyAmount$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CurrencyAmount"], {
                                                                            amount: line.unitPrice * line.quantity
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                            lineNumber: 323,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                        lineNumber: 322,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                lineNumber: 301,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "restaurant-cart-modal__item-actions",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "restaurant-cart-modal__counter",
                                                                        "aria-label": "Количество",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                className: "restaurant-cart-modal__counter-btn",
                                                                                onClick: ()=>updateLineQuantity(line.id, line.quantity - 1),
                                                                                "aria-label": "Уменьшить количество",
                                                                                children: "−"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                                lineNumber: 329,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "restaurant-cart-modal__counter-value",
                                                                                children: line.quantity
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                                lineNumber: 337,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                className: "restaurant-cart-modal__counter-btn",
                                                                                onClick: ()=>updateLineQuantity(line.id, line.quantity + 1),
                                                                                "aria-label": "Увеличить количество",
                                                                                children: "+"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                                lineNumber: 338,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                        lineNumber: 328,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        className: "restaurant-cart-modal__remove",
                                                                        onClick: ()=>removeLine(line.id),
                                                                        children: "Удалить"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                        lineNumber: 348,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                                lineNumber: 327,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, line.id, true, {
                                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                        lineNumber: 289,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 287,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 282,
                                        columnNumber: 13
                                    }, this),
                                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "restaurant-cart-modal__error",
                                        children: error
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 362,
                                        columnNumber: 23
                                    }, this),
                                    success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "restaurant-cart-modal__success",
                                        children: success
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 363,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                className: "restaurant-cart-modal__footer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "restaurant-cart-modal__total",
                                        children: [
                                            "Итого: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencyAmount$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CurrencyAmount"], {
                                                amount: totalAmount
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                                lineNumber: 368,
                                                columnNumber: 22
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 367,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "restaurant-cart-modal__submit",
                                        disabled: items.length === 0 || Boolean(success),
                                        onClick: handleSubmit,
                                        children: "Оформить заказ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                        lineNumber: 370,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                                lineNumber: 366,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
                    lineNumber: 176,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/RestaurantCartModal.tsx",
        lineNumber: 167,
        columnNumber: 5
    }, this), document.body);
}
_s(RestaurantCartModal, "rNdC0dR7ox8W0tbBykt7pV/qI+w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantGuestPaths"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollLock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"]
    ];
});
_c = RestaurantCartModal;
var _c;
__turbopack_context__.k.register(_c, "RestaurantCartModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/MenuCategoryNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MenuCategoryNav",
    ()=>MenuCategoryNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$category$2d$nav$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/menu-category-nav.util.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/MenuCategoryNavContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
;
function getCategoryElementId(categoryId) {
    return "menu-category-".concat(categoryId);
}
function MenuCategoryNavView(param) {
    let { categories, activeId, onSelect, placement, innerRef, enableActiveButtonScroll = true } = param;
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuCategoryNavView.useEffect": ()=>{
            if (!enableActiveButtonScroll || !(innerRef === null || innerRef === void 0 ? void 0 : innerRef.current) || !activeId) {
                return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$category$2d$nav$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scrollMenuCategoryNavButtonIntoView"])(innerRef.current, activeId);
        }
    }["MenuCategoryNavView.useEffect"], [
        activeId,
        enableActiveButtonScroll,
        innerRef
    ]);
    if (categories.length <= 1) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "restaurant-menu__category-nav".concat(placement === 'header' ? ' restaurant-menu__category-nav--header' : ''),
        "aria-label": "Навигация по категориям меню",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: innerRef,
            className: "restaurant-menu__category-nav-inner",
            children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    "data-category-id": category.id,
                    className: "restaurant-menu__category-nav-btn".concat(activeId === category.id ? ' restaurant-menu__category-nav-btn--active' : ''),
                    onClick: ()=>onSelect(category.id),
                    children: category.name
                }, category.id, false, {
                    fileName: "[project]/src/features/restaurants/components/MenuCategoryNav.tsx",
                    lineNumber: 57,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/features/restaurants/components/MenuCategoryNav.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/MenuCategoryNav.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(MenuCategoryNavView, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = MenuCategoryNavView;
function MenuCategoryNavStandalone(param) {
    let { categories } = param;
    var _categories_;
    _s1();
    var _categories__id;
    const [activeId, setActiveId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((_categories__id = (_categories_ = categories[0]) === null || _categories_ === void 0 ? void 0 : _categories_.id) !== null && _categories__id !== void 0 ? _categories__id : '');
    const innerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollToCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MenuCategoryNavStandalone.useCallback[scrollToCategory]": (categoryId)=>{
            const element = document.getElementById(getCategoryElementId(categoryId));
            if (!element) {
                return;
            }
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setActiveId(categoryId);
        }
    }["MenuCategoryNavStandalone.useCallback[scrollToCategory]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuCategoryNavStandalone.useEffect": ()=>{
            setActiveId({
                "MenuCategoryNavStandalone.useEffect": (current)=>{
                    var _categories_;
                    if (categories.some({
                        "MenuCategoryNavStandalone.useEffect": (category)=>category.id === current
                    }["MenuCategoryNavStandalone.useEffect"])) {
                        return current;
                    }
                    var _categories__id;
                    return (_categories__id = (_categories_ = categories[0]) === null || _categories_ === void 0 ? void 0 : _categories_.id) !== null && _categories__id !== void 0 ? _categories__id : '';
                }
            }["MenuCategoryNavStandalone.useEffect"]);
        }
    }["MenuCategoryNavStandalone.useEffect"], [
        categories
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuCategoryNavStandalone.useEffect": ()=>{
            if (categories.length === 0) {
                return;
            }
            const updateActiveId = {
                "MenuCategoryNavStandalone.useEffect.updateActiveId": ()=>{
                    setActiveId({
                        "MenuCategoryNavStandalone.useEffect.updateActiveId": (current)=>{
                            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$category$2d$nav$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveActiveMenuCategoryId"])(categories);
                            return next === current ? current : next;
                        }
                    }["MenuCategoryNavStandalone.useEffect.updateActiveId"]);
                }
            }["MenuCategoryNavStandalone.useEffect.updateActiveId"];
            updateActiveId();
            window.addEventListener('scroll', updateActiveId, {
                passive: true
            });
            window.addEventListener('resize', updateActiveId);
            return ({
                "MenuCategoryNavStandalone.useEffect": ()=>{
                    window.removeEventListener('scroll', updateActiveId);
                    window.removeEventListener('resize', updateActiveId);
                }
            })["MenuCategoryNavStandalone.useEffect"];
        }
    }["MenuCategoryNavStandalone.useEffect"], [
        categories
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuCategoryNavView, {
        categories: categories,
        activeId: activeId,
        onSelect: scrollToCategory,
        placement: "inline",
        innerRef: innerRef
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/MenuCategoryNav.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, this);
}
_s1(MenuCategoryNavStandalone, "V/gdgZSyhy3lVCLJh/V8i+2TQGc=");
_c1 = MenuCategoryNavStandalone;
function MenuCategoryNav(param) {
    let { categories: categoriesProp, placement = 'inline' } = param;
    _s2();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuCategoryNavOptional"])();
    const headerInnerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuCategoryNav.useEffect": ()=>{
            if (!context || placement !== 'header' || !context.docked) {
                return;
            }
            const source = context.inlineNavInnerRef.current;
            const target = headerInnerRef.current;
            if (source && target) {
                target.scrollLeft = source.scrollLeft;
            }
        }
    }["MenuCategoryNav.useEffect"], [
        context === null || context === void 0 ? void 0 : context.docked,
        context,
        placement
    ]);
    if (categoriesProp && !context) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuCategoryNavStandalone, {
            categories: categoriesProp
        }, void 0, false, {
            fileName: "[project]/src/features/restaurants/components/MenuCategoryNav.tsx",
            lineNumber: 153,
            columnNumber: 12
        }, this);
    }
    if (!context) {
        return null;
    }
    const enableInlineActiveButtonScroll = placement === 'header' || placement === 'inline' && !context.docked;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuCategoryNavView, {
        categories: context.categories,
        activeId: context.activeId,
        onSelect: context.scrollToCategory,
        placement: placement,
        innerRef: placement === 'inline' ? context.inlineNavInnerRef : headerInnerRef,
        enableActiveButtonScroll: enableInlineActiveButtonScroll
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/MenuCategoryNav.tsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
}
_s2(MenuCategoryNav, "/w+kIipB23z1Bs3H6+7E124mwZI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuCategoryNavOptional"]
    ];
});
_c2 = MenuCategoryNav;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "MenuCategoryNavView");
__turbopack_context__.k.register(_c1, "MenuCategoryNavStandalone");
__turbopack_context__.k.register(_c2, "MenuCategoryNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/RestaurantMenuInlineCategoryNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantMenuInlineCategoryNav",
    ()=>RestaurantMenuInlineCategoryNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuCategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/MenuCategoryNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/MenuCategoryNavContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function RestaurantMenuInlineCategoryNav() {
    _s();
    const navContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuCategoryNavOptional"])();
    if (!navContext || navContext.mode === 'always_in_header') {
        return null;
    }
    const hiddenWhenDocked = navContext.mode === 'dock_in_header' && navContext.docked;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: navContext.inlineAnchorRef,
        className: "restaurant-menu__category-nav-anchor".concat(hiddenWhenDocked ? ' restaurant-menu__category-nav-anchor--docked' : ''),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuCategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenuCategoryNav"], {
            placement: "inline"
        }, void 0, false, {
            fileName: "[project]/src/features/restaurants/components/RestaurantMenuInlineCategoryNav.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/RestaurantMenuInlineCategoryNav.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_s(RestaurantMenuInlineCategoryNav, "pj5psMyPUmx2iW5pu5HBGXaHQfc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuCategoryNavOptional"]
    ];
});
_c = RestaurantMenuInlineCategoryNav;
var _c;
__turbopack_context__.k.register(_c, "RestaurantMenuInlineCategoryNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/MenuProductCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MenuProductCard",
    ()=>MenuProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencyAmount$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/components/CurrencyAmount.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/shared/types/menu.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/menu-modifiers.util.ts [app-client] (ecmascript)");
;
;
;
;
;
function MenuProductCard(param) {
    let { item, onSelect } = param;
    const showFromPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasPriceAffectingModifiers"])(item.modifierGroups);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: "menu-product-card",
        onClick: ()=>onSelect(item),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "menu-product-card__media",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["resolveImageUrl"])(item.imageUrl),
                    alt: item.name,
                    loading: "lazy"
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "menu-product-card__body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "menu-product-card__title",
                        children: [
                            item.name,
                            item.variantLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "menu-product-card__variant",
                                children: [
                                    " ",
                                    item.variantLabel
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
                                lineNumber: 24,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
                        lineNumber: 21,
                        columnNumber: 9
                    }, this),
                    item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "menu-product-card__description",
                        children: item.description
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "menu-product-card__price",
                        children: [
                            showFromPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "menu-product-card__price-from",
                                children: "от "
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
                                lineNumber: 33,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencyAmount$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CurrencyAmount"], {
                                amount: item.price
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = MenuProductCard;
var _c;
__turbopack_context__.k.register(_c, "MenuProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurant-admin/components/NutritionBadges.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NutritionBadges",
    ()=>NutritionBadges
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
;
const NUTRITION_ITEMS = [
    {
        key: 'calories',
        label: 'Ккал',
        unit: 'ккал',
        mod: 'calories'
    },
    {
        key: 'protein',
        label: 'Б',
        unit: 'г',
        mod: 'protein'
    },
    {
        key: 'fat',
        label: 'Ж',
        unit: 'г',
        mod: 'fat'
    },
    {
        key: 'carbs',
        label: 'У',
        unit: 'г',
        mod: 'carbs'
    }
];
function NutritionBadges(param) {
    let { nutrition } = param;
    const items = NUTRITION_ITEMS.filter((param)=>{
        let { key } = param;
        return nutrition[key] != null;
    });
    if (items.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "nutrition-badges",
        children: items.map((param)=>{
            let { key, label, unit, mod } = param;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "nutrition-badge nutrition-badge--".concat(mod),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "nutrition-badge__label",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurant-admin/components/NutritionBadges.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "nutrition-badge__value",
                        children: [
                            nutrition[key],
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "nutrition-badge__unit",
                                children: unit
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/components/NutritionBadges.tsx",
                                lineNumber: 29,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurant-admin/components/NutritionBadges.tsx",
                        lineNumber: 27,
                        columnNumber: 11
                    }, this)
                ]
            }, key, true, {
                fileName: "[project]/src/features/restaurant-admin/components/NutritionBadges.tsx",
                lineNumber: 25,
                columnNumber: 9
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/features/restaurant-admin/components/NutritionBadges.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c = NutritionBadges;
var _c;
__turbopack_context__.k.register(_c, "NutritionBadges");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/components/Carousel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Carousel",
    ()=>Carousel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$embla$2d$carousel$2d$react$2f$esm$2f$embla$2d$carousel$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/embla-carousel-react/esm/embla-carousel-react.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$embla$2d$carousel$2d$autoplay$2f$esm$2f$embla$2d$carousel$2d$autoplay$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/embla-carousel-autoplay/esm/embla-carousel-autoplay.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function Carousel(param) {
    let { slides, options, autoplay = false, autoplayDelay = 4000, showArrows = true, showDots = true, slideAs: Slide = 'div', className, slideClassName } = param;
    _s();
    const plugins = autoplay ? [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$embla$2d$carousel$2d$autoplay$2f$esm$2f$embla$2d$carousel$2d$autoplay$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
            delay: autoplayDelay,
            stopOnInteraction: false
        })
    ] : [];
    const [emblaRef, emblaApi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$embla$2d$carousel$2d$react$2f$esm$2f$embla$2d$carousel$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(options, plugins);
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [scrollSnaps, setScrollSnaps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const onSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Carousel.useCallback[onSelect]": (api)=>{
            if (!api) return;
            setSelectedIndex(api.selectedScrollSnap());
        }
    }["Carousel.useCallback[onSelect]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Carousel.useEffect": ()=>{
            if (!emblaApi) return;
            setScrollSnaps(emblaApi.scrollSnapList());
            onSelect(emblaApi);
            emblaApi.on('select', onSelect);
            emblaApi.on('reInit', onSelect);
            return ({
                "Carousel.useEffect": ()=>{
                    emblaApi.off('select', onSelect);
                    emblaApi.off('reInit', onSelect);
                }
            })["Carousel.useEffect"];
        }
    }["Carousel.useEffect"], [
        emblaApi,
        onSelect
    ]);
    const scrollTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Carousel.useCallback[scrollTo]": (index)=>emblaApi === null || emblaApi === void 0 ? void 0 : emblaApi.scrollTo(index)
    }["Carousel.useCallback[scrollTo]"], [
        emblaApi
    ]);
    const scrollPrev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Carousel.useCallback[scrollPrev]": ()=>emblaApi === null || emblaApi === void 0 ? void 0 : emblaApi.scrollPrev()
    }["Carousel.useCallback[scrollPrev]"], [
        emblaApi
    ]);
    const scrollNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Carousel.useCallback[scrollNext]": ()=>emblaApi === null || emblaApi === void 0 ? void 0 : emblaApi.scrollNext()
    }["Carousel.useCallback[scrollNext]"], [
        emblaApi
    ]);
    if (slides.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "carousel__viewport",
                ref: emblaRef,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "carousel__container",
                    children: slides.map((slide, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Slide, {
                            className: "carousel__slide".concat(slideClassName ? " ".concat(slideClassName) : ''),
                            children: slide
                        }, index, false, {
                            fileName: "[project]/src/shared/components/Carousel.tsx",
                            lineNumber: 74,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/shared/components/Carousel.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/shared/components/Carousel.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            showArrows && slides.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "carousel__arrow carousel__arrow--prev",
                        onClick: scrollPrev,
                        "aria-label": "Предыдущий слайд",
                        children: "‹"
                    }, void 0, false, {
                        fileName: "[project]/src/shared/components/Carousel.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "carousel__arrow carousel__arrow--next",
                        onClick: scrollNext,
                        "aria-label": "Следующий слайд",
                        children: "›"
                    }, void 0, false, {
                        fileName: "[project]/src/shared/components/Carousel.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            showDots && slides.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "carousel__dots",
                children: scrollSnaps.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "carousel__dot".concat(index === selectedIndex ? ' carousel__dot--active' : ''),
                        onClick: ()=>scrollTo(index),
                        "aria-label": "Слайд ".concat(index + 1)
                    }, index, false, {
                        fileName: "[project]/src/shared/components/Carousel.tsx",
                        lineNumber: 95,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/shared/components/Carousel.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/shared/components/Carousel.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(Carousel, "lQRWKo2rSEg4qiwiSC51xM/XKgg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$embla$2d$carousel$2d$react$2f$esm$2f$embla$2d$carousel$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = Carousel;
var _c;
__turbopack_context__.k.register(_c, "Carousel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/MenuProductModifiers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MenuProductModifiers",
    ()=>MenuProductModifiers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencyAmount$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/components/CurrencyAmount.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/menu-modifiers.util.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function MenuProductModifiers(param) {
    let { groups, selections, onChange } = param;
    function toggleSingle(groupIndex, group, optionKey) {
        const groupKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModifierGroupKey"])(group, groupIndex);
        var _selections_groupKey;
        const current = (_selections_groupKey = selections[groupKey]) !== null && _selections_groupKey !== void 0 ? _selections_groupKey : [];
        const isSelected = current.includes(optionKey);
        if (isSelected) {
            if (group.required) {
                return;
            }
            onChange({
                ...selections,
                [groupKey]: []
            });
            return;
        }
        onChange({
            ...selections,
            [groupKey]: [
                optionKey
            ]
        });
    }
    function toggleMultiple(groupIndex, optionKey) {
        const groupKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModifierGroupKey"])(groups[groupIndex], groupIndex);
        var _selections_groupKey;
        const current = (_selections_groupKey = selections[groupKey]) !== null && _selections_groupKey !== void 0 ? _selections_groupKey : [];
        const isSelected = current.includes(optionKey);
        onChange({
            ...selections,
            [groupKey]: isSelected ? current.filter((key)=>key !== optionKey) : [
                ...current,
                optionKey
            ]
        });
    }
    function handleOptionClick(groupIndex, group, optionKey) {
        if (group.selectionType === 'single') {
            toggleSingle(groupIndex, group, optionKey);
            return;
        }
        toggleMultiple(groupIndex, optionKey);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "menu-product-modifiers",
        children: groups.map((group, groupIndex)=>{
            const groupKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModifierGroupKey"])(group, groupIndex);
            var _selections_groupKey;
            const selectedKeys = (_selections_groupKey = selections[groupKey]) !== null && _selections_groupKey !== void 0 ? _selections_groupKey : [];
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "menu-product-modal__section menu-product-modifiers__group",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "menu-product-modal__section-title menu-product-modifiers__title",
                        children: [
                            group.name,
                            group.selectionType === 'single' && group.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "menu-product-modifiers__required",
                                children: "обязательно"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/MenuProductModifiers.tsx",
                                lineNumber: 73,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurants/components/MenuProductModifiers.tsx",
                        lineNumber: 70,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "menu-product-modifiers__options",
                        role: "list",
                        children: group.options.map((option, optionIndex)=>{
                            const optionKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModifierOptionKey"])(option, optionIndex);
                            const isSelected = selectedKeys.includes(optionKey);
                            const isSingle = group.selectionType === 'single';
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                role: isSingle ? 'radio' : 'checkbox',
                                "aria-checked": isSelected,
                                className: "menu-product-modifiers__option".concat(isSelected ? ' menu-product-modifiers__option--selected' : ''),
                                onClick: ()=>handleOptionClick(groupIndex, group, optionKey),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "menu-product-modifiers__option-label",
                                    children: [
                                        option.name,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencyAmount$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriceDelta"], {
                                            delta: Number(option.priceDelta) || 0
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/restaurants/components/MenuProductModifiers.tsx",
                                            lineNumber: 96,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/restaurants/components/MenuProductModifiers.tsx",
                                    lineNumber: 94,
                                    columnNumber: 21
                                }, this)
                            }, optionKey, false, {
                                fileName: "[project]/src/features/restaurants/components/MenuProductModifiers.tsx",
                                lineNumber: 84,
                                columnNumber: 19
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurants/components/MenuProductModifiers.tsx",
                        lineNumber: 77,
                        columnNumber: 13
                    }, this)
                ]
            }, groupKey, true, {
                fileName: "[project]/src/features/restaurants/components/MenuProductModifiers.tsx",
                lineNumber: 69,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/MenuProductModifiers.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_c = MenuProductModifiers;
var _c;
__turbopack_context__.k.register(_c, "MenuProductModifiers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/MenuProductDetailModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MenuProductDetailModal",
    ()=>MenuProductDetailModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$components$2f$NutritionBadges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/components/NutritionBadges.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencyAmount$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/components/CurrencyAmount.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$Carousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/components/Carousel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollLock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useScrollLock.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/shared/types/menu.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuProductModifiers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/MenuProductModifiers.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/menu-modifiers.util.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$cart$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/cart.util.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/RestaurantStylingContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cart.store.ts [app-client] (ecmascript)");
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
;
const MODAL_ANIMATION_MS = 200;
function MenuProductDetailModal(param) {
    let { item, restaurantId, onClose } = param;
    _s();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isActive, setIsActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [modifierSelections, setModifierSelections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const addLine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "MenuProductDetailModal.useCartStore[addLine]": (s)=>s.addLine
    }["MenuProductDetailModal.useCartStore[addLine]"]);
    const modifierGroups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MenuProductDetailModal.useMemo[modifierGroups]": ()=>{
            var _item_modifierGroups;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getValidModifierGroups"])((_item_modifierGroups = item.modifierGroups) !== null && _item_modifierGroups !== void 0 ? _item_modifierGroups : []);
        }
    }["MenuProductDetailModal.useMemo[modifierGroups]"], [
        item.modifierGroups
    ]);
    const images = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MenuProductDetailModal.useMemo[images]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getMenuItemImages"])(item)
    }["MenuProductDetailModal.useMemo[images]"], [
        item
    ]);
    const hasGallery = images.length > 1;
    const unitPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MenuProductDetailModal.useMemo[unitPrice]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateModifierUnitPrice"])(item.price, modifierGroups, modifierSelections)
    }["MenuProductDetailModal.useMemo[unitPrice]"], [
        item.price,
        modifierGroups,
        modifierSelections
    ]);
    const canAdd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MenuProductDetailModal.useMemo[canAdd]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isModifierSelectionComplete"])(modifierGroups, modifierSelections)
    }["MenuProductDetailModal.useMemo[canAdd]"], [
        modifierGroups,
        modifierSelections
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollLock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"])(mounted);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuProductDetailModal.useEffect": ()=>{
            setMounted(true);
        }
    }["MenuProductDetailModal.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuProductDetailModal.useEffect": ()=>{
            setQuantity(1);
            var _item_modifierGroups;
            setModifierSelections((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyModifierSelections"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getValidModifierGroups"])((_item_modifierGroups = item.modifierGroups) !== null && _item_modifierGroups !== void 0 ? _item_modifierGroups : [])));
        }
    }["MenuProductDetailModal.useEffect"], [
        item.id,
        item.modifierGroups
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuProductDetailModal.useEffect": ()=>{
            if (!mounted) {
                return;
            }
            const frame = requestAnimationFrame({
                "MenuProductDetailModal.useEffect.frame": ()=>{
                    requestAnimationFrame({
                        "MenuProductDetailModal.useEffect.frame": ()=>setIsActive(true)
                    }["MenuProductDetailModal.useEffect.frame"]);
                }
            }["MenuProductDetailModal.useEffect.frame"]);
            return ({
                "MenuProductDetailModal.useEffect": ()=>cancelAnimationFrame(frame)
            })["MenuProductDetailModal.useEffect"];
        }
    }["MenuProductDetailModal.useEffect"], [
        mounted
    ]);
    const handleClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MenuProductDetailModal.useCallback[handleClose]": ()=>{
            setIsActive(false);
            window.setTimeout(onClose, MODAL_ANIMATION_MS);
        }
    }["MenuProductDetailModal.useCallback[handleClose]"], [
        onClose
    ]);
    const handleAdd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MenuProductDetailModal.useCallback[handleAdd]": ()=>{
            if (!canAdd) {
                return;
            }
            addLine(restaurantId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$cart$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildCartLineItem"])(item, quantity, modifierGroups, modifierSelections));
            handleClose();
        }
    }["MenuProductDetailModal.useCallback[handleAdd]"], [
        addLine,
        canAdd,
        handleClose,
        item,
        modifierGroups,
        modifierSelections,
        quantity,
        restaurantId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuProductDetailModal.useEffect": ()=>{
            const handleKeyDown = {
                "MenuProductDetailModal.useEffect.handleKeyDown": (event)=>{
                    if (event.key === 'Escape') {
                        handleClose();
                    }
                }
            }["MenuProductDetailModal.useEffect.handleKeyDown"];
            document.addEventListener('keydown', handleKeyDown);
            return ({
                "MenuProductDetailModal.useEffect": ()=>{
                    document.removeEventListener('keydown', handleKeyDown);
                }
            })["MenuProductDetailModal.useEffect"];
        }
    }["MenuProductDetailModal.useEffect"], [
        handleClose
    ]);
    if (!mounted) {
        return null;
    }
    const title = item.variantLabel ? "".concat(item.name, " ").concat(item.variantLabel) : item.name;
    const activeClass = isActive ? ' menu-product-modal--active' : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantStylingPortalRoot"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "menu-product-modal__backdrop".concat(activeClass),
                    onClick: handleClose,
                    "aria-label": "Закрыть"
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                    lineNumber: 135,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "menu-product-modal".concat(activeClass),
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": "menu-product-modal-title",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "menu-product-modal__panel".concat(activeClass),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "menu-product-modal__close",
                                onClick: handleClose,
                                "aria-label": "Закрыть",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this),
                            images.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "menu-product-modal__media",
                                children: hasGallery ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$Carousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Carousel"], {
                                    className: "menu-product-modal__carousel",
                                    slides: images.map((url, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["resolveImageUrl"])(url),
                                            alt: "".concat(item.name).concat(index > 0 ? " — фото ".concat(index + 1) : ''),
                                            loading: index === 0 ? 'eager' : 'lazy'
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                            lineNumber: 159,
                                            columnNumber: 21
                                        }, void 0)),
                                    options: {
                                        loop: true
                                    },
                                    showArrows: true,
                                    showDots: true
                                }, void 0, false, {
                                    fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                    lineNumber: 156,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["resolveImageUrl"])(images[0]),
                                    alt: item.name
                                }, void 0, false, {
                                    fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                    lineNumber: 170,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "menu-product-modal__body",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        id: "menu-product-modal-title",
                                        className: "menu-product-modal__title",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                        lineNumber: 176,
                                        columnNumber: 13
                                    }, this),
                                    item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "menu-product-modal__description",
                                        children: item.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, this),
                                    modifierGroups.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuProductModifiers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenuProductModifiers"], {
                                        groups: modifierGroups,
                                        selections: modifierSelections,
                                        onChange: setModifierSelections
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this),
                                    item.ingredients && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "menu-product-modal__section",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "menu-product-modal__section-title",
                                                children: "Состав"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                                lineNumber: 194,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "menu-product-modal__ingredients",
                                                children: item.ingredients
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                                lineNumber: 195,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                        lineNumber: 193,
                                        columnNumber: 15
                                    }, this),
                                    item.nutrition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "menu-product-modal__section",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "menu-product-modal__section-title",
                                                children: "КБЖУ (на 100 грамм)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                                lineNumber: 201,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$components$2f$NutritionBadges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NutritionBadges"], {
                                                nutrition: item.nutrition
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                                lineNumber: 202,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                        lineNumber: 200,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                className: "menu-product-modal__footer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "menu-product-modal__price",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencyAmount$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CurrencyAmount"], {
                                            amount: unitPrice * quantity
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                            lineNumber: 209,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "menu-product-modal__actions",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "menu-product-modal__counter",
                                                "aria-label": "Количество",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "menu-product-modal__counter-btn",
                                                        onClick: ()=>setQuantity((value)=>Math.max(1, value - 1)),
                                                        disabled: quantity <= 1,
                                                        "aria-label": "Уменьшить количество",
                                                        children: "−"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                                        lineNumber: 214,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "menu-product-modal__counter-value",
                                                        "aria-live": "polite",
                                                        children: quantity
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "menu-product-modal__counter-btn",
                                                        onClick: ()=>setQuantity((value)=>value + 1),
                                                        "aria-label": "Увеличить количество",
                                                        children: "+"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                                lineNumber: 213,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "menu-product-modal__add",
                                                disabled: !canAdd,
                                                onClick: handleAdd,
                                                children: "Добавить"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                                lineNumber: 236,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
                    lineNumber: 142,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/MenuProductDetailModal.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this), document.body);
}
_s(MenuProductDetailModal, "JH4FbPC0kGVjvFQ6pCJ3nytyFsc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollLock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"]
    ];
});
_c = MenuProductDetailModal;
var _c;
__turbopack_context__.k.register(_c, "MenuProductDetailModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantMenuCatalog",
    ()=>RestaurantMenuCatalog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/RestaurantStylingContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/MenuCategoryNavContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$catalog$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/menu-catalog.util.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantMenuInlineCategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/RestaurantMenuInlineCategoryNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuCategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/MenuCategoryNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/MenuProductCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuProductDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/MenuProductDetailModal.tsx [app-client] (ecmascript)");
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
function RestaurantMenuCatalog(param) {
    let { restaurantId, menu } = param;
    _s();
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { styling } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantStylingOptional"])();
    const navContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuCategoryNavOptional"])();
    const categories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RestaurantMenuCatalog.useMemo[categories]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$catalog$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvailableMenuCategories"])(menu.categories)
    }["RestaurantMenuCatalog.useMemo[categories]"], [
        menu.categories
    ]);
    const showStandaloneNav = styling.menuCategoryNavEnabled && categories.length > 1 && navContext === null;
    if (categories.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "restaurant-menu",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "restaurant-menu__empty",
                children: "Меню пока пусто"
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "restaurant-menu",
        "aria-label": "Меню",
        children: [
            navContext && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantMenuInlineCategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantMenuInlineCategoryNav"], {}, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx",
                lineNumber: 45,
                columnNumber: 22
            }, this),
            showStandaloneNav && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuCategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenuCategoryNav"], {
                categories: categories.map((category)=>({
                        id: category.id,
                        name: category.name
                    }))
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this),
            categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "menu-category-".concat(category.id),
                    className: "restaurant-menu__category",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "restaurant-menu__category-title",
                            children: category.name
                        }, void 0, false, {
                            fileName: "[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "restaurant-menu__grid",
                            children: category.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenuProductCard"], {
                                    item: item,
                                    onSelect: setSelectedItem
                                }, item.id, false, {
                                    fileName: "[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx",
                                    lineNumber: 65,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    ]
                }, category.id, true, {
                    fileName: "[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)),
            selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuProductDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenuProductDetailModal"], {
                item: selectedItem,
                restaurantId: restaurantId,
                onClose: ()=>setSelectedItem(null)
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(RestaurantMenuCatalog, "NZ17ZsyCQ6kUr+LVelEYwijRipg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantStylingOptional"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuCategoryNavOptional"]
    ];
});
_c = RestaurantMenuCatalog;
var _c;
__turbopack_context__.k.register(_c, "RestaurantMenuCatalog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useCartHydrated.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCartHydrated",
    ()=>useCartHydrated
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cart.store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useCartHydrated() {
    _s();
    const [hydrated, setHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCartHydrated.useEffect": ()=>{
            const { persist } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"];
            if (!(persist === null || persist === void 0 ? void 0 : persist.hasHydrated)) {
                setHydrated(true);
                return;
            }
            if (persist.hasHydrated()) {
                setHydrated(true);
                return;
            }
            return persist.onFinishHydration({
                "useCartHydrated.useEffect": ()=>{
                    setHydrated(true);
                }
            }["useCartHydrated.useEffect"]);
        }
    }["useCartHydrated.useEffect"], []);
    return hydrated;
}
_s(useCartHydrated, "/47YNaDQBvRcdaMfKv2fLgjliyI=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/RestaurantCartButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantCartButton",
    ()=>RestaurantCartButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCartHydrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useCartHydrated.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cart.store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const EMPTY_CART_ITEMS = [];
function CartIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "restaurant-cart-button__icon",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.75",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 6h15l-1.5 9H8L6 6Z"
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantCartButton.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 6 5 3H2"
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantCartButton.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9.5",
                cy: "19",
                r: "1.25",
                fill: "currentColor",
                stroke: "none"
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantCartButton.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "17.5",
                cy: "19",
                r: "1.25",
                fill: "currentColor",
                stroke: "none"
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantCartButton.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurants/components/RestaurantCartButton.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = CartIcon;
function RestaurantCartButton(param) {
    let { restaurantId, onOpen } = param;
    _s();
    const hydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCartHydrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartHydrated"])();
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "RestaurantCartButton.useCartStore[items]": (s)=>s.restaurantId === restaurantId ? s.items : EMPTY_CART_ITEMS
    }["RestaurantCartButton.useCartStore[items]"]);
    const itemCount = items.reduce((sum, line)=>sum + line.quantity, 0);
    const hasItems = hydrated && itemCount > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: "restaurant-cart-button",
        onClick: onOpen,
        "aria-label": hasItems ? "Корзина, ".concat(itemCount, " поз.") : 'Корзина',
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartIcon, {}, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantCartButton.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            hasItems && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "restaurant-cart-button__badge",
                children: itemCount
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantCartButton.tsx",
                lineNumber: 51,
                columnNumber: 20
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurants/components/RestaurantCartButton.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(RestaurantCartButton, "WtdqiBNKpwrVDOeaOiO5m/iRN+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCartHydrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartHydrated"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cart$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"]
    ];
});
_c1 = RestaurantCartButton;
var _c, _c1;
__turbopack_context__.k.register(_c, "CartIcon");
__turbopack_context__.k.register(_c1, "RestaurantCartButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantPublicHeader",
    ()=>RestaurantPublicHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/shared/types/menu.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/routing/restaurant-guest-path.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/RestaurantStylingContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/MenuCategoryNavContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuCategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/MenuCategoryNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantCartButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/RestaurantCartButton.tsx [app-client] (ecmascript)");
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
function RestaurantPublicHeader(param) {
    let { restaurantId, restaurantName, logoUrl, onOpenCart, disableScrollHide = false } = param;
    _s();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "RestaurantPublicHeader.useAuthStore[user]": (s)=>s.user
    }["RestaurantPublicHeader.useAuthStore[user]"]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "RestaurantPublicHeader.useAuthStore[logout]": (s)=>s.logout
    }["RestaurantPublicHeader.useAuthStore[logout]"]);
    const paths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantGuestPaths"])(restaurantId);
    const { styling } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantStylingOptional"])();
    const navContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuCategoryNavOptional"])();
    var _styling_headerBehavior;
    const headerBehavior = (_styling_headerBehavior = styling === null || styling === void 0 ? void 0 : styling.headerBehavior) !== null && _styling_headerBehavior !== void 0 ? _styling_headerBehavior : 'sticky';
    const [hidden, setHidden] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const lastScrollY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const isCategoryDockable = navContext !== null && (navContext.mode === 'dock_in_header' || navContext.mode === 'always_in_header');
    const showHeaderCategoryNav = navContext !== null && (navContext.mode === 'always_in_header' || navContext.mode === 'dock_in_header' && navContext.docked);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RestaurantPublicHeader.useEffect": ()=>{
            if (disableScrollHide || headerBehavior !== 'hide-on-scroll') {
                setHidden(false);
                return;
            }
            const onScroll = {
                "RestaurantPublicHeader.useEffect.onScroll": ()=>{
                    const currentY = window.scrollY;
                    const pastThreshold = currentY > 80;
                    const scrollingDown = currentY > lastScrollY.current;
                    if (pastThreshold && scrollingDown) {
                        setHidden(true);
                    } else if (!scrollingDown || !pastThreshold) {
                        setHidden(false);
                    }
                    lastScrollY.current = currentY;
                }
            }["RestaurantPublicHeader.useEffect.onScroll"];
            window.addEventListener('scroll', onScroll, {
                passive: true
            });
            return ({
                "RestaurantPublicHeader.useEffect": ()=>window.removeEventListener('scroll', onScroll)
            })["RestaurantPublicHeader.useEffect"];
        }
    }["RestaurantPublicHeader.useEffect"], [
        disableScrollHide,
        headerBehavior
    ]);
    const isGuestOfRestaurant = (user === null || user === void 0 ? void 0 : user.role) === 'user' && user.restaurantId === restaurantId;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "glass-header".concat(hidden ? ' glass-header--hidden' : '').concat(isCategoryDockable ? ' glass-header--category-dockable' : '').concat(showHeaderCategoryNav ? ' glass-header--category-docked' : ''),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "glass-header__brand",
                children: [
                    logoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        className: "glass-header__logo",
                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["resolveImageUrl"])(logoUrl),
                        alt: ""
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "glass-header__brand-name",
                        children: restaurantName
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            isCategoryDockable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "glass-header__category-nav".concat(showHeaderCategoryNav ? ' glass-header__category-nav--visible' : ''),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuCategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenuCategoryNav"], {
                    placement: "header"
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx",
                    lineNumber: 97,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "glass-header__actions",
                children: [
                    onOpenCart && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantCartButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantCartButton"], {
                        restaurantId: restaurantId,
                        onOpen: onOpenCart
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    isGuestOfRestaurant ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: paths.account,
                                className: "glass-header__link",
                                children: user.firstName
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx",
                                lineNumber: 107,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "glass-header__link",
                                onClick: logout,
                                children: "Выйти"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: paths.auth(),
                        className: "glass-header__link",
                        children: "Войти"
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_s(RestaurantPublicHeader, "apgklWy9v6qi2IfTd6BQ+4+kK18=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantGuestPaths"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantStylingOptional"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuCategoryNavOptional"]
    ];
});
_c = RestaurantPublicHeader;
var _c;
__turbopack_context__.k.register(_c, "RestaurantPublicHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/RestaurantPublicHeaderStack.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantPublicHeaderStack",
    ()=>RestaurantPublicHeaderStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantPublicHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/RestaurantStylingContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function RestaurantPublicHeaderStack(param) {
    let { restaurantId, restaurantName, logoUrl, onOpenCart } = param;
    _s();
    const { styling } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantStylingOptional"])();
    var _styling_headerBehavior;
    const headerBehavior = (_styling_headerBehavior = styling === null || styling === void 0 ? void 0 : styling.headerBehavior) !== null && _styling_headerBehavior !== void 0 ? _styling_headerBehavior : 'sticky';
    const [hidden, setHidden] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const lastScrollY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RestaurantPublicHeaderStack.useEffect": ()=>{
            if (headerBehavior !== 'hide-on-scroll') {
                setHidden(false);
                return;
            }
            const onScroll = {
                "RestaurantPublicHeaderStack.useEffect.onScroll": ()=>{
                    const currentY = window.scrollY;
                    const pastThreshold = currentY > 80;
                    const scrollingDown = currentY > lastScrollY.current;
                    if (pastThreshold && scrollingDown) {
                        setHidden(true);
                    } else if (!scrollingDown || !pastThreshold) {
                        setHidden(false);
                    }
                    lastScrollY.current = currentY;
                }
            }["RestaurantPublicHeaderStack.useEffect.onScroll"];
            window.addEventListener('scroll', onScroll, {
                passive: true
            });
            return ({
                "RestaurantPublicHeaderStack.useEffect": ()=>window.removeEventListener('scroll', onScroll)
            })["RestaurantPublicHeaderStack.useEffect"];
        }
    }["RestaurantPublicHeaderStack.useEffect"], [
        headerBehavior
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "restaurant-public__header-stack".concat(hidden ? ' restaurant-public__header-stack--hidden' : ''),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantPublicHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantPublicHeader"], {
            restaurantId: restaurantId,
            restaurantName: restaurantName,
            logoUrl: logoUrl,
            onOpenCart: onOpenCart,
            disableScrollHide: true
        }, void 0, false, {
            fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeaderStack.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/RestaurantPublicHeaderStack.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(RestaurantPublicHeaderStack, "+Jisrv674PriBE2eiLtlMnwZ1M4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantStylingOptional"]
    ];
});
_c = RestaurantPublicHeaderStack;
var _c;
__turbopack_context__.k.register(_c, "RestaurantPublicHeaderStack");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/src/features/restaurants/components/RestaurantSocialLinks.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantSocialLinks",
    ()=>RestaurantSocialLinks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$SocialIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/components/SocialIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$social$2d$link$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/social-link.ts [app-client] (ecmascript)");
;
;
;
;
function RestaurantSocialLinks(param) {
    let { links } = param;
    if (links.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "restaurant-social-links",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "restaurant-social-links__title",
                children: "Мы в соцсетях"
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantSocialLinks.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "restaurant-social-links__list",
                children: links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: link.url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "restaurant-social-links__item ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$SocialIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialIconClassName"])(link.platform)),
                            "aria-label": (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$social$2d$link$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSocialLinkDisplayLabel"])(link),
                            title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$social$2d$link$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSocialLinkDisplayLabel"])(link),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$SocialIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SocialIcon"], {
                                platform: link.platform
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantSocialLinks.tsx",
                                lineNumber: 29,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/features/restaurants/components/RestaurantSocialLinks.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this)
                    }, link.id, false, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantSocialLinks.tsx",
                        lineNumber: 20,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantSocialLinks.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurants/components/RestaurantSocialLinks.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = RestaurantSocialLinks;
var _c;
__turbopack_context__.k.register(_c, "RestaurantSocialLinks");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurants/components/RestaurantPublicPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantPublicPage",
    ()=>RestaurantPublicPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/shared/types/menu.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/routing/restaurant-guest-path.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/RestaurantStylingContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/MenuCategoryNavContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$catalog$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/menu-catalog.util.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantCartModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/RestaurantCartModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantMenuCatalog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/RestaurantMenuCatalog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantPublicHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/RestaurantPublicHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantPublicHeaderStack$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/RestaurantPublicHeaderStack.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantSocialLinks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/RestaurantSocialLinks.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
function RestaurantPublicPageBody(param) {
    let { restaurant, menu, orderSettings, bookingSettings, socialLinks = [], embedded = false, categoryNavEnabled } = param;
    _s();
    const paths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantGuestPaths"])(restaurant.id, embedded);
    const [cartOpen, setCartOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    var _bookingSettings_bookingEnabled;
    const bookingEnabled = (_bookingSettings_bookingEnabled = bookingSettings === null || bookingSettings === void 0 ? void 0 : bookingSettings.bookingEnabled) !== null && _bookingSettings_bookingEnabled !== void 0 ? _bookingSettings_bookingEnabled : false;
    const headerProps = {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        logoUrl: restaurant.logoUrl,
        onOpenCart: embedded ? undefined : ()=>setCartOpen(true)
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "restaurant-public".concat(embedded ? ' restaurant-public--embedded' : ''),
        children: [
            categoryNavEnabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantPublicHeaderStack$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantPublicHeaderStack"], {
                ...headerProps
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantPublicHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantPublicHeader"], {
                ...headerProps
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "restaurant-public__main",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: restaurant.name
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "restaurant-public__address",
                        children: restaurant.address
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    restaurant.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "restaurant-public__description",
                        children: restaurant.description
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantMenuCatalog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantMenuCatalog"], {
                        restaurantId: restaurant.id,
                        menu: menu
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "restaurant-public__actions",
                        children: [
                            bookingEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: paths.booking,
                                className: "restaurant-public__btn",
                                children: "Забронировать стол"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: paths.preOrder,
                                className: "restaurant-public__btn".concat(bookingEnabled ? ' restaurant-public__btn--secondary' : ''),
                                children: "Сделать предзаказ"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "restaurant-public__footer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "restaurant-public__footer-inner",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "restaurant-public__footer-brand",
                                children: [
                                    restaurant.logoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        className: "restaurant-public__footer-logo",
                                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["resolveImageUrl"])(restaurant.logoUrl),
                                        alt: ""
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "restaurant-public__footer-brand-text",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "restaurant-public__footer-name",
                                                children: restaurant.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                                lineNumber: 101,
                                                columnNumber: 15
                                            }, this),
                                            restaurant.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "restaurant-public__footer-tagline",
                                                children: restaurant.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                                lineNumber: 103,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "restaurant-public__footer-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "restaurant-public__footer-label",
                                        children: "Навигация"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                        lineNumber: 109,
                                        columnNumber: 13
                                    }, this),
                                    bookingEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: paths.booking,
                                        className: "restaurant-public__footer-link",
                                        children: "Бронирование стола"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: paths.preOrder,
                                        className: "restaurant-public__footer-link",
                                        children: "Предзаказ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                        lineNumber: 115,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: paths.account,
                                        className: "restaurant-public__footer-link",
                                        children: "Личный кабинет"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            socialLinks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "restaurant-public__footer-col restaurant-public__footer-social",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantSocialLinks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantSocialLinks"], {
                                    links: socialLinks
                                }, void 0, false, {
                                    fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                    lineNumber: 125,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                lineNumber: 124,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "restaurant-public__footer-bottom",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "© ",
                                    new Date().getFullYear(),
                                    " ",
                                    restaurant.name,
                                    " · ",
                                    restaurant.address
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "restaurant-public__footer-credit",
                                children: "Работает на Svels"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            !embedded && cartOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantCartModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantCartModal"], {
                restaurantId: restaurant.id,
                orderSettings: orderSettings,
                bookingEnabled: bookingEnabled,
                onClose: ()=>setCartOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                lineNumber: 139,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(RestaurantPublicPageBody, "aotipCKKENNjQnutyefcLctDvB4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$routing$2f$restaurant$2d$guest$2d$path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRestaurantGuestPaths"]
    ];
});
_c = RestaurantPublicPageBody;
function RestaurantPublicPage(param) {
    let { restaurant, menu, orderSettings, styling, bookingSettings, socialLinks, embedded } = param;
    _s1();
    const navCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RestaurantPublicPage.useMemo[navCategories]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$catalog$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tempExpandMenuCategoryNavItems"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$catalog$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMenuCategoryNavItems"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$catalog$2e$util$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvailableMenuCategories"])(menu.categories)))
    }["RestaurantPublicPage.useMemo[navCategories]"], [
        menu.categories
    ]);
    const categoryNavEnabled = styling.menuCategoryNavEnabled && navCategories.length > 1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantStylingShell"], {
        styling: styling,
        children: categoryNavEnabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$MenuCategoryNavContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenuCategoryNavProvider"], {
            categories: navCategories,
            mode: "dock_in_header",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RestaurantPublicPageBody, {
                restaurant: restaurant,
                menu: menu,
                orderSettings: orderSettings,
                styling: styling,
                bookingSettings: bookingSettings,
                socialLinks: socialLinks,
                embedded: embedded,
                categoryNavEnabled: true
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
                lineNumber: 174,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
            lineNumber: 173,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RestaurantPublicPageBody, {
            restaurant: restaurant,
            menu: menu,
            orderSettings: orderSettings,
            styling: styling,
            bookingSettings: bookingSettings,
            socialLinks: socialLinks,
            embedded: embedded,
            categoryNavEnabled: false
        }, void 0, false, {
            fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
            lineNumber: 186,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/RestaurantPublicPage.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
_s1(RestaurantPublicPage, "Xk197F/KEaodQzb/bkiwBT3ZUvU=");
_c1 = RestaurantPublicPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "RestaurantPublicPageBody");
__turbopack_context__.k.register(_c1, "RestaurantPublicPage");
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
"[project]/src/features/restaurant-admin/api/styling.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchRestaurantStyling",
    ()=>fetchRestaurantStyling,
    "updateRestaurantStyling",
    ()=>updateRestaurantStyling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-client] (ecmascript)");
;
function fetchRestaurantStyling(restaurantId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/styling"));
}
function updateRestaurantStyling(restaurantId, token, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/styling"), {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurant-admin/api/restaurant-preview.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchRestaurantPreview",
    ()=>fetchRestaurantPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/restaurant-styling.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$social$2d$links$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/social-links.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$styling$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/styling.api.ts [app-client] (ecmascript)");
;
;
;
;
async function fetchRestaurantPreview(restaurantId) {
    const [restaurant, socialLinks, menu, orderSettings, styling] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId)),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$social$2d$links$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSocialLinks"])(restaurantId),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/menu")).catch(()=>({
                categories: []
            })),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/restaurants/".concat(restaurantId, "/order-settings")).catch(()=>({
                restaurantId,
                fulfillmentDelivery: false,
                fulfillmentTakeaway: true,
                fulfillmentDineIn: true,
                paymentCash: true,
                paymentCardOnSite: true,
                paymentOnline: true,
                updatedAt: new Date().toISOString()
            })),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$styling$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchRestaurantStyling"])(restaurantId).catch(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultRestaurantStyling"])(restaurantId))
    ]);
    return {
        restaurant,
        socialLinks,
        menu,
        orderSettings,
        styling
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RestaurantPagePreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantPublicPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/RestaurantPublicPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$restaurant$2d$preview$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/restaurant-preview.api.ts [app-client] (ecmascript)");
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
function RestaurantPagePreview() {
    _s();
    const restaurantId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "RestaurantPagePreview.useAuthStore[restaurantId]": (s)=>{
            var _s_user;
            return (_s_user = s.user) === null || _s_user === void 0 ? void 0 : _s_user.restaurantId;
        }
    }["RestaurantPagePreview.useAuthStore[restaurantId]"]);
    const [restaurant, setRestaurant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [socialLinks, setSocialLinks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [menu, setMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        categories: []
    });
    const [orderSettings, setOrderSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [styling, setStyling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadPreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RestaurantPagePreview.useCallback[loadPreview]": async ()=>{
            if (!restaurantId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$restaurant$2d$preview$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchRestaurantPreview"])(restaurantId);
                setRestaurant(data.restaurant);
                setSocialLinks(data.socialLinks);
                setMenu(data.menu);
                setOrderSettings(data.orderSettings);
                setStyling(data.styling);
            } catch (err) {
                setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось загрузить страницу заведения');
            } finally{
                setLoading(false);
            }
        }
    }["RestaurantPagePreview.useCallback[loadPreview]"], [
        restaurantId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RestaurantPagePreview.useEffect": ()=>{
            void loadPreview();
        }
    }["RestaurantPagePreview.useEffect"], [
        loadPreview
    ]);
    if (!restaurantId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "restaurant-page-preview__notice",
            children: "Заявка ещё на модерации или ресторан не привязан к аккаунту."
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "restaurant-page-preview",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "restaurant-page-preview__toolbar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "restaurant-page-preview__title",
                                children: "Страница заведения"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "restaurant-page-preview__hint",
                                children: "Так вашу страницу видят гости — без доступа к админ-панели."
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    restaurant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/restaurants/".concat(restaurant.id),
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "restaurant-page-preview__open",
                        children: "Открыть в новой вкладке"
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "restaurant-page-preview__error",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx",
                lineNumber: 82,
                columnNumber: 17
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "restaurant-page-preview__empty",
                children: "Загрузка…"
            }, void 0, false, {
                fileName: "[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this) : restaurant && orderSettings && styling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "restaurant-page-preview__frame",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$RestaurantPublicPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RestaurantPublicPage"], {
                    restaurant: restaurant,
                    menu: menu,
                    orderSettings: orderSettings,
                    styling: styling,
                    socialLinks: socialLinks,
                    embedded: true
                }, void 0, false, {
                    fileName: "[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx",
                    lineNumber: 88,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurant-admin/pages/RestaurantPagePreview.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(RestaurantPagePreview, "CDIde07tyrYwp8mN9oYNnKxQ7yA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = RestaurantPagePreview;
var _c;
__turbopack_context__.k.register(_c, "RestaurantPagePreview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__e73e2aa9._.js.map