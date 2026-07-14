'use server';

import fs from 'fs';
import path from 'path';

export async function getJourneyImages(slug) {
    const slugRegex = /^[a-zA-Z0-9-_]+$/;
    if (!slug) return [];
    if (!slugRegex.test(slug)) {
        console.warn(`Potential path injection attempt blocked for slug: "${slug}"`);
        return [];
    }

    const publicDir = path.join(process.cwd(), 'public');
    const journeyDir = path.join(publicDir, 'journey');
    const validImages = [];

    for (let i = 1; i <= 4; i++) {
        const filename = `${slug}${i}.jpg`;
        const filePath = path.join(journeyDir, filename);

        const resolvedPath = path.resolve(filePath);
        if (!resolvedPath.startsWith(path.resolve(journeyDir))) {
            continue;
        }

        try {
            if (fs.existsSync(resolvedPath)) {
                validImages.push(`/journey/${filename}`);
            }
        } catch (error) {
            // Silently fail for individual file checks
        }
    }

    return validImages;
}
