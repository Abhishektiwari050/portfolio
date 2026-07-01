# Handoff Report — Anatomy Page & TDSLoader Investigation

## 1. Observation

### 3D Canvas Configuration Location
The WebGL 3D canvas is configured in `src/components/ThreeCanvas.tsx`.
In `src/AnatomyApp.tsx`, it is rendered on line 22:
```typescript
<ThreeCanvas viewMode="anatomy" scrollProgress={0} scrollVelocity={0} />
```

### Current Loading and Scaling of Skeleton/Skull
In `src/components/ThreeCanvas.tsx`, `GLTFLoader` loads two separate models: `/skeleton.glb` (lines 303-336) and `/skull.glb` (lines 339-358):
```typescript
    // 1. Load 3D Spine/Neck Model (using skeleton.glb with clipping)
    gltfLoader.load('/skeleton.glb', (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = spineMaterial;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      
      // Focus on the top 22% of the skeleton (head & neck) and push the rest off-screen
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      
      const headNeckRatio = 0.22;
      const headNeckHeightInModel = size.y * headNeckRatio;
      const targetHeightInScene = 52.0;
      
      const scale = targetHeightInScene / headNeckHeightInModel;
      model.scale.set(scale, scale, scale);
      
      const headTopY = box.max.y * scale;
      const translationY = 22.0 - headTopY;
      
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.set(-center.x * scale, translationY, -center.z * scale);
      model.rotation.y = Math.PI;
      skeletonGroup.add(model);
    }, undefined, (error) => {
      console.error('Failed to load 3D skeleton model:', error);
    });

    // 2. Load 3D Skull Model (using the highly detailed, realistic skull.glb)
    gltfLoader.load('/skull.glb', (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = boneMaterial;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      
      // Scale and position the skull on top of the clipped neck
      const skullScale = 18.2; // Adjusted to match the neck size perfectly
      model.scale.set(skullScale, skullScale, skullScale);
      model.position.set(0, 11.2, 0.6); // Positioned on top of the cervical vertebrae
      model.rotation.y = Math.PI; // Face the camera initially
      skeletonGroup.add(model);
    }, undefined, (error) => {
      console.error('Failed to load 3D skull model:', error);
    });
```

### Dependency Configuration
In `package.json`, the dependencies include:
```json
    "three": "^0.185.0"
```
In `devDependencies`:
```json
    "@types/three": "^0.185.0"
```

The file `node_modules/three/examples/jsm/loaders/TDSLoader.js` exists and ends with:
```javascript
export { TDSLoader };
```

The file `node_modules/@types/three/examples/jsm/loaders/TDSLoader.d.ts` exists and declares:
```typescript
export class TDSLoader extends Loader<Group> { ... }
```

### 3D Model 'Skelet_N031209.3ds' Location
The model is located at `public/Skelet_N031209.3ds` with a size of 5,131,299 bytes (~5.1 MB). It can be accessed at runtime at `/Skelet_N031209.3ds`.

---

## 2. Logic Chain

1. **Importing TDSLoader**: Since `TDSLoader.js` and its corresponding declaration file `.d.ts` are present in `three` and `@types/three` under `examples/jsm/loaders/`, we can import it in typescript as:
   ```typescript
   import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
   ```
2. **Retaining GLTFLoader/DRACOLoader**: In `ThreeCanvas.tsx` line 238, `gltfLoader` is used to load `/LeePerrySmith.glb` for the point cloud. Therefore, we **must keep** the imports and instantiation of `GLTFLoader` and `DRACOLoader` in `ThreeCanvas.tsx`.
3. **Removing /skeleton.glb and /skull.glb**: The new model `Skelet_N031209.3ds` is a single unified skeleton model. Rather than loading two separate glTF models and clipping one of them, we can replace the double glTF loader callback chain with a single TDSLoader callback chain.
4. **Simplification of Clipping Logic**: Since we are loading a single complete skeleton model and do not need to stitch a separate skull model onto a clipped spine, we can remove the local clipping planes (`localPlane`, `localPlaneSource`), the local clipping enabling on the renderer (`renderer.localClippingEnabled = true`), the `spineMaterial` definition, and the clipping updates in the animation loop:
   ```typescript
   // To be removed from animation loop:
   skeletonGroup.updateMatrixWorld(true);
   localPlane.copy(localPlaneSource).applyMatrix4(skeletonGroup.matrixWorld);
   ```
5. **Scale and Position Calibration**:
   The loaded 3DS model group (`object`) has different base units and center offsets than the GLTF models. We can calculate the bounding box dynamically using `THREE.Box3().setFromObject(object)`.
   - Scale factor: `targetHeight (52.0) / boundingBoxSize.y`
   - Center offset: Shift `object.position` by `-center * scale` to center it horizontally and vertically, plus any needed baseline offsets.

---

## 3. Caveats

- We have not loaded or rendered the `.3ds` model to visually confirm its internal details (such as polygon count, center coordinates, or if it is rotated by 90 degrees as is typical for 3ds files). The final implementation may require an orientation adjustment (e.g. `object.rotation.x = -Math.PI / 2` or `object.rotation.y = Math.PI`) and fine-tuning of the scale/position offsets.
- TDSLoader parses material colors from the `.3ds` file. To maintain the brutalist matte white bone aesthetics, we should explicitly traverse all children of the loaded group and override their materials with the predefined `boneMaterial`.

---

## 4. Conclusion

We can successfully replace `GLTFLoader`/`DRACOLoader` for the skeleton in anatomy mode with `TDSLoader` loading `Skelet_N031209.3ds` by modifying `src/components/ThreeCanvas.tsx`.

### Proposed Code Changes in `src/components/ThreeCanvas.tsx`

1. **Import TDSLoader**
   Add the following line:
   ```typescript
   import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
   ```

2. **Add TDSLoader Instantiation**
   Inside the `useEffect` hook, instantiate TDSLoader:
   ```typescript
   const tdsLoader = new TDSLoader();
   ```

3. **Replace Model Loading Logic**
   Replace lines 268-358 with the following:
   ```typescript
       // Beautiful plaster/bone material (pure matte white)
       const boneMaterial = new THREE.MeshStandardMaterial({
         color: 0xffffff,
         roughness: 0.9,
         metalness: 0.0,
       });
   
       // Add a high-contrast directional light specifically for the skull/skeleton to create deep shadows
       const skullLight = new THREE.DirectionalLight(0xffffff, 2.2);
       skullLight.position.set(-80, 50, 60);
       scene.add(skullLight);
   
       // ── 2. Solid Skeleton (For Anatomy Mode) ──
       const skeletonGroup = new THREE.Group();
       skeletonGroup.visible = false;
       skeletonGroup.scale.set(0.001, 0.001, 0.001); // Start hidden/scaled out
       scene.add(skeletonGroup);
   
       // Load 3D Skeleton Model using TDSLoader
       tdsLoader.load('/Skelet_N031209.3ds', (object) => {
         object.traverse((child) => {
           if ((child as THREE.Mesh).isMesh) {
             const mesh = child as THREE.Mesh;
             mesh.material = boneMaterial;
             mesh.castShadow = true;
             mesh.receiveShadow = true;
           }
         });
   
         // Focus/Scale the skeleton to fit the screen
         const box = new THREE.Box3().setFromObject(object);
         const size = new THREE.Vector3();
         box.getSize(size);
         
         const targetHeightInScene = 52.0;
         const scale = targetHeightInScene / size.y;
         object.scale.set(scale, scale, scale);
         
         const center = new THREE.Vector3();
         box.getCenter(center);
         
         // Center the model and translate to proper position
         object.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
         
         // 3DS files often need a 90-degree X-rotation to stand upright, 
         // and we face it backwards (rotation.y = Math.PI) to look at the camera.
         object.rotation.x = -Math.PI / 2;
         object.rotation.z = Math.PI;
         
         skeletonGroup.add(object);
       }, undefined, (error) => {
         console.error('Failed to load 3D skeleton model (.3ds):', error);
       });
   ```

4. **Update Animation Loop**
   In the animation loop (around lines 476-478), remove the clipping plane updates:
   ```typescript
   // REMOVE THESE LINES:
   // Update clipping plane in world space based on the group's matrixWorld
   skeletonGroup.updateMatrixWorld(true);
   localPlane.copy(localPlaneSource).applyMatrix4(skeletonGroup.matrixWorld);
   ```

---

## 5. Verification Method

To verify the changes, the implementing agent should:
1. Run `npm run build` to verify there are no TypeScript compile-time errors or Vite bundling issues.
2. Run `npm run lint` to ensure no Oxlint violations.
3. Start the dev server using `npm run dev` and navigate to the anatomy route (or `/anatomy.html`) in a browser to inspect the visual rendering, rotation, mouse interaction, and scaling.
4. Verify that no 404 or parser errors occur in the browser console.
