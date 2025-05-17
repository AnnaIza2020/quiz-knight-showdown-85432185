
/**
 * Utility functions for the Fortune Wheel component
 */

/**
 * Draws a section of the wheel with text
 */
export const drawWheelSection = (
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number,
  radius: number,
  startAngle: number, 
  endAngle: number, 
  color: string,
  text: string
) => {
  // Draw section
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineTo(centerX, centerY);
  ctx.fillStyle = color;
  ctx.fill();
  
  // Add text
  ctx.save();
  ctx.translate(centerX, centerY);
  const textAngle = startAngle + (endAngle - startAngle) / 2;
  ctx.rotate(textAngle);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '14px sans-serif';
  
  // Wrap text if too long
  const maxWidth = radius - 30;
  if (ctx.measureText(text).width > maxWidth) {
    wrapText(ctx, text, radius - 20, 0, maxWidth, 15);
  } else {
    ctx.fillText(text, radius - 20, 5);
  }
  
  ctx.restore();
};

/**
 * Wraps text to fit within a given width
 */
export const wrapText = (
  ctx: CanvasRenderingContext2D, 
  text: string, 
  x: number, 
  y: number, 
  maxWidth: number, 
  lineHeight: number
) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  
  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line, x, currentY);
      line = word + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  
  ctx.fillText(line, x, currentY);
};

/**
 * Calculate which category is selected based on final rotation
 */
export const getSelectedCategoryIndex = (
  totalRotation: number,
  numCategories: number
) => {
  const degreesPerCategory = 360 / numCategories;
  
  // Calculate how many degrees past 0 the wheel landed on
  const normalizedRotation = totalRotation % 360;
  
  // Convert to index (reverse because wheel spins clockwise)
  return Math.floor((360 - normalizedRotation) / degreesPerCategory) % numCategories;
};

/**
 * Get an array of neon colors for the wheel
 */
export const getNeonColors = (): string[] => {
  return [
    '#9b87f5', // Purple
    '#7E69AB', // Lavender
    '#FF3E9D', // Pink
    '#00E0FF', // Cyan
    '#00FFA3', // Green
    '#FFA500'  // Orange
  ];
};
