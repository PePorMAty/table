import { Route, Routes } from "react-router-dom";
import "./App.css";
import TableP from "./features/table/TableP";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<TableP />} />
      </Routes>
    </div>
  );
}

export default App;
