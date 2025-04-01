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

//displayEntries();

async function fetchImageById(entryId) {
  try {
    const entry = await client.getEntry(entryId);
    console.log('Fetched Entry:', entry);

    // Check if the entry has an "images" field
    if (entry.fields.images && entry.fields.images.length > 0) {
      // Extract the first image from the array
      const imageUrl = `https:${entry.fields.images[0].fields.file.url}`;
      
      // Set the image URL in the HTML
      document.getElementById('contentful-image').src = imageUrl;
    } else {
      console.error('No images found in this entry.');
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// // Call the function with a specific Entry ID
fetchImageById('QD02xJjeDzhkY3Sm8bu1h');
