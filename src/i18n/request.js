import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './settings';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
    const cookieStore = await cookies();
    const headerStore = await headers();

    let locale = defaultLocale;

    const cookieLocale = cookieStore.get('locale')?.value;
    if (cookieLocale && locales.includes(cookieLocale)) {
        locale = cookieLocale;
    } else {
        const acceptLanguage = headerStore.get('accept-language');
        if (acceptLanguage) {
            const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];
            if (locales.includes(preferredLocale)) {
                locale = preferredLocale;
            }
        }
    }

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
        timeZone: 'Asia/Kolkata'
    };
});
