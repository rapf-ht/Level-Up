import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SigninForm from './components/signin'
import SignupForm from './components/signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SigninForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App