import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Scissors, Zap } from 'lucide-react';

interface Pack3DCanvasProps {
  packName: string;
  packImage: string;
  isOpening: boolean;
  onTearComplete: () => void;
}

export const Pack3DCanvas: React.FC<Pack3DCanvasProps> = ({
  packName,
  packImage,
  isOpening,
  onTearComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [dragProgress, setDragProgress] = useState(0); // 0 to 100
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 360;
    const height = mountRef.current.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x22d3ee, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xfbbf24, 2);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const foilTexture = textureLoader.load(packImage);
    foilTexture.colorSpace = THREE.SRGBColorSpace;

    // Main Pack Body Geometry & Foil Material
    const packWidth = 2.4;
    const packHeight = 3.6;
    const packDepth = 0.25;

    const packGeo = new THREE.BoxGeometry(packWidth, packHeight, packDepth);
    const foilMaterial = new THREE.MeshStandardMaterial({
      map: foilTexture,
      roughness: 0.15,
      metalness: 0.85,
    });

    const packMesh = new THREE.Mesh(packGeo, foilMaterial);
    scene.add(packMesh);

    // Top Tear Strip Mesh
    const topGeo = new THREE.BoxGeometry(packWidth + 0.05, 0.6, packDepth + 0.05);
    const topMaterial = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: false,
    });
    const topTearMesh = new THREE.Mesh(topGeo, topMaterial);
    topTearMesh.position.y = packHeight / 2 + 0.1;
    packMesh.add(topTearMesh);

    // Glowing Holographic Particle System
    const particleCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 6;

      colors[i] = Math.random() > 0.5 ? 0.13 : 0.98; // Cyan / Gold
      colors[i + 1] = Math.random() > 0.5 ? 0.82 : 0.75;
      colors[i + 2] = 0.93;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeo, pMaterial);
    scene.add(particleSystem);

    // Dynamic Tear Explosion Particles
    const tearParticleCount = 80;
    const tearGeo = new THREE.BufferGeometry();
    const tearPos = new Float32Array(tearParticleCount * 3);
    for (let i = 0; i < tearParticleCount * 3; i += 3) {
      tearPos[i] = (Math.random() - 0.5) * 2;
      tearPos[i + 1] = packHeight / 2;
      tearPos[i + 2] = (Math.random() - 0.5) * 0.5;
    }
    tearGeo.setAttribute('position', new THREE.BufferAttribute(tearPos, 3));
    const tearMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.12,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const tearSystem = new THREE.Points(tearGeo, tearMat);
    scene.add(tearSystem);

    // Animation Loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animation
      if (!isOpening) {
        packMesh.rotation.y = Math.sin(elapsedTime * 1.2) * 0.25;
        packMesh.rotation.x = Math.cos(elapsedTime * 0.8) * 0.1;
        packMesh.position.y = Math.sin(elapsedTime * 2) * 0.1;
      } else {
        // Tearing animation sequence
        packMesh.rotation.y += 0.06;
        topTearMesh.position.x += 0.1;
        topTearMesh.position.y += 0.05;
        topTearMesh.rotation.z += 0.1;
        packMesh.scale.x *= 0.97;

        // Particle Burst on Tear
        tearMat.opacity = 0.9;
        const pArr = tearGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < tearParticleCount; i++) {
          pArr[i * 3] += (Math.random() - 0.5) * 0.15;
          pArr[i * 3 + 1] += Math.random() * 0.12;
          pArr[i * 3 + 2] += (Math.random() - 0.5) * 0.15;
        }
        tearGeo.attributes.position.needsUpdate = true;
      }

      particleSystem.rotation.y = elapsedTime * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [packImage, isOpening]);

  // Swipe / Tear gesture handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDraggingRef.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current || isOpening) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = Math.max(0, clientX - startXRef.current);
    const progress = Math.min(100, Math.round((deltaX / 200) * 100));
    setDragProgress(progress);

    if (progress >= 100) {
      isDraggingRef.current = false;
      onTearComplete();
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (dragProgress < 100 && !isOpening) {
      setDragProgress(0);
    }
  };

  return (
    <div
      className="relative w-full h-[460px] flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full flex items-center justify-center" />

      {/* Interactive Swipe Tear Overlay */}
      {!isOpening && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 bg-slate-950/90 border border-cyan-500/40 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-center space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-amber-400 animate-bounce" />
              SWIPE TO TEAR PACK
            </span>
            <span>{dragProgress}%</span>
          </div>

          <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 transition-all duration-75"
              style={{ width: `${dragProgress}%` }}
            />
          </div>

          <button
            onClick={onTearComplete}
            className="w-full mt-1 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>QUICK OPEN PACK (1-CLICK)</span>
          </button>
        </div>
      )}
    </div>
  );
};
