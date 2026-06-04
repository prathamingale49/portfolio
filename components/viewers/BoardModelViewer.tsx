"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getAssetUrl } from "@/lib/assets";

interface BoardModelViewerProps {
  stepFile?: string;
  title: string;
  description?: string;
  compact?: boolean;
  chrome?: boolean;
  className?: string;
  viewerClassName?: string;
}

interface OcctMesh {
  name?: string;
  color?: number[];
  attributes: {
    position: { array: number[] };
    normal?: { array: number[] };
  };
  index?: { array: number[] | number[][] };
}

interface OcctResult {
  success: boolean;
  meshes?: OcctMesh[];
}

interface OcctModule {
  ReadStepFile: (content: Uint8Array, params: Record<string, unknown> | null) => OcctResult;
}

declare global {
  interface Window {
    occtimportjs?: () => Promise<OcctModule>;
  }
}

let occtScriptPromise: Promise<void> | null = null;

function loadOcctScript() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.occtimportjs) {
    return Promise.resolve();
  }

  if (!occtScriptPromise) {
    occtScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/vendor/occt-import-js/occt-import-js.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Could not load STEP importer."));
      document.head.appendChild(script);
    });
  }

  return occtScriptPromise;
}

function flattenIndex(array: number[] | number[][] | undefined) {
  if (!array) {
    return undefined;
  }

  return Array.isArray(array[0])
    ? (array as number[][]).flat()
    : (array as number[]);
}

function makeMeshColor(color: number[] | undefined) {
  if (!color || color.length < 3) {
    return new THREE.Color("#c9ced6");
  }

  const divisor = color.some((channel) => channel > 1) ? 255 : 1;
  return new THREE.Color(color[0] / divisor, color[1] / divisor, color[2] / divisor);
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => material.dispose());
    }
  });
}

function fitCamera(camera: THREE.PerspectiveCamera, controls: OrbitControls, object: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z, 1);

  controls.target.copy(center);
  camera.position.set(center.x + radius * 0.72, center.y - radius * 0.96, center.z + radius * 0.62);
  camera.near = Math.max(radius / 500, 0.01);
  camera.far = radius * 120;
  camera.updateProjectionMatrix();
  controls.update();
}

function createPlaceholderBoard() {
  const group = new THREE.Group();
  group.name = "Interactive board placeholder";

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, 4.15, 0.12),
    new THREE.MeshStandardMaterial({
      color: "#10382f",
      metalness: 0.12,
      roughness: 0.54,
    }),
  );
  group.add(board);

  const copper = new THREE.MeshStandardMaterial({
    color: "#c69b3c",
    metalness: 0.75,
    roughness: 0.26,
  });

  const traceSpecs = [
    [-1.85, 1.22, 2.45, 0.045],
    [0.95, 1.02, 2.8, 0.045],
    [-0.9, 0.16, 3.2, 0.04],
    [1.2, -0.58, 2.1, 0.04],
    [-1.65, -1.13, 1.55, 0.05],
  ];

  traceSpecs.forEach(([x, y, width, height], index) => {
    const trace = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.018), copper);
    trace.position.set(x, y, 0.074 + index * 0.001);
    trace.rotation.z = index % 2 === 0 ? 0.08 : -0.12;
    group.add(trace);
  });

  const packageMaterial = new THREE.MeshStandardMaterial({
    color: "#1d2432",
    metalness: 0.18,
    roughness: 0.4,
  });

  [
    [-2.3, 1.35, 0.5, 0.32],
    [-0.95, 1.2, 0.62, 0.38],
    [0.55, 0.92, 0.72, 0.44],
    [1.9, -0.35, 0.85, 0.54],
    [-0.3, -1.05, 0.95, 0.62],
  ].forEach(([x, y, width, height]) => {
    const part = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.22), packageMaterial);
    part.position.set(x, y, 0.21);
    group.add(part);
  });

  const holeMaterial = new THREE.MeshStandardMaterial({ color: "#030712" });
  [
    [-2.85, 1.72],
    [2.85, 1.72],
    [-2.85, -1.72],
    [2.85, -1.72],
  ].forEach(([x, y]) => {
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 36), holeMaterial);
    hole.rotation.x = Math.PI / 2;
    hole.position.set(x, y, 0.09);
    group.add(hole);
  });

  return group;
}

function createStepGroup(result: OcctResult) {
  const group = new THREE.Group();
  const meshes = result.meshes ?? [];

  for (const mesh of meshes) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(mesh.attributes.position.array, 3),
    );

    if (mesh.attributes.normal?.array.length) {
      geometry.setAttribute("normal", new THREE.Float32BufferAttribute(mesh.attributes.normal.array, 3));
    } else {
      geometry.computeVertexNormals();
    }

    const index = flattenIndex(mesh.index?.array);
    if (index?.length) {
      geometry.setIndex(index);
    }

    geometry.computeBoundingSphere();

    group.add(
      new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: makeMeshColor(mesh.color),
          metalness: 0.18,
          roughness: 0.46,
          side: THREE.DoubleSide,
        }),
      ),
    );
  }

  return group;
}

export function BoardModelViewer({
  stepFile,
  title,
  description,
  compact = false,
  chrome = true,
  className,
  viewerClassName,
}: BoardModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState(stepFile ? "Loading STEP export" : "STEP export not added yet");

  const stepUrl = useMemo(() => (stepFile ? getAssetUrl(stepFile) : ""), [stepFile]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let activeModel: THREE.Object3D = createPlaceholderBoard();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a1018");
    scene.add(activeModel);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.72;

    const ambient = new THREE.HemisphereLight("#e7edf5", "#16202f", 2.4);
    const key = new THREE.DirectionalLight("#ffffff", 2.2);
    key.position.set(5, -4, 7);
    const rim = new THREE.DirectionalLight("#55b8ff", 0.9);
    rim.position.set(-6, 3, 4);
    scene.add(ambient, key, rim);

    fitCamera(camera, controls, activeModel);

    const resize = () => {
      if (!mount) return;
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const animate = () => {
      if (disposed) return;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    async function loadStepModel() {
      if (!stepUrl) return;

      try {
        const response = await fetch(stepUrl);
        if (!response.ok) {
          if (!disposed) setStatus("STEP export not added yet");
          return;
        }

        await loadOcctScript();
        if (!window.occtimportjs) {
          throw new Error("STEP importer unavailable.");
        }

        const occt = await window.occtimportjs();
        const buffer = new Uint8Array(await response.arrayBuffer());
        const result = occt.ReadStepFile(buffer, {
          linearUnit: "millimeter",
          linearDeflectionType: "bounding_box_ratio",
          linearDeflection: 0.002,
          angularDeflection: 0.35,
        });

        if (!result.success || !result.meshes?.length) {
          throw new Error("STEP import returned no meshes.");
        }

        const stepGroup = createStepGroup(result);
        scene.remove(activeModel);
        disposeObject(activeModel);
        activeModel = stepGroup;
        scene.add(activeModel);
        fitCamera(camera, controls, activeModel);
        if (!disposed) setStatus("STEP export loaded");
      } catch {
        if (!disposed) setStatus("STEP viewer fallback");
      }
    }

    void loadStepModel();

    return () => {
      disposed = true;
      observer.disconnect();
      controls.dispose();
      disposeObject(activeModel);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [stepUrl]);

  const heightClass = compact ? "h-[18rem]" : "h-[32rem]";

  if (!chrome) {
    return (
      <div className={className ?? "overflow-hidden bg-[#0a1018]"}>
        <div
          ref={mountRef}
          className={viewerClassName ?? heightClass}
          aria-label={title}
          title={status}
        />
      </div>
    );
  }

  return (
    <section className={className ?? "overflow-hidden rounded-lg border border-line-soft bg-panel shadow-glow"}>
      <div className="flex items-start justify-between gap-4 border-b border-line-soft px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          {!compact && description ? (
            <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
          ) : null}
        </div>
        <span className="shrink-0 rounded border border-line-soft bg-[#0b1018] px-2 py-1 text-xs text-slate-400">
          {status}
        </span>
      </div>
      <div ref={mountRef} className={viewerClassName ?? heightClass} aria-label={title} />
    </section>
  );
}
