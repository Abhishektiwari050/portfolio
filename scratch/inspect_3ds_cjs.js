const fs = require('fs');
const THREE = require('three');
const { TDSLoader } = require('three/examples/jsm/loaders/TDSLoader.js');

// Read the 3ds file into a Buffer, then convert to ArrayBuffer
const fileBuffer = fs.readFileSync('C:\\Users\\abhis\\.gemini\\antigravity\\scratch\\portfolio\\public\\Skelet_N031209.3ds');
const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);

const loader = new TDSLoader();
try {
  const group = loader.parse(arrayBuffer, '');
  console.log("3DS Parse Success!");
  console.log("Total children count:", group.children.length);
  
  // Calculate bounding box
  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);
  
  console.log("Bounding Box Size:", size.x, size.y, size.z);
  console.log("Bounding Box Center:", center.x, center.y, center.z);
  console.log("Bounding Box Min:", box.min.x, box.min.y, box.min.z);
  console.log("Bounding Box Max:", box.max.x, box.max.y, box.max.z);

  // Traverse and log children names
  console.log("\nChildren Hierarchy:");
  let count = 0;
  group.traverse((child) => {
    count++;
    if (count > 50) return; // limit logging
    if (child.isMesh) {
      console.log(`Mesh: Name="${child.name}", Type=${child.type}`);
    } else {
      console.log(`Node: Name="${child.name}", Type=${child.type}`);
    }
  });
} catch (e) {
  console.error("Error parsing 3DS file:", e);
}
