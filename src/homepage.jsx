import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/homepage.css";

function Homepage() {
  const [showModal, setShowModal] = useState(false);
  const audioRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current
          .play()
          .catch((err) => console.log("Autoplay blocked:", err));
      }
    };

    document.addEventListener("click", playAudio, { once: true });
    playAudio(); // Attempt autoplay

    return () => {
      document.removeEventListener("click", playAudio);
    };
  }, []);

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play();
    }
  };

  const quitGame = () => {
    if (window.confirm("Are you sure you want to quit?")) {
      window.open("about:blank", "_self");
      window.close();
    }
  };

  return (
    <div className="homepage flex items-center justify-center h-screen">
      {/* Background & Hover Sounds */}
      <audio ref={audioRef} src="src/assets/lobby-music.mp3" loop hidden />
      <audio ref={hoverSoundRef} src="src/assets/hover-sound.mp3" hidden />

      <div className="text-container text-center">
        <h1 className="spooky-text">INSTINCT: AN INTERACTIVE STORY</h1>

        <div className="menu-container">
          <div className="menu">
            <button
              className="menu-button"
              onMouseEnter={playHoverSound}
              onClick={() => navigate("/game")}
            >
              PLAY
            </button>
            <button
              className="menu-button"
              onMouseEnter={playHoverSound}
              onClick={() => setShowModal(true)}
            >
              ABOUT
            </button>
            <button
              className="menu-button"
              onMouseEnter={playHoverSound}
              onClick={quitGame}
            >
              QUIT
            </button>
            <div className="Headphones">
              <p className="text-red-500 text-lg mt-4 text-center">
                ⚠ Use Headphones for Better Experience ⚠
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">GAME INSTRUCTIONS</h2>
            <p className="modal-text">
              Welcome to <strong>INSTINCT</strong> <br></br>AN INTERACTIVE STORY
              <br />- Every choice you make <b>affects the story</b>.
              <br />
              <br />
              Make decisions <b>wisely</b>. The endings will change based on
              your actions.
              <br />
            </p>
            <button
              className="menu-button mt-6 "
              onClick={() => setShowModal(false)}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
