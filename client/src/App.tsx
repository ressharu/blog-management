import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ArticlePage from './ArticlePage'; // 記事ページコンポーネントのインポート
import ArticleComponent from './ArticleComponent'; // 記事コンポーネントのインポート
import ArticleEdit from './ArticleEdit'; // 記事編集コンポーネントのインポート
import AddTagPage from './AddTagPage';  // AddTagPageのインポート

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/articles/:id" element={<ArticlePage />} /> // 記事ページコンポーネント
        <Route path="/articles" element={<ArticleComponent />} />  // ホームページコンポーネント
        <Route path="/articles/:id/edit" element={<ArticleEdit />} /> // 記事編集ページコンポーネント
        <Route path="/add-tag" element={<AddTagPage />} />  // AddTagPageのルート
      </Routes>
    </Router>
  );
};
