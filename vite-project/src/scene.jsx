import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { EffectComposer, ToneMapping, Bloom } from '@react-three/postprocessing';
// import { useControls } from 'leva';


/** Number of distinct targets (pillows count as 1; based on modals + GitHub) */
const TARGET_COUNT = 7;

function Model({ position, rotation, scale, onOpenModal, onTargetFound }) {
  const { scene } = useGLTF('/models/Portfolio2_baked.glb');
  const [hoveredObjects, setHoveredObjects] = useState({});

  useEffect(() => {
    const targets = {};
    scene.traverse((child) => {
      if (child.name.includes('target')) {
        targets[child.uuid] = false;
        child.userData.isTarget = true;
  
        // Hide the original target mesh to prevent duplicate rendering
        child.visible = false;
      }
    });
    setHoveredObjects(targets);
  }, [scene]);
  

  const GITHUB_URL = 'https://github.com/oCHRONOSo';

  const handlePointerOver = (uuid, objectName) => {
    setHoveredObjects((prev) => ({ ...prev, [uuid]: true }));
    if (['Text_target', 'pc_target', 'Guitar_target', 'pot_target', 'pillow_target', 'pillow2_target', 'book_target', 'lantern_target'].includes(objectName)) document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (uuid) => {
    setHoveredObjects((prev) => ({ ...prev, [uuid]: false }));
    document.body.style.cursor = 'default';
  };

  const handleClick = (object) => {
    if (object.name === 'Text_target') {
      window.open(GITHUB_URL, '_blank');
      onTargetFound?.(object.name);
    } else if (object.name === 'pc_target' && onOpenModal) {
      onOpenModal('techstack');
      onTargetFound?.(object.name);
    } else if (object.name === 'Guitar_target' && onOpenModal) {
      onOpenModal('guitar');
      onTargetFound?.(object.name);
    } else if (object.name === 'pot_target' && onOpenModal) {
      onOpenModal('pot');
      onTargetFound?.(object.name);
    } else if ((object.name === 'pillow_target' || object.name === 'pillow2_target') && onOpenModal) {
      onOpenModal('pillow');
      onTargetFound?.('pillow');
    } else if (object.name === 'book_target' && onOpenModal) {
      onOpenModal('book');
      onTargetFound?.(object.name);
    } else if (object.name === 'lantern_target' && onOpenModal) {
      onOpenModal('lantern');
      onTargetFound?.(object.name);
    }
  };

  return (
    <primitive
      object={scene}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={scale}
    >
      {Object.keys(hoveredObjects).map((uuid) => {
        const object = scene.getObjectByProperty('uuid', uuid);
        return (
          <mesh
            key={uuid}
            geometry={object.geometry}
            material={object.material}
            position={object.position}
            rotation={object.rotation}
            scale={hoveredObjects[uuid] ? [1.2, 1.2, 1.2] : [1, 1, 1]}
            onPointerOver={() => handlePointerOver(uuid, object.name)}
            onPointerOut={() => handlePointerOut(uuid)}
            onClick={() => handleClick(object)}
          />
        );
      })}
    </primitive>
  );
}

function InfoModal({ isOpen, onClose, variant }) {
  if (!isOpen || !variant) return null;

  const titles = { techstack: 'Tech Stack', guitar: 'Guitar', pot: '3D & Modeling', pillow: 'Welcome', book: 'Book', lantern: 'Lantern' };
  const title = titles[variant] || 'Info';

  return (
    <div className="tech-stack-modal-overlay" onClick={onClose}>
      <div className="tech-stack-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tech-stack-modal-header">
          <h2>{title}</h2>
          <button type="button" className="tech-stack-modal-close" onClick={onClose} aria-label="Close">
            <svg className="tech-stack-modal-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="tech-stack-modal-content">
          {variant === 'techstack' && (
            <>
              <section>
                <h3>Frontend</h3>
                <p>HTML, JavaScript, TypeScript, React.</p>
              </section>
              <section>
                <h3>Backend</h3>
                <p>Python, Node.js, REST API.</p>
              </section>
              <section>
                <h3>Sysadmin</h3>
                <p>Bash, PowerShell, Git, GitHub Actions.</p>
              </section>
              <section>
                <h3>Cloud</h3>
                <p>AWS, Azure.</p>
              </section>
              <section>
                <h3>3D & Graphics</h3>
                <p>Blender 3D, Three.js.</p>
              </section>
              <section>
                <h3>Others</h3>
                <p>MongoDB, MySQL, Next.js, Prisma ORM.</p>
              </section>
            </>
          )}
          {variant === 'guitar' && (
            <section>
              <p>
                Music is a big part of my life. I play guitar in my spare time—mostly acoustic, from fingerstyle to
                strumming. It’s a great way to unwind and stay creative outside of coding.
              </p>
            </section>
          )}
          {variant === 'pot' && (
            <section>
              <p>
                I also like 3D and modeling in my free time using Blender 3D. It’s a fun way to create assets and
                scenes, and it ties in nicely with WebGL and Three.js for bringing them to the web.
              </p>
            </section>
          )}
          {variant === 'pillow' && (
            <section>
              <p>
                Have a seat and enjoy. Make yourself at home—stay as long as you like and explore.
              </p>
            </section>
          )}
          {variant === 'book' && (
            <section>
              <p className="tech-stack-modal-quote">
                “The quieter you become, the more you can hear.”
              </p>
              <p className="tech-stack-modal-attribution">— Kali Linux</p>
            </section>
          )}
          {variant === 'lantern' && (
            <section>
              <p>
                How dare you try to switch to light mode. It's always dark mode here—and this lantern is the only light you get.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

const COMPLETION_CUE_DELAY_MS = 1500;
const TOAST_DURATION_MS = 2500;

export default function Scene({ onShowIntro, onRestart }) {
  const [modalType, setModalType] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [foundTargetIds, setFoundTargetIds] = useState(() => new Set());
  const [showThankYou, setShowThankYou] = useState(false);
  const [showCompletionCue, setShowCompletionCue] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const audioRef = useRef(null);

  const triggerThankYou = () => {
    setShowCompletionCue(true);
  };

  const handleCloseModal = () => {
    setModalType(null);
    if (foundTargetIds.size === TARGET_COUNT) {
      triggerThankYou();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [isMuted]);

  // Progress toasts at 3/7 and 6/7
  useEffect(() => {
    const size = foundTargetIds.size;
    if (size === 3) {
      setToastMessage('Halfway there!');
      const t = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
      return () => clearTimeout(t);
    }
    if (size === 6) {
      setToastMessage('Almost there!');
      const t = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [foundTargetIds.size]);

  // At 7/7 with no modal open (e.g. GitHub was last), show completion cue then thank-you
  useEffect(() => {
    if (foundTargetIds.size === TARGET_COUNT && !modalType && !showThankYou && !showCompletionCue) {
      triggerThankYou();
    }
  }, [foundTargetIds.size, modalType, showThankYou, showCompletionCue]);

  // After completion cue delay, show thank-you overlay
  useEffect(() => {
    if (!showCompletionCue) return;
    const t = setTimeout(() => {
      setShowCompletionCue(false);
      setShowThankYou(true);
    }, COMPLETION_CUE_DELAY_MS);
    return () => clearTimeout(t);
  }, [showCompletionCue]);

  // Position / scale / rotation helper (Leva) – uncomment to tweak model in dev
  // const { position, rotation, scale } = useControls({
  //   position: { value: { x: 0, y: -2, z: 0 }, min: -10, max: 10, step: 0.1 },
  //   rotation: { value: { x: 0, y: 0, z: 0 }, min: -Math.PI, max: Math.PI, step: 0.01 },
  //   scale: { value: 1, min: 0.1, max: 3, step: 0.1 },
  // });
  const position = { x: 0, y: -2, z: 0 };
  const rotation = { x: 0, y: 0, z: 0 };
  const scale = 1;

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop />
      <div className="scene-top-buttons">
        <div className="scene-top-buttons-left">
          {onShowIntro && (
            <button type="button" className="scene-menu-btn" onClick={onShowIntro} aria-label="Show menu">
              Menu
            </button>
          )}
          <button
            type="button"
            className="scene-mute-btn"
          onClick={() => setIsMuted((m) => !m)}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="scene-mute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg className="scene-mute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
          </button>
        </div>
        <div
          className={`scene-target-count${foundTargetIds.size === TARGET_COUNT ? ' scene-target-count--complete' : ''}`}
          aria-live="polite"
        >
          {foundTargetIds.size === TARGET_COUNT && (
            <span className="scene-target-count-check" aria-hidden>✓ </span>
          )}
          {foundTargetIds.size}/{TARGET_COUNT}
        </div>
      </div>
      {toastMessage && (
        <div className="scene-toast" role="status">
          {toastMessage}
        </div>
      )}
      {showCompletionCue && (
        <div className="scene-completion-cue" role="status">
          <span className="scene-completion-cue-check">✓</span>
          <span>7/7 complete!</span>
        </div>
      )}
      <Canvas style={{ background: '#1c1e30' }} orthographic camera={{ position: [2.5, 1, 3], zoom: 80 }}>
        <ambientLight intensity={1} />
        <Model
          position={position}
          rotation={rotation}
          scale={scale}
          onOpenModal={setModalType}
          onTargetFound={(id) => setFoundTargetIds((prev) => new Set(prev).add(id))}
        />
      <OrbitControls
        enablePan={false}
        maxZoom={180}
        minZoom={55}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
        maxAzimuthAngle={Math.PI / 2}
        minAzimuthAngle={0}
      />
      <EffectComposer>
        <ToneMapping adaptive resolution={512} middleGrey={1.1} maxLuminance={12.0} />
        <Bloom intensity={0.2} luminanceThreshold={0.4} luminanceSmoothing={0.9} height={300} kernelSize={4} />
      </EffectComposer>
      </Canvas>
      <InfoModal isOpen={!!modalType} onClose={handleCloseModal} variant={modalType} />
      {showThankYou && (
        <div className="thank-you-overlay thank-you-overlay--visible">
          <h2 className="thank-you-title">Thank you for visiting!</h2>
          <button
            type="button"
            className="thank-you-restart"
            onClick={() => {
              setShowThankYou(false);
              setFoundTargetIds(new Set());
              onRestart?.();
            }}
          >
            Restart
          </button>
        </div>
      )}
    </>
  );
}
