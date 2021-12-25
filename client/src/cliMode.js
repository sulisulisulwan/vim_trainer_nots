const updateCLIShadowAndTextEditor = ({ visualCaretPosition, caretPosition, newText, shadowRef, textEditorRef }) => {
  textEditorRef.current.innerHTML = generateCLIInnerHtml(newText, visualCaretPosition)
  shadowRef.current.selectionEnd = caretPosition;
  shadowRef.current.selectionStart = caretPosition;
}

const generateCLIInnerHtml = (newestText, visualCaretPosition) => {
  let newHTML = '';
  for (let i = 0; i < newestText.length; i++) {
    if (i === visualCaretPosition) {
      newestText[i] === ' ' ? newHTML += `<span class="caret">&nbsp;</span>` : newHTML += `<span class="caret">${newestText[i]}</span>`;
    } else {
      switch(newestText[i]) {
        case '<': 
          newHTML += '&lt' 
          break;
        case '>': 
          newHTML += '&gt' 
          break;
        case ' ': 
          newHTML += '&nbsp;' 
          break;
        default: 
          newHTML += newestText[i] 
      }
    }
  }
  if (visualCaretPosition === newestText.length) {
    newHTML += `<span class="caret">&nbsp;</span>`;
  }
  return newHTML;

}

export {
  generateCLIInnerHtml,
  updateCLIShadowAndTextEditor
}