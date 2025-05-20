
export function drawWheelSection(
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  startAngle: number, 
  endAngle: number, 
  color: string,
  text: string
) {
  // Draw sector
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  
  // Fill with gradient
  const gradientRadius = radius * 0.8;
  const gradient = ctx.createRadialGradient(
    centerX, centerY, gradientRadius * 0.2, 
    centerX, centerY, gradientRadius
  );
  
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, adjustColor(color, -30));
  
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Add border
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
  
  // Add text
  const textAngle = startAngle + (endAngle - startAngle) / 2;
  const textRadius = radius * 0.75;
  const textX = centerX + Math.cos(textAngle) * textRadius;
  const textY = centerY + Math.sin(textAngle) * textRadius;
  
  ctx.save();
  ctx.translate(textX, textY);
  ctx.rotate(textAngle + Math.PI / 2);
  
  // Text style
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Wrap text if too long
  const words = text.split(' ');
  let line = '';
  let lines: string[] = [];
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    if (ctx.measureText(testLine).width > 80) {
      lines.push(line);
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  
  // Draw text lines
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 0, i * 14 - (lines.length - 1) * 7);
  }
  
  ctx.restore();
}

export function getSelectedCategoryIndex(rotation: number, numCategories: number): number {
  const angle = (rotation % 360) / 360;
  const sectorSize = 1 / numCategories;
  
  // Calculate the sector index based on current rotation
  let selectedIndex = Math.floor(angle / sectorSize);
  
  // Adjust index based on the direction (clockwise)
  selectedIndex = numCategories - 1 - selectedIndex;
  
  // Ensure it's within bounds
  return (selectedIndex + numCategories) % numCategories;
}

export function getNeonColors(): string[] {
  return [
    '#FF00FF', // Neon Pink
    '#00FFFF', // Neon Cyan
    '#FF6600', // Neon Orange
    '#FFFF00', // Neon Yellow
    '#00FF00', // Neon Green
    '#FF0000', // Neon Red
    '#9D00FF', // Neon Purple
    '#0088FF', // Neon Blue
    '#FF0088', // Neon Magenta
    '#00FF88'  // Neon Mint
  ];
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (!result) return color;
  
  const r = Math.max(0, Math.min(255, parseInt(result[1], 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(result[2], 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(result[3], 16) + amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
