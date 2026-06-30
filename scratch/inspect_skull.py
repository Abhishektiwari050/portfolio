import struct
import json
import os

def inspect_glb(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    with open(filepath, 'rb') as f:
        # Read header
        magic = f.read(4)
        version = struct.unpack('<I', f.read(4))[0]
        length = struct.unpack('<I', f.read(4))[0]
        
        print(f"GLB Magic: {magic}")
        print(f"Version: {version}")
        print(f"Total Length: {length} bytes")
        
        # Read chunk 0 (JSON)
        chunk_length = struct.unpack('<I', f.read(4))[0]
        chunk_type = f.read(4)
        
        print(f"Chunk 0 Length: {chunk_length} bytes")
        print(f"Chunk 0 Type: {chunk_type}")
        
        json_data = f.read(chunk_length).decode('utf-8')
        data = json.loads(json_data)
        
        # Look at nodes and meshes
        print("\nNodes:")
        for i, node in enumerate(data.get('nodes', [])):
            print(f"  Node {i}: {node.get('name', 'unnamed')}, mesh: {node.get('mesh')}, scale: {node.get('scale')}, translation: {node.get('translation')}")
            
        print("\nMeshes:")
        for i, mesh in enumerate(data.get('meshes', [])):
            print(f"  Mesh {i}: {mesh.get('name', 'unnamed')}, primitives count: {len(mesh.get('primitives', []))}")
            
        # Look at accessors to find min/max of position (bounding box)
        print("\nAccessors (Position Bounds):")
        for i, accessor in enumerate(data.get('accessors', [])):
            if 'min' in accessor or 'max' in accessor:
                # Check if it's used for POSITION (typically type 'VEC3')
                print(f"  Accessor {i}: type={accessor.get('type')}, count={accessor.get('count')}, min={accessor.get('min')}, max={accessor.get('max')}")

inspect_glb('C:\\Users\\abhis\\.gemini\\antigravity\\scratch\\portfolio\\public\\skeleton_vre.glb')
