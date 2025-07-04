import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ComputerEditorPage from "./pages/ComputerEditorPage";
import InstalledSoftwareEditorPage from "./pages/InstalledSoftwareEditorPage";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/computers/:idn" element={<ComputerEditorPageWrapper />} />
        <Route
          path="/installed-software/:idn"
          element={<InstalledSoftwareEditorPage />}
        />
      </Routes>
    </Router>
  );
}

// Wrapper jer ComputerEditorPage prima idn kao prop
import { useParams } from "react-router-dom";

function ComputerEditorPageWrapper() {
  const { idn } = useParams();
  return idn ? <ComputerEditorPage idn={idn} /> : <p>Missing computer ID</p>;
}
