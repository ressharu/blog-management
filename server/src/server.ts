const express = require('express');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
//const cors = require('cors');

const app = express();
app.use(express.json());
//app.use(cors());

// SQLiteデータベースに接続
const dbPromise = open({
    filename: './db/blogManagement.db',
    driver: sqlite3.Database
});

// 記事を取得するエンドポイント
app.get('/articles', async (req, res) => {
    const db = await dbPromise;
    const articles = await db.all('SELECT * FROM articles');
    res.json(articles);
});

// 記事を作成するエンドポイント
app.post('/articles', async (req, res) => {
    const { title, content, keywords, status, thumbnail_url, media_files } = req.body;
    const db = await dbPromise;
    const result = await db.run(
      `INSERT INTO articles (title, content, keywords, status, thumbnail_url, media_files) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, content, keywords, status, thumbnail_url, media_files]
    );
    res.status(201).json({ id: result.lastID });
});

//記事を表示するエンドポイント
app.get('/articles/:id', async (req, res) => {
    const { id } = req.params;
    const db = await dbPromise;
    const article = await db.get('SELECT * FROM articles WHERE id = ?', [id]);
    res.json(article);
});

// 記事を更新するエンドポイント（例：閲覧数の更新）
app.patch('/articles/:id/view', async (req, res) => {
    const { id } = req.params;
    const db = await dbPromise;
    await db.run(`UPDATE articles SET view_count = view_count + 1 WHERE id = ?`, [id]);
    res.json({ message: 'View count updated successfully' });
});

// 記事を削除するエンドポイント
app.delete('/articles/:id', async (req, res) => {
    const { id } = req.params;
    const db = await dbPromise;
    await db.run(`DELETE FROM articles WHERE id = ?`, [id]);
    res.json({ message: 'Article deleted successfully' });
});

// 記事を更新するエンドポイント
app.put('/articles/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, keywords, status, thumbnail_url, media_files } = req.body;
    const db = await dbPromise;
    try {
        const result = await db.run(
            `UPDATE articles SET title = ?, content = ?, keywords = ?, status = ?, thumbnail_url = ?, media_files = ? WHERE id = ?`,
            [title, content, keywords, status, thumbnail_url, media_files, id]
        );
        if (result.changes === 0) {
            res.status(404).json({ message: 'Article not found' });
        } else {
            res.json({ message: 'Article updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// タグを取得するエンドポイント
app.get('/tags', async (req, res) => {
    const db = await dbPromise;
    const tags = await db.all('SELECT * FROM tags');
    res.json(tags);
    console.log(tags);
});

//タグを作成するエンドポイント
app.post('/tags', async (req, res) => {
    const { name } = req.body;

    // nameがnullまたは空文字でないことを確認
    if (!name) {
        return res.status(400).json({ error: "Tag cannot be empty" });
    }

    try {
        const db = await dbPromise;
        // 既に同じ名前のタグが存在するか確認
        const existingTag = await db.get(`SELECT * FROM tags WHERE tag = ?`, [name]);
        if (existingTag) {
            // タグが既に存在する場合はエラーを返す
            return res.status(409).json({ error: "Tag already exists" });
        }

        // 新しいタグを挿入
        const result = await db.run(`INSERT INTO tags (tag) VALUES (?)`, [name]);
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = 3100;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
