import * as dat from "lil-gui"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"

// /**
//  * Spector JS
//  */
// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.Spector()
// spector.displayUI()

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
	width: 400,
})

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("draco/")

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load("baked.jpg")
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// Portal light material
const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

/**
 * Model
 */
gltfLoader.load("portal.glb", (gltf) => {
	const bakedMesh = gltf.scene.children.find((child) => child.name === "baked")
	const portalLightMesh = gltf.scene.children.find(
		(child) => child.name === "portalLight"
	)
	const poleLightAMesh = gltf.scene.children.find(
		(child) => child.name === "poleLightA"
	)
	const poleLightBMesh = gltf.scene.children.find(
		(child) => child.name === "poleLightB"
	)

	bakedMesh.material = bakedMaterial
	portalLightMesh.material = portalLightMaterial
	poleLightAMesh.material = poleLightMaterial
	poleLightBMesh.material = poleLightMaterial

	scene.add(gltf.scene)
})

const pointsParams = {
	count: 500,
	size: 10,
}

// points
const positions = new Float32Array(pointsParams.count * 3)
for (let i = 0; i < positions.length / 3; i++) {
	const i3 = i * 3
	positions[i3 + 0] = (Math.random() - 0.5) * pointsParams.size * 3
	positions[i3 + 1] = (Math.random() - 0.5) * pointsParams.size
	positions[i3 + 2] = (Math.random() - 0.5) * pointsParams.size
}
const pointsGeometry = new THREE.BufferGeometry()
pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

const points = new THREE.Points(
	pointsGeometry,
	new THREE.PointsMaterial({
		size: 0.02,
	})
)
points.position.set(0, 5, -10)
scene.add(points)
/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	100
)
camera.position.x = 0
camera.position.y = 0.3
camera.position.z = 2.5

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.minAzimuthAngle = -0.25
controls.maxAzimuthAngle = 0.25
controls.minPolarAngle = 1.2
controls.maxPolarAngle = 1.4

/**
 *
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()
	controls.update()
	camera.lookAt(new THREE.Vector3(0, 1, -4))

	// Update controls

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
