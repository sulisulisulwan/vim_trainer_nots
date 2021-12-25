import React from 'react';
import { useState, useEffect, useRef } from 'react';
import tildas from './tildas.js';
import { deleteAtIdx, replaceWithSpaceAtIdx, generateNewInnerHtml, getLineCount, insertAtIdx, updateShadowAndTextEditor } from './utils.js'
import { updateCLIShadowAndTextEditor } from './cliMode.js';

const TextEditor = ({ editorId }) => {
  const [textEditorActive, setTextEditorActive] = useState(false);
  const [insertMode, setInsertMode] = useState(false);
  const [cliMode, setCLIMode] = useState(false)
  const [keyStrokeHist, setKeyStrokeHist] = useState([])
  const [spacedNextToPeriod, setSpacedNextToPeriod] = useState(false);
  const [editorDimensions, setEditorDimensions] = useState(null);
  const [spaceCount, setSpaceCount] = useState(0);
  const [twoCharsBefore, setTwoCharsBefore] = useState('');
  const textEditor = useRef(null)
  const textEditorCLI = useRef(null)
  const shadowTextInput = useRef(null)
  const shadowCLI = useRef(null)

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
    setTextEditorActive(true);
    console.log('clicked')
    let shadowTextInput = document.getElementById(`${editorId}-shadow-input`);
    let shadowCLI = document.getElementById(`${editorId}-shadow-cli`);
    cliMode ? shadowCLI.focus() : 
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



    if (insertMode) {
  
      if (e.code === 'Escape') {
        e.preventDefault();
        shadowCLI.current.value = '';
        setInsertMode(false);
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

    }

    if (!insertMode) {
      if (!cliMode) {
        if (e.key === 'i') {
          e.preventDefault();
          setInsertMode(true);
          shadowCLI.current.value = '{ INSERT }'
          return;
        }
        if (e.key === ':') {
          document.getElementById(`${editorId}-shadow-cli`).focus();
          setCLIMode(true);
          updateCLIShadowAndTextEditor({
            visualCaretPosition: shadowCLI.current.selectionEnd + 1,
            caretPosition: shadowCLI.current.selectionEnd,
            newText: ':',
            shadowRef: shadowCLI,
            textEditorRef: textEditorCLI
          })
          return;
        }
        if (e.code === 'ArrowLeft') {
          if (shadowTextInput.current.selectionEnd === 0) {
            return;
          }
          changes.visualCaretPosition -= 1
        } else if (e.code === 'ArrowRight') {
          if (shadowTextInput.current.selectionEnd === shadowTextInput.current.value.length) {
            return;
          }
          changes.visualCaretPosition += 1
        }
      }

    }




    let targetIndex = shadowTextInput.current.selectionEnd - 1;
    setTwoCharsBefore(shadowTextInput.current.value[targetIndex])
    updateShadowAndTextEditor(changes)
    return;
  }


  const handleCLIKeystrokes = (e) => {

    const changes = {
      visualCaretPosition: shadowCLI.current.selectionEnd,
      caretPosition: shadowCLI.current.selectionEnd,
      newText: shadowCLI.current.value,
      shadowRef: shadowCLI,
      textEditorRef: textEditorCLI
    }

    //the cursor is not allowed to move on top of the colon
    //the cursor is not allowed to delete the colon UNLESS
        //there are no characters to the right of the colon
    //once the cursor deletes the colon, cliMode is false and insertMode is still false
    //
    
    if (cliMode) {
      if (e.code === 'Space') {
        setSpaceCount(spaceCount + 1)
        changes.newText = insertAtIdx(shadowCLI, e.key)
        changes.visualCaretPosition += 1; 
        if (changes.newText[changes.caretPosition - 1] === '.') {
          setSpacedNextToPeriod(true);
        }
        if (spaceCount >= 1 && twoCharsBefore !== '.' && !spacedNextToPeriod) {
          let targetIndex = shadowCLI.current.selectionEnd - 2;
          if (shadowCLI.current.value[targetIndex] === '.') {
            changes.newText = replaceWithSpaceAtIdx(shadowCLI, targetIndex)
            changes.visualCaretPosition -= 1;
            shadowCLI.current.value = changes.newText;
          }
        }
      } else if (e.code === 'ArrowLeft') {
        if (shadowCLI.current.selectionEnd === 1) {
          e.preventDefault();
          return;
        }
        changes.visualCaretPosition -= 1
      } else if (e.code === 'ArrowRight') {
        if (shadowCLI.current.selectionEnd === shadowCLI.current.value.length) {
          return;
        }
        changes.visualCaretPosition += 1
      } else if (e.code === 'Tab') {
        e.preventDefault();
        changes.newText = insertAtIdx(shadowCLI,'  ');
        changes.caretPosition += 2;
        changes.visualCaretPosition += 2;
      } else if (e.code === 'Enter') {
        changes.newText += '\n';
        changes.visualCaretPosition += 1;
      } else if (e.code === 'Backspace') {
        if (shadowCLI.current.selectionEnd === 1 ) {
          if (shadowCLI.current.value.length === 1) {
            setCLIMode(false);
            shadowCLI.current.value = '';
            updateCLIShadowAndTextEditor({
              visualCaretPosition: -1,
              caretPosition: 0,
              newText: '',
              shadowRef: shadowCLI,
              textEditorRef: textEditorCLI            
            })
            document.getElementById(`${editorId}-shadow-cli`).blur();
            document.getElementById(`${editorId}-shadow-input`).focus();
            return;
          } else {
            console.log(shadowCLI.current.value)
            shadowCLI.current.value = ':' + shadowCLI.current.value;
            shadowCLI.current.selectionEnd = 2
            return;
          }
        }
        changes.newText = deleteAtIdx(shadowCLI)
        changes.visualCaretPosition -= 1;
      } else {
        if (e.key.length === 1) {
          changes.newText = insertAtIdx(shadowCLI, e.key)
          changes.visualCaretPosition += 1; 
        }
      }
      if (spaceCount) {
        setSpacedNextToPeriod(false);
        setSpaceCount(0);
      }

      updateCLIShadowAndTextEditor(changes)
      return;
    }
    let targetIndex = shadowCLI.current.selectionEnd - 1;
    setTwoCharsBefore(shadowCLI.current.value[targetIndex])
    updateCLIShadowAndTextEditor(changes)
    return;
  }
  

  return (
    <>
      <textarea 
        id={`${editorId}-shadow-input`} 
        ref={shadowTextInput}
        className={"shadow-input"}
        onKeyDown={handleSpecialKeys} 
        spellCheck={false}
        autoCorrect='off'
        autoCapitalize='off'
        wrap='off'
        readOnly={!insertMode}
        />
      <textarea
        id={`${editorId}-shadow-cli`}
        ref={shadowCLI}
        className="shadow-CLI"
        onKeyDown={handleCLIKeystrokes}
        spellCheck={false}
        autoCorrect='off'
        autoCapitalize='off'
        wrap='off'
        readOnly={!cliMode}
        />
      <div id={editorId} ref={textEditor} className="text-editor" onClick={editorOnClick}></div>
      <div id={`${editorId}-cli`} ref={textEditorCLI} className="text-editor-cli"></div>
      { textEditorActive ? 'Vim editor active' : 'Inactive'}
    </>
  )
}

export default TextEditor;