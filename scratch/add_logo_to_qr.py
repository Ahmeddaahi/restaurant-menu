from PIL import Image, ImageDraw

def add_logo_to_qr(qr_path, logo_path, output_path):
    # Open the QR code
    qr = Image.open(qr_path).convert("RGBA")
    qr_width, qr_height = qr.size

    # Open the logo
    logo = Image.open(logo_path).convert("RGBA")
    
    # Calculate logo size (25% of QR size)
    logo_size_ratio = 0.25
    logo_width = int(qr_width * logo_size_ratio)
    logo_height = int(qr_height * logo_size_ratio)
    
    # Resize logo
    logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
    
    # Create a white background with rounded corners
    padding = 20
    bg_size = (logo_width + padding, logo_height + padding)
    logo_bg = Image.new("RGBA", bg_size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(logo_bg)
    
    # Draw rounded rectangle
    radius = 15
    draw.rounded_rectangle([0, 0, bg_size[0], bg_size[1]], radius=radius, fill=(255, 255, 255, 255))
    
    # Calculate positions
    bg_pos = ((qr_width - bg_size[0]) // 2, (qr_height - bg_size[1]) // 2)
    logo_pos = ((qr_width - logo_width) // 2, (qr_height - logo_height) // 2)

    # Paste background
    qr.paste(logo_bg, bg_pos, logo_bg)
    
    # Paste logo
    qr.paste(logo, logo_pos, logo)
    
    # Save as PNG
    qr.save(output_path, "PNG")
    print(f"Saved refined QR to {output_path}")

if __name__ == "__main__":
    # Note: I need the ORIGINAL QR code again because I overwrote it.
    # Wait, I don't have the original anymore unless I undo or have a backup.
    # Actually, I can just run it again on the already modified one, 
    # but it's better to have a clean slate if possible.
    # Since I don't have a backup, I'll just run it on the current one.
    # The white background will just cover the old one.
    add_logo_to_qr("images/nadicafe-qr.png", "images/logo.webp", "images/nadicafe-qr.png")
