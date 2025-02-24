import { useState, useEffect } from "react";
import Papa from "papaparse";
import SearchBar from "../search_bar/SearchBar";
import './Sidebar.css';

// Displaying icon for the node
function DisplayIcon({ hasChildren, isOpen, node }) {
  const getIcon = () => {
    if (!hasChildren && node.itemID) {
      return <span className="file-text"></span>;
    }
    if (isOpen) {
      return <img src="./src/assets/sidebar/expand-icon.png" alt="Open folder icon" className="sidebar-icon-marker" />;
    }
    return <img src="./src/assets/sidebar/diminish-icon.png" alt="Closed folder icon" className="sidebar-icon-marker" />;
  };

  const getNodeIcon = () => {
    if (node.iconId) {
      const iconPath = `./src/assets/icons/${node.iconId}_32.png`;
      return <img src={iconPath} alt={`${node.name} icon`} className="sidebar-icon" />;
    }
    return <span></span>;
  };

  return (
    <span className="folder-text">
      {getIcon()}
      {getNodeIcon()}
      {node.name || "Unnamed Node"}
    </span>
  );
}

// TreeNode component which represents a single node in the tree
const TreeNode = ({ node, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const handleSelect = () => {
    if (onSelect) {
      if (node.itemID) {
        onSelect(node.itemID, node.iconId);
      // } else if (node.marketGroupID) {
      //   onSelect(node.marketGroupID, node.iconId);
      }
    }
  };

  return (
    <div className="tree-node">
      <div
        onClick={() => {
          if (hasChildren) setIsOpen(!isOpen);
          handleSelect();
        }}
        style={{ cursor: "pointer" }}
      >
        {<DisplayIcon hasChildren={hasChildren} isOpen={isOpen} node={node} />}
      </div>
      {isOpen &&
        hasChildren &&
        node.children.map((child, index) => (
          <TreeNode key={index} node={child} onSelect={onSelect}/>
        ))}
    </div>
  );
};

// Sidebar component
const Sidebar = ({ marketGroupsFile, typesFile,onSelect }) => {
  const [treeData, setTreeData] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemIconId, setSelectedItemIconId] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(250); // Set an initial width

  const MIN_SIDEBAR_WIDTH = 150; 
  const MAX_SIDEBAR_WIDTH = 500; 

  // Parse the CSV files
  useEffect(() => {
    Promise.all([loadCSV(marketGroupsFile), loadCSV(typesFile)])
      .then(([marketGroups, types]) => {
        try {
          const tree = buildTree(marketGroups, types);
          setTreeData(tree);
        } catch (error) {
          console.error("Error building tree:", error);
        }
      })
      .catch(error => {
        console.error("Error loading CSV files:", error);
      });
  }, [marketGroupsFile, typesFile]);

  // Function for loading CSV files
  const loadCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        download: true,
        header: true,
        skipEmptyLines: true, 
        complete: (results) => {
          // Cleaning and filtering data
          const filteredData = results.data.map(row => {
            const cleanedRow = {};
            Object.keys(row).forEach(key => {
              let value = row[key]?.trim();
              if (value === "" || value.toLowerCase() === "none") {
                value = null;
              }
              cleanedRow[key] = value;
            });
            return cleanedRow;
          });
          resolve(filteredData);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  };

  // Function for building and sorting the tree structure
  const buildTree = (marketGroups, types) => {
    const groupMap = {};

    // Create a map of market groups
    marketGroups.forEach(group => {
      const groupId = group.marketGroupID;
      const groupName = group.marketGroupName?.trim() || "Unnamed Group";

      if (groupId) {
        groupMap[groupId] = {
          ...group,
          marketGroupID: groupId,
          name: groupName,
          iconId: group.iconID || null,
          children: [],
        };
      } else {
        console.warn("Group missing marketGroupID:", group);
      }
    });

    // Building parent-child relationships
    marketGroups.forEach(group => {
      const parentId = group.parentGroupID;
      const groupId = group.marketGroupID;

      if (parentId && groupMap[parentId] && groupMap[groupId]) {
        groupMap[parentId].children.push(groupMap[groupId]);
      } else if (parentId && !groupMap[parentId]) {
        console.warn(`Parent group with ID ${parentId} not found in group ${groupId}`);
      }
    });

    // Assign items to correct market groups and skip invalid items
    types.forEach(item => {
      const groupId = item.marketGroupID;
      const itemName = item.typeName?.trim() || "Unnamed Item";
      const isPublished = item.published === "1";

      if (groupId && groupMap[groupId] && isPublished) {
        groupMap[groupId].children.push({
          name: itemName,
          itemID: item.typeID,
          iconId: item.iconID || null,
          children: [] 
        });
      }
      // } else if (!isPublished) {
      //   console.warn(`Skipped unpublished item '${itemName}'`);
      // } else {
      //   console.warn(`Skipped item '${itemName}' - invalid marketGroupID`);
      // }
    });

    // Sorting function for nodes - groups and items
    const sortNodes = (nodes) => {
      return nodes
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        .map(node => ({
          ...node,
          children: node.children ? sortNodes(node.children) : []
        }));
    };

    // Get root groups - wtihout parents
    const rootGroups = marketGroups
      .filter(group => !group.parentGroupID)
      .map(group => groupMap[group.marketGroupID])
      .filter(Boolean); 

      return sortNodes(rootGroups);
  };

  // Handle mouse events for resizing the sidebar
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    
    const onMouseMove = (moveEvent) => {
      const newWidth = sidebarWidth + (moveEvent.clientX - startX);
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  
  };

  // Rendering the tree structure
  return (
    <div className="sidebar" style={{ width: sidebarWidth }}>
      <div className="resize-handle" onMouseDown={handleMouseDown} />
  
      <div className="sidebar-content">
        {/* <h3 className="selected-item-header">Selected Item ID: {selectedItemId}</h3>
        <h3 className="selected-item-header">Selected Item Icon ID: {selectedItemIconId}</h3> */}
        <SearchBar txtFile={"/type_names.txt"}/>
        {treeData.length > 0 ? (
          treeData.map((node, index) => (
            <TreeNode key={index} node={node} onSelect={(id, iconId) => { 
              setSelectedItemId(id); 
              setSelectedItemIconId(iconId);
              if (onSelect) onSelect(id); 
            }} />
          ))
        ) : (
          <p className="login-label">Loading data...</p>
        )}
      </div>
    </div>
  );
  
};

export default Sidebar;
