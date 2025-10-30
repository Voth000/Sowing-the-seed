
import * as THREE from "three";
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/postprocessing/UnrealBloomPass.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/loaders/DRACOLoader.js';

// Define global variables
let scene, camera, renderer, controls, raycaster, mouse, composer;
let container, tim, tim1, gltf2, gltf3, gltf4;

const popup = document.getElementById("up");

function showPopup() {
  popup.style.display = "flex";
}

function hidePopup() {
  popup.style.display = "none";
}

// Show the popup initially
showPopup();

let countdownValue = 7;
const upContent = popup.querySelector('.up-content');
function updatePopupCountdownText(val) {
  upContent.innerHTML = '<h2>Thank you for visiting your own flower garden</h2>' +
    '<p>The experience will start in <span id="up-countdown">' + val + '</span> seconds.</p>' +
    '<p>After that, you could click on the your 3D model or move your head around to explore!</p>';
}
updatePopupCountdownText(countdownValue);
const popupInterval = setInterval(() => {
  countdownValue--;
  if (countdownValue > 0) {
    updatePopupCountdownText(countdownValue);
  } else {
    clearInterval(popupInterval);
    hidePopup();
  }
}, 1000);

init();

function init() {

  container = document.getElementById('three-container');
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.3));
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true; // If you need shadows

  renderer.toneMappingExposure = 1;
  renderer.setClearAlpha(0.0);
  //scene.background = new THREE.Color(0x333333);
 
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  


  composer = new EffectComposer(renderer);
  const renderScene = new RenderPass(scene, camera);
composer.addPass(renderScene);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.9,  // Bloom strength
    1,  // Bloom radius
    0.85  // Bloom threshold
  );
  composer.addPass(bloomPass);


  // Load texture for spotlight
  const texture = new THREE.TextureLoader();
  const spotTexture = texture.load('./en.JPG'); // Make sure this path is correct
  spotTexture.minFilter = THREE.LinearFilter;
  spotTexture.magFilter = THREE.LinearFilter;
  spotTexture.colorSpace = THREE.SRGBColorSpace;
   // Add an ambient light
  const ambientLight = new THREE.AmbientLight(0x262626);
  scene.add(ambientLight);
 // Set up spotlight with texture
 const spotLight = new THREE.SpotLight(0xffffff, 10);
 const spotLight1 = new THREE.SpotLight(0xffffff, 3);

 spotLight1.position.set(-2.5, 8, 2.5);
 spotLight1.angle = Math.PI / 6;
 spotLight1.map = spotTexture;

 
 spotLight1.penumbra = 1;
 spotLight1.decay = 4;
 spotLight1.distance = 100;

 
 spotLight.position.set(0.5, -20, 0.5);
 spotLight.angle = Math.PI / -4;
 spotLight.penumbra = 1;
 spotLight.decay = 4;
 spotLight.distance = 100;
 spotLight.map = spotTexture;

 spotLight.castShadow = true;
 spotLight.shadow.mapSize.width = 1024;
 spotLight.shadow.mapSize.height = 1024;
 spotLight.shadow.camera.near = 1;
 spotLight.shadow.camera.far = 200;
 spotLight.shadow.focus = 1;
 // Rotates it 180 degrees along Y-axis
 spotLight.rotation.z = Math.PI / -8;
 
 scene.add(spotLight);
 scene.add(spotLight1);
 // Add a ground plane to receive shadows
 const planeGeometry = new THREE.PlaneGeometry(200, 200);
 const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xbcbcbc, transparent: true, opacity: 0.1});
 const ground = new THREE.Mesh(planeGeometry, planeMaterial);
 ground.position.set(-4, -7, 2);
 ground.rotation.x = Math.PI / -6;
 ground.receiveShadow = true;
 scene.add(ground);


const colorPicker = document.getElementById('colorPicker');

const emissiveColor = new THREE.Color(0xffffff);

// Listen for the color picker's input event
colorPicker.addEventListener('input', function(event) {
  const color = event.target.value;
  emissiveColor.set(color);
  updateEmissiveColor();
});

// Function to update the emissive color of the model's material
function updateEmissiveColor() {
  tim.traverse(function (node) {
    if (node.isMesh && node.name !== 'sh') { // Apply to all models except 'sh.glb'
      node.material.emissive = emissiveColor;
    }
  });
  renderer.render(scene, camera); // Render the scene to see the color change immediately
}

// Get the color picker element
const colorPicker1 = document.getElementById('colorPicker2');
// Set up the emissive color
const emissiveColor1 = new THREE.Color(0x949494);
// Listen for the color picker's input event
colorPicker1.addEventListener('input', function(event1) {
  const color1 = event1.target.value;
  emissiveColor1.set(color1);
  updateEmissiveColor1();
});


function updateEmissiveColor1() {
  gltf4.traverse(function (node) {
    if (node.isMesh) {
      node.material.emissive = emissiveColor1;
    }
  });
  renderer.render(scene, camera); // Render the scene to see the color change immediately
}

  // Use one central instance of THREE, GLTFLoader, DRACOLoader
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/libs/draco/'); // DRACO decoder CDN path

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  // Use loader for ani2-optimized.glb, hoa2.glb, tree2.glb, sh.glb
  loader.load('ani2-optimized.glb', function (gltf) {
    tim = gltf.scene;
    scene.add(tim);

const mixer = new THREE.AnimationMixer(tim);
const clips = gltf.animations;


clips.forEach(function (clip) {
 const action = mixer.clipAction(clip);
 action.play();
});
tim.visible = false;
tim.name = "tim";

document.getElementById("three-container").addEventListener("click", function(e) {
  if (popup.classList.contains('show')) {
    hidePopup();
  }
});

document.getElementById("button2").addEventListener("click", function(){
 scene.getObjectByName( 'tim1' ).visible = false;
 scene.getObjectByName( 'tim' ).visible = true;
});

   tim.traverse(function (node) {
       if (node.isMesh) {
         node.material.shininess = 0;
 node.scale.set(0.11, 0.11, 0.11);

 const material = node.material;
 material.emissive = emissiveColor; // set the emissive color to white
 material.emissiveIntensity = 0.7; // adj
 node.material.transparent = true;
     node.material.opacity = 1; 
     node.castShadow = true;
					node.receiveShadow = true;
       }
     });
   // Set the position of the model
   tim.position.set(0, 0, 0.5);

   // Set up the raycaster and mouse
   raycaster = new THREE.Raycaster();
   mouse = new THREE.Vector2();
   // Add an event listener for mouse clicks
   document.addEventListener('mousedown', onDocumentMouseDown);
   // Animation loop
 function animate() {
   requestAnimationFrame(animate);

   // Update the mixer to advance the animations
   mixer.update(0.005); // Adjust the time delta as needed
   const time = performance.now() / 3000;

   spotLight.position.x = Math.cos( time ) * 2.5;
   spotLight.position.z = Math.sin( time ) * 2.5;

   spotLight1.position.x = Math.cos( time ) * 2.5;
   spotLight1.position.z = Math.sin( time ) * 2.5;
   // REMOVE: renderer.render(scene, camera); // Only use composer.render for postprocessing
   // renderer.render(scene, camera);  // <-- REMOVE duplicate render call

   // USE ONLY THIS:
   composer.render();

   controls.update();
 }

 // Start the animation loop
 animate();

 });

   // Load the first GLTF model (tim.glb)
   const loader1 = new GLTFLoader();
   const dracoLoader1 = new DRACOLoader();
   dracoLoader1.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/libs/draco/');
   loader1.setDRACOLoader(dracoLoader1);
   loader1.load('test.glb', function (gltf) {
     tim1 = gltf.scene;
     scene.add(tim1);
 
 const mixer = new THREE.AnimationMixer(tim1);
 const clips = gltf.animations;
 

 clips.forEach(function (clip) {
   const action = mixer.clipAction(clip);
   action.play();
 });

 tim1.visible = true;
 tim1.name = "tim1";

 document.getElementById("button1").addEventListener("click", function(){
   scene.getObjectByName( 'tim' ).visible = false;

 tim1.visible = !tim1.visible;
 });
 
     tim1.traverse(function (node) {
         if (node.isMesh) {
   const material = node.material;
   material.emissive = emissiveColor; // set the emissive color to white
   material.emissiveIntensity = 0.4;
   node.material.metalness = 0.2; // Adjust as desired
        node.material.roughness = 0.4; // Adjust as desired
        node.material.needsUpdate = true;
        node.rotation.x = Math.PI / -8;
       node.scale.set(0.6, 0.6, 0.6);
       node.position.set(-0.25, 1, 0.8);

       if (material.map) {
         material.map.encoding = THREE.sRGBEncoding;
         material.castShadow = true;
         material.receiveShadow = true;
       }
         }
       });
  
    
  
     raycaster = new THREE.Raycaster();
     mouse = new THREE.Vector2();

     document.addEventListener('mousedown', onDocumentMouseDown);

   function animate() {
     requestAnimationFrame(animate);
 
  
     mixer.update(0.008); 
     composer.render();

     renderer.render(scene, camera);
     controls.update();
   }
 
   // Start the animation loop
   animate();
 
   });

  loader.load('hoa2.glb', function (gltf) {
    gltf2 = gltf.scene;
    gltf2.traverse(function (node) {
        if (node.isMesh) {
          node.material.opacity = 1; 
          node.material.shininess = 5;
          node.scale.set(1.4, 1.4, 1.4);
          node.position.set(0, 0, 0);
          node.castShadow = true;
					node.receiveShadow = true;
          const material = node.material;
          material.emissive = new THREE.Color(0xFFFFFF); // set the emissive color to white
          material.emissiveIntensity = 0.4; // adj
         
        }
      });
     
  });

  loader.load('tree2.glb', function (gltf) {
    gltf3 = gltf.scene;
    
    gltf3.traverse(function (node) {
        if (node.isMesh) {
          node.material.shininess = 55;
          node.scale.set(0.2, 0.2, 0.2);
          node.position.set(0, 0, 0);
          node.castShadow = true;
					node.receiveShadow = true;
  const material = node.material;
  material.opacity = 0.6; 
  material.emissive = new THREE.Color(0xffffff); // set the emissive color to white
  material.emissiveIntensity = 0.7; // adj
        }
      });
    
  });

  loader.load('sh.glb', function (gltf) {
    gltf4 = gltf.scene;
    gltf4.traverse(function (node) {
        if (node.isMesh) {
          node.material.shininess = 85;
          node.scale.set(1.4, 1.4, 1.4);
          node.position.set(0, 0, -3);
          node.castShadow = true;
					node.receiveShadow = true;
  const material = node.material;
  material.transparent = true;  
  material.opacity = 0.5; 

 material.emissive = new THREE.Color(0xada9e5);
// material.emissive = new THREE.Color(0x484573); 
   // set the emissive color to white
  material.emissiveIntensity = 1; // adj
        }
      });
     
  });


  // Set the camera position
  camera.position.z = 5;

  window.addEventListener('resize', onWindowResize);

}

let currentGlb = gltf2;
let gltf4Count = 0; // Counter for gltf4 appearances

function onDocumentMouseDown(event) {
  // Set the mouse position
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

// Perform the raycast
raycaster.setFromCamera(mouse, camera);

const intersectObjects = [];

//if (tim.visible) {
 // intersectObjects.push(tim);
//}

if (tim1.visible) {
  intersectObjects.push(tim1);
}

const intersects = raycaster.intersectObjects(intersectObjects, true);

  // Check if the mouse clicked on the tim.glb model
  if (intersects.length > 0) {
    // Get the first intersection point
    const intersection = intersects[0];

    // Calculate the position and rotation of the new object
    const position = intersection.point.clone();
    const normal = intersection.face.normal.clone();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    // Create a clone of the current GLTF model
    if (currentGlb) {
      const clone = currentGlb.clone();
      // Set the position and rotation of the clone based on the mouse click
      clone.position.copy(position);
      clone.quaternion.copy(quaternion);
      scene.add(clone);

      // Increment the gltf4Count if gltf4 is cloned
      if (currentGlb === gltf4) {
        gltf4Count++;
      }
    }
  }

}

setInterval(() => {
  if (currentGlb === gltf2) {
    currentGlb = gltf3;
    scene.remove(gltf2);
    scene.add(gltf3);
  } else if (currentGlb === gltf3) {
    if (gltf4Count < 10) {
      currentGlb = gltf4;
      scene.remove(gltf3);
      scene.add(gltf4);
    } else {
      currentGlb = gltf2;
      scene.remove(gltf3);
      scene.add(gltf2);
    }
  } else {
    currentGlb = gltf2;
    scene.remove(gltf4);
    scene.add(gltf2);
  }
}, 400);


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  composer.render();
}

animate();

// Function to handle window resizing
function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
}
// Remove GSAP and use CSS classes for animation
document.addEventListener('DOMContentLoaded', () => {
  const animateElements = [
    document.querySelector('.a4'),
    document.querySelector('.a2'),
    document.querySelector('.a1'),
  ];
  animateElements.forEach(el => {
    if (el) {
      el.classList.add('fade-in-up', 'show');
    }
  });
});

document.addEventListener("DOMContentLoaded", function(){
  var aboutBtn = document.getElementById("aboutProjectBtn");
  if(aboutBtn){
    aboutBtn.addEventListener("click", showAlert);
  }
  var overlay = document.getElementById("overlay");
  if(overlay) {
    overlay.addEventListener("click", hideAlert);
  }
});


/////

const toggleButton = document.getElementById('toggleButton');
const hiddenDiv = document.getElementById('gui');

toggleButton.addEventListener('change', function() {
  if (toggleButton.checked) {
    hiddenDiv.style.visibility = 'hidden';
  } else {
    hiddenDiv.style.visibility = 'visible';
  }
});


/////


  // Add event listener to refresh button
document.getElementById('refreshButton').addEventListener('click', () => {
	location.reload();
  });
  


  


   



/////
function showAlert() {
  var popDiv = document.getElementById('pop');
  var popup = document.getElementById('popup');
  var overlay = document.getElementById('overlay');
  if(popDiv) {
    popDiv.style.display = 'block';
    popDiv.style.zIndex = '10000';
  }
  if(overlay) {
    overlay.style.display = 'block';
    overlay.style.zIndex = '10001';
  }
  if(popup) {
    popup.style.display = 'block';
    popup.style.zIndex = '10002';
  }
}
function hideAlert() {
  var popDiv = document.getElementById('pop');
  var popup = document.getElementById('popup');
  var overlay = document.getElementById('overlay');
  if(overlay) overlay.style.display = 'none';
  if(popup) popup.style.display = 'none';
  if(popDiv) {
    popDiv.style.display = '';
    popDiv.style.zIndex = '';
  }
}

/////

document.addEventListener('touchmove', function(event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });




const canvas1 = document.getElementById('scribbleCanvas');
const ctx = canvas1.getContext('2d');
const videoElement = document.querySelector('.input_video');
const headRectangle = document.getElementById("headRectangle");
const starContainer = document.getElementById("starContainer");
const starCount = 8; // Number of static stars
const maxBlinkInterval = 500; // Maximum interval for random position update


    const scribbles = []; // Store the scribbles
    const numScribbles = 4; // Number of scribbles to create
    const movementThreshold = 20; // Minimum distance to trigger rotation
    let latestColor1 = 'rgba(112, 112, 112, 1)'; 
    let lastHeadPosition = { x: null, y: null };
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
  });

  faceMesh.onResults(onResults);

  const mediapipeCam = new Camera(videoElement, {
      onFrame: async () => {
          await faceMesh.send({ image: videoElement });
      },
      width: window.width,
      height: window.height
  });
  mediapipeCam.start();


function createStar() {
  const star = document.createElement("div");
  star.classList.add("star");

  // Set initial random position
  randomizeStarPosition(star);

  // Append the star to the container
  starContainer.appendChild(star);

  // Randomize blinking interval for each star
  setInterval(() => {
      randomizeStarPosition(star);
  }, Math.random() * maxBlinkInterval);
}

// Function to randomize position
function randomizeStarPosition(star) {
  const posX = Math.random() * window.innerWidth;
  const posY = Math.random() * window.innerHeight;
  const size = Math.random() * 20 + 20; // Star size between 3px and 8px

  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.left = `${posX}px`;
  star.style.top = `${posY}px`;
}

// Initialize stars on page load
function initializeStars() {
  for (let i = 0; i < starCount; i++) {
      createStar();
  }
}


    function initializeScribbles() {
        for (let i = 0; i < numScribbles; i++) {
            scribbles.push({
                startX: Math.random() * canvas1.width,
                startY: Math.random() * canvas1.height,
                angle: Math.random() * Math.PI * 2, // Random angle
            });
        }
        drawScribbles();
    }


    function onResults(results) {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const faceLandmarks = results.multiFaceLandmarks[0];
          const leftEyeLandmark = faceLandmarks[33];
          
          const scaledPosition = getScaledPosition(leftEyeLandmark);
          // Get the position of the left eye (landmark 33)
          const leftEyeX = faceLandmarks[33].x * canvas1.width;
          const leftEyeY = faceLandmarks[33].y * canvas1.height; // Invert y-coordinate to match canvas
  
          // Update the rectangle position to follow the left eye
          updateRectanglePosition(scaledPosition.x, scaledPosition.y);
  
          // Use a central face point (like the nose at index 1) to track head movement
          const currentHeadPosition = {
              x: faceLandmarks[1].x * canvas1.width,
              y: faceLandmarks[1].y * canvas1.height, // Invert y-coordinate
          };
          
          // Check if the head has moved significantly
          const distance = Math.sqrt(Math.pow(currentHeadPosition.x - (lastHeadPosition.x || 0), 2) + 
                                     Math.pow(currentHeadPosition.y - (lastHeadPosition.y || 0), 2));
  
          if (distance > movementThreshold) {
              // Rotate the scribbles randomly
              rotateScribbles();
              drawScribbles();
              lastHeadPosition = currentHeadPosition; // Update the last head position
          }
      }
  }

  function getScaledPosition(landmark) {
    // Adjust for mirrored video by inverting the x-coordinate
    const x = (1 - landmark.x) * videoElement.clientWidth;
    const y =  landmark.y * videoElement.clientHeight; // Invert y-coordinate
    return { x, y };
}

function updateRectanglePosition(x, y) {
    // Get the viewport boundaries for the rectangle dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rectWidth = headRectangle.offsetWidth;
    const rectHeight = headRectangle.offsetHeight;

    // Clamp x and y within the viewport
    const clampedX = Math.max(rectWidth / 2, Math.min(x, viewportWidth - rectWidth / 2));
    const clampedY = Math.max(rectHeight / 2, Math.min(y, viewportHeight - rectHeight / 2));

    headRectangle.style.left = `${clampedX}px`;
    headRectangle.style.top = `${clampedY}px`;
}

function rotateScribbles() {
    scribbles.forEach(scribble => {
        // Add a random angle between -30 and 30 degrees to the current angle
        scribble.angle += (Math.random() * 60 - 30) * (Math.PI / 180); // Convert degrees to radians
    });
}

function throttle(fn, limit) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn.apply(this, args);
    }
  };
}

const throttledRedraw = throttle(function() {
  rotateScribbles();
  drawScribbles();
}, 50); // Max 20 fps


function changeColor() {
  var colorInput = document.getElementById("colorPicker5");
  var color = colorInput.value;
  var rgb = hexToRgb(color);

  latestColor1 = 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 1)';
  ctx.shadowColor = latestColor1; 
  drawScribbles(); // Redraw scribbles with new color
}




function drawScribbles() {
  // Clear the canvas before drawing
  ctx.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'; // Glow color (white, semi-transparent)
  ctx.shadowBlur = 20;
  scribbles.forEach(scribble => {
      var numLines = 100; // Lower line count for speed
      var radius = 2;

      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';

      var startX = scribble.startX;
      var startY = scribble.startY;
      var angle = scribble.angle;

      for (var i = 0; i < numLines; i++) {
          var x2 = startX + Math.sin(angle) * radius;
          var y2 = startY + Math.cos(angle) * radius;

          ctx.globalAlpha = i / numLines;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          startX = x2;
          startY = y2;
          angle += Math.random() * 2 - 1; // Slight variation in angle
          radius += Math.random() * 40 - 20;

          radius = Math.max(1, Math.min(radius, 20));
      }
  });
   // Reset shadow settings to avoid affecting other drawings
   ctx.shadowColor = 'transparent';
   ctx.shadowBlur = 0;
}



function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.3); // Cap DPR for perf
  canvas1.width = window.innerWidth * dpr;
  canvas1.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  drawScribbles(); // Redraw scribbles after resizing
}

// Set initial canvas size and initialize scribbles
resizeCanvas();
initializeScribbles(); 
initializeStars();
// Create initial scribbles

// Adjust on window resize
window.addEventListener('resize', throttledRedraw);

