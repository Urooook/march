import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import {Vector3} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const isMobile = window.innerWidth < 500;

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader);

let loadedGltf = null;
let mixer = null

const createGltf = (gltf, animationMotion = 11) => {
    console.log(gltf);
    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[animationMotion])
    // action.setLoop(THREE.LoopOnce)
    action.play()
    gltf.scene.castShadow = true
    gltf.scene.scale.set(1.5,1.5,1.5)
    gltf.scene.position.set(430, -20, -0.2)
    scene.add(gltf.scene)
}

gltfLoader.load(
    '/models/Person/model8.glb',
    (gltf) => {
        console.log(gltf)
        loadedGltf = gltf
        createGltf(gltf, 2)
    }
)


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture8 = textureLoader.load('textures/matcaps/8.png')
const matcapTexture7 = textureLoader.load('textures/matcaps/7.png')
const matcapTexture6 = textureLoader.load('textures/matcaps/6.png')
const matcapTexture5 = textureLoader.load('textures/matcaps/5.png')
const matcapTexture4 = textureLoader.load('textures/matcaps/4.png')
const matcapTexture3 = textureLoader.load('textures/matcaps/3.png')
const matcapTexture2 = textureLoader.load('textures/matcaps/2.png')
const matcapTexture1 = textureLoader.load('textures/matcaps/1.png')

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

camera.position.x = -15
camera.position.y = 35
camera.position.z = 50

camera.up.set(0, 1, 0)

scene.add(camera)

const objects = [];

const fontLoader = new THREE.FontLoader();

const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture8})
const material8 = new THREE.MeshMatcapMaterial({matcap: matcapTexture8})
const material7 = new THREE.MeshMatcapMaterial({matcap: matcapTexture7})
const material6 = new THREE.MeshMatcapMaterial({matcap: matcapTexture6})
const material5 = new THREE.MeshMatcapMaterial({matcap: matcapTexture5})
const material4 = new THREE.MeshMatcapMaterial({matcap: matcapTexture4})
const material3 = new THREE.MeshMatcapMaterial({matcap: matcapTexture3})
const material2 = new THREE.MeshMatcapMaterial({matcap: matcapTexture2})
const material1 = new THREE.MeshMatcapMaterial({matcap: matcapTexture1})
const materialNormal = new THREE.MeshNormalMaterial()

const entity = [
    {text: 'Любимый Мамырлик', position: new Vector3(0, 0, 20), material: material8},
    {text: `Поздравляю тебя
       с 8 марта!`, position: new Vector3(50, 10, 0), material: materialNormal, delay: 2000},
    {text: `Если бы успех компании измерялся в цветах,
     ты была бы целым весенним садом`, position: new Vector3(130, 0, 0), material: material5, isBig: true, delay: 5000},
    {text: `Желаю освоить перекантовку,
    тогда рванем в Шерегеш`, position: new Vector3(230, 20, 0), material: material8, delay: 5000},
    {text: `Желаю и диплом, и феррари(без икры)`, position: new Vector3(330, -40, -0), material: material4, delay: 5000, isBig: true},
    {text: `Много много денег)))`, position: new Vector3(430, 20, -30), material: material5, delay: 4000},
    {text: `Я тебя люблю)`, position: new Vector3(230, -40, -0), material: material8, delay: 5000, isBig: true},
    {text: 'Еще раз поздравляю !!!', position: new Vector3(430, -20, 0), material: material8,},
]

const getTextGeometry = (text, font) => {
    const textGeometry = new THREE.TextBufferGeometry(
        text, {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        }
    )
    textGeometry.center();
    return textGeometry;
}

const texts = [];


fontLoader.load(
    'fonts/Arial_Regular.json',
    (font) => {
        entity.forEach(({ position, text, material, isBig = false, delay = 1000 }) => {
           const  textGeometry = getTextGeometry(text, font);
           const mesh = new THREE.Mesh(textGeometry, material);
            mesh.position.set(position.x, position.y, position.z);
            texts.push({toPosition: mesh.position, isBig, delay});
            scene.add(mesh)
        });

       const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
       const boxGeometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5)

       for(let i = 0; i<150; i++){

        const donut = new THREE.Mesh(donutGeometry, materialNormal)
        scene.add(donut)
        objects.push(donut)
        donut.position.x = 430 + (Math.random() - 0.5) * 11
        donut.position.y = -20 + (Math.random() - 0.5) * 11
        donut.position.z = 0 - (Math.random() + 0.1) * 11

        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        donut.scale.set(scale, scale, scale)
    }

    for(let i = 0; i<150; i++){

        const box = new THREE.Mesh(boxGeometry, materialNormal)
        scene.add(box)
        objects.push(box)
        box.position.x = 430 + (Math.random() - 0.5) * 11
        box.position.y = -20 + (Math.random() - 0.5) * 11
        box.position.z = 0 - (Math.random() + 0.1) * 11

        box.rotation.x = Math.random() * Math.PI
        box.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        box.scale.set(scale, scale, scale)
    }
let isFirst = true;
    const isMobileQ = isMobile ? 3 : 1
function moveCamera({toPosition, isBig, delay}) {
    return new Promise(resolve => {
        const additionalX = 0;
        const additionalY = isBig ? 2 : 1;
        const additionalZ = isBig ? 8 : 5;

        gsap.to(camera.position, {
            x: toPosition.x + additionalX * isMobileQ,
            y: toPosition.y + (additionalY - 1)  * isMobileQ,
            z: toPosition.z  + additionalZ * isMobileQ,
            duration: 1,
            onComplete: () => {
                if(isFirst) {
                    isFirst = false;
                }
                setTimeout(resolve, delay); // Задержка 2 секунды
            },
            onUpdate: () => {
                if(!isFirst) {
                    controls.target.copy(camera.position);
                    controls.update()
                }
                camera.lookAt(toPosition);
            }
        });
    });
}


async function animateCamera() {
    for await (const text of texts) {
        await moveCamera(text);
    }
    // controls.target.copy(camera.position);
    // controls.update()
    controls.target.copy(new Vector3(430, -20, 0));
}

    animateCamera();
    }

)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// const pointLight = new THREE.PointLight(0xffffff, 0.8)
// pointLight.castShadow = true
// pointLight.position.set(3,3,3)
// scene.add(pointLight)

const pointLight = new THREE.PointLight( 0xffffff, 0.8, 100 );
pointLight.position.set( -1.4, 4.4, 2.8 );
scene.add( pointLight );

const pointLight1 = new THREE.PointLight( 0xffffff, 1, 100 );
pointLight1.position.set( -4.3, 8.7, 2.8 );
scene.add( pointLight1 );



/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */

window.addEventListener('resize', () =>
{
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


// gsap.to(camera.position, {
//     duration: 2,
//     x: 1,
//     y: 0,
//     z: 3
// } );



// // Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    for(let i =0; i<objects.length; i++){
        objects[i].rotation.x += 0.005
        objects[i].rotation.y += 0.005
        objects[i].rotation.z += 0.005
    }
    // Update controls
    // controls.target.copy(camera.position);

    controls.update()
    // camera.updateProjectionMatrix()
    mixer && mixer.update(deltaTime)


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()