// app/api/stream/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.CLOUDFLARE_WORKER_URL!;
const AUTH_SECRET = process.env.UPLOAD_AUTH_SECRET!;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

export async function POST(request: NextRequest) {
    try {
        const { filename, action, uploadId, key, parts } = await request.json();

        let endpoint = '';
        let body: any = null;

        switch (action) {
            case 'start':
                endpoint = 'start';
                body = { filename };
                break;

            case 'complete':
                endpoint = 'complete';
                body = { uploadId, key, parts };

                // After R2 upload completes, send to Cloudflare Stream
                const workerResponse = await fetch(`${WORKER_URL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${AUTH_SECRET}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                const r2Data = await workerResponse.json();

                if (!r2Data.success) {
                    return NextResponse.json(r2Data, { status: workerResponse.status });
                }

                // Now upload to Cloudflare Stream from R2
                const r2Url = `https://media.menengai.cloud/${r2Data.key}`; // Configure R2 public URL or use presigned URL

                const streamResponse = await fetch(
                    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/copy`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            url: r2Url,
                            meta: {
                                name: filename,
                            },
                        }),
                    }
                );

                const streamData = await streamResponse.json();

                return NextResponse.json({
                    success: true,
                    r2Key: r2Data.key,
                    videoId: streamData.result.uid,
                    thumbnailUrl: `https://videodelivery.net/${streamData.result.uid}/thumbnails/thumbnail.jpg`,
                });

            case 'abort':
                endpoint = '/abort';
                body = { uploadId, key };
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // For start/abort actions
        const response = await fetch(`${WORKER_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AUTH_SECRET}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error: any) {
        console.error('Upload route error:', error);
        return NextResponse.json(
            { error: 'Upload failed', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const uploadId = searchParams.get('uploadId');
        const key = searchParams.get('key');
        const partNumber = searchParams.get('partNumber');

        if (!uploadId || !key || !partNumber) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const response = await fetch(
            `${WORKER_URL}upload-part?uploadId=${uploadId}&key=${encodeURIComponent(key)}&partNumber=${partNumber}`,
            {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${AUTH_SECRET}` },
                body: request.body,
                // @ts-ignore
                duplex: 'half',
            }
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error: any) {
        console.error('Chunk upload error:', error);
        return NextResponse.json({ error: 'Chunk upload failed', details: error.message }, { status: 500 });
    }
}
