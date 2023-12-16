// Import necessary modules and functions
import { serverQueryContent } from '#content/server';
import { SitemapStream, streamToPromise } from 'sitemap';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Define base URL for your website
const BASE_URL = 'https://hoceine.com';

// Constants for changefreq values
const CHANGE_FREQ_MONTHLY = 'monthly';
const CHANGE_FREQ_WEEKLY = 'weekly';

// Define an event handler
export default defineEventHandler(async (event) => {
  const sitemap = new SitemapStream({ hostname: BASE_URL });

  // Fetch and add dynamic content URLs with priority and lastmod
  const docs = await serverQueryContent(event).find();
  for (const doc of docs) {
    const urlOptions = {
      url: doc._path,
      changefreq: CHANGE_FREQ_MONTHLY,
    priority: 0.8,
      lastmod: doc.createdAt || doc.updatedAt || new Date()
    };

      // Include lastmod only if it's available (for Markdown files)


    sitemap.write(urlOptions);
  }

  // Add static endpoint URLs with priority and lastmod
  const staticEndpoints = getStaticEndpoints();
  for (const staticEndpoint of staticEndpoints) {
    sitemap.write({
      url: staticEndpoint,
      changefreq: CHANGE_FREQ_WEEKLY,
      priority: 0.9,
      lastmod: getLastModificationDate(staticEndpoint), // Implement a function to get the last modification date
    });
  }

  sitemap.end();
  return streamToPromise(sitemap);
});

// Function to get static endpoint URLs
function getStaticEndpoints(): string[] {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const files = getFiles(`${__dirname}/../../pages`);
  return files
    .filter((file) => !file.includes('slug'))
    .map((file) => file.split('pages')[1])
    .map((file) => (file.endsWith('index.vue') ? file.split('/index.vue')[0] : file.split('.vue')[0]));
}

// Function to recursively get all files from the /pages folder
function getFiles(dir: string): string[] {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return files.flat();
}

// Function to get the last modification date for a static endpoint (replace it with your implementation)
function getLastModificationDate(endpoint: string): Date {
  // Replace this with logic to get the last modification date for the given endpoint
  return new Date();
}
