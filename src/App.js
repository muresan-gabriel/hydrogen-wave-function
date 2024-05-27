import React, { useState } from "react";
import { WaveFunction } from "./WaveFunction";
import "./App.css";

const App = () => {
  const [quantumNumbers, setQuantumNumbers] = useState({ n: 1, l: 0, m: 0 });
  const [points, setPoints] = useState(300000);
  const [pointSize, setPointSize] = useState(0.01);
  const [animationSpeed, setAnimationSpeed] = useState(0.001);
  const [colorSet, setColorSet] = useState("redBlue");

  const handleSelectionChange = (event) => {
    const { name, value } = event.target;
    setQuantumNumbers((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  // Generează opțiunile pentru select a wave function-ului (n, l, m)
  /**
   * n - numărul cuantic principal - reprezintă nivelul de energie al electronului
   * l - numărul cuantic secundar - reprezintă momentul cinetic al electronului.
   *     Momentul cinetic este un vector care are o magnitudine și o direcție.
   * m - numărul cuantic magnetic - reprezintă orientarea momentului cinetic al electronului
   */
  const generateOptions = (max) => {
    let options = [];
    for (let i = 0; i <= max; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="App">
      <div className="controls bg-zinc-950 text-white rounded-l-xl border-t border-zinc-900 absolute top-10 right-0 p-4 flex flex-col">
        {/* <div className="flex place-content-around mb-3">
          <button
            onClick={() => setView("waveFunction")}
            className="bg-zinc-200 text-black font-bold rounded-lg p-2"
          >
            Wave Function
          </button>
          <button
            onClick={() => setView("superposition")}
            className="bg-zinc-200 text-black font-bold rounded-lg p-2"
          >
            Superposition
          </button>
          <button
            onClick={() => setView("hawkingRadiation")}
            className="bg-zinc-200 text-black font-bold rounded-lg p-2"
          >
            Hawking Radiation
          </button>
        </div> */}
        {/* {view === "waveFunction" && ( */}
        <>
          <div className="flex place-content-around mb-3">
            {/**
             * Setează valorile pentru n, l, m.
             */}
            <div className="flex font-mono">
              n:
              <select
                className="w-14 text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold"
                name="n"
                value={quantumNumbers.n}
                onChange={handleSelectionChange}
              >
                {generateOptions(4)}
              </select>
            </div>
            <div className="flex font-mono">
              l:
              <select
                className="w-14 text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold"
                name="l"
                value={quantumNumbers.l}
                onChange={handleSelectionChange}
              >
                {generateOptions(quantumNumbers.n - 1)}
              </select>
            </div>
            <div className="flex font-mono">
              m:
              <select
                className="w-14 text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold"
                name="m"
                value={quantumNumbers.m}
                onChange={handleSelectionChange}
              >
                {generateOptions(quantumNumbers.l)}
              </select>
            </div>
          </div>
          <div className="flex [&>*]:mr-3 mb-3">
            {/**
             * Setează numărul de puncte și dimensiunea punctelor.
             */}
            <div className="flex font-mono">
              Număr de Puncte:
              <input
                className="text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold"
                type="number"
                name="points"
                onChange={(event) =>
                  setPoints(parseInt(event.target.value, 10))
                }
                value={points}
              />
            </div>
            <div className="flex font-mono">
              Dimensiune Puncte:
              <input
                className="text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold"
                type="number"
                step="0.001"
                name="pointSize"
                onChange={(event) =>
                  setPointSize(parseFloat(event.target.value))
                }
                value={pointSize}
              />
            </div>
          </div>
          <div className="flex items-center justify-center mb-3">
            {/**
             * Setează viteza de animație și setul de culori.
             */}
            <div className="flex font-mono">
              Viteză Animație:
              <input
                className="text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold"
                type="number"
                step="0.001"
                name="animationSpeed"
                onChange={(event) =>
                  setAnimationSpeed(parseFloat(event.target.value))
                }
                value={animationSpeed}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex font-mono">
              Set de Culori:
              <select
                className="text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold"
                name="colorSet"
                value={colorSet}
                onChange={(event) => setColorSet(event.target.value)}
              >
                <option value="redBlue">Rosu & Albastru</option>
                <option value="blackOrange">Negru & Portocaliu</option>
                <option value="greenTransparency">Verde & Transparent</option>
              </select>
            </div>
          </div>
        </>
      </div>
      <div className="controls bg-zinc-950 text-white rounded-l-xl border-t border-zinc-900 absolute top-56 right-0 p-4 flex flex-col">
        Legendă:
        <div className="flex mt-3 text-md text-zinc-600">
          Probabilitatea de a găsi electronul într-un anumit punct
        </div>
        {colorSet === "redBlue" && (
          <div className="bg-gradient-to-r from-blue-700 to-red-700 w-[500px] h-[20px] my-1"></div>
        )}
        {colorSet === "blackOrange" && (
          <div className="bg-gradient-to-r from-amber-500 to-black w-[500px] h-[20px] my-1"></div>
        )}
        {colorSet === "greenTransparency" && (
          <div className="bg-gradient-to-r from-green-700 to-black w-[500px] h-[20px] my-1"></div>
        )}
        <div className="w-[500px] flex place-content-between">
          <div className="text-zinc-300">Probabil</div>
          <div className="text-zinc-300">Neprobabil</div>
        </div>
      </div>
      <div className="controls absolute text-white absolute bottom-2 right-2 p-4 flex flex-col">
        Vizualizare 3D a funcției de undă (wave function) a hidrogenului
      </div>
      {/**
       * Afișează funcția de undă pentru n, l, m.
       */}
      <WaveFunction
        n={quantumNumbers.n}
        l={quantumNumbers.l}
        m={quantumNumbers.m}
        points={points}
        pointSize={pointSize}
        animationSpeed={animationSpeed}
        colorSet={colorSet}
      />
    </div>
  );
};

export default App;
