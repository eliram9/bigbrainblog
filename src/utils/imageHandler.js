const imageHandler = async (quill) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    input.onchange = async () => {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('image', file);
    
        try {
            const response = await fetch('YOUR_IMAGE_UPLOAD_URL', {
                method: 'POST',
                body: formData,
            });
        const data = await response.json();
        const range = quill.getSelection(true);

        quill.insertEmbed(range.index, 'image', data.url);
        } catch (error) {
            console.error('Image upload failed', error);
        }
    };
};
  
export default imageHandler;