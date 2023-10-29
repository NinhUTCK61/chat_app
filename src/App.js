import { Routes, Route } from "react-router-dom";
import { ChatRoom, SignIn, SignUp } from "./views";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="signIn" element={<SignIn />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="/" element={<ChatRoom />} />
      </Routes>
    </div>
  );
}

export default App;
