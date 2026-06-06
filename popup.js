document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('abregeButton').addEventListener('click',()=>{
    chrome.tabs.query({ active: true, currentWindow: true}, (tabs)=> {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func : getText
      }, (results)=> {

      // CHROME RUNTIME ERROR HANDLING.
      if (chrome.runtime.lastError) {
        document.getElementById('contentAbreged').textContent =
        'Accès non autorisé à cette page.';
        return;
      } // ..

        if (!results?.[0] || results[0].result === null){
          document.getElementById('contentAbreged').innerHTML = 'Aucun mail à resumer ici.'
        } else {
          const textTrouve = results[0].result;
          abregeText(textTrouve)
        }
      })
    })
  })
});


function getText(){
  // Selector isnt fix, it may change sometimes & will be update here.
  const actualSelector = ".a3s.aiL";
  let element = document.querySelector(actualSelector);
  return element ? element.innerText : null ;
};


async function abregeText(text){
  const p = document.getElementById('contentAbreged');
  p.innerHTML = 'Résumer en cours...';

  const param = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    };

  fetch('http://localhost:3000/api/abrege', param)
  .then(response => response.json())
  .then(data => p.innerHTML = `Voici votre mail Abrégé : <br> ${data.candidates[0].content.parts[0].text}`)
  .catch(err => p.innerHTML = `Quelque chose s'est mal passé : ${err}`)
};