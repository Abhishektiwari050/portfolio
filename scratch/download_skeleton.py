import urllib.request
import os

candidate_urls = [
    # gym-muscle candidates
    "https://raw.githubusercontent.com/sesgigikimo/gym-muscle/master/public/skeleton.glb",
    "https://raw.githubusercontent.com/sesgigikimo/gym-muscle/main/public/skeleton.glb",
    "https://raw.githubusercontent.com/sesgigikimo/gym-muscle/master/public/model/skeleton.glb",
    "https://raw.githubusercontent.com/sesgigikimo/gym-muscle/main/public/model/skeleton.glb",
    "https://raw.githubusercontent.com/sesgigikimo/gym-muscle/master/skeleton.glb",
    "https://raw.githubusercontent.com/sesgigikimo/gym-muscle/main/skeleton.glb",
    
    # Other potential public skeleton/anatomy model URLs
    "https://raw.githubusercontent.com/gltf-viewer/gltf-viewer/master/models/skeleton.glb",
    "https://raw.githubusercontent.com/varkor/three-skeletal-coordinates/master/models/skeleton.glb",
    "https://raw.githubusercontent.com/pmndrs/drei-assets/master/skeleton.glb",
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/skeleton.glb",
    
    # Try searching for other open-source skeleton/anatomy repositories
    "https://raw.githubusercontent.com/gltf-viewer/gltf-viewer/main/models/skeleton.glb",
]

target_path = "C:\\Users\\abhis\\.gemini\\antigravity\\scratch\\portfolio\\public\\skeleton.glb"

found = False
for url in candidate_urls:
    print(f"Testing URL: {url}...")
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req) as resp:
            if resp.status == 200:
                print(f"Found! Downloading from {url}...")
                urllib.request.urlretrieve(url, target_path)
                print(f"Successfully downloaded to {target_path} (size: {os.path.getsize(target_path)} bytes)")
                found = True
                break
    except Exception as e:
        print(f"  Failed: {e}")

if not found:
    print("Could not find skeleton.glb from candidate URLs.")
