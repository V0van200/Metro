import{A as e,B as t,C as n,D as r,E as i,F as a,I as o,L as s,M as c,N as l,P as u,R as d,S as f,T as ee,_ as p,a as te,b as ne,c as re,d as ie,f as m,g as h,h as ae,i as oe,j as se,k as ce,l as le,m as ue,n as de,o as g,p as _,r as fe,s as v,t as pe,u as y,v as me,w as he,x as ge,y as b,z as x}from"./index-BCIflEAW.js";var S={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},C=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},w=new f(-1,1,1,-1,0,1),T=new class extends oe{constructor(){super(),this.setAttribute(`position`,new y([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new y([0,2,0,0,2,0],2))}},E=class{constructor(e){this._mesh=new h(T,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,w)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},D=class extends C{constructor(t,n=`tDiffuse`){super(),this.textureID=n,this.uniforms=null,this.material=null,t instanceof e?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=s.clone(t.uniforms),this.material=new e({name:t.name===void 0?`unspecified`:t.name,defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new E(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},O=class extends C{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},_e=class extends C{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},ve=class{constructor(e,n){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),n===void 0){let r=e.getSize(new d);this._width=r.width,this._height=r.height,n=new t(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:_}),n.texture.name=`EffectComposer.rt1`}else this._width=n.width,this._height=n.height;this.renderTarget1=n,this.renderTarget2=n.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new D(S),this.copyPass.material.blending=0,this.timer=new u}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}O!==void 0&&(r instanceof O?n=!0:r instanceof _e&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new d);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},ye=class extends C{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new g}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},k={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new g(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},A=class n extends C{constructor(n,r=1,i,a){super(),this.strength=r,this.radius=i,this.threshold=a,this.resolution=n===void 0?new d(256,256):new d(n.x,n.y),this.clearColor=new g(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let o=Math.round(this.resolution.x/2),c=Math.round(this.resolution.y/2);this.renderTargetBright=new t(o,c,{type:_,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let n=new t(o,c,{type:_,depthBuffer:!1});n.texture.name=`UnrealBloomPass.h`+e,n.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(n);let r=new t(o,c,{type:_,depthBuffer:!1});r.texture.name=`UnrealBloomPass.v`+e,r.texture.generateMipmaps=!1,this.renderTargetsVertical.push(r),o=Math.round(o/2),c=Math.round(c/2)}let l=k;this.highPassUniforms=s.clone(l.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new e({uniforms:this.highPassUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}),this.separableBlurMaterials=[];let u=[6,10,14,18,22];o=Math.round(this.resolution.x/2),c=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(u[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new d(1/o,1/c),o=Math.round(o/2),c=Math.round(c/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=r,this.compositeMaterial.uniforms.bloomRadius.value=.1;let f=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=f,this.bloomTintColors=[new x(1,1,1),new x(1,1,1),new x(1,1,1),new x(1,1,1),new x(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=s.clone(S.uniforms),this.blendMaterial=new e({uniforms:this.copyUniforms,vertexShader:S.vertexShader,fragmentShader:S.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new g,this._oldClearAlpha=1,this._basic=new p,this._fsQuad=new E(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new d(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(e,t,r,i,a){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let s=this.renderTargetBright;for(let t=0;t<this.nMips;t++)this._fsQuad.material=this.separableBlurMaterials[t],this.separableBlurMaterials[t].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[t].uniforms.direction.value=n.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[t]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[t].uniforms.colorTexture.value=this.renderTargetsHorizontal[t].texture,this.separableBlurMaterials[t].uniforms.direction.value=n.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[t]),e.clear(),this._fsQuad.render(e),s=this.renderTargetsVertical[t];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(r),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(t){let n=[],r=t/3;for(let e=0;e<t;e++)n.push(.39894*Math.exp(-.5*e*e/(r*r))/r);let i=[],a=[];for(let e=1;e<t;e+=2){let r=n[e],o=e+1<t?n[e+1]:0,s=r+o;i.push((e*r+(e+1)*o)/s),a.push(s)}return new e({defines:{KERNEL_PAIRS:i.length},uniforms:{colorTexture:{value:null},invSize:{value:new d(.5,.5)},direction:{value:new d(.5,.5)},centerWeight:{value:n[0]},gaussianOffsets:{value:i},gaussianWeights:{value:a}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(t){return new e({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};A.BlurDirectionX=new d(1,0),A.BlurDirectionY=new d(0,1);var j={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},be=class extends C{constructor(){super(),this.isOutputPass=!0,this.uniforms=s.clone(j.uniforms),this.material=new r({name:j.name,uniforms:this.uniforms,vertexShader:j.vertexShader,fragmentShader:j.fragmentShader}),this._fsQuad=new E(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},v.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},M=matchMedia(`(prefers-reduced-motion: reduce)`),N=matchMedia(`(pointer: coarse)`).matches,P={paused:M.matches,quality:`auto`,intensity:1,reduced:M.matches},F=document.createElement(`aside`);F.className=`experience-controls`,F.setAttribute(`aria-label`,`Настройки визуальных эффектов`),F.innerHTML=`<button class="fx-toggle" aria-expanded="false" aria-controls="fx-settings"><span class="fx-led"></span> Эффекты <span>✳</span></button><div id="fx-settings" hidden><span class="small-label">РЕЖИССУРА ВАШЕГО ПРОСМОТРА</span><label>Качество<select aria-label="Качество графики"><option value="auto">Авто</option><option value="cinema">Кино</option><option value="light">Лёгкий</option></select></label><label>Интенсивность<input aria-label="Интенсивность эффектов" type="range" min="0.25" max="1.5" step="0.05" value="1"></label><button class="fx-pause"></button><p>Кино: больше частиц и свечение.<br>Прокрутка всегда остаётся под вашим контролем.</p></div>`,document.body.append(F);var I=F.querySelector(`.fx-pause`);function L(){document.body.classList.toggle(`fx-paused`,P.paused),I.textContent=P.paused?`▶ Включить движение`:`Ⅱ Остановить движение`,I.setAttribute(`aria-pressed`,String(P.paused)),dispatchEvent(new CustomEvent(`metro:effects`,{detail:{...P}}))}F.querySelector(`.fx-toggle`).onclick=e=>{let t=e.currentTarget,n=t.getAttribute(`aria-expanded`)===`true`;t.setAttribute(`aria-expanded`,String(!n)),F.querySelector(`#fx-settings`).hidden=n},I.onclick=()=>{P.paused=!P.paused,L()},F.querySelector(`select`).onchange=e=>{P.quality=e.target.value,L()},F.querySelector(`input`).oninput=e=>{P.intensity=Number(e.target.value),L()},M.addEventListener(`change`,e=>{P.reduced=e.matches,P.paused=e.matches,L()}),addEventListener(`metro:pause`,e=>{P.paused=e.detail,L()}),L();var R=new IntersectionObserver(e=>e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`revealed`),R.unobserve(e.target))}),{threshold:.12});if(document.querySelectorAll(`.section h2, .intro p, .why-grid article, .timeline article, .recipe, .real-store figure, .section-top`).forEach((e,t)=>{e.classList.add(`fx-reveal`),e.style.setProperty(`--reveal-delay`,`${t%3*90}ms`),R.observe(e)}),document.querySelectorAll(`.arrival-title h1, .hero-copy h1`).forEach(e=>{let t=e.textContent;e.setAttribute(`aria-label`,t),[...e.childNodes].forEach(e=>{if(e.nodeType===Node.TEXT_NODE){let t=document.createElement(`span`);t.className=`title-line`,t.setAttribute(`aria-hidden`,`true`);let n=document.createElement(`span`);n.textContent=e.textContent,t.append(n),e.replaceWith(t)}else if(e.nodeName===`EM`){e.classList.add(`title-line`),e.setAttribute(`aria-hidden`,`true`);let t=document.createElement(`span`);t.textContent=e.textContent,e.replaceChildren(t)}})}),!N){let e=document.createElement(`div`);e.className=`light-cursor`,e.setAttribute(`aria-hidden`,`true`),document.body.append(e),addEventListener(`pointermove`,t=>{P.paused||(e.style.setProperty(`--px`,`${t.clientX}px`),e.style.setProperty(`--py`,`${t.clientY}px`))},{passive:!0}),document.querySelectorAll(`.recipe,.journal-card,.map-art`).forEach(e=>{e.classList.add(`tilt-surface`),e.addEventListener(`pointermove`,t=>{if(P.paused)return;let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/n.width-.5,i=(t.clientY-n.top)/n.height-.5;e.style.setProperty(`--tilt-x`,`${-i*7}deg`),e.style.setProperty(`--tilt-y`,`${r*9}deg`),e.style.setProperty(`--shine-x`,`${(r+.5)*100}%`),e.style.setProperty(`--shine-y`,`${(i+.5)*100}%`)}),e.addEventListener(`pointerleave`,()=>{e.style.setProperty(`--tilt-x`,`0deg`),e.style.setProperty(`--tilt-y`,`0deg`)})})}var z=document.createElement(`div`);z.className=`page-progress`,z.setAttribute(`aria-hidden`,`true`),document.body.append(z);var B=!1;function V(){B=!1;let e=document.documentElement.scrollHeight-innerHeight;if(z.style.transform=`scaleX(${e>0?scrollY/e:0})`,P.paused)return;document.querySelectorAll(`.ticker`).forEach(e=>{let t=e.getBoundingClientRect();e.style.setProperty(`--ticker-shift`,`${Math.max(-200,Math.min(200,-t.top*.13))}px`)});let t=document.querySelector(`.inside`),n=t.getBoundingClientRect();n.top<innerHeight&&n.bottom>0&&t.style.setProperty(`--inside-drift`,`${n.top/innerHeight*35}px`)}addEventListener(`scroll`,()=>{B||(B=!0,requestAnimationFrame(V))},{passive:!0}),V();var H=document.querySelector(`#immersion-canvas`),U=document.querySelector(`#immersion`),W=document.querySelector(`.immersion-status`);if(H)try{G()}catch(e){H.classList.add(`canvas-unavailable`),W.textContent=`Статичная версия · WebGL недоступен`,console.warn(`Immersion fallback:`,e.message)}function G(){let t=new pe({alpha:!1,antialias:!1,powerPreference:`high-performance`});t.setClearColor(266270),t.toneMapping=4,t.toneMappingExposure=1.1,H.append(t.domElement),t.domElement.setAttribute(`aria-hidden`,`true`);let r=new ce;r.fog=new ie(266270,.018);let s=new n(46,1,.1,100);s.position.set(0,.2,13);let u=new ve(t);u.addPass(new ye(r,s));let f=new A(new d(1,1),.65,.35,1.1);u.addPass(f),u.addPass(new be),r.add(new ue(13428479,1186093,2.8));let p=new ee(16757834,80,30);p.position.set(-3,4,4),r.add(p);let g=new ee(3439103,65,30);g.position.set(4,-1,1),r.add(g);let _=new le(16777215,3);_.position.set(1,5,6),r.add(_);let v=new m;r.add(v);let y=new b({color:14068051,emissive:16760145,emissiveIntensity:1.5,metalness:.65,roughness:.23}),S=[];for(let e=0;e<7;e++){let t=new h(new a(3.9+e*.07,.018,8,120),y);t.position.z=-e*3,t.rotation.x=.15*Math.sin(e),v.add(t),S.push(t);let n=new m;for(let e=0;e<16;e++){let r=new h(new de(.015,.12,.015),y),i=e*Math.PI/8;r.position.set(Math.cos(i)*4,Math.sin(i)*4,t.position.z),r.rotation.z=i-Math.PI/2,n.add(r)}v.add(n)}let C=N?550:1500,w=new Float32Array(C*3);for(let e=0;e<C;e++){let t=e*2.39996,n=2.7+(Math.sin(e*17.71)*.5+.5)*7;w[e*3]=Math.cos(t)*n,w[e*3+1]=Math.sin(t)*n,w[e*3+2]=-(e/C)*35+7}let T=new oe;T.setAttribute(`position`,new fe(w,3));let E=new i(T,new e({transparent:!0,depthWrite:!1,blending:2,uniforms:{time:{value:0},strength:{value:1}},vertexShader:`uniform float time; varying float twinkle; void main(){ vec3 p=position; p.x+=sin(time*.25+position.z)*.1; twinkle=.45+.55*sin(position.x*4.+time); vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=clamp(38./-mv.z,1.,7.); gl_Position=projectionMatrix*mv; }`,fragmentShader:`uniform float strength; varying float twinkle; void main(){ float d=length(gl_PointCoord-.5); float alpha=smoothstep(.5,.08,d)*twinkle; gl_FragColor=vec4(vec3(1.,.72,.32)*strength,alpha); }`}));r.add(E);let D=new h(new he(90,90),new e({transparent:!0,depthWrite:!1,uniforms:{time:{value:0}},vertexShader:`varying vec2 uvWorld; void main(){uvWorld=uv*45.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 uvWorld; uniform float time; void main(){vec2 line=abs(fract(uvWorld-.5)-.5)/fwidth(uvWorld);float grid=1.-min(min(line.x,line.y),1.);float sweep=pow(max(0.,1.-abs(fract(uvWorld.y*.08-time*.06)-.5)*2.),12.);gl_FragColor=vec4(.12,.32,.65,grid*(.12+sweep*.35));}`}));D.rotation.x=-Math.PI/2,D.position.set(0,-3.2,-10),r.add(D);let O=new m;r.add(O);let _e=new me({color:14365212,roughness:.28,clearcoat:.8,clearcoatRoughness:.18}),k=new b({color:4425e3,roughness:.42,side:2}),j=new b({color:15908956,roughness:.3,metalness:.05}),M=[],F=new l(1,28,20);for(let e=0;e<9;e++){let t=new m,n=new h(F,_e);n.scale.set(.34,.29,.34),t.add(n);for(let e=0;e<5;e++){let n=new h(F,k);n.scale.set(.035,.2,.018),n.position.set(Math.sin(e*1.256)*.1,.29,Math.cos(e*1.256)*.1),n.rotation.set(.7,e*1.256,.6),t.add(n)}let r=e*2.399;t.userData.base=new x(Math.cos(r)*(1.25+e%2*.3),Math.sin(r)*1.3,(e%3-1)*.7),t.position.copy(t.userData.base),O.add(t),M.push(t)}for(let e=0;e<13;e++){let t=new se;t.moveTo(0,-.5),t.bezierCurveTo(-.5,-.2,-.4,.35,0,.65),t.bezierCurveTo(.4,.35,.5,-.2,0,-.5);let n=new c(t,12),r=n.attributes.position;for(let e=0;e<r.count;e++)r.setZ(e,Math.sin(r.getY(e)*3)*.09);n.computeVertexNormals();let i=new h(n,k),a=e*2.399+1;i.userData.base=new x(Math.cos(a)*1.9,Math.sin(a)*1.8,Math.sin(e)*.8),i.position.copy(i.userData.base),i.rotation.set(e*.1,e*.35,a),i.scale.setScalar(.55),O.add(i),M.push(i)}let I=new m;O.add(I);for(let e=0;e<18;e++){let t=[];for(let n=0;n<=80;n++){let r=n/80,i=r*Math.PI*5+e*.36;t.push(new x(Math.cos(i)*(.55+e%3*.04),1-r*2,Math.sin(i)*(.55+e%3*.04)))}I.add(new h(new o(new te(t),85,.035,6,!1),j))}let L=new h(new re(2.1,1.5,.12,72),new me({color:16248282,roughness:.2,clearcoat:1}));L.position.y=-2.5,O.add(L);let R=new h(new a(1.98,.045,10,90),new b({color:14922587,metalness:.8,roughness:.2}));R.rotation.x=Math.PI/2,R.position.y=-2.42,O.add(R);let z=new ae(new ge(.035),j,80);O.add(z);let B=new ne;for(let e=0;e<80;e++){let t=e*2.399;B.position.set(Math.cos(t)*(1+e%5*.25),Math.sin(t)*(1+e%7*.15),Math.sin(e*4)*1.5),B.rotation.set(e,e*.4,e*.2),B.updateMatrix(),z.setMatrixAt(e,B.matrix)}H.tabIndex=0,H.setAttribute(`role`,`group`),H.setAttribute(`aria-label`,`Вращение 3D-композиции: стрелки влево и вправо; Home — исходное положение`);let V={x:0,y:0,targetX:0,targetY:0,down:!1,startX:0},G=0;H.addEventListener(`keydown`,e=>{P.paused||(e.key===`ArrowLeft`||e.key===`ArrowRight`?(e.preventDefault(),G+=e.key===`ArrowLeft`?-.25:.25):e.key===`Home`&&(e.preventDefault(),G=0))}),t.domElement.addEventListener(`pointerdown`,e=>{V.down=!0,V.startX=e.clientX,t.domElement.setPointerCapture(e.pointerId)}),t.domElement.addEventListener(`pointermove`,e=>{if(P.paused)return;let t=H.getBoundingClientRect();V.targetX=((e.clientX-t.left)/t.width-.5)*.7,V.targetY=((e.clientY-t.top)/t.height-.5)*.35,V.down&&(G+=(e.clientX-V.startX)*.007,V.startX=e.clientX)});let K=()=>{V.down=!1,V.targetX=0,V.targetY=0};t.domElement.addEventListener(`pointerup`,K),t.domElement.addEventListener(`pointercancel`,K),t.domElement.addEventListener(`pointerleave`,()=>{V.down||K()});let xe=[[`01 / ИМПУЛЬС`,`Всё начинается<br>с <em>искры.</em>`],[`02 / ИНГРЕДИЕНТЫ`,`Каждая деталь —<br><em>на своём месте.</em>`],[`03 / ПРЕВРАЩЕНИЕ`,`Соберите<br><em>свой вкус.</em>`]],q=-1,Se=0,J=0,Y=0,Ce=0,we=!1,X=!0,Z=0,Te=0,Q=1;function Ee(){let e=P.quality===`light`,n=P.quality===`cinema`,r=e?1:Math.min(devicePixelRatio,n?2:N?1.25:1.6)*Q;t.setPixelRatio(r),u.setPixelRatio(r),f.enabled=!e,f.strength=(n?.85:.5)*P.intensity,T.setDrawRange(0,e?Math.floor(C*.3):C),W.textContent=e?`ЛЁГКИЙ РЕЖИМ`:n?`CINEMA / BLOOM + PARTICLES`:`THREE.JS / LIVE EXPERIENCE`,X=!0}function $(){let e=H.clientWidth,n=H.clientHeight;t.setSize(e,n),u.setSize(e,n),s.aspect=e/n,s.updateProjectionMatrix(),X=!0}new ResizeObserver($).observe(H),addEventListener(`metro:effects`,()=>{Ee(),$()}),Ee(),$(),new IntersectionObserver(e=>{we=e[0].isIntersecting,X=!0},{rootMargin:`100px`}).observe(U);function De(){let e=U.getBoundingClientRect();Se=Math.max(0,Math.min(1,-e.top/(U.offsetHeight-innerHeight))),X=!0}addEventListener(`scroll`,De,{passive:!0}),addEventListener(`resize`,De),De(),document.querySelectorAll(`[data-chapter]`).forEach(e=>e.onclick=()=>{let t=Number(e.dataset.chapter),n=U.getBoundingClientRect().top+scrollY;scrollTo({top:n+t*(U.offsetHeight-innerHeight),behavior:P.paused?`instant`:`smooth`})}),t.domElement.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),we=!1,H.classList.add(`canvas-unavailable`),W.textContent=`3D приостановлено · обновите страницу для восстановления`});function Oe(e){requestAnimationFrame(Oe);let t=Math.min((e-Ce)/1e3,.05);if(Ce=e,!we||document.hidden||P.paused&&!X)return;P.paused?J=Se:(Y+=t,J+=(Se-J)*Math.min(t*5,1),V.x+=(V.targetX-V.x)*.06,V.y+=(V.targetY-V.y)*.06);let n=J,r=n<.3?0:n<.68?1:2;r!==q&&(q=r,U.querySelector(`.immersion-kicker`).textContent=xe[q][0],U.querySelector(`.immersion-copy h2`).innerHTML=xe[q][1],U.querySelector(`.immersion-copy`).classList.remove(`chapter-change`),U.offsetWidth,U.querySelector(`.immersion-copy`).classList.add(`chapter-change`),document.querySelectorAll(`[data-chapter]`).forEach((e,t)=>{e.classList.toggle(`active`,t===q),e.setAttribute(`aria-pressed`,String(t===q))})),U.style.setProperty(`--scene-progress`,n);let i=H.clientWidth<700;s.position.set(V.x*.7,V.y*.5+(n>.7?(n-.7)*3:0),(i?17:13)-n*3),s.lookAt(i?0:-.55,0,0),v.position.z=n*6,v.rotation.z=P.paused?0:Math.sin(Y*.12)*.08,S.forEach((e,t)=>{e.rotation.z=Y*(t%2?.07:-.07),e.scale.setScalar(1+Math.sin(Y*.6+t)*.015*P.intensity)});let a=Math.sin(Math.min(n/.72,1)*Math.PI)*1.6*P.intensity;O.position.x=i?0:1.1,O.position.y=i?-1.3:0,O.rotation.y=G+(P.paused?0:Y*.12)+n*Math.PI*.9,O.rotation.z=Math.sin(Y*.3)*.04,M.forEach((e,t)=>{e.position.copy(e.userData.base).multiplyScalar(1+a),e.position.y+=Math.sin(Y*.7+t)*.09*P.intensity,e.rotation.y=Y*.2+t}),I.scale.setScalar(.8+n*.25),I.rotation.z=-.2+n*.4,L.position.y=-2.9+n*.8,R.position.y=L.position.y+.08,z.rotation.y=-Y*.1,z.scale.setScalar(1+a*.5),E.material.uniforms.time.value=Y,E.material.uniforms.strength.value=P.intensity,E.rotation.z=Y*.015,E.position.z=Y*.45%5,D.material.uniforms.time.value=Y,p.intensity=65+Math.sin(Y)*10*P.intensity,u.render(),X=!1,P.quality===`auto`&&!P.paused&&t>0&&(Te+=t,Z++,Z===120&&(Te/Z>.029&&Q>.65&&(Q=Math.max(.65,Q-.15),Ee(),$()),Z=0,Te=0))}requestAnimationFrame(Oe)}export{P as experience};