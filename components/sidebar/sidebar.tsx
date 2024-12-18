import Nav from "../nav/nav";

type SidebarProps = {
  style?: any;
}

export default function Sidebar({
  style
}: SidebarProps) {
  return (
    <aside className={`sidebar flex flexCenter gap5 w100 h100`} style={style}>
      <Nav />
    </aside>
  )
}