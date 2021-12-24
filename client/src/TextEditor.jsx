import React from 'react';
import { useState, useEffect, useRef } from 'react';
import tildas from './tildas.js';
import { replaceWithSpaceAtIdx, generateNewInnerHtml, getLineCount, insertAtIdx, updateShadowAndTextEditor } from './utils.js'
const TextEditor = ({ editorId }) => {

  const [editorDimensions, setEditorDimensions] = useState(null);
  const [spaceCount, setSpaceCount] = useState(0);
  const [twoCharsBefore, setTwoCharsBefore] = useState('');
  const textEditor = useRef(null)
  const shadowTextInput = useRef(null)

  useEffect(() => {
    textEditor.current.innerHTML = tildas;
    window.addEventListener('resize', () => {
      setEditorDimensions({
        height: textEditor.current.clientHeight,
        width: textEditor.current.clientWidth
      })
    }, false)
  }, [])

  useEffect(() => {
    const { value } = shadowTextInput.current;
    const { clientWidth, clientHeight } = textEditor.current;
    const newLineCount = getLineCount(value, clientWidth)
    textEditor.current.innerHTML = generateNewInnerHtml(value, newLineCount, clientHeight)
  }, [editorDimensions])


  const editorOnClick = (e) => {
    let shadowTextInput = document.getElementById(`${editorId}-shadow-input`)
    shadowTextInput.focus()
  }

  const handleSpecialKeys = (e) => {
    let targetIndex = shadowTextInput.current.selectionEnd - 1;
    setTwoCharsBefore(shadowTextInput.current.value[targetIndex])

    if (e.code === 'Tab') {
      e.preventDefault();
      const textWithTab = insertAtIdx(shadowTextInput,'  ')
      updateShadowAndTextEditor(textWithTab, 2, shadowTextInput, textEditor)
    }
    if (e.code === 'Space') {
      setSpaceCount(spaceCount + 1)
      return;
    }
    if (spaceCount) {
      setSpaceCount(0)
    }
  }


  const textInputOnChange = (e) => { 
    let newText = shadowTextInput.current.value;
    if (spaceCount >= 1 && twoCharsBefore !== '.') {
      let targetIndex = shadowTextInput.current.selectionEnd - 2;
      if (shadowTextInput.current.value[targetIndex] === '.') {
        newText = replaceWithSpaceAtIdx(shadowTextInput, targetIndex)
      }
    }
    updateShadowAndTextEditor(newText, 0, shadowTextInput, textEditor)
  }

  return (
    <>
      <div id={editorId} ref={textEditor} className="text-editor" onClick={editorOnClick}></div>
      <textarea 
        id={`${editorId}-shadow-input`} 
        ref={shadowTextInput}
        className={"shadow-input"}
        onKeyDown={handleSpecialKeys} 
        onChange={textInputOnChange}
        spellCheck={false}
        autoCorrect='off'
        autoCapitalize='off'
        />
    </>
  )
}

export default TextEditor;