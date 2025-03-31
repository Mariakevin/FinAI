
import { saveAs } from 'file-saver';

/**
 * Converts an SVG element to a PNG and saves it as a file
 * @param svgElement - The SVG DOM element to convert
 * @param fileName - The name for the downloaded file (without extension)
 */
export const saveSvgAsPng = (svgElement: SVGElement | HTMLElement, fileName: string): void => {
  try {
    // Create a canvas element to draw the SVG
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }

    // Get the SVG dimensions
    const svgRect = svgElement.getBoundingClientRect();
    const { width, height } = svgRect;
    
    // Set canvas dimensions to match SVG
    const scale = 2; // Higher scale for better resolution
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    // Create high-resolution image of the SVG
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const image = new Image();
    image.onload = () => {
      // White background
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Scale the drawing for higher resolution
      context.scale(scale, scale);
      context.drawImage(image, 0, 0, width, height);
      
      // Convert canvas to PNG
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${fileName}.png`);
        }
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    
    image.src = url;
  } catch (error) {
    console.error('Error saving SVG as PNG:', error);
  }
};

/**
 * Downloads text content as a file
 * @param text - The text content to download
 * @param fileName - The name for the downloaded file
 */
export const downloadTextFile = (text: string, fileName: string): void => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, fileName);
};
