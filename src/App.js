import logo from './logo.svg';
import { Routes, Route } from 'react-router-dom';
import SignIn from './component/SignIn';
import SignUp from './component/SignUp';
import ChatRoom from './component/ChatRoom';
import ModalAddRoom from './component/ChatRoom/ModalAddRoom';
import InviteModal from './component/ChatRoom/InviteModal';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='signIn' element={<SignIn/>}/>
        <Route path='signUp' element={<SignUp/>}/>
        <Route path='/' element={<ChatRoom/>}/>
      </Routes>
      <ModalAddRoom/>
      <InviteModal/>
    </div>
  );
}

export default App;
