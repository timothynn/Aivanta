import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Root-hosted static deployments need a real entry point for direct route visits.
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const logistics = html
  .replaceAll('Aivanta | Turn software into intelligent software', 'Aivanta | AI integration for logistics')
  .replace('Aivanta helps businesses turn existing software, data, documents, and workflows into intelligent AI-enabled applications.', 'Practical AI integration for logistics teams. Try a synthetic shipment document check with source evidence and human-reviewed export.')
  .replace('AI software consultancy for practical integration across applications, data, documents, and workflows.', 'Check shipment documents and connect reviewed information to the tools your logistics team already uses.');
await mkdir(new URL('../dist/logistics/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/logistics/index.html', import.meta.url), logistics);
