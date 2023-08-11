export default function (str, justWhitespace = false) {
    if(!justWhitespace) {

        str = str.toLowerCase()
        let articleRegex = /(\bthe\b)|(\ba\b)|(\ban\b)/gi
        str = str.replaceAll(articleRegex, "")
        
        let punctuationRegex = /\^w/gi
        str = str.replaceAll(punctuationRegex, "")
    }
  
    let whitespaceRegex = /\W/gi
    str = str.replaceAll(whitespaceRegex, "")
  
    return str;
  }