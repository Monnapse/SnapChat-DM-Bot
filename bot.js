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

      function insertImage(imageDataUrl, div)
      {
        const img = document.createElement('img');

        // Set the src attribute to the Data URL
        img.src = imageDataUrl;
            
        // Optionally, you can set styles for the image
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
            
        // Append the image to the contenteditable div
        div.appendChild(img);
      }

    const msg = prompt("Please enter your message:");
    const type_timeout = 20;
    const send_timeout = 75;
    const dm_timeout = 200;


    const list = getElementByXPath('/html/body/main/div[1]/div[2]/nav/div[1]/div/div');
    let index = 0;

    function nextDm()
    {
        if (index < list.childNodes.length) {
            const child = list.childNodes[index].firstChild;
            child.click();
            const msgElement = getElementByXPath('//*[@id="root"]/div[1]/div[3]/div/div/div/div[2]/div[2]/div/div/div/div');
            simulateTyping(()=>{ setTimeout(()=>{ pressEnterOnDiv(msgElement); setTimeout(()=>{ nextDm(); },dm_timeout); }  , send_timeout)}, msgElement, msg, type_timeout);
    
            index++;
            
        } else {
            alert("Done");
        }
    }

    nextDm();
  })())