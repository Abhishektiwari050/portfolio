import urllib.request
import os
import json

# We will test various public repositories that might have a high-quality human skeleton GLB
candidate_urls = [
    # Mesh2Motion candidates
    "https://raw.githubusercontent.com/Mesh2Motion/mesh2motion-app/main/public/skeletons/human-skeleton.glb",
    "https://raw.githubusercontent.com/Mesh2Motion/mesh2motion-app/master/public/skeletons/human-skeleton.glb",
    "https://raw.githubusercontent.com/Mesh2Motion/mesh2motion-app/main/static/skeletons/human-skeleton.glb",
    "https://raw.githubusercontent.com/Mesh2Motion/mesh2motion-app/master/static/skeletons/human-skeleton.glb",
    "https://raw.githubusercontent.com/Mesh2Motion/mesh2motion-app/main/public/assets/skeletons/human-skeleton.glb",
    "https://raw.githubusercontent.com/Mesh2Motion/mesh2motion-app/master/public/assets/skeletons/human-skeleton.glb",
    "https://raw.githubusercontent.com/Mesh2Motion/mesh2motion-app/main/src/assets/skeletons/human-skeleton.glb",
    
    # Open anatomy / medical visualization repositories on GitHub
    "https://raw.githubusercontent.com/z-anatomy/z-anatomy-web/master/assets/models/skeleton.glb",
    "https://raw.githubusercontent.com/z-anatomy/z-anatomy-web/main/assets/models/skeleton.glb",
    
    # Standard Three.js examples (we can check if there are other human/anatomy models)
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/human.glb",
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/skeleton.glb",
    
    # Other public anatomy files
    "https://raw.githubusercontent.com/kripken/ammo.js/master/examples/webgl_demo/ammo.glb",
    "https://raw.githubusercontent.com/hifi/hifi/master/interface/resources/assets/models/skeleton.glb",
    "https://raw.githubusercontent.com/hifi/hifi/master/interface/resources/assets/models/skeleton.gltf",
]

# We can also search GitHub API programmatically for "skeleton.glb" or "human_skeleton.glb"
# and get the raw download URL of the most popular repository.
print("Searching GitHub API for 'skeleton.glb'...")
try:
    api_url = "https://api.github.com/search/code?q=filename:skeleton.glb"
    req = urllib.request.Request(
        api_url, 
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        items = res_data.get('items', [])
        print(f"Found {len(items)} files on GitHub matching 'skeleton.glb'.")
        for item in items[:5]:
            repo_name = item['repository']['full_name']
            path = item['path']
            # Convert to raw URL: https://raw.githubusercontent.com/{repo_name}/master/{path} or /main/{path}
            raw_url_main = f"https://raw.githubusercontent.com/{repo_name}/main/{path}"
            raw_url_master = f"https://raw.githubusercontent.com/{repo_name}/master/{path}"
            candidate_urls.append(raw_url_main)
            candidate_urls.append(raw_url_master)
            print(f"  Added candidate from repo '{repo_name}': {path}")
except Exception as e:
    print(f"GitHub API search failed or rate-limited: {e}")

# Add human_skeleton.glb search
print("Searching GitHub API for 'human_skeleton.glb'...")
try:
    api_url = "https://api.github.com/search/code?q=filename:human_skeleton.glb"
    req = urllib.request.Request(
        api_url, 
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        items = res_data.get('items', [])
        print(f"Found {len(items)} files on GitHub matching 'human_skeleton.glb'.")
        for item in items[:5]:
            repo_name = item['repository']['full_name']
            path = item['path']
            raw_url_main = f"https://raw.githubusercontent.com/{repo_name}/main/{path}"
            raw_url_master = f"https://raw.githubusercontent.com/{repo_name}/master/{path}"
            candidate_urls.append(raw_url_main)
            candidate_urls.append(raw_url_master)
            print(f"  Added candidate from repo '{repo_name}': {path}")
except Exception as e:
    print(f"GitHub API search failed or rate-limited: {e}")

# Now test all candidates
target_path = "C:\\Users\\abhis\\.gemini\\antigravity\\scratch\\portfolio\\public\\skeleton_new.glb"

found = False
for url in candidate_urls:
    print(f"\nTesting URL: {url}...")
    try:
        req = urllib.request.Request(
            url, 
            method='HEAD',
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        )
        with urllib.request.urlopen(req) as resp:
            if resp.status == 200:
                print(f"Found! Downloading from {url}...")
                # Download with user agent to avoid being blocked
                download_req = urllib.request.Request(
                    url,
                    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
                )
                with urllib.request.urlopen(download_req) as d_resp:
                    with open(target_path, 'wb') as out_file:
                        out_file.write(d_resp.read())
                
                size = os.path.getsize(target_path)
                # Ignore very small placeholder files (less than 50KB)
                if size < 50000:
                    print(f"  File is too small ({size} bytes), likely a placeholder. Skipping...")
                    os.remove(target_path)
                    continue
                    
                print(f"Successfully downloaded to {target_path} (size: {size} bytes)")
                found = True
                break
    except Exception as e:
        print(f"  Failed: {e}")

if not found:
    print("\nCould not find a better skeleton.glb from candidate URLs.")
else:
    # Overwrite the old skeleton.glb with the new one
    old_path = "C:\\Users\\abhis\\.gemini\\antigravity\\scratch\\portfolio\\public\\skeleton.glb"
    if os.path.exists(old_path):
        os.remove(old_path)
    os.rename(target_path, old_path)
    print("New skeleton model successfully put in place as public/skeleton.glb!")
