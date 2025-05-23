import './Header.css'
import { NavLink } from 'react-router-dom'
import Logo from '../../Images/logo.svg'

function Header() {
  return (
    <>
    <header className="flex items-center justify-evenly w-full fixed z-10 gap-[20rem] headers">
      <NavLink to='/'>
      <div className="logo">
        <img src={Logo} alt="logo" />
        <h1 className='text-2xl text-[#4E84C1] font-bold'>MedLearn</h1>
      </div>
      </NavLink>
      <div className="link-nav">
        <ul>
          <li><NavLink to='/' className={({isActive}) => isActive ? "active" : "deactive" }> HOME </NavLink></li>
          <li><NavLink to='/courses' className={({isActive}) => isActive ? "active" : "deactive"}> COURSES </NavLink></li>
          <li><NavLink to='/about' className={({isActive}) => isActive ? "active" : "deactive"}> ABOUT </NavLink></li>
          <li><NavLink to='/contact' className={({isActive}) => isActive ? "active" : "deactive"}> CONTACT </NavLink></li>
          <li><NavLink to='/chat' className={({isActive}) => isActive ? "active" : "deactive"}> HELP </NavLink></li>

        </ul>
      </div>
      <div className='flex gap-6'>
        <NavLink to='/adminLogin' className={({isActive}) => isActive ? "deactive" : "deactive"}><button  style={{fontSize:"17px",fontWeight:"700"}}>ADMIN</button></NavLink>
      </div>
    </header>
    <div className="gapError"></div>
    </>
  )
}

export default Header
