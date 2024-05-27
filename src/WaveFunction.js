import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";

/**
 * Calculează factorialul unui număr dat n.
 * @param {number} n - Numărul pentru care se calculează factorialul.
 * @returns {number} Factorialul lui n.
 */
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

/**
 * Calculează polinomul asociat Legendre P(l, m, x).
 * @param {number} l - Gradul polinomului.
 * @param {number} m - Ordinul polinomului.
 * @param {number} x - Valoarea la care se evaluează polinomul.
 * @returns {number} Valoarea polinomului Legendre.
 */
const legendre = (l, m, x) => {
  if (m < 0) {
    m = -m;
    const sign = m % 2 === 0 ? 1 : -1;
    return sign * legendre(l, m, x);
  }

  let Pmm = 1.0;

  // Calculează polinomul asociat Legendre P(m, m, x).
  if (m > 0) {
    const somx2 = Math.sqrt((1.0 - x) * (1.0 + x));
    let fact = 1;
    for (let i = 1; i <= m; i++) {
      Pmm *= -fact * somx2;
      fact += 2;
    }
  }
  if (l === m) return Pmm;

  let Pmp1m = x * (2.0 * m + 1.0) * Pmm;
  if (l === m + 1) return Pmp1m;

  let Plm = 0.0;

  // Calculează polinomul asociat Legendre P(l, m, x).
  for (let ll = m + 2; ll <= l; ++ll) {
    Plm = ((2.0 * ll - 1.0) * x * Pmp1m - (ll + m - 1.0) * Pmm) / (ll - m);
    Pmm = Pmp1m;
    Pmp1m = Plm;
  }
  return Plm;
};

/**
 * Calculează armonicul sferic Y(l, m, theta, phi).
 * @param {number} l - Gradul armonicului.
 * @param {number} m - Ordinul armonicului.
 * @param {number} theta - Unghiul polar în radiani.
 * @param {number} phi - Unghiul azimutal în radiani.
 * @returns {number} Valoarea armonicului sferic.
 */
const sphericalHarmonic = (l, m, theta, phi) => {
  const sqrt = Math.sqrt;
  const fact = factorial(l + m) / factorial(l - m);
  // Calculează constanta K și polinomul asociat Legendre P(l, m, x).
  const K = sqrt(((2 * l + 1) / (4 * Math.PI)) * fact);
  const P = legendre(l, m, Math.cos(theta));

  // Calculează armonicul sferic Y(l, m, theta, phi).
  if (m > 0) return K * P * Math.cos(m * phi);
  if (m < 0) return K * P * Math.sin(-m * phi);
  return K * P;
};

/**
 * Calculează funcția radială R(n, l, r).
 * @param {number} n - Numărul cuantic principal.
 * @param {number} l - Numărul cuantic de moment unghiular.
 * @param {number} r - Distanța radială.
 * @returns {number} Valoarea funcției radiale.
 */
const radialWavefunction = (n, l, r) => {
  const sqrt = Math.sqrt;
  const exp = Math.exp;
  const rho = (2 * r) / n;

  /**
   * Calculează polinomul Laguerre generalizat L(p, k, x).
   * @param {number} p - Ordinul polinomului.
   * @param {number} k - Parametrul polinomului.
   * @param {number} x - Valoarea la care se evaluează polinomul.
   * @returns {number} Valoarea polinomului Laguerre.
   */
  const laguerre = (p, k, x) => {
    let result = 0;
    for (let m = 0; m <= p; m++) {
      result +=
        (factorial(p + k) /
          (factorial(p - m) * factorial(m) * factorial(k + m))) *
        Math.pow(-x, m);
    }
    return result;
  };

  // Calculează norma funcției radiale.
  const norm = sqrt(
    ((2 / n) ** 3 * factorial(n - l - 1)) / (2 * n * factorial(n + l))
  );

  // Calculează funcția radială R(n, l, r).
  const Rnl =
    norm *
    exp(-rho / 2) *
    Math.pow(rho, l) *
    laguerre(n - l - 1, 2 * l + 1, rho);

  return Rnl;
};

/**
 * Creează un heatmap din datele date.
 * @param {Array} data - Datele din care se creează heatmap-ul.
 * @param {number} width - Lățimea heatmap-ului.
 * @param {number} height - Înălțimea heatmap-ului.
 * @returns {HTMLCanvasElement} Elementul canvas cu heatmap-ul.
 */
const createHeatmap = (data, width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    const color = getColorForValue(value);
    const index = i * 4;
    imageData.data[index] = color.r;
    imageData.data[index + 1] = color.g;
    imageData.data[index + 2] = color.b;
    imageData.data[index + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

/**
 * Convertește o valoare într-o culoare.
 * @param {number} value - Valoarea de convertit.
 * @returns {Object} Obiectul cu valorile r, g, b ale culorii.
 */
const getColorForValue = (value) => {
  const r = Math.min(255, value * 2 * 255);
  const b = Math.min(255, (1 - value) * 2 * 255);
  return { r, g: 0, b };
};

export const WaveFunction = ({
  n,
  l,
  m,
  points,
  pointSize,
  animationSpeed,
  colorSet,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    /**
     * Setup pentru scena 3D.
     */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();

    // Setează dimensiunile renderer-ului la dimensiunile ferestrei.
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Adaugă renderer-ul (elementul <canvas></canvas>) la div-ul principal.
    mountRef.current.appendChild(renderer.domElement);

    // Adaugă controlul pentru orbitare în jurul scenei.
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Creează geometria pentru puncte.
    const geometry = new THREE.BufferGeometry();
    const numPoints = points;
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 4); // Changed to 4 for RGBA

    /**
     * Creează punctele și le adaugă la geometrie.
     * Se calculează funcția de undă pentru fiecare punct și se adaugă la geometrie.
     * Se calculează intensitatea și se adaugă la culori.
     * Se calculează coordonatele x, y, z și se adaugă la poziții.
     * Se creează un material pentru puncte și se adaugă la scenă.
     * Se setează poziția camerei.
     * Se adaugă statistici pentru performanță.
     * Se creează un loop pentru animație.
     * Se întoarce o funcție de cleanup.
     */
    for (let i = 0; i < numPoints; i++) {
      // Generează coordonatele sferice ale punctului.
      const r = Math.random() * 10;
      const theta = Math.random() * Math.PI;
      const phi = Math.random() * 2 * Math.PI;

      // Calculează funcția de undă pentru punctul curent.
      const radialPart = radialWavefunction(n, l, r);
      const angularPart = sphericalHarmonic(l, m, theta, phi);
      const probabilityDensity = Math.abs(radialPart * angularPart);

      // Calculează coordonatele x, y, z ale punctului.
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);

      // Adaugă coordonatele la poziții și culorile la culori.
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Calculează intensitatea și adaugă culoarea în funcție de setul de culori.
      const intensity = Math.min(1, probabilityDensity * 100);

      // Setează culorile în funcție de setul de culori.
      if (
        colorSet === "redBlue" ||
        colorSet === null ||
        colorSet === undefined
      ) {
        colors[i * 4] = 1 - intensity;
        colors[i * 4 + 1] = 0;
        colors[i * 4 + 2] = intensity;
        colors[i * 4 + 3] = 1.0; // Fully opaque
      }

      if (colorSet === "greenTransparency") {
        colors[i * 4] = 0;
        colors[i * 4 + 1] = intensity; // Higher intensity means green
        colors[i * 4 + 2] = 0;
        colors[i * 4 + 3] = intensity; // Alpha channel for transparency
      }
    }

    // Adaugă pozițiile și culorile la geometrie.
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4)); // Changed to 4

    // Creează materialul pentru puncte.
    const material = new THREE.PointsMaterial({
      size: pointSize,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true, // Enable transparency
      opacity: 1.0, // Default opacity
    });

    // Creează mesh-ul pentru puncte și adaugă la scenă.
    const pointsMesh = new THREE.Points(geometry, material);
    scene.add(pointsMesh);

    // Setează poziția camerei.
    camera.position.z = 40;

    // Adaugă statistici pentru performanță.
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    let frame = 0;
    const animate = () => {
      stats.begin();

      // Cod pentru randomizare de pozitie pentru efect de vibratie - nu-i musai

      // if (frame % 2 === 0) {
      //   const positionAttribute = geometry.getAttribute("position");
      //   for (let i = 0; i < positionAttribute.count; i++) {
      //     positionAttribute.array[i * 3] += (Math.random() - 0.5) * 0.05;
      //     positionAttribute.array[i * 3 + 1] += (Math.random() - 0.5) * 0.05;
      //     positionAttribute.array[i * 3 + 2] += (Math.random() - 0.5) * 0.05;
      //   }
      //   positionAttribute.needsUpdate = true;
      // }

      // Roteste mesh-ul de puncte.
      pointsMesh.rotation.x += animationSpeed;
      pointsMesh.rotation.y += animationSpeed;

      // Actualizează controlul pentru orbitare.
      controls.update();
      renderer.render(scene, camera);
      frame++;

      // Actualizează statistici pentru performanță.
      stats.end();
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      // Cleanup
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [n, l, m, points, pointSize, animationSpeed, colorSet]);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }}></div>;
};

export default WaveFunction;
