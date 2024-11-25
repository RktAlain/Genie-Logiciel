import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './components/login/Login';
import { Home } from './components/home/Home';


function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
