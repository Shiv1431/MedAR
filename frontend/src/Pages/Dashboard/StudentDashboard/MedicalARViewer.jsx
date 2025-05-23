import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Line } from '@react-three/drei';
import PropTypes from 'prop-types';
import * as THREE from 'three';

const organLabels = {
  brain: [
    { name: 'Frontal Lobe', position: [0.3, 0.7, 0], labelPos: [1.0, 1.5, 0] },
    { name: 'Parietal Lobe', position: [0.4, 0.4, 0], labelPos: [1.1, 1.1, 0] },
    { name: 'Temporal Lobe', position: [0.2, 0.1, 0], labelPos: [0.8, 0.6, 0] },
    { name: 'Occipital Lobe', position: [-0.5, 0.3, 0], labelPos: [-1.2, 1.0, 0] },
    { name: 'Cerebellum', position: [-0.3, -0.5, 0], labelPos: [-1.0, -1.4, 0] },
    { name: 'Brainstem', position: [0, -0.7, 0], labelPos: [0, -1.6, 0] },
  ],
  heart: [
    { name: 'Left Atrium', position: [-0.3, 0, 0], labelPos: [-1.1, 0.7, 0] },
    { name: 'Right Atrium', position: [0.3, 0.1, 0], labelPos: [1.1, 0.8, 0] },
    { name: 'Left Ventricle', position: [-0.3, -0.3, 0], labelPos: [-1.1, -1.1, 0] },
    { name: 'Right Ventricle', position: [0.3, -0.3, 0], labelPos: [1.1, -1.1, 0] },
    { name: 'Aorta', position: [0, 0.5, 0], labelPos: [0, 1.3, 0] },
    { name: 'Pulmonary Artery', position: [0, 0.2, 0.2], labelPos: [0, 1.0, 0.7] },
  ],
  lungs: [
    { name: 'Left Lung', position: [-0.5, 0, 0], labelPos: [-1.5, 0.7, 0] },
    { name: 'Right Lung', position: [0.5, 0, 0], labelPos: [1.5, 0.7, 0] },
    { name: 'Left Bronchus', position: [-0.3, -0.2, 0], labelPos: [-1.3, -0.8, 0] },
    { name: 'Right Bronchus', position: [0.3, -0.2, 0], labelPos: [1.3, -0.8, 0] },
    { name: 'Trachea', position: [0, 0.5, 0], labelPos: [0, 1.4, 0] },
    { name: 'Alveoli', position: [0, -0.5, 0], labelPos: [0, -1.5, 0] },
  ],
  gallbladder: [
    { name: 'Gallbladder Body', position: [0, -0.3, 0.1], labelPos: [0, -1.2, 0.8] },
    { name: 'Cystic Duct', position: [0.1, -0.4, 0], labelPos: [0.7, -1.4, 0] },
    { name: 'Neck', position: [-0.1, -0.5, 0], labelPos: [-0.7, -1.6, 0] },
    { name: 'Fundus', position: [0, -0.2, 0], labelPos: [0, -1.0, 0] },
    { name: 'Body', position: [0, -0.3, 0], labelPos: [0, -1.1, 0.6] },
    { name: 'Common Bile Duct', position: [0.3, -0.6, 0], labelPos: [1.0, -1.8, 0] },
  ],
  kidney: [
    { name: 'Left Kidney', position: [-0.3, -0.2, 0], labelPos: [-1.3, -0.8, 0] },
    { name: 'Right Kidney', position: [0.3, -0.2, 0], labelPos: [1.3, -0.8, 0] },
    { name: 'Renal Cortex', position: [-0.4, -0.1, 0], labelPos: [-1.4, -0.6, 0] },
    { name: 'Renal Medulla', position: [0.4, -0.3, 0], labelPos: [1.4, -1.0, 0] },
    { name: 'Renal Pelvis', position: [0, -0.4, 0], labelPos: [0, -1.2, 0] },
    { name: 'Ureter', position: [0, -0.6, 0], labelPos: [0, -1.8, 0] },
  ],
  stomach: [
    { name: 'Stomach Body', position: [0, -0.1, 0], labelPos: [0, -1.2, 0] },
    { name: 'Esophagus', position: [0, 0.2, 0], labelPos: [0, 1.3, 0] },
    { name: 'Pylorus', position: [0.3, -0.2, 0], labelPos: [1.1, -1.0, 0] },
    { name: 'Fundus', position: [-0.3, 0, 0], labelPos: [-1.1, 0.7, 0] },
    { name: 'Antrum', position: [0.1, -0.3, 0], labelPos: [0.7, -1.2, 0] },
    { name: 'Cardia', position: [0, 0.3, 0], labelPos: [0, 1.5, 0] },
  ],
  intestine: [
    { name: 'Small Intestine', position: [0, 0, 0], labelPos: [0, 1.1, 0] },
    { name: 'Large Intestine', position: [0.4, -0.2, 0], labelPos: [1.5, 0.7, 0] },
    { name: 'Ileocecal Valve', position: [-0.4, -0.3, 0], labelPos: [-1.5, 0, 0] },
    { name: 'Duodenum', position: [0.1, 0.3, 0], labelPos: [0.7, 1.4, 0] },
    { name: 'Jejunum', position: [0, 0.1, 0], labelPos: [0, 1.2, 0] },
    { name: 'Ileum', position: [-0.1, -0.1, 0], labelPos: [-0.8, 0.4, 0] },
  ],
  liver: [
    { name: 'Right Lobe', position: [0.4, 0, 0], labelPos: [1.4, 0.7, 0] },
    { name: 'Left Lobe', position: [-0.4, 0, 0], labelPos: [-1.4, 0.7, 0] },
    { name: 'Caudate Lobe', position: [0, 0.3, 0], labelPos: [0, 1.5, 0] },
    { name: 'Quadrate Lobe', position: [0, -0.3, 0], labelPos: [0, -1.5, 0] },
    { name: 'Gallbladder Fossa', position: [0, -0.1, 0.2], labelPos: [0, -1.2, 0.7] },
    { name: 'Porta Hepatis', position: [0.1, 0, 0], labelPos: [0.7, 0.7, 0] },
  ],
  pancreas: [
    { name: 'Head', position: [0.3, -0.1, 0], labelPos: [1.2, -0.7, 0] },
    { name: 'Body', position: [0, 0, 0], labelPos: [0, 1.2, 0] }, // moved body label ABOVE pancreas model
    { name: 'Tail', position: [-0.3, 0.1, 0], labelPos: [-1.2, 0.9, 0] },
    { name: 'Pancreatic Duct', position: [0, -0.2, 0], labelPos: [0, -1.2, 0] },
    { name: 'Uncinate Process', position: [0.2, -0.3, 0], labelPos: [0.9, -1.3, 0] },
    { name: 'Neck', position: [0.1, 0, 0], labelPos: [0.8, 1.0, 0] }, // moved neck label ABOVE pancreas model
  ],
};


const Model = ({ modelPath, label, info, organId }) => {
  const { scene } = useGLTF(modelPath);
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const object = ref.current;
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    object.position.set(0, 0, 0).sub(center);
    const scale = 2.5 / Math.max(size.x, size.y, size.z);
    object.scale.setScalar(scale);
  }, [scene]);

  const labels = organLabels[organId] || [];

  return (
    <>
      <primitive ref={ref} object={scene.clone(true)} />
      {/* Organ info box below model */}
      <Html position={[0, -2.5, 0]} center>
        <div className="bg-white p-2 rounded shadow text-xs w-48">
          <strong>{label}</strong>
          <p>{info}</p>
        </div>
      </Html>

      {/* Labels with arrows */}
      {labels.map(({ name, position, labelPos }, i) => (
        <React.Fragment key={i}>
          {/* Arrow Line */}
          <Line
            points={[position, labelPos]}
            color="white"
            lineWidth={1}
            dashed={false}
          />
          {/* Label */}
          <Html
            position={labelPos}
            center
            distanceFactor={8}
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '3px 8px',
              borderRadius: 5,
              fontSize: '0.75rem',
              fontWeight: '600',
              boxShadow: '0 0 6px rgba(0,0,0,0.6)'
            }}>
              {name}
            </div>
          </Html>
        </React.Fragment>
      ))}
    </>
  );
};

Model.propTypes = {
  modelPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  organId: PropTypes.string.isRequired,
};

const modelPaths = [
  'brain', 'heart', 'lungs', 'gallbladder', 'intestine', 'kidney', 'liver', 'pancreas', 'stomach'
];
modelPaths.forEach(name => useGLTF.preload(`/models/${name}.glb`));

const organs = [
  { id: 'brain', name: 'Brain', path: '/models/brain.glb', info: 'The brain controls thoughts, memory and movement.' },
  { id: 'heart', name: 'Heart', path: '/models/heart.glb', info: 'The heart pumps blood throughout the body.' },
  { id: 'lungs', name: 'Lungs', path: '/models/lungs.glb', info: 'Lungs enable breathing by gas exchange.' },
  { id: 'gallbladder', name: 'Gallbladder', path: '/models/gallbladder.glb', info: 'Stores bile for digestion.' },
  { id: 'intestine', name: 'Intestine', path: '/models/intestine.glb', info: 'Absorbs nutrients from digested food.' },
  { id: 'kidney', name: 'Kidney', path: '/models/kidney.glb', info: 'Filters blood and produces urine.' },
  { id: 'liver', name: 'Liver', path: '/models/liver.glb', info: 'Processes nutrients and detoxifies the blood.' },
  { id: 'pancreas', name: 'Pancreas', path: '/models/pancreas.glb', info: 'Regulates blood sugar levels.' },
  { id: 'stomach', name: 'Stomach', path: '/models/stomach.glb', info: 'Breaks down and digests food.' }
];

const MedicalARViewer = () => {
  const [selectedOrgan, setSelectedOrgan] = useState('brain');
  const [loading, setLoading] = useState(true);
  const [cameraKey, setCameraKey] = useState(0);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);

  const selected = organs.find(o => o.id === selectedOrgan);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, [selectedOrgan]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Camera access denied. Please allow camera permission.");
      }
    };
    startCamera();
    return () => {
      if (videoStream) videoStream.getTracks().forEach(track => track.stop());
    };
  }, [cameraKey]);

  const resetCamera = () => {
    setCameraKey(prev => prev + 1);
    setVideoStream(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">3D Medical Anatomy Viewer</h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {organs.map((organ) => (
                <button
                  key={organ.id}
                  onClick={() => {
                    setSelectedOrgan(organ.id);
                    setLoading(true);
                  }}
                  className={`min-w-[120px] px-4 py-2 text-sm text-center rounded-md transition-colors ${selectedOrgan === organ.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {organ.name}
                </button>
              ))}
            </div>
            <button
              onClick={resetCamera}
              className="mb-6 bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600"
            >
              Reset Camera
            </button>

            <div className="relative h-[600px] bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              <div className="absolute inset-0 z-10">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-blue-500 rounded-full"></div>
                  </div>
                ) : (
                  <Canvas key={cameraKey} camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 5, 5]} intensity={1.2} />
                    <pointLight position={[-5, -5, -5]} intensity={0.8} />
                    <React.Suspense fallback={null}>
                      <Model
                        modelPath={selected.path}
                        label={selected.name}
                        info={selected.info}
                        organId={selected.id}
                      />
                    </React.Suspense>
                    <OrbitControls enableZoom enablePan enableRotate />
                  </Canvas>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Click an organ to load its 3D model</li>
                <li>Rotate with mouse drag</li>
                <li>Zoom with scroll</li>
                <li>Pan with right-click drag</li>
                <li>Click "Reset Camera" to recenter the view</li>
                <li>Labels on the model indicate key parts (with arrows)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalARViewer;
