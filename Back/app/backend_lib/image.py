# process an image to be suitable for storing on backend
from werkzeug.datastructures import FileStorage
from PIL import Image
import io

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def check_file_type(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(image: FileStorage) -> bool:
    if not check_file_type(image.filename):
        return False

    try:
        # Open the image using PIL
        img = Image.open(image)

        # Convert to RGB if not already (to prevent errors with certain modes)
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Crop to a square
        img_width, img_height = img.size
        min_dim = min(img_width, img_height)
        img_square = img.crop(((img_width - min_dim) // 2,
                             (img_height - min_dim) // 2,
                             (img_width + min_dim) // 2,
                             (img_height + min_dim) // 2))

        # Resize image maintaining the aspect ratio
        max_size = (1000, 1000)
        img_square.thumbnail(max_size, Image.Resampling.LANCZOS)  # Maintain aspect ratio

        # Save back to image.stream so Flask can still save it later
        buffer = io.BytesIO()
        img_square.save(buffer, format='JPEG')
        buffer.seek(0)
        image.stream = buffer

        return True
    except Exception as e:
        print(f"Image processing error: {e}")
        return False