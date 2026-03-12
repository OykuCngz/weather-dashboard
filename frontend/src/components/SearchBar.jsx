import React from 'react';
import { Search, Loader2, Clock } from 'lucide-react';

const SearchBar = ({ onSearch, history, loading }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const input = e.target.elements.city.value.trim();
        if (input) onSearch(input);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-inner">
                    <Search className="search-icon" size={20} />
                    <input
                        name="city"
                        type="text"
                        placeholder="Explore the weather..."
                        required
                    />
                    {loading ? (
                        <Loader2 className="spinner" size={18} />
                    ) : (
                        <button type="submit">Search</button>
                    )}
                </div>
            </form>

            {history.length > 0 && (
                <div className="recent-searches">
                    <div className="recent-header">
                        <Clock size={14} />
                        <span>Recent</span>
                    </div>
                    <div className="recent-list">
                        {history.map((city, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSearch(city)}
                                className="recent-chip"
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
