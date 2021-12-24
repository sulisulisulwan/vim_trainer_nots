import React from 'react';
import { useState, useEffect } from 'react';

const TextEditor = ({ editorId }) => {

  useEffect(() => {
    textEditor = document.getElementById(editorId)
    shadowTextInput = document.getElementById(editorId + '-shadow-input')
  }, [])

  let textEditor;
  let shadowTextInput;
  const [text, setText] = useState('');
  const [innerHtml, setInnerHtml] = useState('')




  const editorOnClick = (e) => {
    shadowTextInput.focus()
  }

  const textInputOnKeyDown = (e) => {
    if (e.code === 'Tab') {
      e.preventDefault();
      let newInnerHtml = e.target.value + '  '
      shadowTextInput.value = newInnerHtml;
    }
  }

  const textInputOnChange = (e) => {
    let newestText = e.target.value;
    let newInnerHtml = '';
    for (let i = 0; i < newestText.length; i++) {
      newestText[i] === '\n' ? newInnerHtml += '<br>'
        : newestText[i] === ' ' ? newInnerHtml += '&nbsp;'
        : newInnerHtml += newestText[i];
    }
    textEditor.innerHTML = newInnerHtml;
  }
  return (
    <>
      <div id={editorId} className="text-editor" onClick={editorOnClick}></div>
      <textarea id={`${editorId}-shadow-input`} onKeyDown={textInputOnKeyDown} onChange={textInputOnChange}></textarea>
    </>
  )
}

export default TextEditor;