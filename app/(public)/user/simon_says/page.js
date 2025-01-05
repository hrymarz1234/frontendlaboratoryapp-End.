"use client";

import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

const SimonSays = () => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [message, setMessage] = useState("Kliknij POWER, aby włączyć grę.");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [count, setCount] = useState(0); 
  const auth = getAuth();
  const router = useRouter();
  const colors = ["red", "blue", "green", "yellow"];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Nie udało się zalogować. Sprawdź dane logowania.");
    }
  };

  const addColorToSequence = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prev) => [...prev, randomColor]);
  };

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setMessage("Obserwuj sekwencję...");
    setGameOver(false);
    setCount(0); 
    addColorToSequence();
  };

  const playSequence = async () => {
    for (let i = 0; i < sequence.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      highlightButton(sequence[i]);
    }
    setTimeout(() => {
      setMessage("Twoja kolej!");
      setIsPlayerTurn(true);
    }, 600);
  };

  useEffect(() => {
    if (sequence.length > 0 && !isPlayerTurn) {
      playSequence();
    }
  }, [sequence, isPlayerTurn, playSequence]); // Dodano 'playSequence' jako zależność

  const highlightButton = (color) => {
    const button = document.getElementById(color);
    if (button) {
      button.classList.add("active");
      setTimeout(() => button.classList.remove("active"), 400);
    }
  };

  const handlePlayerClick = (color) => {
    if (!isPlayerTurn || gameOver) return;

    const nextIndex = playerSequence.length;
    setPlayerSequence((prev) => [...prev, color]);

    if (color !== sequence[nextIndex]) {
      setMessage("Błąd! Koniec gry.");
      setGameOver(true);
      setIsPlayerTurn(false);
      saveBestScore();
      return;
    }

    if (nextIndex + 1 === sequence.length) {
      setMessage("Dobra robota! Kolejna runda...");
      setScore((prev) => prev + 1);
      setPlayerSequence([]);
      setIsPlayerTurn(false);
      setTimeout(() => {
        addColorToSequence();
        setCount((prev) => prev + 1); 
      }, 1000);
    }
  };

  const saveBestScore = () => {
    const user = auth.currentUser;
    if (user) {
      const userKey = `bestScore_${user.uid}`;
      const bestScore = localStorage.getItem(userKey);
      if (!bestScore || score > parseInt(bestScore, 10)) {
        localStorage.setItem(userKey, score);
      }
    }
  };

  const togglePower = () => {
    setGameStarted((prev) => !prev);
    setMessage(gameStarted ? "Kliknij POWER, aby włączyć grę." : "Kliknij START, aby rozpocząć.");
    if (gameStarted) {
      setCount(0); 
    } else {
      setCount(1); 
    }
  };

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div className="login-form">
        <h1>Zaloguj się</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Zaloguj</button>
        </form>
        <style jsx>{`
          .login-form {
            text-align: center;
            margin-top: 20px;
          }
          input {
            display: block;
            margin: 10px auto;
            padding: 8px;
            width: 80%;
          }
          button {
            padding: 10px 20px;
            cursor: pointer;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="simon-says">
      <h1>Simon Says</h1>
      <p>{message}</p>
      <div className="display">
        <p>Count: {count < 10 ? `0${count}` : count}</p>
      </div>
      <div className="buttons">
        {colors.map((color) => (
          <button
            key={color}
            id={color}
            className={`button ${color}`}
            onClick={() => handlePlayerClick(color)}
            disabled={!gameStarted}
          ></button>
        ))}
      </div>
      <div className="controls">
        <button onClick={togglePower} className="power-button">
          {gameStarted ? "Power OFF" : "Power ON"}
        </button>
        <button onClick={startGame} className="start-button" disabled={!gameStarted}>
          Start
        </button>
      </div>
      <style jsx>{`
        .simon-says {
          text-align: center;
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(45deg, #ff8c00,blue);
          color: white;
          font-family: 'Arial', sans-serif;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5); /* Cień na tle */
        }
        .display {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 30px;
        }
        .buttons {
          display: grid;
          grid-template-columns: repeat(2, 120px);
          gap: 15px;
          margin: 20px auto;
        }
        .button {
          width: 120px;
          height: 120px;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          opacity: 0.8;
          transition: transform 0.3s, opacity 0.3s;
        }
        .button.active {
          transform: scale(1.1);
          opacity: 1;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
        }
        .red {
          background-color: #ff4d4d;
        }
        .blue {
          background-color: #4d79ff;
        }
        .green {
          background-color: #4dff88;
        }
        .yellow {
          background-color: #fff44d;
        }
        .controls {
          margin-top: 30px;
        }
        .power-button,
        .start-button {
          padding: 12px 20px;
          font-size: 18px;
          cursor: pointer;
          background-color: #fff;
          border-radius: 8px;
          border: none;
          margin: 10px;
          color: #333;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        .power-button:hover,
        .start-button:hover {
          background-color: #ff0080;
          color: white;
        }
        button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default SimonSays;
