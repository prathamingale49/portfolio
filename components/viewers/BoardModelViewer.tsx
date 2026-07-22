"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getAssetUrl } from "@/lib/assets";

type ModelVector = {
  x: number;
  y: number;
  z: number;
};

type ModelTransform = {
  rotation: ModelVector;
  position: ModelVector;
  zoom: number;
};

type ModelCamera = {
  position: ModelVector;
  target: ModelVector;
};

interface BoardModelViewerProps {
  stepFile?: string;
  glbFile?: string;
  rotation?: ModelVector;
  position?: ModelVector;
  zoom?: number;
  camera?: ModelCamera;
  title: string;
  description?: string;
  compact?: boolean;
  chrome?: boolean;
  preferStep?: boolean;
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

function applyCameraZoom(camera: THREE.PerspectiveCamera, controls: OrbitControls, zoom: number | undefined) {
  const zoomFactor = Math.max(zoom ?? 1, 0.05);
  const offset = camera.position.clone().sub(controls.target);
  camera.position.copy(controls.target).add(offset.divideScalar(zoomFactor));
  camera.updateProjectionMatrix();
  controls.update();
}

function applyDefaultCamera(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  cameraDefault: ModelCamera | undefined,
) {
  if (!cameraDefault) {
    return;
  }

  camera.position.set(cameraDefault.position.x, cameraDefault.position.y, cameraDefault.position.z);
  controls.target.set(cameraDefault.target.x, cameraDefault.target.y, cameraDefault.target.z);
  camera.updateProjectionMatrix();
  controls.update();
}

function applyModelRotation(object: THREE.Object3D, rotation: ModelVector) {
  object.rotation.set(
    THREE.MathUtils.degToRad(rotation.x),
    THREE.MathUtils.degToRad(rotation.y),
    THREE.MathUtils.degToRad(rotation.z),
  );
}

function applyModelPosition(object: THREE.Object3D, position: ModelVector) {
  object.position.set(position.x, position.y, position.z);
}

function applyModelTransform(
  object: THREE.Object3D,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  transform: ModelTransform,
  cameraDefault: ModelCamera | undefined,
) {
  object.position.set(0, 0, 0);
  applyModelRotation(object, transform.rotation);
  fitCamera(camera, controls, object);
  applyModelPosition(object, transform.position);
  applyCameraZoom(camera, controls, transform.zoom);
  applyDefaultCamera(camera, controls, cameraDefault);
}

function cleanNumber(value: number) {
  return Number.isInteger(value) ? value : Number(value.toFixed(3));
}

function cleanVector(vector: ModelVector): ModelVector {
  return {
    x: cleanNumber(vector.x),
    y: cleanNumber(vector.y),
    z: cleanNumber(vector.z),
  };
}

function readCameraSnapshot(
  camera: THREE.PerspectiveCamera | null,
  controls: OrbitControls | null,
): ModelCamera | null {
  if (!camera || !controls) {
    return null;
  }

  return {
    position: {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    },
    target: {
      x: controls.target.x,
      y: controls.target.y,
      z: controls.target.z,
    },
  };
}

function subscribeDebugFlag() {
  return () => undefined;
}

function getDebugFlagSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  const search = new URLSearchParams(window.location.search);
  return search.get("modelDebug") === "1" || window.localStorage.getItem("modelDebug") === "1";
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
  glbFile,
  rotation,
  position,
  zoom,
  camera: cameraDefault,
  title,
  description,
  compact = false,
  chrome = true,
  preferStep = false,
  className,
  viewerClassName,
}: BoardModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeModelRef = useRef<THREE.Object3D | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const initialTransform = useMemo(
    () => ({
      rotation: {
        x: rotation?.x ?? 0,
        y: rotation?.y ?? 0,
        z: rotation?.z ?? 0,
      },
      position: {
        x: position?.x ?? 0,
        y: position?.y ?? 0,
        z: position?.z ?? 0,
      },
      zoom: zoom ?? 1,
    }),
    [position?.x, position?.y, position?.z, rotation?.x, rotation?.y, rotation?.z, zoom],
  );
  const transformRef = useRef<ModelTransform>(initialTransform);
  const [transform, setTransform] = useState(initialTransform);
  const [cameraSnapshot, setCameraSnapshot] = useState<ModelCamera | null>(cameraDefault ?? null);
  const debugEnabled = useSyncExternalStore(subscribeDebugFlag, getDebugFlagSnapshot, () => false);
  const [floatingDebugOpen, setFloatingDebugOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(
    glbFile || stepFile
      ? preferStep && glbFile && stepFile
        ? "Loading GLB preview"
        : "Loading 3D model"
      : "3D export not added yet",
  );
  const [stepProgress, setStepProgress] = useState<number | null>(null);

  const glbUrl = useMemo(() => (glbFile ? getAssetUrl(glbFile) : ""), [glbFile]);
  const stepUrl = useMemo(() => (stepFile ? getAssetUrl(stepFile) : ""), [stepFile]);

  useEffect(() => {
    transformRef.current = transform;

    if (activeModelRef.current && cameraRef.current && controlsRef.current) {
      applyModelTransform(activeModelRef.current, cameraRef.current, controlsRef.current, transform, cameraDefault);
      const snapshot = readCameraSnapshot(cameraRef.current, controlsRef.current);
      if (snapshot) {
        setCameraSnapshot(snapshot);
      }
    }
  }, [cameraDefault, transform]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let activeModel: THREE.Object3D = createPlaceholderBoard();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a1018");
    scene.add(activeModel);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
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

    activeModelRef.current = activeModel;
    applyModelTransform(activeModel, camera, controls, transformRef.current, cameraDefault);

    const updateCameraSnapshot = () => {
      const snapshot = readCameraSnapshot(camera, controls);
      if (snapshot && !disposed) {
        setCameraSnapshot(snapshot);
      }
    };

    controls.addEventListener("change", updateCameraSnapshot);
    requestAnimationFrame(updateCameraSnapshot);

    const resize = () => {
      if (!mount) return;
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height);
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

    function replaceActiveModel(model: THREE.Object3D, nextStatus: string) {
      scene.remove(activeModel);
      disposeObject(activeModel);
      activeModel = model;
      activeModelRef.current = activeModel;
      scene.add(activeModel);
      applyModelTransform(activeModel, camera, controls, transformRef.current, cameraDefault);
      updateCameraSnapshot();
      if (!disposed) setStatus(nextStatus);
    }

    async function loadGlbModel() {
      if (!glbUrl) return false;

      try {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(glbUrl);
        if (!gltf.scene.children.length) {
          throw new Error("GLB contains no scene objects.");
        }

        replaceActiveModel(gltf.scene, "GLB model loaded");
        return true;
      } catch {
        if (!disposed) setStatus(stepUrl ? "GLB failed; loading STEP export" : "GLB model unavailable");
        return false;
      }
    }

    async function readStepBytes(response: Response) {
      const contentLength = Number(response.headers.get("content-length") ?? 0);

      if (!response.body || !Number.isFinite(contentLength) || contentLength <= 0) {
        if (!disposed) setStepProgress(35);
        const buffer = new Uint8Array(await response.arrayBuffer());
        if (!disposed) setStepProgress(80);
        return buffer;
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      while (!disposed) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;

        chunks.push(value);
        received += value.length;
        setStepProgress(Math.min(Math.round((received / contentLength) * 80), 80));
      }

      const bytes = new Uint8Array(received);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }

      return bytes;
    }

    async function loadStepModel(replacingGlb = false) {
      if (!stepUrl) return false;

      try {
        if (!disposed) {
          setStepProgress(0);
          setStatus(replacingGlb ? "GLB preview loaded; loading STEP export" : "Loading STEP export");
        }

        const response = await fetch(stepUrl);
        if (!response.ok) {
          if (!disposed) {
            setStatus("STEP export not added yet");
            setStepProgress(null);
          }
          return false;
        }

        const buffer = await readStepBytes(response);
        if (disposed) return false;

        setStepProgress(84);
        await loadOcctScript();
        if (!window.occtimportjs) {
          throw new Error("STEP importer unavailable.");
        }

        setStepProgress(90);
        const occt = await window.occtimportjs();
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
        if (!disposed) setStepProgress(100);
        replaceActiveModel(stepGroup, "STEP export loaded");
        if (!disposed) setStepProgress(null);
        return true;
      } catch {
        if (!disposed) {
          setStatus(replacingGlb ? "GLB preview loaded; STEP unavailable" : "STEP viewer fallback");
          setStepProgress(null);
        }
        return false;
      }
    }

    async function loadModel() {
      const glbLoaded = await loadGlbModel();
      if (preferStep) {
        if (stepUrl) {
          await loadStepModel(glbLoaded);
        } else if (!glbLoaded) {
          setStatus("3D export not added yet");
        }
        return;
      }

      if (!glbLoaded) {
        await loadStepModel(false);
      }
    }

    void loadModel();

    return () => {
      disposed = true;
      activeModelRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      controls.removeEventListener("change", updateCameraSnapshot);
      observer.disconnect();
      controls.dispose();
      disposeObject(activeModel);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [cameraDefault, glbUrl, preferStep, stepUrl]);

  const heightClass = compact ? "h-[18rem]" : "h-[32rem]";
  const debugSnippet = JSON.stringify(
    {
      rotation: {
        x: cleanNumber(transform.rotation.x),
        y: cleanNumber(transform.rotation.y),
        z: cleanNumber(transform.rotation.z),
      },
      position: {
        x: cleanNumber(transform.position.x),
        y: cleanNumber(transform.position.y),
        z: cleanNumber(transform.position.z),
      },
      zoom: cleanNumber(transform.zoom),
      ...(cameraSnapshot
        ? {
            camera: {
              position: cleanVector(cameraSnapshot.position),
              target: cleanVector(cameraSnapshot.target),
            },
          }
        : {}),
    },
    null,
    2,
  );

  function updateVector(kind: "rotation" | "position", axis: keyof ModelVector, value: string) {
    const nextValue = Number.parseFloat(value);
    if (Number.isNaN(nextValue)) return;

    setCopied(false);
    setTransform((current) => ({
      ...current,
      [kind]: {
        ...current[kind],
        [axis]: nextValue,
      },
    }));
  }

  function updateZoom(value: string) {
    const nextValue = Number.parseFloat(value);
    if (Number.isNaN(nextValue)) return;

    setCopied(false);
    setTransform((current) => ({
      ...current,
      zoom: nextValue,
    }));
  }

  async function copyDebugSnippet() {
    await navigator.clipboard.writeText(debugSnippet);
    setCopied(true);
  }

  const stepProgressLabel = stepProgress === null ? "" : `${Math.round(stepProgress)}%`;

  const debugPanel = debugEnabled ? (
    <div className="border-t border-line-soft bg-[#080b10] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#f4efe3]">3D transform debug</p>
          <p className="mt-1 text-xs text-slate-500">
            {title}. Drag the model, then paste the JSON into this project&apos;s model3d block.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCopied(false);
            setTransform(initialTransform);
          }}
          className="h-8 border border-line-soft px-2.5 text-xs text-slate-200 hover:border-copper/60"
        >
          Reset
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)]">
        <div className="grid gap-3 sm:grid-cols-3">
          {(["rotation", "position"] as const).map((kind) => (
            <fieldset key={kind} className="grid gap-2 border border-line-soft p-3">
              <legend className="px-1 text-xs uppercase tracking-[0.14em] text-slate-500">{kind}</legend>
              {(["x", "y", "z"] as const).map((axis) => (
                <label key={axis} className="grid gap-1 text-xs text-slate-400">
                  {axis}
                  <input
                    type="number"
                    value={transform[kind][axis]}
                    step={kind === "rotation" ? 5 : 1}
                    onChange={(event) => updateVector(kind, axis, event.target.value)}
                    className="h-8 border border-line-soft bg-[#0b1018] px-2 text-sm text-slate-100"
                  />
                </label>
              ))}
            </fieldset>
          ))}
          <fieldset className="grid content-start gap-2 border border-line-soft p-3">
            <legend className="px-1 text-xs uppercase tracking-[0.14em] text-slate-500">zoom</legend>
            <label className="grid gap-1 text-xs text-slate-400">
              factor
              <input
                type="number"
                value={transform.zoom}
                min={0.05}
                step={0.1}
                onChange={(event) => updateZoom(event.target.value)}
                className="h-8 border border-line-soft bg-[#0b1018] px-2 text-sm text-slate-100"
              />
            </label>
          </fieldset>
        </div>
        <div className="grid gap-2">
          <pre className="max-h-56 overflow-auto border border-line-soft bg-[#05070a] p-3 text-xs leading-5 text-slate-300">
            {debugSnippet}
          </pre>
          <button
            type="button"
            onClick={() => void copyDebugSnippet()}
            className="h-8 border border-copper/60 px-2.5 text-xs font-medium text-copper hover:bg-copper/10"
          >
            {copied ? "Copied" : "Copy JSON"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  if (!chrome) {
    return (
      <div className={`${className ?? "overflow-hidden bg-[#0a1018]"} relative`}>
        <div
          ref={mountRef}
          className={`overflow-hidden ${viewerClassName ?? heightClass}`}
          aria-label={title}
          title={status}
        />
        {debugEnabled ? (
          <button
            type="button"
            onClick={() => setFloatingDebugOpen(true)}
            className="absolute right-2 top-2 z-10 border border-copper/60 bg-[#080b10]/90 px-2 py-1 text-xs font-medium text-copper backdrop-blur hover:bg-copper/10"
          >
            Debug
          </button>
        ) : null}
        {debugEnabled && floatingDebugOpen ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-auto border border-line-soft bg-[#080b10] shadow-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-3">
                <p className="text-sm font-semibold text-[#f4efe3]">{title}</p>
                <button
                  type="button"
                  onClick={() => setFloatingDebugOpen(false)}
                  className="border border-line-soft px-2.5 py-1 text-xs text-slate-200 hover:border-copper/60"
                >
                  Close
                </button>
              </div>
              {debugPanel}
            </div>
          </div>
        ) : null}
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
      {stepProgress !== null ? (
        <div className="border-b border-line-soft bg-[#080d14] px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-slate-300">Loading STEP export</span>
            <span className="tabular-nums text-slate-500">{stepProgressLabel}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#171f2b]">
            <div
              className="h-full rounded-full bg-[#d84a3a] transition-[width] duration-200 ease-out"
              style={{ width: `${Math.max(3, Math.min(stepProgress, 100))}%` }}
            />
          </div>
        </div>
      ) : null}
      <div ref={mountRef} className={`overflow-hidden ${viewerClassName ?? heightClass}`} aria-label={title} />
      {debugPanel}
    </section>
  );
}
