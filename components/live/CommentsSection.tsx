// components/live/CommentsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/client';
import { Database } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare, Trash2, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { getRelativeTime } from '@/lib/utils/slug';

type Comment = Database['public']['Tables']['livestream_comments']['Row'];

interface CommentsSectionProps {
    streamId: string;
    userId?: string;
    userEmail?: string;
}

export function CommentsSection({ streamId, userId, userEmail }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchComments();
    }, [streamId]);

    // Subscribe to real-time comment updates
    useEffect(() => {
        const channel = supabase
            .channel(`livestream-comments-${streamId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'livestream_comments',
                    filter: `livestream_id=eq.${streamId}`,
                },
                () => {
                    fetchComments();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [streamId]);

    const fetchComments = async () => {
        try {
            const { data, error } = await supabase
                .from('livestream_comments')
                .select('*')
                .eq('livestream_id', streamId)
                .eq('is_deleted', false)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setComments(data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim() || isSubmitting) return;
        if (!userId && (!guestName.trim() || !guestEmail.trim())) {
            // use sonner toast
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('livestream_comments')
                .insert({
                    livestream_id: streamId,
                    user_id: userId || null,
                    guest_name: !userId ? guestName : null,
                    guest_email: !userId ? guestEmail : null,
                    comment: newComment.trim(),
                    parent_id: replyingTo,
                });

            if (error) throw error;

            setNewComment('');
            setReplyingTo(null);
            toast.success('Comment posted!', {
                description: 'Your comment has been added',
            });
        } catch (error: any) {
            console.error('Error posting comment:', error);
            toast.error('Error', {
                description: error.message || 'Failed to post comment',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLikeComment = async (commentId: string) => {
        try {
            const { error } = await supabase
                .from('livestream_comment_likes')
                .insert({
                    comment_id: commentId,
                    user_id: userId || null,
                });

            if (error) {
                if (error.code === '23505') {
                    // Already liked, unlike
                    await supabase
                        .from('livestream_comment_likes')
                        .delete()
                        .eq('comment_id', commentId)
                        .eq('user_id', userId || null);
                } else {
                    throw error;
                }
            }

            fetchComments();
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            const { error } = await supabase
                .from('livestream_comments')
                .update({ is_deleted: true })
                .eq('id', commentId)
                .eq('user_id', userId);

            if (error) throw error;

            toast.success('Comment deleted', {
                description: 'Your comment has been removed',
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Error', {
                description: 'Failed to delete comment',
            });
        }
    };

    // Organize comments with replies
    const topLevelComments = comments.filter(c => !c.parent_id);
    const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId);

    return (
        <div className="space-y-6">
            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-4">
                {!userId && (
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="Your name *"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            required
                        />
                        <Input
                            type="email"
                            placeholder="Your email *"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            required
                        />
                    </div>
                )}

                <Textarea
                    placeholder={
                        replyingTo
                            ? 'Write your reply...'
                            : 'Share your thoughts about this stream...'
                    }
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    maxLength={2000}
                    className="resize-none"
                />

                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        {newComment.length}/2000 characters
                    </span>
                    <div className="flex gap-2">
                        {replyingTo && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setReplyingTo(null)}
                            >
                                Cancel Reply
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={!newComment.trim() || isSubmitting}
                            className="bg-brand-red hover:bg-brand-red-muted"
                        >
                            {isSubmitting ? 'Posting...' : replyingTo ? 'Post Reply' : 'Post Comment'}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Loading comments...
                    </div>
                ) : topLevelComments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    topLevelComments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            replies={getReplies(comment.id)}
                            onLike={handleLikeComment}
                            onReply={setReplyingTo}
                            onDelete={handleDeleteComment}
                            currentUserId={userId}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function CommentItem({
    comment,
    replies,
    onLike,
    onReply,
    onDelete,
    currentUserId,
}: {
    comment: Comment;
    replies: Comment[];
    onLike: (id: string) => void;
    onReply: (id: string) => void;
    onDelete: (id: string) => void;
    currentUserId?: string;
}) {
    const displayName = comment.guest_name || 'User';
    const initial = displayName.charAt(0).toUpperCase();
    const isOwn = currentUserId && comment.user_id === currentUserId;

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <Avatar>
                    <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{displayName}</span>
                                <span className="text-xs text-muted-foreground">
                                    {getRelativeTime(comment.created_at!)}
                                </span>
                            </div>
                            <p className="mt-2 text-sm whitespace-pre-wrap">{comment.comment}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                        <button
                            onClick={() => onLike(comment.id)}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ThumbsUp className="h-4 w-4" />
                            {comment.likes_count !== null && comment.likes_count > 0 && <span>{comment.likes_count}</span>}
                        </button>

                        <button
                            onClick={() => onReply(comment.id)}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <MessageSquare className="h-4 w-4" />
                            Reply
                        </button>

                        {isOwn && (
                            <button
                                onClick={() => onDelete(comment.id)}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Replies */}
            {replies.length > 0 && (
                <div className="ml-12 space-y-4 border-l-2 border-border pl-4">
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            replies={[]}
                            onLike={onLike}
                            onReply={onReply}
                            onDelete={onDelete}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}