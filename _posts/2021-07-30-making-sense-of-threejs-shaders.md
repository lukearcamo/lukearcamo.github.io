---
layout: article
title: "Making sense of Three.js shaders"
category: coding
tags: 3D-graphics webgl js glsl threejs
background-color: "#EE9B00"
needs-rouge: true
---
Three.js comes with several materials built-in, but customizing these materials can be difficult because there isn't really a "clean" way to do it. There is the option of writing a custom shader from scratch, or injecting your own code into the existing shaders. Either way, it is important to understand Three.js shaders in order to be able to modify them. Unfortunately, Three.js shaders lack sufficient documentation, here is a general guide to understanding them. 

<!--split-->

- [1. Problem](#1-problem)
- [2. Files Structure](#2-files-structure)
- [3. Chunks](#3-chunks)
  - [3.1. `common` and `packing`](#31-common-and-packing)
  - [3.2. `pars`](#32-pars)
  - [3.3. Main](#33-main)
- [4. Examples](#4-examples)
  - [4.1. Vertex Deformation](#41-vertex-deformation)
  - [4.2. Color Adjustment](#42-color-adjustment)
- [5. Resources](#5-resources)

<!--split-->

*Edit May 25, 2023: This article is somewhat outdated. It was written for Three.js 0.129.0, and the links should now lead to this specific release. However, the general functioning of Three.js shaders should remain the same.*

## 1. Problem

If you write a custom raw shader material, you won't have access to all of the lighting, fog, skinning, tonemapping, etc. that the default shaders come with. Instead, you can use the materials' onBeforeCompile callback to inject your own code into the shader source.

## 2. Files Structure

In Three.js repo, material shaders are located under `src/renderers`. Since materials may share different parts of a shader, Three.js divides the shaders into shader chunks. These shaders consist of several `#include` directives, which are eventually replaced by the actual shader chunk code before they are compiled.

These chunks are entirely or parially enabled/disabled using preprocessor directives, which depend on various settings in the form of defines. This long list of defines are prepended to the shaders in [src/renderers/webgl/WebGLProgram.js](https://github.com/mrdoob/three.js/blob/r129/src/renderers/webgl/WebGLProgram.js#L431), which are in turn based on the long list of material parameters in the confusingly named [src/renderers/webgl/WebGLPrograms.js](https://github.com/mrdoob/three.js/blob/r129/src/renderers/webgl/WebGLPrograms.js#L154). Note that these functions/objects are in the back-end, so they are not exported and are only accessible if you delve into the code. The most documentation that I've found on the Three.js website about Three.js shaders is the one for WebGLProgram.

Additionally, some shader functions are defined only in these obscure locations as well. For example, the `encodings_pars_fragment` is imported into every fragment shader but it is not found in the fragment shader code. It is prepended by `WebGLProgram`. The only way to see this chunk is to either delve into the GitHub code or manually create errors using the material's `onBeforeCompile` callback. Another example is the function `mapTexelToLinear`, which is an alias for one of the several encoding functions. Which one it corresponds to is determined in `WebGLProgram` as well, hardcoded as a GLSL define via JS.

[src/renderers/shaders/ShaderChunk/](https://github.com/mrdoob/three.js/tree/r129/src/renderers/shaders/ShaderChunk) contains individual JS files which export GLSL code wrapped in a JS string variable. This makes it easy for [src/renderers/shaders/ShaderChunk.js](https://github.com/mrdoob/three.js/blob/r129/src/renderers/shaders/ShaderChunk.js) to simply import these GLSL code strings and map them to a corresponding name in the THREE.ShaderChunk object. Additionally, `ShaderChunk.js` also contains the complete shader code strings from `src/renderers/shaders/ShaderLib/`:

[src/renderers/shaders/ShaderLib/](https://github.com/mrdoob/three.js/tree/r129/src/renderers/shaders/ShaderLib) contains the vertex and fragment shader GLSL code for each material, which are also stored in JS strings.
 
Since not all shader chunks use all uniforms, uniforms are also broken into chunks, found in [src/renderers/shaders/UniformsLib.js](https://github.com/mrdoob/three.js/blob/r129/src/renderers/shaders/UniformsLib.js) and combined per material in [src/renderers/shaders/ShaderLib.js](https://github.com/mrdoob/three.js/blob/r129/src/renderers/shaders/ShaderLib.js). THREE.Shaderlib uses [src/renderers/shaders/UniformsUtils.js](https://github.com/mrdoob/three.js/blob/r129/src/renderers/shaders/UniformsUtils.js) for deep copying objects in order to combine the shader code into one object, along with only the necessary uniforms for each material.

## 3. Chunks

### 3.1. `common` and `packing`

`common` and `packing` are two shader chunks found near the top of most shaders, after the material-specific uniforms and varyings. Packing is only found in fragment shaders.

`common` contains mathematical constants, like pi and epsilon. It also contains arithmetic, geometric, and matrix functions which are not built into GLSL, as well as three structs: `IncidentLight`, `ReflectedLight`, and `GeometricContext`. `packing` contains functions and constants for encoding and decoding values to fit into other compact formats. It also contains functions for converting between z coordinates, orthographic depth, and perspective depth.

The three structs from common will be important in the main function.

### 3.2. `pars`

After common and packing, there are several more chunks located before the `main()` function, with the majority of them containing the word "pars". "pars" is short for "parameters". These chunks contain uniform declarations, varying declarations, and functions.

For vertex shaders, this section can be roughly divided into these main categories:
* Varyings (color [vertex colors], uv, and uv2 [the second UV channel is only used for lightmaps and aomaps])
* Maps (displacementmap, envmapmap, etc.)
* Deformation (morphtarget, skinning)
* Other (shadowmap, fog, logdepthbuf, clipping_planes, etc.)

And for fragment shaders, this section is roughly structured like so:
* Varyings (color [vertex colors], uv, and uv2 [the second UV channel is only used for lightmaps and aomaps])
* Maps (map, lightmap, normalmap, metalnessmap, etc.)
* Lighting (brdf & shadow functions and structs, etc.)
* Other (dithering, fog, logdepthbuf, clipping_planes, etc.)

### 3.3. Main

As with all shaders, the `void main()` function is where the real bulk of the calculations happen. It is important to understand the main function in order to figure out where you should insert your code.

In vertex shaders, the chunks take all of the attributes and calculate the varyings. The main function begins with simple uv calculations, followed by vertex colors. They are followed by the normals and tangents which are then altered by morphing and skinning-related chunks, and then their appropriate transformation matrices. However, if flat shading is enabled, the real normal is actually calculated within the fragment shader using the `OES_standard_derivatives` functions. Afterwards, the vertices are modified like the normals, and are followed by some other calculations for varyings.

In fragment shaders, the beginning of the main function usually contains a `vec4 diffuseColor` variable, a `ReflectedLight reflectedLight`, and the chunks related to discarding fragments (clipping planes, alphatest). Later on, an `IncidentLight directLight` is created and is shared between all light sources, with only its data being modified for each iteration through the light sources.

Most of the chunks in `main()` use these variables, either modifying them or using them to calculate the final `outgoingLight` color used for `gl_FragColor`.

The last chunks are the final modifications of the output color; they are meant to go after all of the color, lighting, and shadow calculations. This section includes tonemapping, encoding the output, applying fog color, premultiplying alpha, and dithering.

## 4. Examples

### 4.1. Vertex Deformation
This is very similar to the example for [modified materials](https://threejs.org/examples/#webgl_materials_modified) already on the Three.js website. Hopefully, with newfound insight, you may understand it better.

Flat shading is enabled so that normals are calculated per fragment rather than using the normal attribute. This does not work for lambert materials since it calculates lighting in the vertex shader. Technically, you could manually recalculate normals if you had tangents and bitangents. See [this external blog post](https://www.ronja-tutorials.com/post/015-wobble-displacement/) for how to do so.

{% highlight js %}
var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 1, 30, 1),
                          new THREE.MeshPhongMaterial({ color: 0x841A00 }));
scene.add(cube);

cube.material.onBeforeCompile = function(shader) {
    shader.uniforms.time = { value: 0.0 };
    
    shader.flatShading = true;
    shader.vertexShader = "uniform float time;\n" + shader.vertexShader.replace(
        "#include <begin_vertex>",
        `vec3 transformed = vec3(position);
        transformed.xz *= sin(transformed.y * PI * 3.0 + time) * 0.25 + 0.75;`
    );
    cube.material.userData.shader = shader;
};

// In the render loop
if (cube.material.userData.shader) cube.material.userData.shader.uniforms.time.value = time;
{% endhighlight %}

### 4.2. Color Adjustment

In this example, the final color's components are swizzled from `rgb` to `brg`, and then the contrast is increased. I placed my code *before* the tonemapping and encoding fragments are applied. But if you want, you can even or override them if you wanted to.

{% highlight js %}
var cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshLambertMaterial({ color: 0xffffff }));
new THREE.TextureLoader().load("../imgs/articles/testtex_512.png", tex => {
    cube.material.map = tex; cube.material.needsUpdate = true;
});
scene.add(cube);

cube.material.onBeforeCompile = function(shader) {
    shader.fragmentShader = shader.fragmentShader.replace(
        "#include <tonemapping_fragment>",
        `gl_FragColor.rgb = gl_FragColor.brg;
        gl_FragColor.rgb = 4.0 * gl_FragColor.rgb - 1.5;
        #include <tonemapping_fragment>`
    );
    cube.material.userData.shader = shader;
};
{% endhighlight %}

## 5. Resources
Latest released Three.js GitHub code — [https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders](https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders)
Three.js forums, specifically these two posts:
* [https://discourse.threejs.org/t/what-are-pars-chunks-when-making-materials-what-does-pars-stand-for/15468](https://discourse.threejs.org/t/what-are-pars-chunks-when-making-materials-what-does-pars-stand-for/15468)
* [https://discourse.threejs.org/t/why-do-ao-and-lightmap-need-a-second-set-of-uvs/4178](https://discourse.threejs.org/t/why-do-ao-and-lightmap-need-a-second-set-of-uvs/4178)