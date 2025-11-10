export { htmlToMarkdown };

const htmlToMarkdown = (html: string): string => {
  let markdown = html;

  // Decode HTML entities
  const decodeHtmlEntities = (text: string): string => {
    const entities: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      // eslint-disable-next-line quotes
      '&#39;': "'",
      // eslint-disable-next-line quotes
      '&apos;': "'",
    };
    return text.replace(/&[a-z]+;/gi, (match) => entities[match] || match);
  };

  // Convert <h3> to ### heading
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1');

  // Convert <h2> to ## heading
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1');

  // Convert <h1> to # heading
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1');

  // Convert <strong> and <b> to **text**
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/g, '**$1**');

  // Convert <em> and <i> to *text*
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/g, '*$1*');

  // Convert <li> to list items with proper spacing
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/g, '- $1\n');

  // Convert <ul> and <ol> cleanup
  markdown = markdown.replace(/<\/?[ou]l[^>]*>/g, '');

  // Convert <p> to paragraphs with newlines
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n');

  // Convert <code> blocks
  markdown = markdown.replace(
    /<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gs,
    '```javascript\n$1\n```',
  );

  // Convert <code> inline
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`');

  // Remove HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  markdown = decodeHtmlEntities(markdown);

  // Clean up excess whitespace in lines
  markdown = markdown
    .split('\n')
    .map((line) => line.replace(/^\s+/, '').replace(/\s+$/, ''))
    .join('\n');

  // Clean up multiple newlines
  markdown = markdown.replace(/\n\n+/g, '\n\n');

  // Trim whitespace
  markdown = markdown.trim();

  return markdown;
};
