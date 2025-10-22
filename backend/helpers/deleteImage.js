import fs from 'fs/promises'; // use promises version

export const deleteImage = async (filePath) => {
    try {
        await fs.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File does not exist, ignore
            console.log(`File not found: ${filePath}`);
        } else {
            console.log(error.message);
        }
    }
}
