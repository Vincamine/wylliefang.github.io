// Water Ripple Effect

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    const container = document.createElement('div');
    
    // Style the container to fit within the body, beneath content
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1';
    container.style.pointerEvents = 'none';
    container.style.opacity = '0.8'; // Slightly transparent to see content better
    
    // Add canvas to container
    container.appendChild(canvas);
    
    // Add container to body
    document.body.appendChild(container);
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Previous and current buffer for ripple data
    let previous, current;
    
    // Set ripple properties
    const rippleRadius = 3;
    const rippleStrength = 1;
    const damping = 0.97;
    
    function init() {
      width = window.innerWidth;
      height = window.innerHeight;
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;
      
      // Initialize ripple buffers
      previous = new Array(width * height).fill(0);
      current = new Array(width * height).fill(0);
      
      // Create a gradient that matches your theme (smoky-black background with subtle blue)
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(7, 7, 7, 0.95)'); // Match --smoky-black
      gradient.addColorStop(1, 'rgba(5, 5, 10, 0.95)'); // Slightly blueish at bottom
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    function disturbWater(x, y, strength) {
      if (x < rippleRadius || x > width - rippleRadius || 
          y < rippleRadius || y > height - rippleRadius) return;
      
      for (let i = -rippleRadius; i <= rippleRadius; i++) {
        for (let j = -rippleRadius; j <= rippleRadius; j++) {
          const idx = (y + j) * width + (x + i);
          current[idx] += strength;
        }
      }
    }
    
    function animate() {
      // Update ripple physics
      for (let i = 1; i < width - 1; i++) {
        for (let j = 1; j < height - 1; j++) {
          const idx = j * width + i;
          
          // Calculate average of surrounding points
          const val = (
            previous[idx - 1] + 
            previous[idx + 1] + 
            previous[idx - width] + 
            previous[idx + width]
          ) / 2 - current[idx];
          
          // Apply damping
          current[idx] = val * damping;
        }
      }
      
      // Draw ripples
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          const idx = j * width + i;
          const pixelIdx = (j * width + i) * 4;
          
          // Calculate ripple displacement
          const xOffset = Math.max(-5, Math.min(5, current[idx] * 5));
          const yOffset = Math.max(-5, Math.min(5, current[idx] * 5));
          
          // Sample pixel with offset for ripple effect
          const sampleX = Math.max(0, Math.min(width - 1, i + Math.floor(xOffset)));
          const sampleY = Math.max(0, Math.min(height - 1, j + Math.floor(yOffset)));
          
          // Create ripple colors that match the site's color scheme (with orange-yellow highlights)
          const baseR = 7; // Dark base (smoky black)
          const baseG = 7;
          const baseB = 10;
          
          // Add orange-yellow highlights to the ripples (matching your --orange-yellow-crayola)
          const intensity = Math.abs(current[idx] * 30);
          
          // More yellow-orange in the highlights
          data[pixelIdx] = baseR + (current[idx] > 0 ? intensity * 2.5 : intensity * 0.5);     // R (more for highlights)
          data[pixelIdx + 1] = baseG + (current[idx] > 0 ? intensity * 1.8 : intensity * 0.3); // G (more for highlights)
          data[pixelIdx + 2] = baseB + (current[idx] > 0 ? intensity * 0.3 : intensity * 0.8); // B (more for shadows)
          data[pixelIdx + 3] = 240;                                                           // A
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Swap buffers
      [previous, current] = [current, previous];
      
      requestAnimationFrame(animate);
    }
    
    // Create random ripples periodically
    function createRandomRipples() {
      const x = Math.random() * width;
      const y = Math.random() * height;
      disturbWater(Math.floor(x), Math.floor(y), rippleStrength * 5);
      
      setTimeout(createRandomRipples, 2000 + Math.random() * 3000);
    }
    
    // Handle mouse/touch interaction
    function handlePointer(e) {
      const x = e.clientX || e.touches[0].clientX;
      const y = e.clientY || e.touches[0].clientY;
      disturbWater(Math.floor(x), Math.floor(y), rippleStrength * 10);
    }
    
    // Set up event listeners
    window.addEventListener('mousemove', handlePointer);
    window.addEventListener('touchmove', handlePointer);
    window.addEventListener('resize', init);
    
    // Initialize and start animation
    init();
    animate();
    createRandomRipples();
  });