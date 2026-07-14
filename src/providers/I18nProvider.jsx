'use client';

import { NextIntlClientProvider } from 'next-intl';

export function I18nProvider({ children, locale, messages, timeZone = 'Asia/Kolkata' }) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
            {children}
        </NextIntlClientProvider>
    );
}
