const replaceWithSpaceAtIdx = (shadowRef, index) => {
  let string = shadowRef.current.value;
  let firstString = string.substring(0, index)
  let secondString = string.substring(index + 1)
  const newString = firstString + ' ' + secondString;
  return newString;
}

const insertAtIdx = (shadowRef, insert) => {
  let string = shadowRef.current.value;
  let index = shadowRef.current.selectionEnd;
  let firstString = string.substring(0, index);
  let secondString = string.substring(index);
  return firstString + insert + secondString;
}

const deleteAtIdx = (shadowRef) => {
  const oldText = shadowRef.current.value
  const deleteIdx = shadowRef.current.selectionEnd - 1;
  const newText = oldText.substring(0, deleteIdx) + oldText.substring(deleteIdx + 1)
  return newText;
}

const updateShadowAndTextEditor = ({ caretPosition, visualCaretPosition, newText, shadowRef, textEditorRef }) => {
  const { clientWidth, clientHeight } = textEditorRef.current;
  const newLineCount = getLineCount(newText, clientWidth)
  textEditorRef.current.innerHTML = generateNewInnerHtml(newText, newLineCount, clientHeight, caretPosition, visualCaretPosition)
  shadowRef.current.selectionEnd = caretPosition;
  shadowRef.current.selectionStart = caretPosition;
}


const generateTildas = (lineCount, currentHeight, lineHeight) => {
  let tilda = `
  <br/><span className="vim-tilda">~</span>
  `;
  let tildas = '';
  let tildaAmount = Math.floor((currentHeight / lineHeight) - lineCount)
  for (let i = 0; i < tildaAmount; i += 1) {
    tildas += tilda;
  }
  return tildas;
}

const getLineCount = (text, textEditorWidth) => {
  let cpl = Math.floor(textEditorWidth / (20 / 1.64))
  let charCount = text.length === 0 ? 1 : text.length;
  let lines = 1;
  let charsInLineCount = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '\n') {
      lines += 1;
      continue;
    }
    charsInLineCount += 1;
    if (charsInLineCount === cpl) {
      lines += 1;
      charsInLineCount = 0;
    }
  }
  return lines;
}

const generateNewInnerHtml = (newestText, lineCount, textEditorHeight, caretPosition, visualCaretPosition) => {
  let newHtml = '';
  for (let i = 0; i < newestText.length; i++) {
    if (i === visualCaretPosition) {
      // newestText[i] === ' ' ? newHtml += `<span class="caret">&nbsp;</span>` : newHtml += `<span class="caret">${newestText[i]}</span>`;
      newestText[i] === ' ' ? newHtml += `<span class="caret">${newestText[i]}</span>` : newHtml += `<span class="caret">${newestText[i]}</span>`;
    } else {
      switch(newestText[i]) {
        case '<': 
          newHtml += '&lt' 
          break;
        case '>': 
          newHtml += '&gt' 
          break;
        case '\n': 
          newHtml += '<br>' 
          break;
        case '\r':
          newHtml += '<br>'
        case ' ': 
          newHtml += '&nbsp;' 
          break;
        default: 
          newHtml += newestText[i] 
      }
    }
  }
  if ((visualCaretPosition !== -1 && !newestText.length) || visualCaretPosition === newestText.length) {
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