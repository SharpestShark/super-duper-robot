const repoOwner = 'SharpestShark';
const repoName = 'super-duper-robot';

async function fetchHTMLPages() {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    const htmlPages = data.filter(item => item.type === 'file' && item.name.endsWith('.html'));

    htmlPages.forEach(async page => {
      const pageUrl = page.download_url;
      try {
        const pageResponse = await fetch(pageUrl);
        // const pageHtml = await pageResponse.text();
        // console.log(`HTML content of ${page.name}:`, pageHtml);
        var a = document.createElement("a");
        a.innerHTML = page.name.split('.')[0] + '<br>';
        a.href = "/" + page.name;
        document.getElementById('pages').appendChild(a);
        // Do something with the HTML content, like displaying it on the page
      } catch (error) {
        console.error(`Error fetching HTML content of ${page.name}:`, error);
      }
    });
  } catch (error) {
    console.error('Error fetching repository contents:', error);
  }
}

fetchHTMLPages();
