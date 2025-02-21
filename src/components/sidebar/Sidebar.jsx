import { useState, useEffect } from "react";
import Papa from "papaparse";
import './Sidebar.css';

// TreeNode component which represents a single node in the tree
const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ marginLeft: "20px" }}>
      <div
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{ cursor: hasChildren ? "pointer" : "default" }}
      >
        {hasChildren ? (isOpen ? "📂" : "📁") : "📄"} {node.name || "Unnamed Node"}
      </div>
      {isOpen &&
        hasChildren &&
        node.children.map((child, index) => (
          <TreeNode key={index} node={child} />
        ))}
    </div>
  );
};

// Sidebar component
const Sidebar = ({ marketGroupsFile, typesFile }) => {
  const [treeData, setTreeData] = useState([]);

  // Parse the CSV files
  useEffect(() => {
    Promise.all([loadCSV(marketGroupsFile), loadCSV(typesFile)])
      .then(([marketGroups, types]) => {
        console.log("Market Groups Loaded:", marketGroups);
        console.log("Types Loaded:", types);

        try {
          const tree = buildTree(marketGroups, types);
          console.log("Generated Tree:", tree);
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

      if (groupId && groupMap[groupId]) {
        groupMap[groupId].children.push({
          name: itemName,
          children: [] 
        });
      } else {
        // Skiping items without a valid marketGroupID
        console.warn(`Skipped item '${itemName}'`);
      }
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

  // Rendering the tree structure
  return (
    <div className="sidebar">
      {treeData.length > 0 ? (
        treeData.map((node, index) => (
          <TreeNode key={index} node={node} />
        ))
      ) : (
        //Display loading message - optional xD - we are so back 
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Sidebar;
