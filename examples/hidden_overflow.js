
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';

import ThreeMeshUI from '../src/three-mesh-ui.js';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls,
	scrollableContainer, textContainer;

window.addEventListener('load', init );
window.addEventListener('resize', onWindowResize );

//

function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x505050 );

	camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.1, 100 );
	camera.position.set( 0, 1.6, 0 );
	camera.lookAt( 0, 1, -1.8 );

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.localClippingEnabled = true;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	renderer.xr.enabled = true;
	document.body.appendChild(VRButton.createButton(renderer));
	document.body.appendChild( renderer.domElement );

	controls = new OrbitControls( camera, renderer.domElement );
	camera.position.set( 0, 1.6, 0 );
	controls.target = new THREE.Vector3( 0, 1, -1.8 );
	controls.update();

	// ROOM

	const room = new THREE.LineSegments(
		new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
		new THREE.LineBasicMaterial( { color: 0x808080 } )
	);

	scene.add( room );

	// TEXT PANEL

	makeTextPanel();

	//

	renderer.setAnimationLoop( loop );

};

//

function makeTextPanel() {

	scrollableContainer = ThreeMeshUI.Block({
		height: 0.7,
		width: 0.6,
		padding: 0.05,
		justifyContent: 'center',
		alignContent: 'center',
		fontFamily: './assets/Roboto-msdf.json',
		fontTexture: './assets/Roboto-msdf.png'
	});

	scrollableContainer.position.set( 0, 1, -1.8 );
	scrollableContainer.rotation.x = -0.55;
	scene.add( scrollableContainer );

	//

	textContainer = ThreeMeshUI.Block({
		width: 1.4,
		height: 1.2,
		padding: 0.03,
		justifyContent: 'center'
	});

	scrollableContainer.add( textContainer );

	let counter = 0;

	//

	textContainer.add(

		ThreeMeshUI.Text({
			content: "hiddenOverflow = true | ".repeat( 30 ),
			fontSize: 0.07
		})

	);

};

// handles resizing the renderer when the viewport is resized

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
};

//

function loop() {

	scrollableContainer.position.x = Math.sin( Date.now() / 1500 ) * 0.3;
	scrollableContainer.position.y = (Math.cos( Date.now() / 1500 ) * 0.3) + 1;

	// textContainer.position.x = Math.sin( Date.now() / 1500 ) * 0.3;
	// textContainer.position.y = Math.cos( Date.now() / 1500 ) * 0.3;

	// Don't forget, ThreeMeshUI must be updated manually.
	// This has been introduced in version 3.0.0 in order
	// to improve performance
	ThreeMeshUI.update();

	controls.update();
	renderer.render( scene, camera );

};