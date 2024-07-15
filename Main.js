function transformImage() {
    const fileInput = document.getElementById('fileInputs');
    const canvas = document.getElementById('outputs');
    const ctx = canvas.getContext('2d');

    const file = fileInput.files[0];
    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Check image size
            if (img.width !== 512 || img.height !== 512) {
                alert('Image must be 512x512 pixels.');
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the original image
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Create circular clipping path
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Verify if the colors are happy colors
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            let happyColorCount = 0;
            let nonTransparentPixelCount = 0;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];

                // Check if pixel of the image is non-transparent
                if (a !== 0) {
                    nonTransparentPixelCount++;

                    // Check if pixel of the image gives a "happy" feeling (e.g., brightness > 128)
                    const brightness = (r + g + b) / 3;
                    if (brightness > 128) {
                        happyColorCount++;
                    }
                }
            }

            // Calculate the ratio of happy colors to non-transparent pixels
            const happyColorRatio = happyColorCount / nonTransparentPixelCount;

            // Check if image colors give a "happy" feeling
            if (happyColorRatio <= 0.5) {
                alert("Image colors do not give a happy feeling, we can't transform it.");
                alert("Try another Picture")
                return;
            }

            // Clear canvas and redraw image within the circle
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.restore();

            // Output the transforme the given images
            const transformedImage = canvas.toDataURL('image/png');

            // Create and style the download link
            const link = document.createElement('a');
            link.href = transformedImage;
            link.download = 'transformed_circle.png';
            link.textContent = 'Download Transformed Image';
            link.classList.add('download-link'); // Add a class for styling

            // Reload the page when download link is clicked
            link.addEventListener('click', function() {
                setTimeout(function() {
                    location.reload();
                }, 100);
            });

            // Append the link under the canvas
            const container = document.createElement('div');
            container.classList.add('download-container');
            container.appendChild(link);
            document.body.appendChild(container);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}