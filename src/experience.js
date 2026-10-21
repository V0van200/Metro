import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
const coarse = matchMedia('(pointer: coarse)').matches;
export const experience = { paused: reduceQuery.matches, quality: 'auto', intensity: 1, reduced: reduceQuery.matches };
const panel = document.createElement('aside');
panel.className = 'experience-controls';
panel.setAttribute('aria-label', 'Настройки визуальных эффектов');
panel.innerHTML = `<button class="fx-toggle" aria-expanded="false" aria-controls="fx-settings"><span class="fx-led"></span> Эффекты <span>✳</span></button><div id="fx-settings" hidden><span class="small-label">РЕЖИССУРА ВАШЕГО ПРОСМОТРА</span><label>Качество<select aria-label="Качество графики"><option value="auto">Авто</option><option value="cinema">Кино</option><option value="light">Лёгкий</option></select></label><label>Интенсивность<input aria-label="Интенсивность эффектов" type="range" min="0.25" max="1.5" step="0.05" value="1"></label><button class="fx-pause"></button><p>Кино: больше частиц и свечение.<br>Прокрутка всегда остаётся под вашим контролем.</p></div>`;
document.body.append(panel);
const pauseButton = panel.querySelector('.fx-pause');
function publish() {
  document.body.classList.toggle('fx-paused', experience.paused);
  pauseButton.textContent = experience.paused ? '▶ Включить движение' : 'Ⅱ Остановить движение';
  pauseButton.setAttribute('aria-pressed', String(experience.paused));
  dispatchEvent(new CustomEvent('metro:effects', { detail: { ...experience } }));
}
panel.querySelector('.fx-toggle').onclick = e => {
  const btn = e.currentTarget, expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded)); panel.querySelector('#fx-settings').hidden = expanded;
};
pauseButton.onclick = () => { experience.paused = !experience.paused; publish(); };
panel.querySelector('select').onchange = e => { experience.quality = e.target.value; publish(); };
panel.querySelector('input').oninput = e => { experience.intensity = Number(e.target.value); publish(); };
reduceQuery.addEventListener('change', e => { experience.reduced = e.matches; experience.paused = e.matches; publish(); });
addEventListener('metro:pause', e => { experience.paused = e.detail; publish(); });
publish();

// Split only decorative heading copies. A single accessible heading remains intact.
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.section h2, .intro p, .why-grid article, .timeline article, .recipe, .real-store figure, .section-top').forEach((element, i) => {
  element.classList.add('fx-reveal'); element.style.setProperty('--reveal-delay', `${(i % 3) * 90}ms`); revealObserver.observe(element);
});
document.querySelectorAll('.arrival-title h1, .hero-copy h1').forEach(heading => {
  const text = heading.textContent; heading.setAttribute('aria-label', text);
  [...heading.childNodes].forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const span = document.createElement('span'); span.className = 'title-line'; span.setAttribute('aria-hidden','true');
      const inner = document.createElement('span'); inner.textContent = node.textContent; span.append(inner); node.replaceWith(span);
    } else if (node.nodeName === 'EM') { node.classList.add('title-line'); node.setAttribute('aria-hidden','true'); const inner = document.createElement('span'); inner.textContent = node.textContent; node.replaceChildren(inner); }
  });
});

// Pointer effects are deliberately absent on touch: scrolling remains a native gesture.
if (!coarse) {
  const cursor = document.createElement('div'); cursor.className = 'light-cursor'; cursor.setAttribute('aria-hidden', 'true'); document.body.append(cursor);
  addEventListener('pointermove', e => { if (!experience.paused) { cursor.style.setProperty('--px', `${e.clientX}px`); cursor.style.setProperty('--py', `${e.clientY}px`); } }, {passive:true});
  document.querySelectorAll('.recipe,.journal-card,.map-art').forEach(card => {
    card.classList.add('tilt-surface');
    card.addEventListener('pointermove', e => {
      if (experience.paused) return;
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.setProperty('--tilt-x', `${-y*7}deg`);card.style.setProperty('--tilt-y', `${x*9}deg`);
      card.style.setProperty('--shine-x', `${(x+.5)*100}%`);card.style.setProperty('--shine-y', `${(y+.5)*100}%`);
    });
    card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')});
  });
}
const pageProgress=document.createElement('div');pageProgress.className='page-progress';pageProgress.setAttribute('aria-hidden','true');document.body.append(pageProgress);
let scrollQueued=false;
function scrollEffects(){
  scrollQueued=false;const total=document.documentElement.scrollHeight-innerHeight;
  pageProgress.style.transform=`scaleX(${total>0?scrollY/total:0})`;
  if(experience.paused)return;
  document.querySelectorAll('.ticker').forEach(e=>{const r=e.getBoundingClientRect();e.style.setProperty('--ticker-shift',`${Math.max(-200,Math.min(200,-r.top*.13))}px`)});
  const inside=document.querySelector('.inside'),r=inside.getBoundingClientRect();
  if(r.top<innerHeight&&r.bottom>0)inside.style.setProperty('--inside-drift',`${(r.top/innerHeight)*35}px`);
}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(scrollEffects)}},{passive:true});
scrollEffects();

const mount=document.querySelector('#immersion-canvas');
const section=document.querySelector('#immersion');
const status=document.querySelector('.immersion-status');
if(mount) {
  try { createImmersion(); }
  catch(error) { mount.classList.add('canvas-unavailable');status.textContent='Статичная версия · WebGL недоступен';console.warn('Immersion fallback:',error.message); }
}
function createImmersion(){
  const renderer=new THREE.WebGLRenderer({alpha:false,antialias:false,powerPreference:'high-performance'});
  renderer.setClearColor(0x04101e);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  mount.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x04101e,.018);
  const camera=new THREE.PerspectiveCamera(46,1,.1,100);camera.position.set(0,.2,13);
  const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
  const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.65,.35,1.1);composer.addPass(bloom);composer.addPass(new OutputPass());
  scene.add(new THREE.HemisphereLight(0xcce6ff,0x12192d,2.8));
  const warm=new THREE.PointLight(0xffb44a,80,30);warm.position.set(-3,4,4);scene.add(warm);
  const blue=new THREE.PointLight(0x3479ff,65,30);blue.position.set(4,-1,1);scene.add(blue);
  const white=new THREE.DirectionalLight(0xffffff,3);white.position.set(1,5,6);scene.add(white);
  const universe=new THREE.Group();scene.add(universe);
  const ringMaterial=new THREE.MeshStandardMaterial({color:0xd6a953,emissive:0xffbd51,emissiveIntensity:1.5,metalness:.65,roughness:.23});
  const rings=[];
  for(let i=0;i<7;i++){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(3.9+i*.07,.018,8,120),ringMaterial);
    ring.position.z=-i*3;ring.rotation.x=.15*Math.sin(i);universe.add(ring);rings.push(ring);
    const ticks=new THREE.Group();
    for(let j=0;j<16;j++){const tick=new THREE.Mesh(new THREE.BoxGeometry(.015,.12,.015),ringMaterial);const angle=j*Math.PI/8;tick.position.set(Math.cos(angle)*4,Math.sin(angle)*4,ring.position.z);tick.rotation.z=angle-Math.PI/2;ticks.add(tick)}
    universe.add(ticks);
  }
  const particleCount=coarse?550:1500;
  const points=new Float32Array(particleCount*3);
  for(let i=0;i<particleCount;i++){const a=i*2.39996,r=2.7+(Math.sin(i*17.71)*.5+.5)*7;points[i*3]=Math.cos(a)*r;points[i*3+1]=Math.sin(a)*r;points[i*3+2]=-(i/particleCount)*35+7}
  const particleGeometry=new THREE.BufferGeometry();particleGeometry.setAttribute('position',new THREE.BufferAttribute(points,3));
  const particles=new THREE.Points(particleGeometry,new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{time:{value:0},strength:{value:1}},vertexShader:`uniform float time; varying float twinkle; void main(){ vec3 p=position; p.x+=sin(time*.25+position.z)*.1; twinkle=.45+.55*sin(position.x*4.+time); vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=clamp(38./-mv.z,1.,7.); gl_Position=projectionMatrix*mv; }`,fragmentShader:`uniform float strength; varying float twinkle; void main(){ float d=length(gl_PointCoord-.5); float alpha=smoothstep(.5,.08,d)*twinkle; gl_FragColor=vec4(vec3(1.,.72,.32)*strength,alpha); }`}));
  scene.add(particles);
  // A shader floor gives the fly-through a coherent architectural scale.
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:{value:0}},vertexShader:`varying vec2 uvWorld; void main(){uvWorld=uv*45.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 uvWorld; uniform float time; void main(){vec2 line=abs(fract(uvWorld-.5)-.5)/fwidth(uvWorld);float grid=1.-min(min(line.x,line.y),1.);float sweep=pow(max(0.,1.-abs(fract(uvWorld.y*.08-time*.06)-.5)*2.),12.);gl_FragColor=vec4(.12,.32,.65,grid*(.12+sweep*.35));}`}));
  floor.rotation.x=-Math.PI/2;floor.position.set(0,-3.2,-10);scene.add(floor);
  const food=new THREE.Group();scene.add(food);
  const tomatoMat=new THREE.MeshPhysicalMaterial({color:0xdb321c,roughness:.28,clearcoat:.8,clearcoatRoughness:.18});
  const leafMat=new THREE.MeshStandardMaterial({color:0x438528,roughness:.42,side:THREE.DoubleSide});
  const pastaMat=new THREE.MeshStandardMaterial({color:0xf2c05c,roughness:.3,metalness:.05});
  const ingredients=[];const sphereGeometry=new THREE.SphereGeometry(1,28,20);
  for(let i=0;i<9;i++){
    const tomato=new THREE.Group();const body=new THREE.Mesh(sphereGeometry,tomatoMat);body.scale.set(.34,.29,.34);tomato.add(body);
    for(let j=0;j<5;j++){const leaf=new THREE.Mesh(sphereGeometry,leafMat);leaf.scale.set(.035,.2,.018);leaf.position.set(Math.sin(j*1.256)*.1,.29,Math.cos(j*1.256)*.1);leaf.rotation.set(.7,j*1.256,.6);tomato.add(leaf)}
    const a=i*2.399;tomato.userData.base=new THREE.Vector3(Math.cos(a)*(1.25+i%2*.3),Math.sin(a)*1.3,(i%3-1)*.7);tomato.position.copy(tomato.userData.base);food.add(tomato);ingredients.push(tomato);
  }
  for(let i=0;i<13;i++){
    const shape=new THREE.Shape();shape.moveTo(0,-.5);shape.bezierCurveTo(-.5,-.2,-.4,.35,0,.65);shape.bezierCurveTo(.4,.35,.5,-.2,0,-.5);
    const geometry=new THREE.ShapeGeometry(shape,12);const pos=geometry.attributes.position;
    for(let j=0;j<pos.count;j++)pos.setZ(j,Math.sin(pos.getY(j)*3)*.09);geometry.computeVertexNormals();
    const leaf=new THREE.Mesh(geometry,leafMat);const a=i*2.399+1;leaf.userData.base=new THREE.Vector3(Math.cos(a)*1.9,Math.sin(a)*1.8,Math.sin(i)*.8);leaf.position.copy(leaf.userData.base);leaf.rotation.set(i*.1,i*.35,a);leaf.scale.setScalar(.55);food.add(leaf);ingredients.push(leaf);
  }
  const pastaGroup=new THREE.Group();food.add(pastaGroup);
  for(let j=0;j<18;j++){
    const path=[];for(let i=0;i<=80;i++){const t=i/80,a=t*Math.PI*5+j*.36;path.push(new THREE.Vector3(Math.cos(a)*(.55+j%3*.04),1-t*2,Math.sin(a)*(.55+j%3*.04)))}
    pastaGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path),85,.035,6,false),pastaMat));
  }
  const plate=new THREE.Mesh(new THREE.CylinderGeometry(2.1,1.5,.12,72),new THREE.MeshPhysicalMaterial({color:0xf7edda,roughness:.2,clearcoat:1}));plate.position.y=-2.5;food.add(plate);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(1.98,.045,10,90),new THREE.MeshStandardMaterial({color:0xe3b35b,metalness:.8,roughness:.2}));rim.rotation.x=Math.PI/2;rim.position.y=-2.42;food.add(rim);
  // Instancing keeps dozens of animated seasoning fragments in one draw call.
  const flakes=new THREE.InstancedMesh(new THREE.OctahedronGeometry(.035),pastaMat,80);food.add(flakes);const dummy=new THREE.Object3D();
  for(let i=0;i<80;i++){const a=i*2.399;dummy.position.set(Math.cos(a)*(1+i%5*.25),Math.sin(a)*(1+i%7*.15),Math.sin(i*4)*1.5);dummy.rotation.set(i,i*.4,i*.2);dummy.updateMatrix();flakes.setMatrixAt(i,dummy.matrix)}
  mount.tabIndex=0;mount.setAttribute('role','group');mount.setAttribute('aria-label','Вращение 3D-композиции: стрелки влево и вправо; Home — исходное положение');
  const drag={x:0,y:0,targetX:0,targetY:0,down:false,startX:0};let userSpin=0;mount.addEventListener('keydown',e=>{if(experience.paused)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();userSpin+=e.key==='ArrowLeft'?-.25:.25}else if(e.key==='Home'){e.preventDefault();userSpin=0}});
  renderer.domElement.addEventListener('pointerdown',e=>{drag.down=true;drag.startX=e.clientX;renderer.domElement.setPointerCapture(e.pointerId)});
  renderer.domElement.addEventListener('pointermove',e=>{if(experience.paused)return;const r=mount.getBoundingClientRect();drag.targetX=((e.clientX-r.left)/r.width-.5)*.7;drag.targetY=((e.clientY-r.top)/r.height-.5)*.35;if(drag.down){userSpin+=(e.clientX-drag.startX)*.007;drag.startX=e.clientX}});
  const endDrag=()=>{drag.down=false;drag.targetX=0;drag.targetY=0};renderer.domElement.addEventListener('pointerup',endDrag);renderer.domElement.addEventListener('pointercancel',endDrag);renderer.domElement.addEventListener('pointerleave',()=>{if(!drag.down)endDrag()});
  const phases=[['01 / ИМПУЛЬС','Всё начинается<br>с <em>искры.</em>'],['02 / ИНГРЕДИЕНТЫ','Каждая деталь —<br><em>на своём месте.</em>'],['03 / ПРЕВРАЩЕНИЕ','Соберите<br><em>свой вкус.</em>']];
  let phase=-1,progress=0,smoothed=0,time=0,last=0,visible=false,dirty=true,frameCount=0,frameSum=0,adaptiveScale=1;
  function settings(){
    const light=experience.quality==='light';const cinema=experience.quality==='cinema';
    const ratio=light?1:Math.min(devicePixelRatio,cinema?2:coarse?1.25:1.6)*adaptiveScale;
    renderer.setPixelRatio(ratio);composer.setPixelRatio(ratio);bloom.enabled=!light;bloom.strength=(cinema?.85:.5)*experience.intensity;
    particleGeometry.setDrawRange(0,light?Math.floor(particleCount*.3):particleCount);status.textContent=light?'ЛЁГКИЙ РЕЖИМ':cinema?'CINEMA / BLOOM + PARTICLES':'THREE.JS / LIVE EXPERIENCE';dirty=true;
  }
  function resize(){const w=mount.clientWidth,h=mount.clientHeight;renderer.setSize(w,h);composer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();dirty=true}
  new ResizeObserver(resize).observe(mount);addEventListener('metro:effects',()=>{settings();resize()});settings();resize();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;dirty=true},{rootMargin:'100px'}).observe(section);
  function updateProgress(){const r=section.getBoundingClientRect();progress=Math.max(0,Math.min(1,-r.top/(section.offsetHeight-innerHeight)));dirty=true}
  addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
  document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>{
    const target=Number(b.dataset.chapter);const top=section.getBoundingClientRect().top+scrollY;
    scrollTo({top:top+target*(section.offsetHeight-innerHeight),behavior:experience.paused?'instant':'smooth'});
  });
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();visible=false;mount.classList.add('canvas-unavailable');status.textContent='3D приостановлено · обновите страницу для восстановления'});
  function render(now){
    requestAnimationFrame(render);const dt=Math.min((now-last)/1000,.05);last=now;
    if(!visible||document.hidden)return;
    if(experience.paused&&!dirty)return;
    if(!experience.paused){time+=dt;smoothed+=(progress-smoothed)*Math.min(dt*5,1);drag.x+=(drag.targetX-drag.x)*.06;drag.y+=(drag.targetY-drag.y)*.06;}else smoothed=progress;
    const p=smoothed;const nextPhase=p<.3?0:p<.68?1:2;
    if(nextPhase!==phase){phase=nextPhase;section.querySelector('.immersion-kicker').textContent=phases[phase][0];section.querySelector('.immersion-copy h2').innerHTML=phases[phase][1];section.querySelector('.immersion-copy').classList.remove('chapter-change');void section.offsetWidth;section.querySelector('.immersion-copy').classList.add('chapter-change');document.querySelectorAll('[data-chapter]').forEach((b,i)=>{b.classList.toggle('active',i===phase);b.setAttribute('aria-pressed',String(i===phase))})}
    section.style.setProperty('--scene-progress',p);
    // Camera pushes through the portal while the ingredients expand and reassemble.
    const mobile=mount.clientWidth<700;camera.position.set(drag.x*.7,drag.y*.5+(p>.7?(p-.7)*3:0),(mobile?17:13)-p*3);camera.lookAt(mobile?0:-.55,0,0);
    universe.position.z=p*6;universe.rotation.z=experience.paused?0:Math.sin(time*.12)*.08;
    rings.forEach((r,i)=>{r.rotation.z=time*(i%2?.07:-.07);r.scale.setScalar(1+Math.sin(time*.6+i)*.015*experience.intensity)});
    const explosion=(Math.sin(Math.min(p/.72,1)*Math.PI)*1.6)*experience.intensity;
    food.position.x=mobile?0:1.1;food.position.y=mobile?-1.3:0;food.rotation.y=userSpin+(experience.paused?0:time*.12)+p*Math.PI*.9;food.rotation.z=Math.sin(time*.3)*.04;
    ingredients.forEach((o,i)=>{o.position.copy(o.userData.base).multiplyScalar(1+explosion);o.position.y+=Math.sin(time*.7+i)*.09*experience.intensity;o.rotation.y=time*.2+i});
    pastaGroup.scale.setScalar(.8+p*.25);pastaGroup.rotation.z=-.2+p*.4;
    plate.position.y=-2.9+p*.8;rim.position.y=plate.position.y+.08;flakes.rotation.y=-time*.1;flakes.scale.setScalar(1+explosion*.5);
    particles.material.uniforms.time.value=time;particles.material.uniforms.strength.value=experience.intensity;particles.rotation.z=time*.015;particles.position.z=(time*.45)%5;
    floor.material.uniforms.time.value=time;warm.intensity=65+Math.sin(time)*10*experience.intensity;
    composer.render();dirty=false;
    // Auto mode reduces resolution after sustained slow frames, never increases work mid-scroll.
    if(experience.quality==='auto'&&!experience.paused&&dt>0){frameSum+=dt;frameCount++;if(frameCount===120){if(frameSum/frameCount>.029&&adaptiveScale>.65){adaptiveScale=Math.max(.65,adaptiveScale-.15);settings();resize()}frameCount=0;frameSum=0}}
  }
  requestAnimationFrame(render);
}
