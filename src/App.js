import { useState, useEffect, useRef } from "react";
import { generate } from "random-words";

function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(15);
  const [currentInput, setCurrentInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setInCorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const textInput = useRef(null);

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
    setWords(generateWords());
  }, [status]);

  function generateWords() {
    return new Array(200).fill(null).map(() => generate());
  }

  function start() {
    if (status === "finished") {
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setInCorrect(0);
      setCurrCharIndex(-1);
      setCurrChar("");
    }

    if (status !== "started") {
      setStatus("started");
    }
    console.log(status);
    let interval = setInterval(() => {
      setCountDown((prevCountDown) => {
        if (prevCountDown === 0) {
          clearInterval(interval);
          setStatus("finished");
          return countDown;
        } else {
          return prevCountDown - 1;
        }
      });
    }, 1000);
  }

  function handleKeyDown({ keyCode, key }) {
    if (keyCode === 32) {
      checkMatch();
      setCurrCharIndex(-1);
      setCurrentInput("");
      setCurrWordIndex(currWordIndex + 1);
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }
  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currentInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setInCorrect(incorrect + 1);
    }
  }
  function getCharClass(wordIdx, charIdx, char) {
    if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        return "has-background-success";
      } else {
        return "has-background-danger";
      }
    } else if (
      wordIdx === currWordIndex &&
      currCharIndex >= words[currWordIndex].length
    ) {
      return "has-background-danger";
    } else {
      return "";
    }
  }
  function getAccuracy() {
    if (incorrect === 0) {
      return 100;
    }
    if (correct === 0) {
      return 0;
    }
    return Math.round((correct / (correct * incorrect) + Number.EPSILON) * 100);
  }

  return (
    <div className="bg-slate-900 text-center text-cyan-200 ">
      <div>
        <div className="text-2xl font-medium uppercase text-lime-200">
          Speed Type
        </div>
        <div>
          <div className="container">
            <div>Time: </div>
            <div className="flex space-x-4 justify-center">
              <button
                id={1}
                type="button"
                className="text-lime-200 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 inline-flex rounded-md shadow-sm bg-trasparent p-2"
                onClick={() => {
                  setCountDown(15);
                }}
              >
                15
              </button>
              <button
                id={2}
                type="button"
                className="text-lime-200 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 inline-flex rounded-md shadow-sm bg-trasparent p-2"
                onClick={() => {
                  setCountDown(30);
                }}
              >
                30
              </button>
              <button
                id={3}
                type="button"
                className="text-lime-200 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 inline-flex rounded-md shadow-sm bg-trasparent p-2"
                onClick={() => {
                  setCountDown(60);
                }}
              >
                60
              </button>
              <button
                id={4}
                type="button"
                className="text-lime-200 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 inline-flex rounded-md shadow-sm bg-trasparent p-2"
                onClick={() => {
                  setCountDown(120);
                }}
              >
                120
              </button>
            </div>
          </div>
          <div>{countDown}</div>
          {status === "started" && (
            <div className="container">
              <div className="card">
                <div className="card-section">
                  <div className="text-lime-200">
                    {words.map((word, i) => {
                      return (
                        <span>
                          <span key={i}>
                            {word.split("").map((char, idx) => {
                              return (
                                <span
                                  className={getCharClass(i, idx, char)}
                                  key={idx}
                                >
                                  {char}
                                </span>
                              );
                            })}
                          </span>
                          <span> </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          {status === "finished" && (
            <div className="container">
              <div className="columns">
                <div className="column has-text-centered">
                  <span className="text-lime-200">
                    WPM :{" "}
                    <span className="text-cyan-200">
                      {correct * (60 / countDown)}
                    </span>
                  </span>
                </div>
                <div className="column">
                  <div className="text-lime-200">
                    Accuracy :{" "}
                    <span className="text-cyan-200">{getAccuracy()} %</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="container">
            <button className="button is-info" onClick={start}>
              Start
            </button>
          </div>

          <div>
            <input
              ref={textInput}
              disabled={status !== "started"}
              type="input"
              className="bg-gray-800 text-lime-200"
              onKeyDown={handleKeyDown}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
            />
          </div>

          <div className="container">
            <button
              className="button is-info"
              onClick={() => {
                window.location.reload();
              }}
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
