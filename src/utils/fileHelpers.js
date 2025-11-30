/**
 * Helper function to ensure the filename has the correct extension based on MIME type.
 */
export const ensureExtension = (fileName, mimeType) => {
    const extensionMap = {
        'application/pdf': '.pdf',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'text/plain': '.txt',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
    };

    let final = fileName || 'download';
    // Don't add extension if fileName already has one
    if (!/\.[0-9a-z]+$/i.test(final)) {
        const ext = extensionMap[mimeType] || '';
        final = final + ext;
    }
    return final;
};

/**
 * Helper function to save a Blob to the user's device.
 * Handles legacy browsers and ensures proper cleanup.
 */
export const saveBlob = (blob, fileName) => {
    // IE/Edge legacy support
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName);
        return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Explicitly set attribute
    link.style.display = 'none';
    document.body.appendChild(link);

    // Programmatic click
    link.click();

    // Delay removal to ensure browser processes the download
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 2000);

    console.log(`Saved blob as: ${fileName}`);
};

/**
 * Main function to download a file from a base64 string.
 * Supports both data URIs (data:...) and raw base64 strings.
 */
export const downloadBase64File = async (base64Data, fileName = 'download', mimeType) => {
    try {
        let blob;
        let detectedMimeType = mimeType;

        // 1) Handle data URI format
        if (typeof base64Data === 'string' && base64Data.startsWith('data:')) {
            if (!detectedMimeType) {
                const match = base64Data.match(/data:([^;]+);/);
                if (match) detectedMimeType = match[1];
            }
            const res = await fetch(base64Data);
            blob = await res.blob();
        }
        // 2) Handle raw base64
        else if (typeof base64Data === 'string') {
            const cleaned = base64Data.replace(/\s/g, '');
            detectedMimeType = detectedMimeType || 'application/octet-stream';

            const byteChars = atob(cleaned);
            const byteArray = new Uint8Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) {
                byteArray[i] = byteChars.charCodeAt(i);
            }
            blob = new Blob([byteArray], { type: detectedMimeType });
        } else {
            throw new Error('Invalid base64Data format');
        }

        // Ensure proper filename
        const finalName = ensureExtension(fileName, detectedMimeType);

        // Save the blob
        saveBlob(blob, finalName);

        return true;
    } catch (err) {
        console.error('Download failed:', err);
        return false;
    }
};
