import {useEffect, useState} from "react";
import logo from "../public/images/logo-bonus.svg";
import pentagon from "../public/images/bg-pentagon.svg";
import closeIcon from "../public/images/icon-close.svg";
import rulesIcon from "../public/images/image-rules-bonus.svg";
import Modal from "./components/Modal";
import "./reset.css";
import './App.css';

type Option = {
  name: string;
  icon: string;
};

type ChoiceProps = {
  option: Option;
};

const options: Option[] = [
  {icon: "./images/icon-scissors.svg", name: "Scissors"},
  {icon: "./images/icon-paper.svg", name: "Paper"},
  {icon: "./images/icon-rock.svg", name: "Rock"},
  {icon: "./images/icon-lizard.svg", name: "Lizard"},
  {icon: "./images/icon-spock.svg", name: "Spock"}
];

function App() {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [flashingOption, setFlashingOption] = useState<Option | null>(null);
  const [finalOption, setFinalOption] = useState<Option | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [winner, setWinner] = useState<string>("");
  const [isRulesOpened, setIsRulesOpened] = useState(false);

  const winningConditions: Record<string, string[]> = {
    Rock: ["Scissors", "Lizard"],
    Scissors: ["Paper", "Lizard"],
    Paper: ["Rock", "Spock"],
    Lizard: ["Paper", "Spock"],
    Spock: ["Rock", "Scissors"]
  };

  function playRound(playerSelection: string, computerSelection: string): string {
    playerSelection = playerSelection.charAt(0).toUpperCase() + playerSelection.slice(1).toLowerCase();
    computerSelection = computerSelection.charAt(0).toUpperCase() + computerSelection.slice(1).toLowerCase();

    const validChoices = Object.keys(winningConditions);

    if (!validChoices.includes(playerSelection) || !validChoices.includes(computerSelection)) {
      return "Invalid choice. Please choose Rock, Paper, Scissors, Lizard, or Spock.";
    }

    if (playerSelection === computerSelection) {
      return "It's a draw!";
    }

    if (winningConditions[playerSelection].includes(computerSelection)) {
      setWinner("human");
      return "YOU WIN";
    } else {
      setWinner("computer");
      return "YOU LOSE";
    }
  }


  useEffect(() => {
    if (selectedOption) {
      // Start with pseudo-element visible

      const flashDuration = 2000;
      const flashInterval = 200;

      let index = 0;
      const shuffledOptions = options.sort(() => Math.random() - 0.5);

      const startTime = Date.now();

      // Show pseudo-element briefly before flashing


      const flashIntervalId = setInterval(() => {
        setFlashingOption(shuffledOptions[index]);
        index = (index + 1) % shuffledOptions.length;

        if (Date.now() - startTime > flashDuration) {
          clearInterval(flashIntervalId);
          const finalIndex = Math.floor(Math.random() * shuffledOptions.length);
          setFinalOption(shuffledOptions[finalIndex]);

          const result = playRound(selectedOption.name, shuffledOptions[finalIndex].name);
          setResultMessage(result);
        }
      }, flashInterval);

      return () => {
        clearInterval(flashIntervalId);
      };
    }
  }, [selectedOption]);
  const Choice = ({option}: ChoiceProps) => (
    <div onClick={() => setSelectedOption(option)} className={`option ${option.name.toLowerCase()}`}>
      <div className="image-wrapper">
        <img src={option.icon} alt={option.name}/>
      </div>
    </div>
  );

  const PreviewChoice = ({option}: ChoiceProps) => (
    <div className={`option ${option.name.toLowerCase()}`}>
      <div className="image-wrapper">
        <img src={option.icon} alt={option.name}/>
      </div>
    </div>
  );

  const handlePlayAgain = () => {
    setSelectedOption(null);
    setFlashingOption(null);
    setFinalOption(null);
    setResultMessage(null);
    setWinner("");
  };

  return (
    <div className='app'>
      <header></header>
      <main>
        <div className="app-header">
          <h1 className="logo">
            <img src={logo} alt="logo"/>
          </h1>
          <div className="score">
            <span className='score-label'>score</span>
            <span className='score-value'>12</span>
          </div>
        </div>

        {!selectedOption && (
          <div className={`game-options`}>
            <div className="bg">
              <img src={pentagon} alt="pentagon"/>
            </div>
            {options.map((option, index) => (
              <Choice key={index} option={option}/>
            ))}
          </div>
        )}

        {selectedOption && (
          <div className={`game-board`}>
            <div className={`game-board__item user-choice  ${winner === "human" ? "winner" : ""}`}>
              <h2 className='game-board__title'>YOU PICKED</h2>
              {selectedOption && (
                <div className={`option ${selectedOption.name.toLowerCase()}`}>
                  <div className="image-wrapper">
                    <img src={selectedOption.icon} alt={selectedOption.name}/>
                  </div>
                </div>
              )}
            </div>
            <div className="result-wrapper">
              {resultMessage && <h1 className='title'>{resultMessage}</h1>}
              {resultMessage && (
                <button className="button play-again-button" onClick={handlePlayAgain}>
                  Play Again
                </button>
              )}
            </div>
            <div className={`game-board__item computer-choice ${winner === "computer" ? "winner" : ""}`}>
              <h2 className='game-board__title'>THE HOUSE PICKED</h2>
              {flashingOption && !finalOption && (
                <PreviewChoice option={flashingOption}/>
              )}
              {finalOption && (
                <PreviewChoice option={finalOption}/>
              )}

            </div>
          </div>
        )}


        <button className="button rules-button" onClick={() => setIsRulesOpened(true)}>Rules</button>
      </main>
      <footer></footer>
      <Modal isOpen={isRulesOpened} onClose={() => setIsRulesOpened(false)}>

        <div className="modal-header">
          <h3>RULES</h3>
          <button className="close-modal" onClick={() => setIsRulesOpened(false)}>
            <img src={closeIcon} alt="close icon"/>
          </button>
        </div>

        <div className="rules-image">
          <img src={rulesIcon} alt="rules icon"/>
        </div>

      </Modal>
    </div>
  );
}

export default App;
