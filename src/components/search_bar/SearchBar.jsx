import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import './SearchBar.css';

const SearchBar = ({ csvFile }) => {
    const [data, setData] = useState([]);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const suggestionsRef = useRef(null);
    const itemRefs = useRef([]);

    // Load data from CSV
    useEffect(() => {
        Papa.parse(csvFile, {
            download: true,
            header: true,
            complete: (results) => {
                setData(results.data);
            },
            error: (error) => console.error('CSV Load Error:', error)
        });
    }, [csvFile]);

    // Handle changes in the search field
    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            const filtered = data.filter(item =>
                item.typeName && item.typeName.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setHighlightedIndex(-1);
        } else {
            setSuggestions([]);
        }
    };

    // Handle keyboard events
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prevIndex) => {
                const nextIndex = Math.min(prevIndex + 1, suggestions.length - 1);
                scrollToItem(nextIndex);
                return nextIndex;
            });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prevIndex) => {
                const nextIndex = Math.max(prevIndex - 1, 0);
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
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    };

    const handleSelect = (item) => {
        setQuery(item.typeName);
        setSuggestions([]);
        setHighlightedIndex(-1);
    };

    return (
        <div className="search-bar-container">
            <input
                type="text"
                className="search-bar-placeholder"
                placeholder="Type for search..."
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list" ref={suggestionsRef}>
                    {suggestions.map((item, index) => (
                        <li
                            key={index}
                            ref={(el) => (itemRefs.current[index] = el)}
                            onClick={() => handleSelect(item)}
                            className={index === highlightedIndex ? 'highlighted' : ''}
                        >
                            {item.typeName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
