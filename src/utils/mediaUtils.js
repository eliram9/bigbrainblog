export const getMediaType = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    const audioExtensions = ['.mp3', '.wav', '.ogg'];
    
    const extension = url.substring(url.lastIndexOf('.')).toLowerCase();
    
    if (imageExtensions.includes(extension)) {
        // Differentiate between Giphy GIFs and regular GIFs
        const giphyRegex = /https?:\/\/(media|i)\.giphy\.com\/media\/[a-zA-Z0-9_-]+\/giphy\.gif/;
        if (giphyRegex.test(url)) {
            return 'giphy';
        }
        return extension === '.gif' ? 'gif' : 'image';
    }
    if (videoExtensions.includes(extension)) {
        return 'video';
    }
    if (audioExtensions.includes(extension)) {
        return 'audio';
    }
    
    // Regular expressions to detect YouTube and Vimeo URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
    
    if (youtubeRegex.test(url)) {
        return 'youtube';
    }
    if (vimeoRegex.test(url)) {
        return 'vimeo';
    }
    
    return 'text';  // Default to text if no media is detected
};