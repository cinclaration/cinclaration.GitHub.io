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

// Connection class to draw lines between nodes
class Connection {
    constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.line = this.createLine();
    }

    createLine() {
        const geometry = new THREE.Geometry();
        geometry.vertices.push(this.node1.position);
        geometry.vertices.push(this.node2.position);
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        return line;
    }

    update() {
        this.line.geometry.vertices[0] = this.node1.position;
        this.line.geometry.vertices[1] = this.node2.position;
        this.line.geometry.verticesNeedUpdate = true;
    }
}

// Node collection and connections
let nodes = [];
let connections = [];

// Flower of Life pattern (simple 2D version for node placement)
function flowerOfLife(radius, numCircles, zLevel) {
    const points = [];
    const angleStep = Math.PI * 2 / numCircles;
    for (let i = 0; i < numCircles; i++) {
        const angle = i * angleStep;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        points.push(new THREE.Vector3(x, y, zLevel));
    }
    return points;
}

// Platonic Solid: Tetrahedron vertices as example
function platonicSolid() {
    return [
        new THREE.Vector3(1, 1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 1, -1),
        new THREE.Vector3(-1, -1, 1),
    ];
}

// Function to create nodes based on sacred geometry
function createSacredNodes() {
    // Flower of Life (2D) pattern with radius of 5 and 6 circles
    const flowerPoints = flowerOfLife(5, 6, 0);
    flowerPoints.forEach(point => {
        nodes.push(new Node(point.x, point.y, point.z));
    });

    // Platonic Solid (Tetrahedron) nodes
    const tetrahedronNodes = platonicSolid();
    tetrahedronNodes.forEach(point => {
        nodes.push(new Node(point.x * 3, point.y * 3, point.z * 3));
    });

    // Create connections between nodes (basic distance check)
    nodes.forEach((node, index) => {
        nodes.forEach((otherNode, otherIndex) => {
            if (index !== otherIndex) {
                const distance = node.position.distanceTo(otherNode.position);
                if (distance < 5) { // Create a connection if nodes are close enough
                    connections.push(new Connection(node, otherNode));
                }
            }
        });
    });
}

// Create nodes based on sacred geometry
createSacredNodes();

// Add an animation loop to update and render the scene
function animate() {
    requestAnimationFrame(animate);

    // Update all nodes
    nodes.forEach(node => node.update());

    // Update all connections
    connections.forEach(connection => connection.update());

    // Render the scene from the camera's perspective
    renderer.render(scene, camera);
}

animate();

// Set the camera's initial position so we can see the nodes
camera.position.z = 15;