
import { Routes, Route } from 'react-router-dom';
import SignIn from './component/SignIn';
import SignUp from './component/SignUp';
import ChatRoom from './component/ChatRoom';
import ModalAddRoom from './component/ChatRoom/ModalAddRoom';
import InviteModal from './component/ChatRoom/InviteModal';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <>
      <Helmet>
          <meta charSet="utf-8" />
          <title>Chat App</title>
      </Helmet>
      <div className="App">
        <Routes>
          <Route path='signIn' element={<SignIn/>}/>
          <Route path='signUp' element={<SignUp/>}/>
          <Route path='/' element={<ChatRoom/>}/>
        </Routes>
        <ModalAddRoom/>
        <InviteModal/>
      </div>
    </>
  );
}

export default App;
