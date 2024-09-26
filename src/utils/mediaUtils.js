// Function to detect the media type from the URL
export const getMediaType = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    const audioExtensions = ['.mp3', '.wav', '.ogg'];
    
    const extension = url.substring(url.lastIndexOf('.')).toLowerCase();
    
    if (imageExtensions.includes(extension)) {
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

    // YouTube and Vimeo detection
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

// Function to extract YouTube ID from a YouTube URL
export const getYouTubeID = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

// Function to extract Vimeo ID from a Vimeo URL
export const getVimeoID = (url) => {
    const regex = /vimeo\.com\/(?:.*#|\/.*)?\/?([0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
};