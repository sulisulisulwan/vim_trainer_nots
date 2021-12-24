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
  textEditorRef.current.innerHTML = generateNewInnerHtml(newText, newLineCount, clientHeight)
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
  let length = text.length === 0 ? 1 : text.length;
  return Math.ceil((12.3 * length)/textEditorWidth);
}

const generateNewInnerHtml = (newestText, lineCount, textEditorHeight) => {
  let newHtml = '';
  for (let i = 0; i < newestText.length; i++) {
    newestText[i] === '\n' ? newHtml += '<br>'
      : newestText[i] === ' ' ? newHtml += '&nbsp;'
      : newHtml += newestText[i];
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