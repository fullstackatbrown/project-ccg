import { createClient } from 'contentful';

const client = createClient({
  space: '4evwxmhrlmjd',
  accessToken: 'wIZOtSpgvJ2TyST9SaXwi455DJD44NCZwnu0f15Kr3c'
});

async function displayEntries() {
    try {
      const entries = await client.getEntries({ content_type: 'recruitment' });
  
      const contentDiv = document.getElementById('content');
      entries.items.forEach(entry => {
        const article = document.createElement('article');
        article.innerHTML = `<h2>${entry.fields.description}</h2><br>
                            <p>${entry.fields.ccgEmail}</p>
                             <p>${entry.fields.annualReport}</p><br>`;
        contentDiv.appendChild(article);
      });
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
}
  
displayEntries();

