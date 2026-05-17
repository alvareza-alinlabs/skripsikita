import fs from 'node:fs';

async function download() {
  try {
    fs.mkdirSync('public', { recursive: true });
    // Attempt to download the file from Google Drive
    const targetUrl = 'https://drive.google.com/uc?export=download&id=1cGBcdZRCSZORnNRE7E7kfYRgjEwjQz1t';
    console.log('Downloading from:', targetUrl);
    
    const res = await fetch(targetUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    // Check if it's a redirect / html (Google Drive sometimes returns HTML for large files warning)
    const contentType = res.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    const buffer = await res.arrayBuffer();
    fs.writeFileSync('public/skripsi.pdf', Buffer.from(buffer));
    console.log('Successfully saved to public/skripsi.pdf! Size:', buffer.byteLength);
  } catch (error) {
    console.error('Download failed:', error);
  }
}
download();
