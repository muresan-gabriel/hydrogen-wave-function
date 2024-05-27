import React, { useState } from "react";
import { WaveFunction } from "./WaveFunction";
import "./App.css";

const App = () => {
  const [quantumNumbers, setQuantumNumbers] = useState({ n: 1, l: 0, m: 0 });
  const [points, setPoints] = useState(300000);
  const [pointSize, setPointSize] = useState(0.01);
  const [animationSpeed, setAnimationSpeed] = useState(0.001);
  const [colorSet, setColorSet] = useState("redBlue");
  const [showControls, setShowControls] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  const handleSelectionChange = (event) => {
    const { name, value } = event.target;
    setQuantumNumbers((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

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
      <button
        className="sm:hidden fixed right-0 bottom-32 z-50 bg-zinc-950 text-white rounded-l-lg p-2"
        onClick={() => setShowControls(!showControls)}
      >
        {showControls ? "Ascunde" : "Afișează"} Controale
      </button>
      <button
        className="sm:hidden fixed right-0 bottom-20 z-50 bg-zinc-950 text-white rounded-l-lg p-2"
        onClick={() => setShowLegend(!showLegend)}
      >
        {showLegend ? "Ascunde" : "Afișează"} Legenda
      </button>
      {showControls && (
        <div className="controls bg-zinc-950 text-white rounded-l-xl border-t border-zinc-900 absolute top-10 right-0 p-4 flex flex-col sm:block">
          <>
            <div className="flex sm:flex-row flex-col place-content-around mb-3">
              <div className="flex font-mono">
                n:
                <select
                  className="sm:w-14 w-full w-4 text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold sm:mb-0 mb-3"
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
                  className="sm:w-14 w-full text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold sm:mb-0 mb-3"
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
                  className="sm:w-14 w-full text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold sm:mb-0 mb-3"
                  name="m"
                  value={quantumNumbers.m}
                  onChange={handleSelectionChange}
                >
                  {generateOptions(quantumNumbers.l)}
                </select>
              </div>
            </div>
            <div className="flex sm:flex-row flex-col [&>*]:mr-3 mb-3">
              <div className="flex sm:flex-row flex-col font-mono">
                Număr de Puncte:
                <input
                  className="text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold sm:mb-0 mb-3"
                  type="number"
                  name="points"
                  onChange={(event) =>
                    setPoints(parseInt(event.target.value, 10))
                  }
                  value={points}
                />
              </div>
              <div className="flex sm:flex-row flex-col font-mono">
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
              <div className="flex sm:flex-row flex-col font-mono">
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
              <div className="flex sm:flex-row flex-col font-mono">
                Set de Culori:
                <select
                  className="text-center rounded-lg ml-2 bg-zinc-200 border-t border-zinc-50 text-black font-bold"
                  name="colorSet"
                  value={colorSet}
                  onChange={(event) => setColorSet(event.target.value)}
                >
                  <option value="redBlue">Rosu & Albastru</option>
                  <option value="greenTransparency">Verde & Transparent</option>
                </select>
              </div>
            </div>
          </>
        </div>
      )}
      {showLegend && (
        <div className="controls bg-zinc-950 text-white rounded-l-xl border-t border-zinc-900 absolute md:top-56 bottom-72 right-0 p-4 flex flex-col sm:block">
          Legendă:
          <div className="flex mt-3 text-md text-zinc-600 sm:w-[300px] w-[350px] text-left">
            Probabilitatea de a găsi electronul într-un anumit punct
          </div>
          {colorSet === "redBlue" && (
            <div className="bg-gradient-to-r from-blue-700 to-red-700 sm:w-[300px] w-[350px] h-[30px] my-1"></div>
          )}
          {colorSet === "greenTransparency" && (
            <div className="bg-gradient-to-r from-green-700 to-black sm:w-[300px] w-[350px] h-[30px] my-1"></div>
          )}
          <div className="sm:w-[300px] w-[350px] flex place-content-between">
            <div className="text-zinc-300">Probabil</div>
            <div className="text-zinc-300">Neprobabil</div>
          </div>
        </div>
      )}
      <div className="controls absolute text-white absolute bottom-2 right-2 p-4 flex flex-col">
        Vizualizare 3D a funcției de undă (wave function) a hidrogenului
      </div>
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
