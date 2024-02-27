const NBFFConverter = require('nbff-converter')
const fs = require('fs')

const constants = require('./constants')

const main = async () => {
  // VALIDATE FILES EXIST

  const bookmarksExists = fs.existsSync(constants.BOOKMARKS_FILE_PATH)
  if (bookmarksExists !== true) {
    throw Error("File bookmarks.html doesn't exist.")
  }

  const linkdingConfigExists = fs.existsSync(constants.LINKDING_CONFIG_FILE_PATH)
  if (linkdingConfigExists !== true) {
    throw Error("File linkding-config.json doesn't exist.")
  }




  // VALIDATE LINKDING CONFIG IS CORRECT

  const linkdingConfigRaw = await fs.promises.readFile(constants.LINKDING_CONFIG_FILE_PATH, 'utf-8')
  const linkdingConfigParsed = JSON.parse(linkdingConfigRaw)
  if (!linkdingConfigParsed.url || !linkdingConfigParsed.token) {
    throw Error("Linkding configuration not valid.")
  }




  // CONVERT HTML BOOKMARKS INTO JSON

  const nbffConverter = new NBFFConverter()
  const htmlFile = await fs.promises.readFile(constants.BOOKMARKS_FILE_PATH, 'utf-8')
  const parsed = await nbffConverter.netscapeToJSON(htmlFile)

  const formatted = []
  parsed.children.forEach((folder) => {
    folder.children.forEach((bookmark) => {
      if (bookmark.type === "url") {
        formatted.push({
          url: bookmark.url,
          title: bookmark.title,
          category: folder.title.replaceAll(' ', '-')
        })
      }
    })
  })


  

  // SAVE BOOKMARKS INTO LINKDING

  for (const bookmark of formatted) {
    const formData = new FormData();
    formData.append("url", bookmark.url)
    formData.append("title", bookmark.title)
    formData.append("description", "")
    formData.append("is_archived", "false")
    formData.append("unread", "false")
    formData.append("shared", "false")
    formData.append("tag_names", bookmark.category)
    
    const result = await fetch(`${linkdingConfigParsed.url}/api/bookmarks/`, {
      method: "post",
      headers: {
        "Authorization": `Token ${linkdingConfigParsed.token}`
      },
      body: formData
    })
    if (result.status < 400) {
      console.log(`Success: ${bookmark.url}`)
    }
    else {
      console.error(`Error (${result.status}): ${bookmark.url}`)
    }
  }
}

main()