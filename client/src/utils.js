const replaceWithSpaceAtIdx = (inputRef, index) => {
  let string = inputRef.current.value;
  let firstString = string.substring(0, index)
  let secondString = string.substring(index + 1)
  return firstString + ' ' + secondString;
}

const insertAtIdx = (inputRef, insert) => {
  let string = inputRef.current.value;
  let index = inputRef.current.selectionEnd;
  let firstString = string.substring(0, index);
  let secondString = string.substring(index);
  return firstString + insert + secondString;
}

const updateShadowAndTextEditor = (newText, cursorOffset, shadowRef, textEditorRef) => {
  const targetIndex = shadowRef.current.selectionEnd;
  shadowRef.current.value = newText;
  const { clientWidth, clientHeight } = textEditorRef.current;
  const newLineCount = getLineCount(newText, clientWidth)
  textEditorRef.current.innerHTML = generateNewInnerHtml(newText, newLineCount, clientHeight, targetIndex + cursorOffset)
  shadowRef.current.selectionEnd = targetIndex + cursorOffset;
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

const generateNewInnerHtml = (newestText, lineCount, textEditorHeight, caretPosition) => {
  let newHtml = '';
  for (let i = 0; i < newestText.length; i++) {
    i === caretPosition ? newHtml += `<span class="caret">${newestText[i]}</span>`
      : newestText[i] === '\n' ? newHtml += '<br>'
      : newestText[i] === ' ' ? newHtml += '&nbsp;'
      : newHtml += newestText[i];
  }
  if (caretPosition === newestText.length) {
    newHtml += `<span class="caret">&nbsp;</span>`;
  }
  let tildas = generateTildas(lineCount, textEditorHeight, 25)
  return newHtml += tildas;
}
export {
  replaceWithSpaceAtIdx,
  generateTildas,
  generateNewInnerHtml,
  getLineCount,
  insertAtIdx,
  updateShadowAndTextEditor
}