from PIL import Image

# Create a simple black square icon
img = Image.new("RGB", (64, 64), (0, 0, 0))  # 64x64 black icon
img.save("favicon.ico")
