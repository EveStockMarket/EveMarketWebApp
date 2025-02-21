import Sidebar from './components/sidebar/Sidebar';
import SidebarData from './components/sidebar/SidebarData';
import './App.css';

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar data={SidebarData} />

      <div style={{ marginLeft: "20px", padding: "10px" }}>
        <h1>Eve market item menu</h1>
        <p>Click on the folders to expand/collapse them</p>
      </div>
    </div>
  );
}

export default App;
