import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Teacher from "./Teacher";
import Student from "./Student";

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/teacher/:roomId" element={<Teacher />} />
      <Route path="/student/:roomId" element={<Student />} />
      <Route path="/join/:url" element={<Home />} />
    </Routes>
  );
};

export default App;
