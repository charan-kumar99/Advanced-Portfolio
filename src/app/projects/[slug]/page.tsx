import { notFound } from 'next/navigation';
import { portfolioData } from '@/data/portfolio';
import { ProjectPageContent } from '@/components/projects/ProjectPageContent';
import { getProjectImages } from '@/app/actions/getProjectImages'; // Import server action

export async function generateStaticParams() {
    return portfolioData.projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = portfolioData.projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    // Use portfolioData images as primary, fallback to dynamic public/project folder if empty
    const hasDefaultImages = !!(project.image && project.galleryImages && project.galleryImages.length > 0);
    const galleryImages = hasDefaultImages ? (project.galleryImages ?? []) : await getProjectImages(slug, project.title);
 
    const updatedProject = {
        ...project,
        image: hasDefaultImages ? project.image : (galleryImages.length > 0 ? galleryImages[0] : project.image), // First image as Hero
        galleryImages: galleryImages // All images for gallery
    };

    return <ProjectPageContent project={updatedProject} />;
}
