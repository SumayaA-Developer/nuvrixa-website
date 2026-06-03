import { useMemo, useState } from 'react';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase.js';

function formatDate(value) {
  if (!value) return 'Coming soon';
  try {
    return new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium' }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function KnowledgeBase() {
  const { categories, articles, loading, error } = useKnowledgeBase();
  const [search, setSearch] = useState('');

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return articles;
    return articles.filter((article) => article.title?.toLowerCase().includes(query));
  }, [articles, search]);

  function countArticlesForCategory(categoryName) {
    return articles.filter((article) => article.category === categoryName || article.category_name === categoryName).length;
  }

  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Knowledge Base</p>
        <h2>Helpful resources.</h2>
        <p>Find guides and answers for using your Nuvrixa system and client portal.</p>
      </div>

      <label style={{ marginBottom: '20px' }}>
        Search Articles
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the knowledge base..." />
      </label>

      {loading && <p>Loading knowledge base...</p>}
      {error && <p>{error}</p>}

      <div className="grid services-grid">
        {categories.map((category) => (
          <article className="card" key={category.id || category.name}>
            <p className="eyebrow">Category</p>
            <h3>{category.name}</h3>
            <p>{category.description || 'Knowledge base category'}</p>
            <p>{countArticlesForCategory(category.name)} articles</p>
          </article>
        ))}
      </div>

      <div className="card" style={{ marginTop: '20px', overflowX: 'auto' }}>
        <h3>Articles</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Summary</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article.id || article.slug || article.title}>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{article.category || article.category_name}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{article.title}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{article.summary || 'No summary available yet.'}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{formatDate(article.last_updated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
