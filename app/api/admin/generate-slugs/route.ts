
import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';

function generateLivestreamSlug(title: string, id: string): string {
    const shortId = id.replace(/-/g, '').substring(0, 8);
    const titleSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 60)
        .replace(/^-|-$/g, '');
    return `${titleSlug}-${shortId}`;
}

export async function POST() {
    try {
        const supabase = await createClient();

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.app_metadata?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { data: streams, error } = await supabase
            .from('livestreams')
            .select('id, title, slug')
            .is('slug', null);

        if (error) throw error;

        const updates = [];

        for (const stream of streams || []) {
            const slug = generateLivestreamSlug(stream.title, stream.id);
            updates.push(
                supabase
                    .from('livestreams')
                    .update({ slug })
                    .eq('id', stream.id)
            );
        }

        await Promise.all(updates);

        return NextResponse.json({
            success: true,
            count: streams?.length || 0,
            message: `Generated slugs for ${streams?.length || 0} streams`
        });
    } catch (error) {
        console.error('Error generating slugs:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
