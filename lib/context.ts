import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export function getBlogContext(): string {
    try {
        const files = fs.readdirSync(BLOG_DIR);

        // Filter for MDX files
        const mdxFiles = files.filter(file => file.endsWith('.mdx'));

        // Extract frontmatter and summary
        const summaries = mdxFiles.map(file => {
            const filePath = path.join(BLOG_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(content);

            return `
      Title: ${data.title}
      Description: ${data.description}
      Published: ${data.date}
      Topic: ${data.title} involves ${data.description}.
      `;
        });

        return `
    ## Latest Blog Posts by Vaibhav:
    ${summaries.join('\n')}
    `;
    } catch (error) {
        console.error("Error reading blog context:", error);
        return "No blog posts found.";
    }
}
