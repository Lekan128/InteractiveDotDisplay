window.onload = function() {
    const container = document.getElementById('dotContainer');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const imageLoader = document.getElementById('imageLoader');

    imageLoader.addEventListener('change', handleImage, false);
    loadImage('myimage.png'); // Default image to load

    function loadImage(src) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            createDots(ctx, canvas.width, canvas.height);
        };
        img.src = src;
    }

    function handleImage(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            loadImage(event.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    function createDots(ctx, width, height) {
        container.innerHTML = ''; // Clear previous dots
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const step = 4; // Adjust for higher resolution of dots
        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const i = (y * width + x) * 4;
                const rgba = `rgba(${data[i]}, ${data[i+1]}, ${data[i+2]}, ${data[i+3] / 255})`;
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.style.backgroundColor = rgba;
                dot.style.left = `${x}px`;
                dot.style.top = `${y}px`;
                container.appendChild(dot);
            }
        }
    }

    // Add hover functionality
    container.addEventListener('mousemove', function(event) {
        const mouseX = event.clientX - container.getBoundingClientRect().left;
        const mouseY = event.clientY - container.getBoundingClientRect().top;
        document.querySelectorAll('.dot').forEach(dot => {
            const dotX = parseFloat(dot.style.left) + 2.5; // center of the dot
            const dotY = parseFloat(dot.style.top) + 2.5; // center of the dot
            const distance = Math.sqrt((mouseX - dotX) ** 2 + (mouseY - dotY) ** 2);
            if (distance < 20) { // Reduced interaction distance
                const angle = Math.atan2(mouseY - dotY, mouseX - dotX);
                dot.style.transform = `translate(${Math.cos(angle) * 10}px, ${Math.sin(angle) * 10}px)`;
            } else {
                dot.style.transform = '';
            }
        });
    });

    container.addEventListener('mouseout', () => {
        document.querySelectorAll('.dot').forEach(dot => {
            dot.style.transform = '';
        });
    });
};
