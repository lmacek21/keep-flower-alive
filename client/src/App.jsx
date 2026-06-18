import Navbar from './components/Navbar.jsx'

export default function App({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
