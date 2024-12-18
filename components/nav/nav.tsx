import NavMenu from "./navmenu";
import Logo from "../logo/logo";

export class NavOptions {
  style?: any;
}

export default function Nav({
  style
}: NavOptions) {
  return (
    <nav className={`sidebarContainer spaceBetween h100 gap15 flex column`} style={style}>
      <Logo />
      <NavMenu />
    </nav>
  )
}