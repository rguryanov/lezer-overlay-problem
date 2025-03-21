
import { basicSetup, EditorView } from "codemirror"
import { parser as mustacheParser } from './mustache/mustache.grammar.mjs';
import { LanguageSupport, LRLanguage } from "@codemirror/language"
import { javascript } from "@codemirror/lang-javascript"
import { html } from "@codemirror/lang-html"
import { parseMixed } from "@lezer/common"

const jsLang = javascript()
const jsParser = jsLang.language.parser
const htmlLang = html()
const htmlParser = htmlLang.language.parser

const mixedParser = mustacheParser.configure({
  wrap: parseMixed(node => {

    if (node.type.isTop) {
      return {
        parser: htmlParser,
        overlay: node => node.type.name == "PlainText"
      }
    }

    if (node.type.name === "InsertBlock") {
      return {
        parser: jsParser,
      }
    }

    return null
  })
})

const lang = new LanguageSupport(LRLanguage.define({
  parser: mixedParser,
}), [
  jsLang.support,
  htmlLang.support,
]);

const longDivs = "<div>something</div>\n".repeat(120);

const htmlText = `
<html>
  <body>
    <div>something</div>
    <div>something</div>
    <div>something</div>
    <div>something</div>
    <div>something</div>
    <div>{{
// highlighted javascript
var hello = "hello";
var world = "world";
return hello;
}}</div>
    <div>something</div>
    <div>
      HTML highlighting breaks after next div with templates
    </div>
    <div>{{hello}} {{world}}</div>
    <div>
      HTML highlighting broken here
      If you delete most divs underneath - highlighting will work again 
    </div>
  ${longDivs}
  </body> 
</html>
`;

const root = document.getElementById('root');
if (root) {
  new EditorView({
    doc: htmlText,
    extensions: [basicSetup, [lang]],
    parent: root
  })
}
