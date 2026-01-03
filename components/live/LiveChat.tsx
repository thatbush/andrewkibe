// components/live/LiveChat.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/client';
import { Database } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Pin, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getRelativeTime } from '@/lib/utils/slug';

type ChatMessage = Database['public']['Tables']['livestream_chat_messages']['Row'];

interface LiveChatProps {
    streamId: string;
    userId?: string;
    userName?: string;
}

export function LiveChat({ streamId, userId, userName }: LiveChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Fetch initial messages
    useEffect(() => {
        fetchMessages();
    }, [streamId]);

    // Subscribe to real-time updates
    useEffect(() => {
        const channel = supabase
            .channel(`livestream-chat-${streamId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'livestream_chat_messages',
                    filter: `livestream_id=eq.${streamId}`,
                },
                (payload) => {
                    const newMsg = payload.new as ChatMessage;
                    setMessages((prev) => [...prev, newMsg]);
                    scrollToBottom();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'livestream_chat_messages',
                    filter: `livestream_id=eq.${streamId}`,
                },
                (payload) => {
                    const updatedMsg = payload.new as ChatMessage;
                    setMessages((prev) =>
                        prev.map((msg) => (msg.id === updatedMsg.id ? updatedMsg : msg))
                    );
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'livestream_chat_messages',
                    filter: `livestream_id=eq.${streamId}`,
                },
                (payload) => {
                    const deletedMsg = payload.old as ChatMessage;
                    setMessages((prev) => prev.filter((msg) => msg.id !== deletedMsg.id));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [streamId]);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('livestream_chat_messages')
                .select('*')
                .eq('livestream_id', streamId)
                .eq('is_deleted', false)
                .order('created_at', { ascending: true })
                .limit(100);

            if (error) throw error;
            setMessages(data || []);
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || isSending) return;

        setIsSending(true);

        try {
            const { error } = await supabase
                .from('livestream_chat_messages')
                .insert({
                    livestream_id: streamId,
                    user_id: userId || null,
                    guest_name: !userId ? 'Anonymous' : null,
                    message: newMessage.trim(),
                });

            if (error) throw error;

            setNewMessage('');
        } catch (error: any) {
            console.error('Error sending message:', error);
            toast.error('Error', {
                description: error.message || 'Failed to send message',
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            const { error } = await supabase
                .from('livestream_chat_messages')
                .update({ is_deleted: true })
                .eq('id', messageId)
                .eq('user_id', userId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Error', {
                description: 'Failed to delete message',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="bg-muted/30 rounded-lg p-6 h-[600px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading chat...</p>
            </div>
        );
    }

    return (
        <div className="bg-muted/30 rounded-lg overflow-hidden h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                    <Badge className="bg-brand-red animate-pulse">LIVE</Badge>
                    Chat
                </h3>
                <span className="text-sm text-muted-foreground">
                    {messages.length} messages
                </span>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-3">
                    {messages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No messages yet. Be the first to chat!</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`group ${msg.is_pinned ? 'bg-brand-red/10 p-2 rounded' : ''}`}
                            >
                                {msg.is_pinned && (
                                    <div className="flex items-center gap-1 text-xs text-brand-red mb-1">
                                        <Pin className="h-3 w-3" />
                                        Pinned
                                    </div>
                                )}

                                <div className="flex items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-semibold text-sm truncate">
                                                {msg.guest_name || 'User'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {getRelativeTime(msg.created_at!)}
                                            </span>
                                        </div>
                                        <p className="text-sm break-words mt-1">
                                            {msg.message}
                                        </p>
                                    </div>

                                    {/* Delete button for own messages */}
                                    {userId && msg.user_id === userId && (
                                        <button
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                <div className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={userId ? 'Send a message...' : 'Sign in to chat...'}
                        disabled={!userId || isSending}
                        maxLength={500}
                        className="flex-1"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!userId || !newMessage.trim() || isSending}
                        className="bg-brand-red hover:bg-brand-red-muted"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                {!userId && (
                    <p className="text-xs text-muted-foreground mt-2">
                        Sign in to participate in the chat
                    </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                    {newMessage.length}/500 characters
                </p>
            </form>
        </div>
    );
}