import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/homepage.css";
import "./styles/loading.css"; // Import loading screen styles

function Homepage() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading screen
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

  // Effect to handle navigation after loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        navigate("/game");
      }, 3000); // Navigate after 3 seconds

      // Cleanup function to clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [isLoading, navigate]);

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play();
    }
  };

  const handlePlayClick = () => {
    setIsLoading(true); // Show loading screen
    // Optional: Stop lobby music if needed
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const quitGame = () => {
    if (window.confirm("Are you sure you want to quit?")) {
      window.open("about:blank", "_self");
      window.close();
    }
  };

  // Render Loading Screen if isLoading is true
  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loading-text">Loading...</div>
        {/* Optional: Add a spinner or animation here */}
      </div>
    );
  }

  // Render Homepage if not loading
  return (
    <div className="homepage flex items-center justify-center h-screen">
      {/* Background & Hover Sounds */}
      <audio ref={audioRef} src="/assets/sounds/lobby-music.mp3" loop hidden />
      <audio ref={hoverSoundRef} src="/assets/sounds/hover-sound.mp3" hidden />

      <div className="text-container text-center">
        <div className="menu-container">
          <h1 className="spooky-text">INSTINCT: AN INTERACTIVE STORY</h1>
          <div className="menu">
            <button
              className="menu-button"
              onMouseEnter={playHoverSound}
              onClick={handlePlayClick} // Updated onClick handler
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
              className="menu-button modal-close-button mt-6"
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
