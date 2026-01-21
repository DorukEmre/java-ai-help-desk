import { Link } from "react-router-dom"

function Header() {

  return (
    <header className="d-flex justify-content-between p-4 border-bottom">
      <h1>Service Desk</h1>
      <div className="d-flex gap-2">
        <Link to="/login">Login</Link>
      </div>
    </header>
  )
}

export default Header
