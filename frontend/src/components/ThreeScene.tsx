// src/components/ThreeScene.tsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(light);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const originalMaterials = new Map<
      THREE.Object3D,
      THREE.Material | THREE.Material[]
    >();
    let hoveredMesh: THREE.Mesh | null = null;
    let selectedMesh: THREE.Mesh | null = null;

    const loader = new GLTFLoader();
    loader.load(
      "/models/planar_head_by_oleg_toropygin.glb",
      (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.userData.selectable = true;
            originalMaterials.set(mesh, mesh.material);
          }
        });

        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    const highlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
    }); // yellow
    const selectedMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
    }); // red

    const onMouseMove = (event: MouseEvent) => {
      const bounds = currentMount.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const mesh = intersects[0].object as THREE.Mesh;

        if (
          mesh.userData.selectable &&
          mesh !== hoveredMesh &&
          mesh !== selectedMesh
        ) {
          // Restore previous hover
          if (hoveredMesh && hoveredMesh !== selectedMesh) {
            const original = originalMaterials.get(hoveredMesh);
            if (original) hoveredMesh.material = original;
          }

          // Apply new hover material
          if (mesh !== selectedMesh) {
            mesh.material = highlightMaterial;
          }

          hoveredMesh = mesh;
        }
      } else {
        // Clear hover highlight if nothing is hovered
        if (hoveredMesh && hoveredMesh !== selectedMesh) {
          const original = originalMaterials.get(hoveredMesh);
          if (original) hoveredMesh.material = original;
        }
        hoveredMesh = null;
      }
    };

    const onMouseClick = () => {
      if (hoveredMesh) {
        // Restore previously selected
        if (selectedMesh) {
          const original = originalMaterials.get(selectedMesh);
          if (original) selectedMesh.material = original;
        }

        // Select new one
        selectedMesh = hoveredMesh;
        selectedMesh.material = selectedMaterial;

        console.log("Selected part:", selectedMesh.name || selectedMesh.uuid);
      }
    };

    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onMouseClick);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      renderer.domElement.removeEventListener("click", onMouseClick);
      if (currentMount) currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default ThreeScene;
