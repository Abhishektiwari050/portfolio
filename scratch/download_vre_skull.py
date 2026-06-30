import urllib.request
import os

url = "https://raw.githubusercontent.com/Natalnet/VRE/master/Skull.glb"
target_path = "C:\\Users\\abhis\\.gemini\\antigravity\\scratch\\portfolio\\public\\skeleton_vre.glb"

print(f"Downloading from {url}...")
try:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    with urllib.request.urlopen(req) as resp:
        with open(target_path, 'wb') as f:
            f.write(resp.read())
    print(f"Successfully downloaded to {target_path} (size: {os.path.getsize(target_path)} bytes)")
except Exception as e:
    print(f"Failed to download: {e}")
