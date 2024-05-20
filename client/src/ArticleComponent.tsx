import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const ArticleComponent: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const navigator = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${url}/articles`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const createArticle = async () => {
    try {
      const newArticle: Omit<Article, 'id'> = {
        title: "New Article",
        content: "Content of the new article.",
        keywords: "new,article",
        status: "draft",
        thumbnail_url: "http://example.com/thumbnail.jpg",
        media_files: "http://example.com/media.mp4"
      };
      const response = await fetch(`${url}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });
      if (!response.ok) {
        throw new Error('Failed to create article');
      }
      fetchArticles();
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  const incrementViewCount = async (id: number) => {
    try {
      const response = await fetch(`${url}/articles/${id}/view`, {
        method: 'PATCH'
      });
      if (!response.ok) {
        throw new Error('Failed to increment view count');
      }
      fetchArticles();
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  return (
    <div>
      <button onClick={createArticle}>Create Article</button>
      <button onClick={() => navigator(`/add-tag`)}>Show Tags & Add tag</button>
      {articles.map(article => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.content}</p>
          <button onClick={() => navigator(`/articles/${article.id}`)}>View Details</button>
          <button onClick={(e) => { e.stopPropagation(); incrementViewCount(article.id); }}>Increment View Count</button>
          
        </div>
      ))}
    </div>
  );
};

export default ArticleComponent;
