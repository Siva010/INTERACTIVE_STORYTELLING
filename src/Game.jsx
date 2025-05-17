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
  const sceneTransitionTimeoutRef = useRef(null); // Ref to store timeout ID
  const [isHoveringChoice, setIsHoveringChoice] = useState(false); // State for choice hover
  const [sceneHoverCount, setSceneHoverCount] = useState(0);
  const [mouseHasLeftButtonArea, setMouseHasLeftButtonArea] = useState(true);
  const [applyIntenseEffect, setApplyIntenseEffect] = useState(false);

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
    transitioning: "", // No music during transition
  };

  // Function to handle scene transitions with a delay
  const transitionToScene = (nextScene, delay = 400) => {
    // Clear any existing transition timeout
    if (sceneTransitionTimeoutRef.current) {
      clearTimeout(sceneTransitionTimeoutRef.current);
    }
    // Don't play transition sound if going to start or game over/win
    const playTransitionSound = ![
      "start",
      "gameOver1",
      "gameOver2",
      "win",
    ].includes(nextScene);

    setScene("transitioning"); // Show transition overlay

    if (playTransitionSound) {
      const transitionSound = new Audio("/assets/sounds/scene-transition.mp3"); // Add a transition sound
      transitionSound.volume = 0.6;
      transitionSound
        .play()
        .catch((e) => console.log("Transition sound error:", e));
    }

    sceneTransitionTimeoutRef.current = setTimeout(() => {
      setScene(nextScene);
      sceneTransitionTimeoutRef.current = null; // Clear ref after execution
    }, delay);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (sceneTransitionTimeoutRef.current) {
        clearTimeout(sceneTransitionTimeoutRef.current);
      }
    };
  }, []);

  // Change background music when the scene updates (excluding transition)
  useEffect(() => {
    if (scene !== "transitioning" && audioRef.current) {
      const newSrc = sceneMusic[scene] || "/assets/default.mp3";
      if (audioRef.current.src !== newSrc) {
        audioRef.current.src = newSrc;
        audioRef.current.loop = !["gameOver1", "gameOver2", "win"].includes(
          scene
        ); // Loop unless it's end screen
        audioRef.current.volume = scene === "win" ? 0.8 : 0.5; // Adjust volume maybe?
        audioRef.current
          .play()
          .catch((err) => console.log("Autoplay blocked:", err));
      }
    }
    // Optionally fade out music during transition
    else if (scene === "transitioning" && audioRef.current) {
      // You could implement a fade out here if desired
      // audioRef.current.pause(); // Or just pause immediately
    }
  }, [scene]);

  // Reset hover count on scene change
  useEffect(() => {
    setSceneHoverCount(0); // Reset count for new scene
    setMouseHasLeftButtonArea(true); // Reset flag
    setApplyIntenseEffect(false); // Ensure effect is off initially
    setIsHoveringChoice(false); // Ensure this is reset too
  }, [scene]);

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play();
    }
  };

  const makeChoice = (nextScene, isBad) => {
    const finalScenes = ["gameOver1", "gameOver2", "win"];

    if (isBad) {
      const newBadChoices = badChoices + 1;
      setBadChoices(newBadChoices);
      if (newBadChoices >= 2) {
        const gameOverScene =
          nextScene.includes("ghost") || nextScene.includes("cat")
            ? "gameOver2"
            : "gameOver1";
        // Go directly to game over scene
        setScene(gameOverScene);
      } else {
        // Transition for intermediate bad choices
        transitionToScene(nextScene);
      }
    } else {
      // Check if it's a final scene (like win)
      if (finalScenes.includes(nextScene)) {
        // Go directly to final scene
        setScene(nextScene);
      } else {
        // Transition for regular good choices
        transitionToScene(nextScene);
      }
    }
  };

  // Handlers for intense hover effect (modified)
  const handleChoiceMouseEnter = () => {
    playHoverSound();
    setIsHoveringChoice(true);
    let currentCount = sceneHoverCount;
    if (mouseHasLeftButtonArea) {
      currentCount = sceneHoverCount + 1;
      setSceneHoverCount(currentCount);
      setMouseHasLeftButtonArea(false); // Mouse is now inside button area
    }
    if (currentCount >= 2) {
      setApplyIntenseEffect(true); // Activate effect on second hover onwards
    }
  };

  const handleChoiceMouseLeave = () => {
    setIsHoveringChoice(false);
    setMouseHasLeftButtonArea(true); // Mouse has left the button area
    setApplyIntenseEffect(false); // Deactivate effect immediately on leave
  };

  return (
    <div
      className={`game-container ${
        applyIntenseEffect ? "intense-hover-active" : ""
      }`}
    >
      {/* Dynamic Background Music */}
      <audio ref={audioRef} hidden />{" "}
      {/* Removed loop here, handled in useEffect */}
      <audio ref={hoverSoundRef} src="/assets/hover-sound.mp3" hidden />
      {/* Transition Overlay */}
      {scene === "transitioning" && <div className="transition-overlay"></div>}
      {/* Render scene content only if not transitioning */}
      {scene !== "transitioning" && (
        <div className="game-content">
          {/* Message scenes */}
          {scene === "start" && (
            <div className="game-message">
              <p className="game-text">📩 (Pawan): "Have you arrived yet?"</p>
              <audio src="/assets/sounds/message-sound.mp3" autoPlay hidden />
              <button
                className="game-button1"
                onMouseEnter={playHoverSound}
                onClick={() => setScene("enterApartment")} // Use setScene directly
              >
                "Yeah, I am right in front of the gate."
              </button>
            </div>
          )}
          {scene === "enterApartment" && (
            <div className="game-message">
              <p className="game-text">
                📩 (Pawan): "Cool, my house is on the 3rd floor, flat 13B. I
                will be waiting outside."
              </p>
              <audio src="/assets/sounds/message-sound.mp3" autoPlay hidden />
              <button
                className="game-button1"
                onMouseEnter={playHoverSound}
                onClick={() => setScene("choice")} // Use setScene directly
              >
                "Alright, coming..."
              </button>
            </div>
          )}
          {/* Enter Apartment choices*/}
          {/* Wrap scenes in a container that fades in? We have .scene-content */}
          <div className="scene-content">
            {scene === "choice" && (
              <>
                <p className="game-text">
                  🚪 You enter the apartment. How do you go up?
                </p>
                <div className="choice-container">
                  <div className="choice-option">
                    <img
                      src="/assets/images/Lift.jpeg"
                      alt="Lift"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => {
                        setBiscuitDropped(true);
                        makeChoice("lift", true);
                      }}
                    >
                      🛗 Take the Lift
                    </button>
                  </div>
                  <div className="choice-option">
                    <img
                      src="/assets/images/Stairs.png"
                      alt="Stairs"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => makeChoice("stairs", false)}
                    >
                      🚶 Take the Stairs
                    </button>
                  </div>
                </div>
              </>
            )}
            {scene === "lift" && (
              <>
                <p className="game-text">
                  🚨 The lift stops working! What do you do?
                </p>
                <div className="choice-container">
                  <div className="choice-option">
                    <img
                      src="/assets/images/Shouting.jpeg"
                      alt="Shouting"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => setScene("watchman", true)} // Use makeChoice for consistency
                    >
                      📣 Shout for help
                    </button>
                  </div>
                  <div className="choice-option">
                    <img
                      src="/assets/images/Breaking.jpeg"
                      alt="Breaking"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => makeChoice("biscuit-fell", false)} // Use makeChoice
                    >
                      🏋️ Break open the lift
                    </button>
                  </div>
                </div>
              </>
            )}
            {scene === "biscuit-fell" && (
              <div>
                <p className="game-text ">
                  Biscuit fell down from your pocket, while you are getting out.
                </p>
                {/* Removed button container div, button is now standalone */}
                <button
                  className="game-button" // Use standard button class
                  onMouseEnter={handleChoiceMouseEnter}
                  onMouseLeave={handleChoiceMouseLeave}
                  onClick={() => transitionToScene("catAngry", false)} // Use transition directly
                >
                  continue..
                </button>
              </div>
            )}
            {scene === "stairs" && (
              <>
                {/* ... stairs scene JSX using makeChoice ... */}
                <p className="game-text">
                  🐱 You see a **Cute Cat** on the stairs. What do you do?
                </p>
                <div className="choice-container">
                  <div className="choice-option">
                    <img
                      src="/assets/images/Give-biscuit-cat.jpeg"
                      alt="give"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => makeChoice("catAngry", true)}
                    >
                      🍪 Give Biscuit to the Cat
                    </button>
                  </div>
                  <div className="choice-option">
                    <img
                      src="/assets/images/Dontgive-biscuit-cat.jpeg"
                      alt="dont"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => makeChoice("biscuitremains", false)}
                    >
                      ❌ Don't Give Biscuit
                    </button>
                  </div>
                </div>
              </>
            )}
            {scene === "watchman" && (
              <>
                {/* ... watchman scene JSX using makeChoice ... */}
                <p className="game-text">
                  👮 Watchman slowly walks towards you....
                </p>
                <button
                  className="game-button"
                  onMouseEnter={handleChoiceMouseEnter}
                  onMouseLeave={handleChoiceMouseLeave}
                  onClick={() => makeChoice("gameOver1", true)}
                >
                  Ask for Help
                </button>
              </>
            )}
            {scene === "catAngry" && (
              <>
                {/* ... catAngry scene JSX using makeChoice ... */}
                <p className="game-text">🐱 You Find Cat staring at you...</p>
                <div className="choice-container">
                  <div className="choice-option">
                    <img
                      src="/assets/images/Petting-cat.jpeg"
                      alt="pet"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => setScene("gameOver2", true)} // Game Over here
                    >
                      🐾 Pet the Cat
                    </button>
                  </div>
                  <div className="choice-option">
                    <img
                      src="/assets/images/Jump-over-cat.jpeg"
                      alt="jump"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => makeChoice("climb-Up", false)}
                    >
                      🏃 Jump over the Cat
                    </button>
                  </div>
                </div>
              </>
            )}
            {scene === "biscuitremains" && (
              <>
                {/* ... biscuitremains scene JSX using makeChoice ... */}
                <p className="game-text">
                  🐱 The cat stares at you. Do you try to pet it or move past?
                </p>
                <div className="choice-container">
                  <div className="choice-option">
                    <img
                      src="/assets/images/Cat-appears.jpeg"
                      alt="Pet"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => makeChoice("ghostchoice", false)}
                    >
                      🐾 Pet the Cat
                    </button>
                  </div>
                  <div className="choice-option">
                    <img
                      src="/assets/images/Jump-over-cat.jpeg"
                      alt="Jump"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => makeChoice("climb-Up", false)}
                    >
                      🏃 Jump over the Cat
                    </button>
                  </div>
                </div>
              </>
            )}
            {scene === "ghostchoice" && (
              <>
                {/* ... ghostchoice scene JSX using makeChoice ... */}
                <p className="game-text">
                  👻 A ghost Appears...What will you do?
                </p>
                <div className="choice-container">
                  <div className="choice-option">
                    <img
                      src="/assets/images/Give-biscuit-ghost.jpeg"
                      alt="Give biscuit"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => makeChoice("ghosthappy", false)}
                    >
                      🍪 Give Biscuit to the Ghost
                    </button>
                  </div>
                  <div className="choice-option">
                    <img
                      src="/assets/images/Dontgive-biscuit-ghost.jpeg"
                      alt="Attack ghost"
                      className="choice-image"
                    />
                    <button
                      className="game-button"
                      onMouseEnter={handleChoiceMouseEnter}
                      onMouseLeave={handleChoiceMouseLeave}
                      onClick={() => makeChoice("gameOver2", true)}
                    >
                      🍪 Hide the Biscuit
                    </button>
                  </div>
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
                  onMouseEnter={handleChoiceMouseEnter}
                  onMouseLeave={handleChoiceMouseLeave}
                  onClick={() => transitionToScene("climb-Up", false)} // Keep transition here
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
                  onMouseEnter={handleChoiceMouseEnter}
                  onMouseLeave={handleChoiceMouseLeave}
                  onClick={() => makeChoice("gameOver2", true)} // makeChoice handles direct scene change
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
                  onMouseEnter={handleChoiceMouseEnter}
                  onMouseLeave={handleChoiceMouseLeave}
                  onClick={() => setScene("win")} // Go directly to win scene, skip transition
                >
                  🚶 Climb up
                </button>
              </>
            )}

            {/* Game Over and Win Scenes */}
            {scene === "gameOver1" && (
              <>
                <video autoPlay muted className="game-over-video">
                  <source
                    src="/assets/videos/watchman-g.mp4"
                    type="video/mp4"
                  />
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
          </div>{" "}
          {/* End of scene-content */}
        </div> /* End of game-content */
      )}{" "}
      {/* End of conditional rendering for !transitioning */}
    </div>
  );
}

export default Game;
