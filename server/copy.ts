const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQLデータベースに接続
const dbPromise = mysql.createPool({
    host: 'ressblogdb.c7w4eqe0sx2d.ap-northeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'dCizmM7FunPxxZsCkJLp',
    database: 'ressBlog'
});

// 記事を取得するエンドポイント
app.get('/articles', async (req, res) => {
    const db = await dbPromise;
    const [articles] = await db.query('SELECT * FROM articles');
    res.json(articles);
});

// 記事を作成するエンドポイント
app.post('/articles', async (req, res) => {
    const { title, content, keywords, status, thumbnail_url, media_files } = req.body;
    const db = await dbPromise;
    const [result] = await db.execute(
      `INSERT INTO articles (title, content, keywords, status, thumbnail_url, media_files) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, content, keywords, status, thumbnail_url, media_files]
    );
    res.status(201).json({ id: result.insertId });
});

//記事を表示するエンドポイント
app.get('/articles/:id', async (req, res) => {
    const { id } = req.params;
    const db = await dbPromise;
    const [article] = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
    res.json(article[0] || null);
});

// 記事を更新するエンドポイント（例：閲覧数の更新）
app.patch('/articles/:id/view', async (req, res) => {
    const { id } = req.params;
    const db = await dbPromise;
    await db.query(`UPDATE articles SET view_count = view_count + 1 WHERE id = ?`, [id]);
    res.json({ message: 'View count updated successfully' });
});

// 記事を削除するエンドポイント
app.delete('/articles/:id', async (req, res) => {
    const { id } = req.params;
    const db = await dbPromise;
    await db.query(`DELETE FROM articles WHERE id = ?`, [id]);
    res.json({ message: 'Article deleted successfully' });
});

// 記事を更新するエンドポイント
app.put('/articles/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, keywords, status, thumbnail_url, media_files } = req.body;
    const db = await dbPromise;
    const [result] = await db.query(
        `UPDATE articles SET title = ?, content = ?, keywords = ?, status = ?, thumbnail_url = ?, media_files = ? WHERE id = ?`,
        [title, content, keywords, status, thumbnail_url, media_files, id]
    );
    if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Article not found' });
    } else {
        res.json({ message: 'Article updated successfully' });
    }
});

const port = 3100;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
