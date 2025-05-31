import { Routes, Route } from "react-router-dom";
import Homepage from "./homepage";
import Game from "./Game";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}

export default App;
