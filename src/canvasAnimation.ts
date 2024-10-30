// Previous imports and interfaces remain the same

const imageCache = new Map<number, HTMLImageElement>();
const totalFrames = 12; // Updated to 12 frames
let imagesLoaded = false;

export function preloadImages(): Promise<void> {
  return new Promise((resolve) => {
    let loadedCount = 0;
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          imagesLoaded = true;
          resolve();
        }
      };
      // Updated path to match the assets directory structure
      img.src = `/src/assets/star/frame_${i}.png`;
      imageCache.set(i, img);
    }
  });
}

export function initializeCanvas(
  canvasElement: HTMLCanvasElement,
  frameRate: number,
  color: string,
  isRandom: boolean
): void {
  const ctx = canvasElement.getContext('2d');
  if (!ctx) return;

  let currentFrame = 0;
  let lastFrameTime = 0;
  let state = 1;
  let fps = frameRate;
  let overlayColor = 'rgba(0, 0, 0, 0)';
  let particles: ParticleEffect[] = [];

  // Updated audio paths
  const fanfareSound = new Audio('/src/assets/fanfare.mp3');
  const successSound = new Audio('/src/assets/shortsuccess.mp3');
  
  // Pre-load audio files
  fanfareSound.load();
  successSound.load();
  
  let lastPlayedState = 1;

  const originalWidth = 500;
  const originalHeight = 500;
  const newWidth = Math.floor(originalWidth * 0.5); // Adjusted scale
  const newHeight = Math.floor(originalHeight * 0.5); // Adjusted scale

  // Rest of the canvas animation code remains the same

  function animate(currentTime: number): void {
    requestAnimationFrame(animate);

    if (currentTime - lastFrameTime < 1000 / fps) return;

    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (imagesLoaded) {
      const currentImage = imageCache.get(currentFrame);
      if (currentImage) {
        // Center the image in the canvas
        const x = (canvasElement.width - newWidth) / 2;
        const y = (canvasElement.height - newHeight) / 2;
        
        ctx.drawImage(
          currentImage,
          0,
          0,
          originalWidth,
          originalHeight,
          x,
          y,
          newWidth,
          newHeight
        );
      }

      // Rest of the animation code remains the same
    }
  }

  // Rest of the initialization code remains the same
}