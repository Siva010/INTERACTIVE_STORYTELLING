import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/game.css";

function Game() {
  const [scene, setScene] = useState("start");
  const [badChoices, setBadChoices] = useState(0);
  const [biscuitDropped, setBiscuitDropped] = useState(false); // Track if biscuit is lost
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const hoverSoundRef = useRef(null);

  const [hoveredDescription, setHoveredDescription] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (event, description) => {
    setHoveredDescription(description);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredDescription("");
  };

  // Redirect to home on refresh
  useEffect(() => {
    // Check if the page was refreshed
    if (sessionStorage.getItem("refreshed")) {
      sessionStorage.removeItem("refreshed"); // Clear the flag after redirect
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Set session flag when reloading
    const handleBeforeUnload = () => {
      sessionStorage.setItem("refreshed", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Music mapping for each scene
  const sceneMusic = {
    start: "",
    enterApartment: "",
    choice: "/assets/sounds/Entry-music.mp3",
    lift: " /assets/sounds/First-badchoice.mp3",
    watchman: " /assets/sounds/Pre-watchman.mp3",
    stairs: " /assets/sounds/Cat-music.mp3",
    catAngry: " /assets/sounds/Cat-music.mp3",
    catFinalChoice: " /assets/sounds/Cat-music.mp3",
    petCat: "/assets/sounds/Pre-Ghost.mp3",
    ghostchoice: "/assets/sounds/Pre-Ghost.mp3",
    ghosthappy: "/assets/sounds/Biscuit-Ghost.mp3",
    biscuitremains: "/assets/sounds/First-badchoice.mp3",
    gameOver1: "/assets/sounds/Watchman-Jumpscare.mp3",
    gameOver2: "/assets/sounds/Ghost-Jumpscare.mp3",
    win: "/assets/sounds/win-sound.mp3",
  };

  // Change background music when the scene updates
  useEffect(() => {
    if (audioRef.current) {
      const newSrc = sceneMusic[scene] || "/assets/default.mp3";

      // Prevent restarting if the same music is already playing
      if (audioRef.current.src !== newSrc) {
        audioRef.current.src = newSrc;
        audioRef.current.loop = false; // Disable looping
        audioRef.current
          .play()
          .catch((err) => console.log("Autoplay blocked:", err));
      }
    }
  }, [scene]);

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play();
    }
  };

  const makeChoice = (nextScene, isBad) => {
    if (isBad) {
      setBadChoices((prev) => {
        const newBadChoices = prev + 1;
        // Check if this bad choice puts us at 2 or more bad choices
        if (newBadChoices >= 2) {
          setScene(nextScene.includes("ghost") ? "gameOver2" : "gameOver1");
          return newBadChoices;
        }
        setScene(nextScene);
        return newBadChoices;
      });
    } else {
      setScene(nextScene);
    }
  };

  return (
    <div className="game-container">
      {/* Dynamic Background Music */}
      <audio ref={audioRef} loop hidden />
      <audio ref={hoverSoundRef} src="/assets/hover-sound.mp3" hidden />

      <div className="game-content">
        {/* Message scenes */}
        {scene === "start" && (
          <div className="game-message">
            <p className="game-text">📩 (Pawan): "Have you arrived yet?"</p>
            <audio src="/assets/sounds/message-sound.mp3" autoPlay hidden />
            <button
              className="game-button1"
              onMouseEnter={playHoverSound}
              onClick={() => setScene("enterApartment")}
            >
              "Yeah, I am right in front of the gate."
            </button>
          </div>
        )}
        {/* Message scenes */}
        {scene === "enterApartment" && (
          <div className="game-message">
            <p className="game-text">
              📩 (Pawan): "Cool, my house is on the 3rd floor, flat 13B. I will
              be waiting outside."
            </p>
            <audio src="/assets/sounds/message-sound.mp3" autoPlay hidden />
            <button
              className="game-button1"
              onMouseEnter={playHoverSound}
              onClick={() => setScene("choice")}
            >
              "Alright, coming..."
            </button>
          </div>
        )}

        {/* Enter Apartment choices*/}
        <div className="scene-content">
          {scene === "choice" && (
            <>
              <p className="game-text">
                🚪 You enter the apartment. How do you go up?
              </p>

              <div className="scene-image-container">
                <img
                  src="/assets/images/Lift.jpeg"
                  alt="Lift"
                  className="left-image"
                />

                <img
                  src="/assets/images/Stairs.png"
                  alt="Breaking"
                  className="right-image"
                />
              </div>
              <div className="button-container">
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => {
                    setBiscuitDropped(true);
                    makeChoice("lift", true);
                  }}
                >
                  🛗 Take the Lift
                </button>
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => makeChoice("stairs", false)}
                >
                  🚶 Take the Stairs
                </button>
              </div>
            </>
          )}
          {/* Lift choices*/}
          {scene === "lift" && (
            <>
              <p className="game-text">
                🚨 The lift stops working! What do you do?
              </p>

              <div className="scene-image-container">
                <img
                  src="/assets/images/Shouting.jpeg"
                  alt="Shouting"
                  className="left-image"
                />
                <img
                  src="/assets/images/Breaking.jpeg"
                  alt="Breaking"
                  className="right-image"
                />
              </div>
              <div className="button-container">
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => setScene("watchman", true)}
                >
                  📣 Shout for help
                </button>
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => setScene("biscuit-fell", false)}
                >
                  🏋️ Break open the lift
                </button>
              </div>
            </>
          )}

          {scene === "biscuit-fell" && (
            <div>
              <p className="game-text ">
                Biscuit fell down from your pocket, while you are getting out.
              </p>
              <div className="button-container">
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => setScene("catAngry", false)}
                >
                  continue..
                </button>
              </div>
            </div>
          )}

          {scene === "stairs" && (
            <>
              <p className="game-text">
                🐱 You see a **Cute Cat** on the stairs. What do you do?
              </p>

              <div className="scene-image-container">
                <img
                  src="/assets/images/Give-biscuit-cat.jpeg"
                  alt="give"
                  className="left-image"
                />
                <img
                  src="/assets/images/Dontgive-biscuit-cat.jpeg"
                  alt="dont"
                  className="right-image"
                />
              </div>

              <div className="button-container">
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => makeChoice("catAngry", true)}
                >
                  🍪 Give Biscuit to the Cat
                </button>
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => makeChoice("biscuitremains", false)}
                >
                  ❌ Don't Give Biscuit
                </button>
              </div>
            </>
          )}
          {scene === "watchman" && (
            <>
              <p className="game-text">
                👮 Watchman slowly walks towards you....
              </p>
              <button
                className="game-button"
                onMouseEnter={playHoverSound}
                onClick={() => makeChoice("gameOver1", true)}
              >
                Ask for Help
              </button>
            </>
          )}
          {scene === "catAngry" && (
            <>
              <p className="game-text">🐱 You Find Cat staring at you...</p>
              <div className="scene-image-container">
                <img
                  src="/assets/images/Petting-cat.jpeg"
                  alt="pet"
                  className="left-image"
                />
                <img
                  src="/assets/images/Jump-over-cat.jpeg"
                  alt="jump"
                  className="right-image"
                />
              </div>
              <div className="button-container">
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => setScene("gameOver2", true)}
                >
                  🐾 Pet the Cat
                </button>
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => makeChoice("climb-Up", false)}
                >
                  🏃 Jump over the Cat
                </button>
              </div>
            </>
          )}
          {scene === "biscuitremains" && (
            <>
              <p className="game-text">
                🐱 The cat stares at you. Do you try to pet it or move past?
              </p>

              <div className="scene-image-container">
                <img
                  src="/assets/images/Cat-appears.jpeg"
                  alt="Lift"
                  className="left-image"
                />
                <img
                  src="/assets/images/Jump-over-cat.jpeg"
                  alt="Stairs"
                  className="right-image"
                />
              </div>
              <div className="button-container">
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => makeChoice("ghostchoice", false)}
                >
                  🐾 Pet the Cat
                </button>
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => makeChoice("climb-Up", false)}
                >
                  🏃 Jump over the Cat
                </button>
              </div>
            </>
          )}
          {scene === "ghostchoice" && (
            <>
              <p className="game-text">
                👻 Ghost approaches you. What do you do?
              </p>
              <div className="scene-image-container">
                <img
                  src="/assets/images/Give-biscuit-ghost.jpeg"
                  alt="Lift"
                  className="left-image"
                />
                <img
                  src="/assets/images/Dontgive-biscuit-ghost.jpeg"
                  alt="Stairs"
                  className="right-image"
                />
              </div>
              <div className="button-container">
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => makeChoice("ghosthappy", false)}
                >
                  🍪 Give the Biscuit
                </button>
                <button
                  className="game-button"
                  onMouseEnter={playHoverSound}
                  onClick={() => makeChoice("gameOver2", true)}
                >
                  🏃 Don't give biscuit
                </button>
              </div>
            </>
          )}
          {scene === "ghosthappy" && (
            <>
              <p className="game-text">
                👻 Ghost stares at you... and then disappears
              </p>
              <button
                className="game-button"
                onMouseEnter={playHoverSound}
                onClick={() => makeChoice("climb-Up", false)}
              >
                🚶 Climb up
              </button>
            </>
          )}
          {scene === "petCat" && (
            <>
              <p className="game-text">
                🦷 The cat bites you! 👻 A ghost appears behind you...
              </p>
              <button
                className="game-button"
                onMouseEnter={playHoverSound}
                onClick={() => makeChoice("gameOver2", true)}
              >
                🏃 Run away!
              </button>
            </>
          )}

          {scene === "climb-Up" && (
            <>
              <p className="game-text">Continue</p>
              <button
                className="game-button"
                onMouseEnter={playHoverSound}
                onClick={() => makeChoice("win", false)}
              >
                🚶 Climb up
              </button>
            </>
          )}

          {scene === "gameOver1" && (
            <>
              <video autoPlay muted className="game-over-video">
                <source src="/assets/videos/watchman-g.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="game-text-gameover">
                ☠️ GAME OVER! You made too many bad choices...(watchman)
              </p>
              <button
                className="game-button-gameover"
                onMouseEnter={playHoverSound}
                onClick={() => navigate("/")}
              >
                Return to Menu
              </button>
            </>
          )}
          {scene === "gameOver2" && (
            <>
              <video autoPlay className="game-over-video">
                <source
                  src="/assets/videos/gameover-ghost.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <p className="game-text-gameover">
                ☠️ GAME OVER! You made too many bad choices...(ghost)
              </p>
              <button
                className="game-button-gameover"
                onMouseEnter={playHoverSound}
                onClick={() => navigate("/")}
              >
                Return to Menu
              </button>
            </>
          )}
          {scene === "win" && (
            <>
              {" "}
              <video autoPlay className="game-over-video">
                <source src="/assets/videos/win-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="game-text-win">
                🎉 Congratulations! You survived and reached the party!
              </p>
              <button
                className="game-button-win"
                onMouseEnter={playHoverSound}
                onClick={() => navigate("/")}
              >
                Play Again?
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;
