// Convert file to base64 string for storage in Firestore
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// Convert multiple files to base64
export const filesToBase64 = async (files) => {
    const promises = files.map(file => fileToBase64(file));
    return await Promise.all(promises);
};
