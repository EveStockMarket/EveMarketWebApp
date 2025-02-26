import { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import Fuse from 'fuse.js';
import './SearchBar.css';

const SearchBar = ({ txtFile, onSelect, onSettingsClick }) => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [fuseInstance, setFuseInstance] = useState(null);

  const suggestionsRef = useRef(null);
  const inputRef = useRef(null); 
  const itemRefs = useRef([]);

  // Load data from TXT and initialize Fuse
  useEffect(() => {
    fetch(txtFile)
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        setData(lines);
        const fuse = new Fuse(lines, {
          threshold: 0.3,
          includeScore: true,
        });
        setFuseInstance(fuse);
      })
      .catch(error => console.error('TXT Load Error:', error));
  }, [txtFile]);

  // Debounced search handler with cleanup
  const debouncedSearch = useCallback(
    debounce((value) => {
      if (fuseInstance) {
        const results = fuseInstance.search(value);
        const filtered = results.map(result => result.item).slice(0, 10);
        setSuggestions(filtered);
        setHighlightedIndex(-1);
      }
    }, 300),
    [fuseInstance]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Set the width of the suggestions list based on the input
  useEffect(() => {
    if (suggestionsRef.current && inputRef.current) {
      const inputWidth = inputRef.current.offsetWidth;
      suggestionsRef.current.style.width = `${inputWidth}px`;
    }
  }, [suggestions]);

  // Handle changes in the search field
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === '') {
      setSuggestions([]);
    } else {
      debouncedSearch(value);
    }
  };

  // Handle keyboard events with wrapping navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % suggestions.length;
        scrollToItem(nextIndex);
        return nextIndex;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const nextIndex = (prevIndex - 1 + suggestions.length) % suggestions.length;
        scrollToItem(nextIndex);
        return nextIndex;
      });
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightedIndex]);
    }
  };

  // Function to scroll the list to the active item
  const scrollToItem = (index) => {
    const item = itemRefs.current[index];
    if (item && item.scrollIntoView) {
      item.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
      });
    }
  };

  const handleSelect = (item) => {
    setQuery(item);
    setSuggestions([]);
    setHighlightedIndex(-1);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div className="search-bar-container">
      <img src="/assets/main_icons/search_icon.png" alt="Search icon" className="search-icon" />
      <input
        ref={inputRef}
        type="text"
        className="search-bar-placeholder"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type for search..."
      />
      <img src="/assets/main_icons/filter_icon.png" alt="Filter icon" className="filter-icon" />
      <img
        src="/assets/main_icons/settings_icon.png"
        alt="Settings icon"
        className="settings-icon"
        onClick={onSettingsClick}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list" ref={suggestionsRef}>
          {suggestions.map((item, index) => (
            <li
              key={item}
              ref={(el) => {
                if (el) itemRefs.current[index] = el;
              }}
              onClick={() => handleSelect(item)}
              className={index === highlightedIndex ? 'highlighted' : ''}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;