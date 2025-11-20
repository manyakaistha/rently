from PIL import Image
import os

def convert_icns_to_ico(icns_path, ico_path):
    try:
        img = Image.open(icns_path)
        img.save(ico_path, format='ICO', sizes=[(256, 256)])
        print(f"Successfully converted {icns_path} to {ico_path}")
    except Exception as e:
        print(f"Error converting icon: {e}")

if __name__ == "__main__":
    convert_icns_to_ico('public/icon.icns', 'public/icon.ico')
