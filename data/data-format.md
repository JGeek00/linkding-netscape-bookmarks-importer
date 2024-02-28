# Data format

## Bookmarks file
The bookmarks file must be an HTML file following the Netscape bookmarks format. Place it inside this directory and rename it to ``bookmarks.html``.

## Linkding config
Here you need to input the necessary details to establish a connection with the Linkding server. Create a JSON file called ``config.json`` with the following structure:
```json
{
  "linkding": {
    "url": "LINKDING_URL",
    "token": "LINKDING_TOKEN"
  },
  "options": {
    "exportGeneratedBookmarks": true
  }
}
```