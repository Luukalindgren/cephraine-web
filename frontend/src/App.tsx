import { FC } from "react";
import ThreeScene from "./components/ThreeScene";

const App: FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <ThreeScene />
    </div>
  );
};

export default App;
