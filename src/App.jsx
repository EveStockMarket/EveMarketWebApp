import Sidebar from './components/sidebar/Sidebar';
import './App.css';

function App() {
  return (
    <div className = "App">
      <h1> Eve Online Market Browser</h1>
      <Sidebar
        marketGroupsFile = "/invMarketGroups.csv"  
        typesFile = "/invTypes.csv"
      />
    </div>
  );
}


export default App;
