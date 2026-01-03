// components/live/StreamEngagement.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    ThumbsUp,
    Heart,
    Flame,
    Share2,
    Twitter,
    Facebook,
    MessageCircle,
    Copy,
    Check
} from 'lucide-react';
import { createClient } from '@/lib/client';
import { Database } from '@/types/database.types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { formatViewCount } from '@/lib/utils/slug';

interface StreamEngagementProps {
    streamId: string;
    userId?: string;
    initialLikes: number;
    initialShares: number;
}

const reactionIcons = {
    like: ThumbsUp,
    love: Heart,
    fire: Flame,
    clap: '👏',
};

export function StreamEngagement({
    streamId,
    userId,
    initialLikes,
    initialShares
}: StreamEngagementProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [shares, setShares] = useState(initialShares);
    const [hasLiked, setHasLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [copied, setCopied] = useState(false);
    const supabase = createClient();

    const handleLike = async () => {
        if (isLiking) return;

        setIsLiking(true);

        try {
            if (hasLiked) {
                // Unlike
                const { error } = await supabase
                    .from('livestream_reactions')
                    .delete()
                    .eq('livestream_id', streamId)
                    .eq('user_id', userId || null)
                    .eq('reaction_type', 'like');

                if (!error) {
                    setLikes(prev => Math.max(0, prev - 1));
                    setHasLiked(false);
                }
            } else {
                // Like
                const { error } = await supabase
                    .from('livestream_reactions')
                    .insert({
                        livestream_id: streamId,
                        user_id: userId || null,
                        reaction_type: 'like',
                    });

                if (!error) {
                    setLikes(prev => prev + 1);
                    setHasLiked(true);
                } else if (error.code === '23505') {
                    // Already liked
                    setHasLiked(true);
                }
            }
        } catch (error) {
            console.error('Error liking stream:', error);
            toast.error('Error', {
                description: 'Failed to update reaction',
            });
        } finally {
            setIsLiking(false);
        }
    };

    const handleShare = async (platform: string) => {
        const url = window.location.href;
        const text = `Check out this stream!`;

        // Track share
        try {
            await supabase
                .from('livestream_shares')
                .insert({
                    livestream_id: streamId,
                    user_id: userId || null,
                    platform,
                });
            setShares(prev => prev + 1);
        } catch (error) {
            console.error('Error tracking share:', error);
        }

        // Open share dialog
        switch (platform) {
            case 'twitter':
                window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                    '_blank'
                );
                break;
            case 'facebook':
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                    '_blank'
                );
                break;
            case 'whatsapp':
                window.open(
                    `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
                    '_blank'
                );
                break;
            case 'telegram':
                window.open(
                    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                    '_blank'
                );
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                toast('Link copied!', {
                    description: 'Share link has been copied to clipboard',
                });
                break;
        }
    };

    return (
        <div className="flex items-center gap-4 py-4 border-y border-border">
            {/* Like Button */}
            <Button
                variant={hasLiked ? 'default' : 'outline'}
                size="lg"
                onClick={handleLike}
                disabled={isLiking}
                className={hasLiked ? 'bg-brand-red hover:bg-brand-red-muted' : ''}
            >
                <ThumbsUp className={`h-5 w-5 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
                {formatViewCount(likes)} {likes === 1 ? 'Like' : 'Likes'}
            </Button>

            {/* Share Button */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="lg">
                        <Share2 className="h-5 w-5 mr-2" />
                        {shares > 0 && `${formatViewCount(shares)} `}Share
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => handleShare('twitter')}>
                        <Twitter className="h-4 w-4 mr-2" />
                        Share on Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('facebook')}>
                        <Facebook className="h-4 w-4 mr-2" />
                        Share on Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Share on WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('telegram')}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Share on Telegram
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('copy')}>
                        {copied ? (
                            <Check className="h-4 w-4 mr-2" />
                        ) : (
                            <Copy className="h-4 w-4 mr-2" />
                        )}
                        Copy Link
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}