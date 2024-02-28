const NBFFConverter = require('nbff-converter')
const fs = require('fs')

const constants = require('./constants')

const main = async () => {
  // VALIDATE FILES EXIST

  const bookmarksExists = fs.existsSync(constants.BOOKMARKS_FILE_PATH)
  if (bookmarksExists !== true) {
    throw Error("File bookmarks.html doesn't exist.")
  }

  const configExists = fs.existsSync(constants.CONFIG_FILE_PATH)
  if (configExists !== true) {
    throw Error("File config.json doesn't exist.")
  }




  // VALIDATE CONFIG IS CORRECT

  const configRaw = await fs.promises.readFile(constants.CONFIG_FILE_PATH, 'utf-8')
  const configParsed = JSON.parse(configRaw)
  if (!configParsed.linkding.url || !configParsed.linkding.token) {
    throw Error("Configuration not valid.")
  }




  // CONVERT HTML BOOKMARKS INTO JSON

  const nbffConverter = new NBFFConverter()
  const htmlFile = await fs.promises.readFile(constants.BOOKMARKS_FILE_PATH, 'utf-8')
  const parsed = await nbffConverter.netscapeToJSON(htmlFile)

  const formatted = []
  const convert = (node, categories = []) => {
    if (node.children) {
      node.children.forEach((child) => {
        convert(child, node.title ? [...categories, node.title] : categories)
      })
    }
    else if (node.type === "url") {
      formatted.push({
        url: node.url,
        title: node.title,
        category: categories.map((c) => c.replaceAll(' ', '-')).join(',')
      })
    }
  }
  convert(parsed, [])  
  console.log(`Generated ${formatted.length} bookmarks for import`)  




  // WRITE FORMATTED BOOKMARKS INTO FILE

  if (configParsed.options.exportParsedBookmarks === true) {
    fs.writeFileSync(constants.BOOKMARKS_EXPORT_PARSED_FILE_PATH, JSON.stringify(parsed), 'utf-8')
  }
  if (configParsed.options.exportBookmarksPreLinkdingImport === true) {
    fs.writeFileSync(constants.BOOKMARKS_EXPORT_PRE_IMPORT_FILE_PATH, JSON.stringify(formatted), 'utf-8')
  }


  

  // SAVE BOOKMARKS INTO LINKDING
  var success = 0
  var errors = 0
  for (const bookmark of formatted) {
    const formData = new FormData();
    formData.append("url", bookmark.url)
    formData.append("title", bookmark.title)
    formData.append("description", "")
    formData.append("is_archived", "false")
    formData.append("unread", "false")
    formData.append("shared", "false")
    formData.append("tag_names", bookmark.category)
    
    const result = await fetch(`${configParsed.linkding.url}/api/bookmarks/`, {
      method: "post",
      headers: {
        "Authorization": `Token ${configParsed.linkding.token}`
      },
      body: formData
    })
    if (result.status < 400) {
      console.log(`Success: ${bookmark.url}`)
      success++
    }
    else {
      console.error(`Error (${result.status}): ${bookmark.url}`)
      errors++
    }
  }
  console.log('\n')
  console.log('--------- RESULTS ---------')
  console.log('\n')
  console.log(`${success} imported successfully`)
  console.log(`${errors} imports failed`)
}

main()