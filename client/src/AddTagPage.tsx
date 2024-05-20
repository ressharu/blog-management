import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const url = import.meta.env.VITE_URL;

const AddTagPage: React.FC = () => {
    const [tagName, setTagName] = useState('');
    const [tags, setTags] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: tagName })
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`Tag added successfully: ${tagName}`);
                setTags([...tags, data]);  // Assume 'data' includes the newly added tag
            } else {
                console.error('Failed to add the tag:', data.message);
                setError(data.message || 'Failed to add the tag');
            }
        } catch (error) {
            console.error('Error adding tag:', error);
            setError(error.message || 'Error adding tag');
        }
    };

    const fetchTags = async () => {
        const response = await fetch(`${url}/tags`);
        if (!response.ok) {
            console.log('Failed to fetch tags');
            return;
        }
        const data = await response.json();
        setTags(data);
    };

    useEffect(() => {
        fetchTags();
    }, []);

    return (
        <div>
            <h1>Add New Tag</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="tagName">Tag Name:</label>
                <input
                    type="text"
                    id="tagName"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    required
                />
                <button type="submit">Add Tag</button>
            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <h2>Existing Tags</h2>
                <ul>
                    {tags.map((tag, index) => (
                        <li key={index}>{tag.tag}</li>  // Assuming 'tag' has a 'name' property
                    ))}
                </ul>
            </div>
            <button onClick={() => navigate(`/articles`)}>Home</button>
        </div>
    );
};

export default AddTagPage;
