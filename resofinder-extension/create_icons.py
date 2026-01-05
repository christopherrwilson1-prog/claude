#!/usr/bin/env python3
"""Generate simple placeholder icons for the Chrome extension"""

from PIL import Image, ImageDraw, ImageFont

def create_icon(size, filename):
    # Create a red background (Resy brand color)
    img = Image.new('RGB', (size, size), color='#D32323')
    draw = ImageDraw.Draw(img)

    # Add white "R" text
    try:
        # Try to use a system font
        font_size = int(size * 0.6)
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()

    # Draw "R" for ResoFinder
    text = "R"
    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    position = ((size - text_width) // 2, (size - text_height) // 2 - bbox[1])
    draw.text(position, text, fill='white', font=font)

    img.save(filename)
    print(f"Created {filename}")

if __name__ == '__main__':
    create_icon(16, 'icon16.png')
    create_icon(48, 'icon48.png')
    create_icon(128, 'icon128.png')
    print("All icons created successfully!")
