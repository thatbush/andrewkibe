// lib/upload.ts
export async function uploadLargeFile(file: File, onProgress?: (progress: number) => void) {
    const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB
    const PARALLEL_UPLOADS = 5;

    const startRes = await fetch('/api/stream/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', filename: file.name })
    });
    const { uploadId, key } = await startRes.json();

    const chunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadedParts = [];

    for (let i = 0; i < chunks; i += PARALLEL_UPLOADS) {
        const batch = [];

        for (let j = 0; j < PARALLEL_UPLOADS && (i + j) < chunks; j++) {
            const partNumber = i + j + 1;
            const start = (i + j) * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            const uploadPromise = fetch(
                `/api/stream/upload?uploadId=${uploadId}&key=${encodeURIComponent(key)}&partNumber=${partNumber}`,
                { method: 'PUT', body: chunk }
            ).then(r => r.json());

            batch.push(uploadPromise);
        }

        const results = await Promise.all(batch);
        uploadedParts.push(...results);

        const progress = Math.round((uploadedParts.length / chunks) * 100);
        onProgress?.(progress);
    }

    const completeRes = await fetch('/api/stream/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', uploadId, key, parts: uploadedParts })
    });

    return await completeRes.json();
}
