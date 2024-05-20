import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Article {
    id: number;
    title: string;
    content: string;
    keywords: string;
    status: string;
    thumbnail_url: string;
    media_files: string;
}

const url = import.meta.env.VITE_URL;

const ArticleEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);


    useEffect(() => {
        const fetchArticle = async () => {
            const response = await fetch(`${url}/articles/${id}`);
            if (!response.ok) {
                navigate('/404');
                return;
            }
            const data: Article = await response.json();
            setArticle(data);
        };

        fetchArticle();
    }, [id]);

    const deleteArticle = async (id: number) => {
        try {
            const response = await fetch(`${url}/articles/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete article');
            }
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    const fetchTags = async () => {
        const response = await fetch(`${url}/tags`);
        if (!response.ok) {
            navigate('/404');
            return;
        }
        const data = await response.json();
        setTags(data);
    };

    useEffect(() => {
        console.log(tags);
        fetchTags();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (article) {
            const response = await fetch(`${url}/articles/${article.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(article),
            });

            if (response.ok) {
                navigate(`/articles/${article.id}`);
            } else {
                console.error('Failed to update the article');
            }
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (article) {
            setArticle(prevArticle => ({ ...prevArticle as Article, [name]: value }));
        }
    };

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Title:</label>
            <input
                type="text"
                name="title"
                value={article.title || ''}
                onChange={handleChange}
                onKeyDown={(event) => {
                    // エンターキーが押されたときにフォームの送信を防止
                    if (event.key === 'Enter') {
                        event.preventDefault();
                    }
                }}
            />

            <label>Content:</label>
            <textarea
                name="content"
                value={article.content || ''}
                onChange={handleChange}
            />
            <label>Status:</label>
            <select name="status" value={article.status || ''}
                onChange={handleChange}>
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="private">private</option>
            </select>

            <label>Keywords:</label>
            <select name="keywords" value={article.keywords || ''} onChange={handleChange}>
                {tags.map((tagObject, index) => (
                    <option key={index} value={(tagObject as { tag: string }).tag}>{(tagObject as { tag: string }).tag}</option>
                ))}
            </select>
            <button onClick={() => navigate(`/add-tag`)}>Show Tags & Add tag</button>
            <button type="submit">Update Article</button>
            <button onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('本当にこの記事を削除しますか？')) {
                    deleteArticle(article.id);
                    navigate(`/articles`);
                }
            }}>Delete Article</button>
            <button type="button" onClick={() => navigate('/articles')}>Home</button>
        </form>
    );
};

export default ArticleEdit;
