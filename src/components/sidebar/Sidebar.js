import { useState } from "react";
import './Sidebar.css'

// Define the TreeNode component - represents a single node in the tree
const TreeNode = ({node}) => {
    //Check state of
    const [isOpen, setIsOpen] = useState(false);
    //check if node has children
    const hasChildren = node.children && node.children.length > 0;

    return (
        //CLick changes the state of isOpen
        //Change cursor to pointer if node has children
        //If node has children, display open folder icon, else display closed folder icon or file icon
        <div style={{marginLeft: "20px"}}>
            <div
            onClick={() => hasChildren && setIsOpen(!isOpen)}
            style={{ cursor: hasChildren ? "pointer" : "default" }}>

            {hasChildren ? (isOpen ? "📂" : "📁") : "📄"} {node.name}

            </div>
        {isOpen && hasChildren && node.children.map((child,index) => (<TreeNode key={index} node={child} />))}
        </div>
    );

};

const Sidebar = ({ data }) => {
    return (
      <div className="sidebar">
        {data.map((node, index) => (
          <TreeNode key={index} node={node} />
        ))}
      </div>
    );
  };

export default Sidebar;