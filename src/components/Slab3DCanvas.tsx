import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Slab3DCanvasProps {
  cardImageUrl?: string;
  grade?: number;
  gradeText?: string;
  serialNumber?: string;
  className?: string;
  interactive?: boolean;
}

export const Slab3DCanvas: React.FC<Slab3DCanvasProps> = ({
  cardImageUrl = 'https://images.pokemontcg.io/sv3pt5/173_hires.png',
  grade = 10,
  gradeText = 'GEM MINT',
  serialNumber = 'VCA-000-000-001',
  className = 'w-full h-[400px]',
  interactive = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group for the floating Slab
    const slabGroup = new THREE.Group();
    scene.add(slabGroup);

    // Outer Acrylic Slab Geometry
    const slabWidth = 2.4;
    const slabHeight = 3.6;
    const slabThickness = 0.22;

    const acrylicGeo = new THREE.BoxGeometry(slabWidth, slabHeight, slabThickness);
    const acrylicMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide
    });
    const acrylicMesh = new THREE.Mesh(acrylicGeo, acrylicMat);
    slabGroup.add(acrylicMesh);

    // Bevel frame outline
    const borderEdges = new THREE.EdgesGeometry(acrylicGeo);
    const borderMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.5 });
    const borderLine = new THREE.LineSegments(borderEdges, borderMat);
    slabGroup.add(borderLine);

    // Card Mesh inside Acrylic
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'Anonymous';
    const cardTexture = textureLoader.load(cardImageUrl);

    const cardGeo = new THREE.PlaneGeometry(1.8, 2.5);
    const cardMat = new THREE.MeshBasicMaterial({ map: cardTexture, side: THREE.DoubleSide });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.set(0, -0.35, 0.01);
    slabGroup.add(cardMesh);

    // Top Holographic Header Nameplate
    const headerGeo = new THREE.PlaneGeometry(2.1, 0.55);
    const canvasHeader = document.createElement('canvas');
    canvasHeader.width = 512;
    canvasHeader.height = 128;
    const ctx = canvasHeader.getContext('2d');
    if (ctx) {
      // Holographic gradient
      const grad = ctx.createLinearGradient(0, 0, 512, 128);
      grad.addColorStop(0, '#22d3ee');
      grad.addColorStop(0.3, '#c084fc');
      grad.addColorStop(0.7, '#fbbf24');
      grad.addColorStop(1, '#38bdf8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 128);

      // Black text
      ctx.fillStyle = '#05070a';
      ctx.font = '900 48px Orbitron, sans-serif';
      ctx.fillText('VCA', 24, 75);

      ctx.beginPath();
      ctx.moveTo(170, 20);
      ctx.lineTo(170, 108);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#05070a';
      ctx.stroke();

      ctx.font = '900 38px Orbitron, sans-serif';
      ctx.fillText(`#${grade}`, 200, 60);

      ctx.font = '800 20px Orbitron, sans-serif';
      ctx.fillText(gradeText, 200, 95);

      ctx.font = '600 16px "JetBrains Mono", monospace';
      ctx.fillText(serialNumber, 24, 115);
    }

    const headerTexture = new THREE.CanvasTexture(canvasHeader);
    const headerMat = new THREE.MeshBasicMaterial({ map: headerTexture, side: THREE.DoubleSide });
    const headerMesh = new THREE.Mesh(headerGeo, headerMat);
    headerMesh.position.set(0, 1.25, 0.02);
    slabGroup.add(headerMesh);

    // Glowing Pedestal Dais below
    const daisGeo = new THREE.CylinderGeometry(2.0, 2.5, 0.3, 32);
    const daisMat = new THREE.MeshStandardMaterial({
      color: 0x0a101d,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x082f49,
      emissiveIntensity: 0.5
    });
    const daisMesh = new THREE.Mesh(daisGeo, daisMat);
    daisMesh.position.set(0, -2.4, 0);
    scene.add(daisMesh);

    const daisRingGeo = new THREE.RingGeometry(1.8, 2.0, 32);
    const daisRingMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide });
    const daisRing = new THREE.Mesh(daisRingGeo, daisRingMat);
    daisRing.rotation.x = Math.PI / 2;
    daisRing.position.set(0, -2.24, 0);
    scene.add(daisRing);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x22d3ee, 3, 10);
    cyanPointLight.position.set(3, 3, 4);
    scene.add(cyanPointLight);

    const violetPointLight = new THREE.PointLight(0xc084fc, 2, 10);
    violetPointLight.position.set(-3, -2, 3);
    scene.add(violetPointLight);

    // Interactivity: Drag to Rotate
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      slabGroup.rotation.y += deltaX * 0.01;
      slabGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gentle floating sine wave movement when not dragging
      if (!isDragging) {
        slabGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
        slabGroup.rotation.y += 0.005; // slow float spin
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [cardImageUrl, grade, gradeText, serialNumber, interactive]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/80 backdrop-blur-md ${className}`}>
      {/* HUD scanlines */}
      <div className="absolute inset-0 hud-scanlines pointer-events-none z-10 opacity-30" />
      
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Control prompt overlay */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-[11px] font-mono text-cyan-300">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>3D HOLOGRAPHIC SLAB • DRAG TO ROTATE</span>
      </div>
    </div>
  );
};
