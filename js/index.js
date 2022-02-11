import * as THREE from "./lib/three.module.js";

function getRandomInt(min = 0, max = 255) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
const getRandomRGBColor = () =>
  `rgb(${getRandomInt()}, ${getRandomInt()}, ${getRandomInt()})`;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let count = 10;
let circle = Math.PI * 2;
let angle = circle / count;
const radius = 20;

const group = new THREE.Group();
for (let i = 0; i < count; i++) {
  const geometry = new THREE.BoxGeometry();
  const cube = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: getRandomRGBColor(),
    })
  );
  cube.position.set(radius * Math.sin(circle), 0, radius * Math.cos(circle));
  circle -= angle;
  cube.lookAt(0, 0, 0);
  group.add(cube);
}
scene.add(group);

let currAngle = {
  val: 0,
};

const rotate = (val) => {
  gsap.to(currAngle, {
    val: "+=" + val * 0.1,
    onUpdate: () => {
      group.rotation.y = currAngle.val;
      render();
    },
  });
};

let dragging = false;
camera.position.set(20, 0, 0);
let prevPos = 0;

const calcPosition = (e) => {
  if (!dragging) return;
  let clientX = e.clientX ? e.clientX : e.touches[0].clientX;
  if (clientX == prevPos) return;
  clientX > prevPos ? rotate(1) : rotate(-1);
  prevPos = clientX;
};

const onTouchStart = (e) => {
  dragging = true;
  prevPos = e.clientX || e.touches[0].clientX;
  console.log(prevPos);
};

document.addEventListener("mousedown", onTouchStart, false);
document.addEventListener("mouseup", (e) => (dragging = false), false);
document.addEventListener("mousemove", calcPosition, false);

document.addEventListener("touchstart", onTouchStart, false);
document.addEventListener("touchend", (e) => (dragging = false), false);
document.addEventListener("touchmove", calcPosition, false);

const render = () => renderer.render(scene, camera);

render();
