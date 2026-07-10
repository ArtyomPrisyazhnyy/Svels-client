module.exports = [
"[project]/src/shared/types/restaurant-styling.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    "RESTAURANT_HEADER_LAYOUT_OPTIONS",
    ()=>RESTAURANT_HEADER_LAYOUT_OPTIONS,
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
    headerLayout: 'logo-left',
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
const RESTAURANT_HEADER_LAYOUT_OPTIONS = [
    {
        value: 'logo-left',
        label: 'Логотип слева',
        description: 'Классическая компоновка: логотип слева, действия справа'
    },
    {
        value: 'logo-center',
        label: 'Логотип по центру',
        description: 'Симметричный шапка: логотип в центре, действия по краям'
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
}),
"[project]/src/features/restaurants/utils/restaurant-styling.util.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/restaurant-styling.ts [app-ssr] (ecmascript)");
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].fontFamily;
}
function resolveColorTheme(colorTheme) {
    if (colorTheme && colorTheme in COLOR_THEMES) {
        return colorTheme;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].colorTheme;
}
function buildRestaurantStylingVars(styling) {
    const fontFamily = resolveFontFamily(styling.fontFamily);
    const colorTheme = resolveColorTheme(styling.colorTheme);
    const buttonShape = styling.buttonShape ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].buttonShape;
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
    return {
        'data-rs-button-shape': styling.buttonShape ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].buttonShape,
        'data-rs-button-variant': styling.buttonVariant ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].buttonVariant,
        'data-rs-switcher-style': styling.switcherStyle ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].switcherStyle,
        'data-rs-card-style': styling.cardStyle ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].cardStyle,
        'data-rs-magazine-layout': styling.magazineCardLayout ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].magazineCardLayout,
        'data-rs-menu-category-nav': styling.menuCategoryNavEnabled ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].menuCategoryNavEnabled ? 'true' : 'false',
        'data-rs-header-layout': styling.headerLayout ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].headerLayout,
        'data-rs-header-style': styling.headerStyle ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].headerStyle,
        'data-rs-header-behavior': styling.headerBehavior ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].headerBehavior,
        'data-rs-footer-layout': styling.footerLayout ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].footerLayout,
        'data-rs-footer-accent': styling.footerAccent ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].footerAccent
    };
}
}),
"[next]/internal/font/google/inter_578afd2f.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "inter_578afd2f-module__YD-fLW__className",
  "variable": "inter_578afd2f-module__YD-fLW__variable",
});
}),
"[next]/internal/font/google/inter_578afd2f.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_578afd2f.module.css [app-ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Inter', 'Inter Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/montserrat_f41b021f.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "montserrat_f41b021f-module__GYCYbW__className",
  "variable": "montserrat_f41b021f-module__GYCYbW__variable",
});
}),
"[next]/internal/font/google/montserrat_f41b021f.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/montserrat_f41b021f.module.css [app-ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Montserrat', 'Montserrat Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/playfair_display_7054ecc7.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "playfair_display_7054ecc7-module__Zv7Hga__className",
  "variable": "playfair_display_7054ecc7-module__Zv7Hga__variable",
});
}),
"[next]/internal/font/google/playfair_display_7054ecc7.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/playfair_display_7054ecc7.module.css [app-ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Playfair Display', 'Playfair Display Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/marmelad_f3798ee2.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "marmelad_f3798ee2-module__DC3Y-q__className",
  "variable": "marmelad_f3798ee2-module__DC3Y-q__variable",
});
}),
"[next]/internal/font/google/marmelad_f3798ee2.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/marmelad_f3798ee2.module.css [app-ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Marmelad', 'Marmelad Fallback'",
        fontWeight: 400,
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/comfortaa_3495221b.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "comfortaa_3495221b-module__VNfz6W__className",
  "variable": "comfortaa_3495221b-module__VNfz6W__variable",
});
}),
"[next]/internal/font/google/comfortaa_3495221b.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/comfortaa_3495221b.module.css [app-ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Comfortaa', 'Comfortaa Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/comic_relief_727f76c1.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "comic_relief_727f76c1-module__FzFZ4a__className",
  "variable": "comic_relief_727f76c1-module__FzFZ4a__variable",
});
}),
"[next]/internal/font/google/comic_relief_727f76c1.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/comic_relief_727f76c1.module.css [app-ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Comic Relief'",
        fontWeight: 400,
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/roboto_a670f2f1.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "roboto_a670f2f1-module__LKQl7q__className",
  "variable": "roboto_a670f2f1-module__LKQl7q__variable",
});
}),
"[next]/internal/font/google/roboto_a670f2f1.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/roboto_a670f2f1.module.css [app-ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Roboto', 'Roboto Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/src/features/restaurants/fonts/restaurant-fonts.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RESTAURANT_FONT_CLASSES",
    ()=>RESTAURANT_FONT_CLASSES
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_578afd2f.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/montserrat_f41b021f.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/playfair_display_7054ecc7.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/marmelad_f3798ee2.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/comfortaa_3495221b.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/comic_relief_727f76c1.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/roboto_a670f2f1.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const RESTAURANT_FONT_CLASSES = [
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_578afd2f$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$montserrat_f41b021f$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_7054ecc7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$marmelad_f3798ee2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comfortaa_3495221b$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$comic_relief_727f76c1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].variable,
    __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$roboto_a670f2f1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].variable
].filter(Boolean).join(' ');
;
;
;
;
;
;
;
}),
"[project]/src/features/restaurants/context/RestaurantStylingContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RestaurantStylingPortalRoot",
    ()=>RestaurantStylingPortalRoot,
    "RestaurantStylingShell",
    ()=>RestaurantStylingShell,
    "useRestaurantStylingOptional",
    ()=>useRestaurantStylingOptional
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/restaurant-styling.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$restaurant$2d$styling$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/restaurant-styling.util.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$fonts$2f$restaurant$2d$fonts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/restaurants/fonts/restaurant-fonts.ts [app-ssr] (ecmascript) <locals>");
'use client';
;
;
;
;
;
;
;
const RestaurantStylingContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function RestaurantStylingRoot({ styling, className, children }) {
    const cssVars = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$restaurant$2d$styling$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildRestaurantStylingVars"])(styling);
    const domProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$restaurant$2d$styling$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRestaurantStylingDomProps"])(styling);
    const rootClassName = [
        'restaurant-styled',
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$fonts$2f$restaurant$2d$fonts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["RESTAURANT_FONT_CLASSES"],
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
function RestaurantStylingShell({ styling, children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RestaurantStylingContext.Provider, {
        value: {
            styling,
            currencyDisplay: styling.currencyDisplay
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RestaurantStylingRoot, {
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
function RestaurantStylingPortalRoot({ children }) {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(RestaurantStylingContext);
    if (!context) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RestaurantStylingRoot, {
        styling: context.styling,
        className: "restaurant-styled--portal",
        children: children
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/context/RestaurantStylingContext.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
function useRestaurantStylingOptional() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(RestaurantStylingContext);
    return context ?? {
        styling: {
            restaurantId: '',
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"],
            updatedAt: ''
        },
        currencyDisplay: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_RESTAURANT_STYLING"].currencyDisplay
    };
}
}),
"[project]/src/shared/types/order-settings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    const enabled = getEnabledFulfillmentOptions(settings);
    return enabled[0]?.key ?? 'fulfillmentTakeaway';
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
    const enabled = getEnabledPaymentOptions(settings);
    return enabled[0]?.key ?? null;
}
}),
"[project]/src/features/restaurants/components/SegmentedSwitcher.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SegmentedSwitcher",
    ()=>SegmentedSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function SegmentedSwitcher({ options, value, onChange, ariaLabel }) {
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const optionRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const [thumb, setThumb] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [thumbAnimated, setThumbAnimated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const activeIndex = options.findIndex((option)=>option.key === value);
    const updateThumb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const activeEl = optionRefs.current[activeIndex];
        if (!activeEl || activeIndex < 0) {
            setThumb(null);
            return;
        }
        setThumb({
            width: activeEl.offsetWidth,
            height: activeEl.offsetHeight,
            transform: `translate(${activeEl.offsetLeft}px, ${activeEl.offsetTop}px)`
        });
    }, [
        activeIndex
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        updateThumb();
    }, [
        updateThumb,
        options.length,
        value
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        setThumbAnimated(false);
        const frameId = requestAnimationFrame(()=>{
            setThumbAnimated(true);
        });
        return ()=>cancelAnimationFrame(frameId);
    }, [
        options.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const observer = new ResizeObserver(()=>{
            updateThumb();
        });
        observer.observe(container);
        window.addEventListener('resize', updateThumb);
        return ()=>{
            observer.disconnect();
            window.removeEventListener('resize', updateThumb);
        };
    }, [
        updateThumb
    ]);
    if (options.length <= 1) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "fulfillment-selector",
        role: "tablist",
        "aria-label": ariaLabel,
        children: [
            thumb && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `fulfillment-selector__thumb${thumbAnimated ? ' fulfillment-selector__thumb--animated' : ''}`,
                style: thumb,
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/features/restaurants/components/SegmentedSwitcher.tsx",
                lineNumber: 97,
                columnNumber: 9
            }, this),
            options.map((option, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
}),
"[project]/src/features/restaurants/components/FulfillmentSelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FulfillmentSelector",
    ()=>FulfillmentSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$order$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/order-settings.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$SegmentedSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/SegmentedSwitcher.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function FulfillmentSelector({ settings, value, onChange }) {
    const options = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$order$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FULFILLMENT_OPTIONS"].filter((option)=>settings[option.key]);
    if (options.length <= 1) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$SegmentedSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SegmentedSwitcher"], {
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
}),
"[project]/src/features/restaurants/components/MenuCategoryNav.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MenuCategoryNav",
    ()=>MenuCategoryNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function getCategoryElementId(categoryId) {
    return `menu-category-${categoryId}`;
}
function MenuCategoryNav({ categories }) {
    const [activeId, setActiveId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(categories[0]?.id ?? '');
    const navRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollToCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((categoryId)=>{
        const element = document.getElementById(getCategoryElementId(categoryId));
        if (!element) {
            return;
        }
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        setActiveId(categoryId);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (categories.length === 0) {
            return;
        }
        const observer = new IntersectionObserver((entries)=>{
            const visible = entries.filter((entry)=>entry.isIntersecting).sort((a, b)=>a.boundingClientRect.top - b.boundingClientRect.top);
            if (visible.length === 0) {
                return;
            }
            const categoryId = visible[0].target.id.replace('menu-category-', '');
            setActiveId(categoryId);
        }, {
            rootMargin: '-35% 0px -55% 0px',
            threshold: 0
        });
        categories.forEach((category)=>{
            const element = document.getElementById(getCategoryElementId(category.id));
            if (element) {
                observer.observe(element);
            }
        });
        return ()=>observer.disconnect();
    }, [
        categories
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!navRef.current || !activeId) {
            return;
        }
        const activeButton = navRef.current.querySelector(`[data-category-id="${activeId}"]`);
        if (activeButton instanceof HTMLElement) {
            activeButton.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [
        activeId
    ]);
    if (categories.length <= 1) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        ref: navRef,
        className: "restaurant-menu__category-nav",
        "aria-label": "Навигация по категориям меню",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "restaurant-menu__category-nav-inner",
            children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    "data-category-id": category.id,
                    className: `restaurant-menu__category-nav-btn${activeId === category.id ? ' restaurant-menu__category-nav-btn--active' : ''}`,
                    onClick: ()=>scrollToCategory(category.id),
                    children: category.name
                }, category.id, false, {
                    fileName: "[project]/src/features/restaurants/components/MenuCategoryNav.tsx",
                    lineNumber: 86,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/features/restaurants/components/MenuCategoryNav.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/features/restaurants/components/MenuCategoryNav.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/shared/config/currency.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/shared/components/CurrencySign.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CurrencySign",
    ()=>CurrencySign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/currency.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/RestaurantStylingContext.tsx [app-ssr] (ecmascript)");
'use client';
;
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CURRENCY_GLYPH"];
    }
}
function CurrencySign({ className }) {
    const { currencyDisplay } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRestaurantStylingOptional"])();
    if (currencyDisplay === 'byn_glyph') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: className ? `byn-sign ${className}` : 'byn-sign',
            role: "img",
            "aria-label": "белорусский рубль",
            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CURRENCY_GLYPH"]
        }, void 0, false, {
            fileName: "[project]/src/shared/components/CurrencySign.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className ? `currency-text ${className}` : 'currency-text',
        children: renderCurrencyText(currencyDisplay)
    }, void 0, false, {
        fileName: "[project]/src/shared/components/CurrencySign.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/shared/components/CurrencyAmount.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CurrencyAmount",
    ()=>CurrencyAmount,
    "PriceDelta",
    ()=>PriceDelta
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencySign$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/components/CurrencySign.tsx [app-ssr] (ecmascript)");
'use client';
;
;
function CurrencyAmount({ amount, fractionDigits = 0, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className ? `byn-price ${className}` : 'byn-price',
        children: [
            Number(amount).toFixed(fractionDigits),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencySign$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CurrencySign"], {}, void 0, false, {
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
function PriceDelta({ delta }) {
    if (!delta) {
        return null;
    }
    const sign = delta > 0 ? '+' : '−';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "byn-price",
        children: [
            ' (',
            sign,
            Math.abs(delta).toFixed(0),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencySign$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CurrencySign"], {}, void 0, false, {
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
}),
"[project]/src/shared/utils/currency.util.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatPrice",
    ()=>formatPrice,
    "formatPriceDelta",
    ()=>formatPriceDelta,
    "formatPricePlain",
    ()=>formatPricePlain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/currency.ts [app-ssr] (ecmascript)");
;
function formatPricePlain(price, fractionDigits = 0) {
    return `${Number(price).toFixed(fractionDigits)} BYN`;
}
function formatPrice(price, fractionDigits = 0) {
    return `${Number(price).toFixed(fractionDigits)}\u00A0${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CURRENCY_GLYPH"]}`;
}
function formatPriceDelta(delta) {
    if (!delta) {
        return '';
    }
    const sign = delta > 0 ? '+' : '−';
    return ` (${sign}${Math.abs(delta).toFixed(0)}\u00A0${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$currency$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CURRENCY_GLYPH"]})`;
}
}),
"[project]/src/shared/types/menu.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAX_MENU_ITEM_GALLERY_IMAGES",
    ()=>MAX_MENU_ITEM_GALLERY_IMAGES,
    "getMenuItemImages",
    ()=>getMenuItemImages,
    "resolveImageUrl",
    ()=>resolveImageUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$utils$2f$currency$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/utils/currency.util.ts [app-ssr] (ecmascript)");
const MAX_MENU_ITEM_GALLERY_IMAGES = 9;
function getMenuItemImages(item) {
    return [
        item.imageUrl,
        ...item.galleryUrls ?? []
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
        } catch  {
        // ignore invalid URL
        }
        return imageUrl;
    }
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
}
}),
"[project]/src/features/restaurants/components/MenuProductCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MenuProductCard",
    ()=>MenuProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencyAmount$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/components/CurrencyAmount.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/shared/types/menu.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/menu-modifiers.util.ts [app-ssr] (ecmascript)");
;
;
;
;
;
function MenuProductCard({ item, onSelect }) {
    const showFromPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$menu$2d$modifiers$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPriceAffectingModifiers"])(item.modifierGroups);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: "menu-product-card",
        onClick: ()=>onSelect(item),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "menu-product-card__media",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$menu$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["resolveImageUrl"])(item.imageUrl),
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "menu-product-card__body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "menu-product-card__title",
                        children: [
                            item.name,
                            item.variantLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "menu-product-card__description",
                        children: item.description
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "menu-product-card__price",
                        children: [
                            showFromPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "menu-product-card__price-from",
                                children: "от "
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurants/components/MenuProductCard.tsx",
                                lineNumber: 33,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$components$2f$CurrencyAmount$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CurrencyAmount"], {
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
"[project]/src/features/restaurant-admin/api/styling.api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchRestaurantStyling",
    ()=>fetchRestaurantStyling,
    "updateRestaurantStyling",
    ()=>updateRestaurantStyling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-ssr] (ecmascript)");
;
function fetchRestaurantStyling(restaurantId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/styling`);
}
function updateRestaurantStyling(restaurantId, token, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/restaurants/${restaurantId}/styling`, {
        method: 'PATCH',
        token,
        body: JSON.stringify(payload)
    });
}
}),
"[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StylingAdminPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/context/RestaurantStylingContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$FulfillmentSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/FulfillmentSelector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuCategoryNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/MenuCategoryNav.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuProductCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/components/MenuProductCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/features/restaurants/actions/data:0f6329 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/api-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/types/restaurant-styling.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$restaurant$2d$styling$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurants/utils/restaurant-styling.util.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$styling$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/restaurant-admin/api/styling.api.ts [app-ssr] (ecmascript)");
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
;
;
const PREVIEW_ORDER_SETTINGS = {
    restaurantId: 'preview',
    fulfillmentDelivery: true,
    fulfillmentTakeaway: true,
    fulfillmentDineIn: true,
    paymentCash: true,
    paymentCardOnSite: true,
    paymentOnline: true,
    updatedAt: new Date().toISOString()
};
const PREVIEW_MENU_ITEM_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset="1" stop-color="#cbd5e1"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><g fill="none" stroke="#64748b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M155 135 h85 v35 a42 42 0 0 1 -42 42 h-1 a42 42 0 0 1 -42 -42 z"/><path d="M240 145 a24 24 0 0 1 0 36"/></g><g stroke="#94a3b8" stroke-width="6" stroke-linecap="round" fill="none"><path d="M175 108 q-8 -10 0 -20"/><path d="M197 108 q-8 -10 0 -20"/><path d="M219 108 q-8 -10 0 -20"/></g></svg>')}`;
const PREVIEW_MENU_ITEM = {
    id: 'preview-item',
    categoryId: 'preview-category',
    name: 'Капучино',
    variantLabel: '350 мл',
    description: 'Классический кофе с нежной молочной пенкой',
    ingredients: null,
    nutrition: null,
    price: 7.5,
    isAvailable: true,
    imageUrl: PREVIEW_MENU_ITEM_IMAGE,
    galleryUrls: [],
    modifierGroups: []
};
const PREVIEW_MENU_CATEGORIES = [
    {
        id: 'burgers',
        name: 'Бургеры'
    },
    {
        id: 'rolls',
        name: 'Роллы'
    },
    {
        id: 'drinks',
        name: 'Напитки'
    }
];
function StylingAdminPage() {
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((s)=>s.user);
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((s)=>s.accessToken);
    const restaurantId = user?.restaurantId;
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [previewFulfillment, setPreviewFulfillment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('fulfillmentTakeaway');
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
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$styling$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchRestaurantStyling"])(restaurantId);
            setSettings(data);
            setDraft({
                fontFamily: data.fontFamily,
                colorTheme: data.colorTheme,
                currencyDisplay: data.currencyDisplay,
                buttonShape: data.buttonShape,
                buttonVariant: data.buttonVariant,
                switcherStyle: data.switcherStyle,
                cardStyle: data.cardStyle,
                magazineCardLayout: data.magazineCardLayout,
                menuCategoryNavEnabled: data.menuCategoryNavEnabled,
                headerLayout: data.headerLayout,
                headerStyle: data.headerStyle,
                headerBehavior: data.headerBehavior,
                footerLayout: data.footerLayout,
                footerAccent: data.footerAccent
            });
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось загрузить стилизацию');
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
    const previewStyling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!settings || !restaurantId) {
            return null;
        }
        return {
            ...settings,
            fontFamily: draft.fontFamily ?? settings.fontFamily,
            colorTheme: draft.colorTheme ?? settings.colorTheme,
            currencyDisplay: draft.currencyDisplay ?? settings.currencyDisplay,
            buttonShape: draft.buttonShape ?? settings.buttonShape,
            buttonVariant: draft.buttonVariant ?? settings.buttonVariant,
            switcherStyle: draft.switcherStyle ?? settings.switcherStyle,
            cardStyle: draft.cardStyle ?? settings.cardStyle,
            magazineCardLayout: draft.magazineCardLayout ?? settings.magazineCardLayout,
            menuCategoryNavEnabled: draft.menuCategoryNavEnabled ?? settings.menuCategoryNavEnabled,
            headerLayout: draft.headerLayout ?? settings.headerLayout,
            headerStyle: draft.headerStyle ?? settings.headerStyle,
            headerBehavior: draft.headerBehavior ?? settings.headerBehavior,
            footerLayout: draft.footerLayout ?? settings.footerLayout,
            footerAccent: draft.footerAccent ?? settings.footerAccent
        };
    }, [
        draft,
        restaurantId,
        settings
    ]);
    const hasChanges = settings !== null && (settings.fontFamily !== draft.fontFamily || settings.colorTheme !== draft.colorTheme || settings.currencyDisplay !== draft.currencyDisplay || settings.buttonShape !== draft.buttonShape || settings.buttonVariant !== draft.buttonVariant || settings.switcherStyle !== draft.switcherStyle || settings.cardStyle !== draft.cardStyle || settings.magazineCardLayout !== draft.magazineCardLayout || settings.menuCategoryNavEnabled !== draft.menuCategoryNavEnabled || settings.headerLayout !== draft.headerLayout || settings.headerStyle !== draft.headerStyle || settings.headerBehavior !== draft.headerBehavior || settings.footerLayout !== draft.footerLayout || settings.footerAccent !== draft.footerAccent);
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
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurant$2d$admin$2f$api$2f$styling$2e$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateRestaurantStyling"])(restaurantId, accessToken, draft);
            setSettings(updated);
            setDraft({
                fontFamily: updated.fontFamily,
                colorTheme: updated.colorTheme,
                currencyDisplay: updated.currencyDisplay,
                buttonShape: updated.buttonShape,
                buttonVariant: updated.buttonVariant,
                switcherStyle: updated.switcherStyle,
                cardStyle: updated.cardStyle,
                magazineCardLayout: updated.magazineCardLayout,
                menuCategoryNavEnabled: updated.menuCategoryNavEnabled,
                headerLayout: updated.headerLayout,
                headerStyle: updated.headerStyle,
                headerBehavior: updated.headerBehavior,
                footerLayout: updated.footerLayout,
                footerAccent: updated.footerAccent
            });
            setSuccess('Стилизация сохранена');
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$actions$2f$data$3a$0f6329__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["revalidateRestaurantPublicPage"])(restaurantId);
        } catch (err) {
            setError(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Не удалось сохранить стилизацию');
        } finally{
            setSaving(false);
        }
    }
    if (!restaurantId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "styling-admin__notice",
            children: "Заявка ещё на модерации или ресторан не привязан к аккаунту."
        }, void 0, false, {
            fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
            lineNumber: 208,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "styling-admin",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "styling-admin__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Стилизация"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "styling-admin__intro",
                                children: "Настройте внешний вид страницы заведения для гостей: шрифт, цвета, кнопки и переключатель способа получения заказа."
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "styling-admin__save",
                        disabled: saving || loading || !hasChanges,
                        onClick: ()=>void handleSave(),
                        children: saving ? 'Сохранение…' : 'Сохранить'
                    }, void 0, false, {
                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "styling-admin__error",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                lineNumber: 234,
                columnNumber: 17
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "styling-admin__success",
                children: success
            }, void 0, false, {
                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                lineNumber: 235,
                columnNumber: 19
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "styling-admin__empty",
                children: "Загрузка…"
            }, void 0, false, {
                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                lineNumber: 238,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "styling-admin__layout",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "styling-admin__controls",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Шрифт"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 243,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_FONT_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option${draft.fontFamily === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "fontFamily",
                                                        value: option.value,
                                                        checked: draft.fontFamily === option.value,
                                                        onChange: ()=>updateDraft({
                                                                fontFamily: option.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 259,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__font-sample",
                                                        style: {
                                                            fontFamily: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$utils$2f$restaurant$2d$styling$2e$util$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFontStack"])(option.value)
                                                        },
                                                        children: option.sample
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 260,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 246,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 244,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Цветовое оформление"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options styling-admin__options--themes",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_COLOR_THEME_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option styling-admin__option--theme${draft.colorTheme === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "colorTheme",
                                                        value: option.value,
                                                        checked: draft.colorTheme === option.value,
                                                        onChange: ()=>updateDraft({
                                                                colorTheme: option.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 288,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-desc",
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 289,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__swatches",
                                                        "aria-hidden": "true",
                                                        children: option.swatches.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    backgroundColor: color
                                                                }
                                                            }, color, false, {
                                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                                lineNumber: 292,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 290,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 275,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 273,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Форма кнопок"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 301,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_BUTTON_SHAPE_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option${draft.buttonShape === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "buttonShape",
                                                        value: option.value,
                                                        checked: draft.buttonShape === option.value,
                                                        onChange: ()=>updateDraft({
                                                                buttonShape: option.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 310,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 317,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-desc",
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 318,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 304,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 302,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 300,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Стиль кнопок"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 325,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_BUTTON_VARIANT_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option${draft.buttonVariant === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "buttonVariant",
                                                        value: option.value,
                                                        checked: draft.buttonVariant === option.value,
                                                        onChange: ()=>updateDraft({
                                                                buttonVariant: option.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 341,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-desc",
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 342,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 328,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 326,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 324,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Переключатель получения заказа"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 349,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options styling-admin__options--switcher",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_SWITCHER_STYLE_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option${draft.switcherStyle === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "switcherStyle",
                                                        value: option.value,
                                                        checked: draft.switcherStyle === option.value,
                                                        onChange: ()=>updateDraft({
                                                                switcherStyle: option.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 358,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 365,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-desc",
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 366,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 352,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 350,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 348,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Стиль карточек товара"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 373,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options styling-admin__options--switcher",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_CARD_STYLE_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option${draft.cardStyle === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "cardStyle",
                                                        value: option.value,
                                                        checked: draft.cardStyle === option.value,
                                                        onChange: ()=>updateDraft({
                                                                cardStyle: option.value,
                                                                ...option.value === 'magazine' && !draft.magazineCardLayout ? {
                                                                    magazineCardLayout: settings?.magazineCardLayout ?? 'content_left'
                                                                } : {}
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 382,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 396,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-desc",
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 397,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 376,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 374,
                                        columnNumber: 15
                                    }, this),
                                    draft.cardStyle === 'magazine' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__suboptions",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "styling-admin__suboptions-title",
                                                children: "Компоновка журнальной карточки"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 404,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "styling-admin__options styling-admin__options--switcher",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAGAZINE_CARD_LAYOUT_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `styling-admin__option${draft.magazineCardLayout === option.value ? ' styling-admin__option--active' : ''}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "radio",
                                                                name: "magazineCardLayout",
                                                                value: option.value,
                                                                checked: draft.magazineCardLayout === option.value,
                                                                onChange: ()=>updateDraft({
                                                                        magazineCardLayout: option.value
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                                lineNumber: 415,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "styling-admin__option-title",
                                                                children: option.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                                lineNumber: 422,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "styling-admin__option-desc",
                                                                children: option.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                                lineNumber: 423,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, option.value, true, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 407,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 405,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 403,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 372,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Навигация по категориям меню"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 432,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "styling-admin__hint",
                                        children: "Горизонтальные кнопки над меню для быстрого перехода к разделам — как на сайтах доставки еды."
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 433,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "styling-admin__toggle-option",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "styling-admin__toggle-copy",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Показывать кнопки категорий"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 439,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Гости смогут нажимать «Бургеры», «Роллы» и т.д. и прокручиваться к нужному разделу меню."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 440,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 438,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                className: "styling-admin__toggle",
                                                checked: Boolean(draft.menuCategoryNavEnabled),
                                                disabled: saving,
                                                onChange: (e)=>updateDraft({
                                                        menuCategoryNavEnabled: e.target.checked
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 445,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 437,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 431,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Шапка — расположение"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 456,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_HEADER_LAYOUT_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option${draft.headerLayout === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "headerLayout",
                                                        value: option.value,
                                                        checked: draft.headerLayout === option.value,
                                                        onChange: ()=>updateDraft({
                                                                headerLayout: option.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 465,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 472,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-desc",
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 473,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 459,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 457,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 455,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Шапка — стиль фона"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 480,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_HEADER_STYLE_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option${draft.headerStyle === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "headerStyle",
                                                        value: option.value,
                                                        checked: draft.headerStyle === option.value,
                                                        onChange: ()=>updateDraft({
                                                                headerStyle: option.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 489,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 496,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-desc",
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 483,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 481,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 479,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Шапка — поведение при прокрутке"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 504,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_HEADER_BEHAVIOR_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option${draft.headerBehavior === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "headerBehavior",
                                                        value: option.value,
                                                        checked: draft.headerBehavior === option.value,
                                                        onChange: ()=>updateDraft({
                                                                headerBehavior: option.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 513,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 520,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-desc",
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 521,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 507,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 505,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 503,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Подвал — компоновка"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 528,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_FOOTER_LAYOUT_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option${draft.footerLayout === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "footerLayout",
                                                        value: option.value,
                                                        checked: draft.footerLayout === option.value,
                                                        onChange: ()=>updateDraft({
                                                                footerLayout: option.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 537,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 544,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-desc",
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 545,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 531,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 529,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 527,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Подвал — акцент"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 552,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_FOOTER_ACCENT_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option${draft.footerAccent === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "footerAccent",
                                                        value: option.value,
                                                        checked: draft.footerAccent === option.value,
                                                        onChange: ()=>updateDraft({
                                                                footerAccent: option.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 561,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 568,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-desc",
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 569,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 555,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 553,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 551,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "styling-admin__panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Отображение валюты"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 576,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__options",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$types$2f$restaurant$2d$styling$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESTAURANT_CURRENCY_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `styling-admin__option${draft.currencyDisplay === option.value ? ' styling-admin__option--active' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "currencyDisplay",
                                                        value: option.value,
                                                        checked: draft.currencyDisplay === option.value,
                                                        onChange: ()=>updateDraft({
                                                                currencyDisplay: option.value
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 585,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-title",
                                                        children: option.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 592,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "styling-admin__option-desc",
                                                        children: option.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 593,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, option.value, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 579,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 577,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 575,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                        lineNumber: 241,
                        columnNumber: 11
                    }, this),
                    previewStyling && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "styling-admin__preview-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Предпросмотр"
                            }, void 0, false, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 602,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$context$2f$RestaurantStylingContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RestaurantStylingShell"], {
                                styling: previewStyling,
                                className: "styling-admin__preview",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                        className: "glass-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "glass-header__brand",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "glass-header__brand-name",
                                                    children: "Moontea"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                    lineNumber: 606,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 605,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "glass-header__actions",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "glass-header__link glass-header__link--accent",
                                                    children: "Войти"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                    lineNumber: 609,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 608,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 604,
                                        columnNumber: 17
                                    }, this),
                                    previewStyling.menuCategoryNavEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuCategoryNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MenuCategoryNav"], {
                                        categories: PREVIEW_MENU_CATEGORIES
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 614,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "restaurant-menu__grid styling-admin__preview-grid",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$MenuProductCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MenuProductCard"], {
                                            item: PREVIEW_MENU_ITEM,
                                            onSelect: ()=>{}
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                            lineNumber: 618,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 617,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "styling-admin__preview-switcher",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$restaurants$2f$components$2f$FulfillmentSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FulfillmentSelector"], {
                                            settings: PREVIEW_ORDER_SETTINGS,
                                            value: previewFulfillment,
                                            onChange: setPreviewFulfillment
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                            lineNumber: 622,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 621,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "restaurant-public__actions styling-admin__preview-actions",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "restaurant-public__btn",
                                                children: "Забронировать стол"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 630,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "restaurant-public__btn restaurant-public__btn--secondary",
                                                children: "Предзаказ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 633,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 629,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                        className: "restaurant-public__footer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "restaurant-public__footer-inner",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "restaurant-public__footer-brand",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "restaurant-public__footer-brand-text",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "restaurant-public__footer-name",
                                                                    children: "Moontea"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                                    lineNumber: 645,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "restaurant-public__footer-tagline",
                                                                    children: "Чайная мастерская в самом сердце города"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                                    lineNumber: 646,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                            lineNumber: 644,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 643,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                                        className: "restaurant-public__footer-col",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "restaurant-public__footer-label",
                                                                children: "Навигация"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                                lineNumber: 652,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "restaurant-public__footer-link",
                                                                children: "Бронирование стола"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                                lineNumber: 653,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "restaurant-public__footer-link",
                                                                children: "Предзаказ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                                lineNumber: 654,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "restaurant-public__footer-link",
                                                                children: "Личный кабинет"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                                lineNumber: 655,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 651,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 642,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "restaurant-public__footer-bottom",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "© 2026 Moontea · ул. Примерная, 1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 659,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "restaurant-public__footer-credit",
                                                        children: "Работает на Svels"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                        lineNumber: 660,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                                lineNumber: 658,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                        lineNumber: 641,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                                lineNumber: 603,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                        lineNumber: 601,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
                lineNumber: 240,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/restaurant-admin/pages/StylingAdminPage.tsx",
        lineNumber: 215,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a6b5fbad._.js.map