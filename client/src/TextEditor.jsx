import React from 'react';
import { useState, useEffect, useRef } from 'react';
import tildas from './tildas.js';
import { deleteAtIdx, replaceWithSpaceAtIdx, generateNewInnerHtml, getLineCount, insertAtIdx, updateShadowAndTextEditor } from './utils.js'
const TextEditor = ({ editorId }) => {
  const [keyStrokeHist, setKeyStrokeHist] = useState([])
  const [spacedNextToPeriod, setSpacedNextToPeriod] = useState(false);
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
    const text = shadowTextInput.current.value;
    const changes = {
      caretPosition: shadowTextInput.current.selectionEnd,
      visualCaretPosition: shadowTextInput.current.selectionEnd,
      newText: text,
      shadowRef: shadowTextInput,
      textEditorRef: textEditor
    }
    updateShadowAndTextEditor(changes)
  }, [editorDimensions])


  const editorOnClick = (e) => {
    let shadowTextInput = document.getElementById(`${editorId}-shadow-input`)
    shadowTextInput.focus()
  }

  const handleSpecialKeys = (e) => {
    const newKeyHistory = keyStrokeHist.slice();
    newKeyHistory.push(e.code);

    const changes = {
      caretPosition: shadowTextInput.current.selectionEnd,
      visualCaretPosition: shadowTextInput.current.selectionEnd,
      newText: shadowTextInput.current.value,
      shadowRef: shadowTextInput,
      textEditorRef: textEditor
    }    

    if (e.code === 'Space') {
      setSpaceCount(spaceCount + 1)
      changes.newText = insertAtIdx(shadowTextInput, e.key)
      changes.visualCaretPosition += 1; 
      if (changes.newText[changes.caretPosition - 1] === '.') {
        setSpacedNextToPeriod(true);
      }
      if (spaceCount >= 1 && twoCharsBefore !== '.' && !spacedNextToPeriod) {
        let targetIndex = shadowTextInput.current.selectionEnd - 2;
        if (shadowTextInput.current.value[targetIndex] === '.') {
          changes.newText = replaceWithSpaceAtIdx(shadowTextInput, targetIndex)
          changes.visualCaretPosition -= 1;
          shadowTextInput.current.value = changes.newText;
        }
      }
      updateShadowAndTextEditor(changes)
      return;
    } else if (e.code === 'ArrowLeft') {
      if (shadowTextInput.current.selectionEnd === 0) {
        return;
      }
      changes.visualCaretPosition -= 1
    } else if (e.code === 'ArrowRight') {
      if (shadowTextInput.current.selectionEnd === shadowTextInput.current.value.length) {
        return;
      }
      changes.visualCaretPosition += 1
    } else if (e.code === 'Tab') {
      e.preventDefault();
      changes.newText = insertAtIdx(shadowTextInput,'  ');
      changes.caretPosition += 2;
      changes.visualCaretPosition += 2;
    } else if (e.code === 'Enter') {
      changes.newText += '\n';
      changes.visualCaretPosition += 1;
    } else if (e.code === 'Backspace') {
      if (shadowTextInput.current.selectionEnd === 0) {
        return;
      }
      changes.newText = deleteAtIdx(shadowTextInput)
      changes.visualCaretPosition -= 1;
    } else {
      if (e.key.length === 1) {
        changes.newText = insertAtIdx(shadowTextInput, e.key)
        changes.visualCaretPosition += 1; 
      }
    }
    if (spaceCount) {
      setSpacedNextToPeriod(false);
      setSpaceCount(0);
    }


    let targetIndex = shadowTextInput.current.selectionEnd - 1;
    setTwoCharsBefore(shadowTextInput.current.value[targetIndex])
    updateShadowAndTextEditor(changes)
    return;
  }

  return (
    <>
      <div id={editorId} ref={textEditor} className="text-editor" onClick={editorOnClick}></div>
      <textarea 
        id={`${editorId}-shadow-input`} 
        ref={shadowTextInput}
        className={"shadow-input"}
        onKeyDown={handleSpecialKeys} 
        spellCheck={false}
        autoCorrect='off'
        autoCapitalize='off'
        wrap='off'
        />
    </>
  )
}

export default TextEditor;