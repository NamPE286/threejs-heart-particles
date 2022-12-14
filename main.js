import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/* -------------------------------- Three.js Setup ------------------------------- */
const canvas = document.querySelector("#bg");
const scene = new THREE.Scene();

/* -------------------------------- Textures -------------------------------- */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/heart.png");

/* -------------------------------- Particles ------------------------------- */
// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 4269;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
const magicNumber = 2.236; //range of the equation with real solutions
for (let i = 0; i < count * 3; i += 3) {
  // x
  positions[i] = (Math.random() - 0.5) * 2 * magicNumber;
  //y
  positions[i + 1] = 0;
  //z
  positions[i + 2] = (Math.random() - 0.5) * 1.5;
  //colors
  colors[i] = Math.random();
  colors[i + 1] = Math.random();
  colors[i + 2] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial();

//size
particlesMaterial.size = 0.1;
particlesMaterial.sizeAttenuation = true;

//color
particlesMaterial.color = new THREE.Color("#ff88cc");
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = true;

//❤️ Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/* ---------------------------------- sizes --------------------------------- */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/* --------------------------------- Camera --------------------------------- */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 7;
camera.position.y = 4;
scene.add(camera);

/* -------------------------------- Controls -------------------------------- */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
/* -------------------------------- Renderer -------------------------------- */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* ------------------------------- Axis Helper ------------------------------ */
/* const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper); */

/* --------------------------------- Animate -------------------------------- */
const clock = new THREE.Clock();
var divider = 100
window.addEventListener("wheel", event => {
  divider += event.deltaY / 10
  if(divider < 1) divider = 1
  if(divider > 500) divider = 500
});
window.addEventListener('keydown', e => {
  if(e.key == "Control"){
    controls.enableZoom = true;
  }
})
window.addEventListener('keyup', e => {
  console.log(e)
  if (e.key == "Control") {
    controls.enableZoom = false;
  }
})
function update() {
  //Update particles
  document.querySelector('#speed').innerHTML = 510 - divider
  for (let i = 0; i < count; i++) {
    let i3 = i * 3;
    const X = particlesGeometry.attributes.position.array[i3];
    const A = (Math.sin(clock.getElapsedTime() / (divider)) - 0.5) * 50 * 2;
    particlesGeometry.attributes.position.array[i3 + 1] = Math.pow(Math.abs(X), 2 / 3) + 0.9 * Math.pow(5 - Math.pow(Math.abs(X), 2), 1 / 2) * Math.sin(A * Math.abs(X))
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(update);
};

update();
