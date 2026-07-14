'use server';

import fs from 'fs';
import path from 'path';

export async function getProjectImages(slug, title) {
    const publicDir = path.join(process.cwd(), 'public');
    const projectDir = path.join(publicDir, 'projects');
    const validImages = [];

    const sanitizedSlug = slug.replace(/-/g, '');

    const sanitizedTitle = title ? title.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

    const searchBases = sanitizedTitle ? [sanitizedTitle, sanitizedSlug] : [sanitizedSlug];

    const uniqueBases = [...new Set(searchBases)];

    for (const baseName of uniqueBases) {
        if (!baseName) continue;

        for (let i = 1; i <= 10; i++) {
            const extensions = ['png', 'jpg', 'jpeg', 'webp'];

            for (const ext of extensions) {
                const filename = `${baseName}${i}.${ext}`;
                const filePath = path.join(projectDir, filename);

                try {
                    if (fs.existsSync(filePath)) {
                        const imagePath = `/projects/${filename}`;
                        if (!validImages.includes(imagePath)) {
                            validImages.push(imagePath);
                        }
                        break;
                    }
                } catch (error) {
                    // Ignore errors
                }
            }
        }

        if (validImages.length > 0) break;
    }

    return validImages;
}
