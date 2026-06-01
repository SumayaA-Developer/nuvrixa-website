const categories = [
  { name: 'Getting Started', count: 3 },
  { name: 'Client Portal', count: 2 },
  { name: 'Project Tracking', count: 2 },
  { name: 'Support', count: 1 }
];

const articles = [
  {
    categoryName: 'Getting Started',
    articleTitle: 'How to use your Nuvrixa client portal',
    lastUpdated: 'Coming soon'
  },
  {
    categoryName: 'Project Tracking',
    articleTitle: 'Understanding project milestones and updates',
    lastUpdated: 'Coming soon'
  },
  {
    categoryName: 'Support',
    articleTitle: 'How to submit and track a support ticket',
    lastUpdated: 'Coming soon'
  }
];

export default function KnowledgeBase() {
  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Knowledge Base</p>
        <h2>Helpful resources.</h2>
        <p>Find guides and answers for using your Nuvrixa system and client portal.</p>
      </div>

      <label style={{ marginBottom: '20px' }}>
        Search Articles
        <input placeholder="Search the knowledge base..." />
      </label>

      <div className="grid services-grid">
        {categories.map((category) => (
          <article className="card" key={category.name}>
            <p className="eyebrow">Category</p>
            <h3>{category.name}</h3>
            <p>{category.count} articles</p>
          </article>
        ))}
      </div>

      <div className="card" style={{ marginTop: '20px', overflowX: 'auto' }}>
        <h3>Articles</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px' }}>Category Name</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Article Title</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.articleTitle}>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{article.categoryName}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{article.articleTitle}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{article.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Next Integration</h3>
        <p>This page is ready to connect to knowledge_base_categories and knowledge_base_articles in Supabase.</p>
      </div>
    </div>
  );
}
