const videoHandler = async (quill) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/*');
    input.click();
  
    input.onchange = async () => {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('video', file);
    
        try {
            const response = await fetch('YOUR_VIDEO_UPLOAD_URL', {
                method: 'POST',
                body: formData,
            });
        const data = await response.json();
        const range = quill.getSelection(true);

        quill.insertEmbed(range.index, 'video', data.url);
        } catch (error) {
            console.error('Video upload failed', error);
        }
    };
};
  
export default videoHandler;
