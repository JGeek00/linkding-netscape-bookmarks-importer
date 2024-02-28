# Linkding Netscape Bookmarks Importer
This script takes an HTML file with the Netscape bookmarks format, converts it to JSON, and imports the bookmarks to the Linkding bookmark manager.

## How to use it
1. Install [Node.js](https://nodejs.org) on your computer if you don't already have it.
2. Get the ``importer.js`` file from the releases section.
3. Create a folder called ``data`` on the same directory where the ``importer.js`` is placed.
4. Inside that ``data`` folder, place the bookmarks HTML file, and rename it to ``bookmarks.html``.
5. Inside that ``data`` folder, create a new file called ``config.json`` with the following structure:
```json
{
  "linkding": {
    "url": "LINKDING_URL",
    "token": "LINKDING_TOKEN"
  },
  "options": {
    "exportParsedBookmarks": true,
    "exportBookmarksPreLinkdingImport": true
  }
}
```
6. Replace ``LINKDING_URL`` with the base URL you use to access Linkding. Example: ``https://linkding.mydomain.com``.
7. Replace ``LINKDING_API_TOKEN`` with Linkdin's API token. To get it login into the web application, go to Settings, go to Integrations, and at the bottom of that page you can find the API token.
