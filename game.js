// Setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a dark background
scene.background = new THREE.Color(0x000000);

// Lighting: Add a point light to illuminate the nodes
const light = new THREE.PointLight(0xFFFFFF, 1, 100);
light.position.set(0, 0, 5); // Position the light in front of the scene
scene.add(light);

// Node class
class Node {
    constructor(x, y, z) {
        this.position = new THREE.Vector3(x, y, z);
        this.energy = Math.random() * 100; // Random energy for nodes
        this.connectivity = 0;
        this.intelligence = Math.random() * 100;
        this.age = 0;
        this.sphere = this.createNode();
    }

    createNode() {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`)
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(this.position.x, this.position.y, this.position.z);
        scene.add(sphere);
        return sphere;
    }

    update() {
        this.age += 0.01;
        this.energy -= 0.1; // Energy decreases over time
        if (this.energy <= 0) {
            scene.remove(this.sphere); // Remove node when energy is depleted
        }
        this.sphere.material.color.setHSL(this.energy / 100, 1, 0.5); // Change color based on energy
    }
}

// Node collection
let nodes = [];

// Function to create nodes based on mouse or touch input
function createNode(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    const z = Math.random() * 2 - 1; // Random z-position for 3D effect
    nodes.push(new Node(x * 10, y * 10, z * 10)); // Scale positions for better view
}

// Handle mouse movement for node creation
window.addEventListener('mousemove', createNode);

// Add an animation loop to update and render the scene
function animate() {
    requestAnimationFrame(animate);

    // Update all nodes
    nodes.forEach(node => node.update());

    // Render the scene from the camera's perspective
    renderer.render(scene, camera);
}

animate();

// Set the camera's initial position so we can see the nodes
camera.position.z = 10;

// Optional: Add controls to allow camera movement (like orbit controls) for better exploration