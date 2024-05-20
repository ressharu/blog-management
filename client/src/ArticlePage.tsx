import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Article {
    id: number;
    title: string;
    content: string;
    keywords: string;
    status: string;
    thumbnail_url: string;
    media_files: string;
    view_count: number;
}

const url = import.meta.env.VITE_URL;

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Specify the types directly here.
  const [article, setArticle] = useState<Article | null>(null);
  const navigator = useNavigate();
  //const url = process.env.URL;

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await fetch(`${url}/articles/${id}`);
      const data = await response.json();
      setArticle(data);
    };

    fetchArticle();
  }, [id]);

  if (!article) {
    return <div>404 Not Found</div>;
  }

  return (
    <div>
      <h1>Title:{article.title}</h1>
      <p>Content:{article.content}</p>
        <p>Keywords:{article.keywords}</p>
        <p>Status:{article.status}</p>
        <p>Thumbnail URL:{article.thumbnail_url}</p>
        <p>Media Files:{article.media_files}</p>
        <p>View: {article.view_count}</p>
      <button onClick={() => navigator(`/articles/${article.id}/edit`)}>Edit</button>
      <button onClick={() => navigator(`/articles`)}>Home</button>
    </div>
  );
};

export default ArticlePage;
