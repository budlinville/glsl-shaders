const vshader = `
void main() {	
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position * 0.25, 1.0 );
}
`
const fshader = `
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform vec3 u_color;

void main (void) {
  vec2 mouse = u_mouse/u_resolution;  // x/y values of 0-1
  vec3 color = vec3(mouse.x, 0.0, mouse.y);
  //gl_FragColor = vec4(u_color, 1.0).grba;  // swizzle (swap) red and green values
  gl_FragColor = vec4(color, 1.0);
}
`






const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const clock = new THREE.Clock();

const geometry = new THREE.PlaneGeometry( 2, 2 );
const uniforms = {
  u_color: { value: new THREE.Color(0x00FF00) },
  u_time: { value: 0.0 },
  u_mouse: { value: { x: 0.0, y: 0.0 } },
  u_resolution: { value: { x: 0.0, y: 0.0 } }
}
 
const material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader
} );

const plane = new THREE.Mesh( geometry, material );
scene.add( plane );

camera.position.z = 1;

onWindowResize();

if ('ontouchstart' in window) {
  document.addEventListener('touchmove', move);
} else {
  window.addEventListener( 'resize', onWindowResize, false );  
  document.addEventListener('mousemove', move);
}


animate();

function move(e) {
  // use touches for mobile device
  uniforms.u_mouse.value.x = e.touches ? e.touches[0].clientX : e.clientX;
  uniforms.u_mouse.value.y = e.touches ? e.touches[0].clientY : e.clientY;
}

function onWindowResize( event ) {
  const aspectRatio = window.innerWidth/window.innerHeight;
  let width, height;
  if (aspectRatio>=1){
    width = 1;
    height = (window.innerHeight/window.innerWidth) * width;
  }else{
    width = aspectRatio;
    height = 1;
  }
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  if (uniforms.u_resolution !== undefined) {
    uniforms.u_resolution.value.x = window.innerWidth;
    uniforms.u_resolution.value.y = window.innerHeight;
  }
}

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}