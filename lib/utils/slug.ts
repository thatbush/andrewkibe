// lib/utils/slug.ts

/**
 * Generate a URL-friendly slug from a title and ID
 * Format: "title-words-abcd1234"
 * Example: "real-raw-rare-s2e08-andrew-kibe-a1b2c3d4"
 */
export function generateLivestreamSlug(title: string, id: string): string {
    // Take first 8 characters of the UUID for the slug suffix
    const shortId = id.replace(/-/g, '').substring(0, 8);

    // Convert title to slug format
    const titleSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .substring(0, 60) // Limit length
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    return `${titleSlug}-${shortId}`;
}

/**
 * Extract the ID from a slug
 * Example: "real-raw-rare-s2e08-andrew-kibe-a1b2c3d4" -> "a1b2c3d4"
 */
export function extractIdFromSlug(slug: string): string | null {
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];

    // Verify it's 8 alphanumeric characters
    if (lastPart && /^[a-z0-9]{8}$/i.test(lastPart)) {
        return lastPart;
    }

    return null;
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${mins}m`;
}

/**
 * Format view count to readable string
 */
export function formatViewCount(count: number): string {
    if (count < 1000) {
        return count.toString();
    } else if (count < 1000000) {
        return `${(count / 1000).toFixed(1)}K`;
    } else {
        return `${(count / 1000000).toFixed(1)}M`;
    }
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: Date | string): string {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
    } else {
        return then.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: now.getFullYear() !== then.getFullYear() ? 'numeric' : undefined
        });
    }
}

/**
 * Get client IP address (server-side only)
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    return 'unknown';
}