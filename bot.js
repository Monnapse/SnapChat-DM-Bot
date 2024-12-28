((async (startPage = 0, autoClearConsole = true) => {
    function getElementByXPath(xpath, context = document, single = true) {
        const resultType = single 
          ? XPathResult.FIRST_ORDERED_NODE_TYPE 
          : XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;
        
        const result = document.evaluate(xpath, context, null, resultType, null);
      
        if (single) {
          return result.singleNodeValue; // Return the first match or null
        } else {
          const elements = [];
          for (let i = 0; i < result.snapshotLength; i++) {
            elements.push(result.snapshotItem(i)); // Add each matched element to the array
          }
          return elements.length > 0 ? elements : null;
        }
      }
    function pressEnterOnDiv(element) {
        if (!element) {
          console.error("Element not found.");
          return;
        }
      
        // Create a keyboard event for the Enter key
        const enterEvent = new KeyboardEvent("keydown", {
          key: "Enter", // Specify the key name
          code: "Enter", // Specify the key code
          keyCode: 13, // Legacy keyCode value for Enter
          bubbles: true, // Allow the event to bubble
          cancelable: true, // Allow the event to be canceled
        });
      
        // Dispatch the event on the element
        element.dispatchEvent(enterEvent);
      }

    function simulateTyping(handler, element, text, delay = 100) {
        if (!element || !element.isContentEditable) {
          console.error("The provided element is not a contenteditable <div>.");
          return;
        }
      
        let index = 0;
      
        const typeChar = () => {
          if (index < text.length) {
            const char = text[index];
      
            // Create and dispatch a keydown event
            const keydownEvent = new KeyboardEvent("keydown", {
              key: char,
              bubbles: true,
              cancelable: true,
            });
            element.dispatchEvent(keydownEvent);
      
            // Append the character to the <div>
            element.textContent += char;
      
            // Create and dispatch an input event
            const inputEvent = new Event("input", {
              bubbles: true,
              cancelable: true,
            });
            element.dispatchEvent(inputEvent);
      
            index++;
            setTimeout(typeChar, delay);
          }
          else
          {
            handler();
          }
        };
      
        typeChar();
    }

    const msg = prompt("Please enter your message:");
    const type_timeout = 10;
    const send_timeout = 75;
    const dm_timeout = 500;

    const list = getElementByXPath('/html/body/main/div[1]/div[2]/nav/div[1]/div/div');
    ////*[@id="root"]/div[1]/div[2]/nav/div[1]/div/div
    let index = 0;

    function nextDm()
    {
        if (index < list.childNodes.length) {
            const child = list.childNodes[index].firstChild;
            child.click();
            const msgElement = getElementByXPath('/html/body/main/div[1]/div[3]/div/div/div/div[2]/div[2]/div/div/div/div');
            setTimeout(()=>{ simulateTyping(()=>{ setTimeout(()=>{ pressEnterOnDiv(msgElement); setTimeout(()=>{ nextDm(); },send_timeout); }  , send_timeout)}, msgElement, msg, type_timeout); }, dm_timeout);
            index++;
        } else {
            alert("Done");
        }
    }

    nextDm();
  })())