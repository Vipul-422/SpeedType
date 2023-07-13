import { useState, useEffect, useRef } from "react";
import { generate } from "random-words";
const N = 100;
const S = 15;

function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(S);
  const [currentInput, setCurrentInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setInCorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  function generateWords() {
    return new Array(N).fill(null).map(() => generate());
  }

  function restart() {
    window.location.reload();
  }

  function start() {
    if (status === "finished") {
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setInCorrect(0);
      setCurrCharIndex(-1)
      setCurrChar("")
    }
    if (status !== "started") {
      setStatus("started");
    }
    let interval = setInterval(() => {
      setCountDown((prevCountDown) => {
        if (prevCountDown === 0) {
          clearInterval(interval);
          setStatus("finished");
          return S;
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
    } else if(keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1)
      setCurrChar("")
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
    } else if(wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) { 
      return'has-background-danger';
    }  else {
      return "";
    }
  }

  return (
    <>
      <div className="App">
        <div className="is-size-1 has-text-centered has-text-primary">
          {countDown}
        </div>
        {status === "started" && (
          <div className="section">
            <div className="card">
              <div className="card-section">
                <div className="content">
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
          <div className="section">
            <div className="columns">
              <div className="column has-text-centered">
                <p className="is-size-5">WPM</p>
                <p className="has-text-primary is-size-1">{correct * 4}</p>
              </div>
              <div className="column">
                <div className="is-size-5">Accuracy :</div>
                <p className="has-text-info is-size-1">
                  {Math.round((correct / (correct * incorrect)) * 100)} %
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="section">
          <button className="button is-info" onClick={start}>
            Start
          </button>
        </div>

        <div className="control is-expanded section">
          <input
            ref={textInput}
            disabled={status !== "started"}
            type="text"
            className="input"
            onKeyDown={handleKeyDown}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
          />
        </div>

        <div className="section">
          <button className="button is-info" onClick={restart}>
            Restart
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
