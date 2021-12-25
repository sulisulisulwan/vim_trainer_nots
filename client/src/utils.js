const replaceWithSpaceAtIdx = (inputRef, index) => {
  let string = inputRef.current.value;
  let firstString = string.substring(0, index)
  let secondString = string.substring(index + 1)
  const newString = firstString + ' ' + secondString;
  return newString;
}

const insertAtIdx = (inputRef, insert) => {
  let string = inputRef.current.value;
  let index = inputRef.current.selectionEnd;
  let firstString = string.substring(0, index);
  let secondString = string.substring(index);
  return firstString + insert + secondString;
}

const deleteAtIdx = (shadowRef) => {
  const oldText = shadowRef.current.value
  const deleteIdx = shadowRef.current.selectionEnd - 1;
  console.log('deleteIdx', deleteIdx)
  const newText = oldText.substring(0, deleteIdx) + oldText.substring(deleteIdx + 1)
  console.log(newText)
  return newText;
}

const updateShadowAndTextEditor = ({ caretPosition, visualCaretPosition, newText, shadowRef, textEditorRef }) => {
  const { clientWidth, clientHeight } = textEditorRef.current;
  const newLineCount = getLineCount(newText, clientWidth)
  console.log(JSON.stringify(newText))
  textEditorRef.current.innerHTML = generateNewInnerHtml(newText, newLineCount, clientHeight, caretPosition, visualCaretPosition)
  shadowRef.current.selectionEnd = caretPosition;
}


const generateTildas = (lineCount, currentHeight, lineHeight) => {
  let tilda = `
  <br/><span className="vim-tilda">~</span>
  `;
  let tildas = '';
  let tildaAmount = (currentHeight / lineHeight) - lineCount;
  for (let i = 0; i < tildaAmount - 1; i += 1) {
    tildas += tilda;
  }
  return tildas;
}

const getLineCount = (text, textEditorWidth) => {
  let cpl = Math.floor(textEditorWidth / (20 / 1.64))
  let charCount = text.length === 0 ? 1 : text.length;
  return Math.ceil(charCount / cpl)
}

const generateNewInnerHtml = (newestText, lineCount, textEditorHeight, caretPosition, visualCaretPosition) => {
  let newHtml = '';
  console.log('visual caret position', visualCaretPosition)
  for (let i = 0; i < newestText.length; i++) {
    if (i === visualCaretPosition) {
      newestText[i] === ' ' ? newHtml += `<span class="caret">&nbsp;</span>` : newHtml += `<span class="caret">${newestText[i]}</span>`;
    } else {
      switch(newestText[i]) {
        case '<': 
          newHtml += '&lt' 
          break;
        case '>': 
          newHtml += '&gt' 
          break;
        case '\n': 
          console.log('this is a new line break')
          newHtml += '<br>' 
          break;
        case '\r':
          console.log('return break happens here')
        case ' ': 
          newHtml += '&nbsp;' 
          break;
        default: 
          newHtml += newestText[i] 
      }
    }
  }
  if (visualCaretPosition === newestText.length) {
    newHtml += `<span class="caret">&nbsp;</span>`;
  }
  let tildas = generateTildas(lineCount, textEditorHeight, 25)
  return newHtml += tildas;
}
export {
  deleteAtIdx,
  replaceWithSpaceAtIdx,
  generateTildas,
  generateNewInnerHtml,
  getLineCount,
  insertAtIdx,
  updateShadowAndTextEditor
}