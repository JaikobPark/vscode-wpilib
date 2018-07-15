'use strict';

const vscode = acquireVsCodeApi();

function eclipseSelectButtonClick() {
  vscode.postMessage({type: 'eclipse'});
}

function projectSelectButtonClick() {
  vscode.postMessage({type: 'newproject'});
}

function upgradeProjectButtonClick() {
  vscode.postMessage({
    type: 'upgradeproject',
    data: {
      fromProps: document.getElementById('eclipseInput').value,
      toFolder: document.getElementById('projectFolder').value,
      projectName: document.getElementById('projectName').value,
      newFolder: document.getElementById('newFolderCB').checked,
    }
  })
}

window.addEventListener('message', (event) => {
  const data = event.data;
  switch(data.type) {
    case 'eclipse':
      document.getElementById('eclipseInput').value = data.data;
      break;
    case 'projectname':
      const doc = document.getElementById('projectName');
      doc.value = data.data;
      doc.disabled = false;
      break;
    case 'newproject':
      const elem = document.getElementById('projectFolder');
      elem.value = data.data;
      break;
  }
});

function validateProject() {
  const elem = document.getElementById('projectName');
  const s = elem.value
  const match = s.match('^([a-zA-Z_]{1}[a-zA-Z0-9_]*(\\.[a-zA-Z_]{1}[a-zA-Z0-9_]*)*)$');
  const pdiv = document.getElementById('projectnamediv');
  if (match === null || match.length === 0) {
    pdiv.innerText = 'Invalid Project Name';

    pdiv.classList.add('error');
    elem.classList.add('error');
  } else {
    pdiv.innerText = 'Enter a project name';
    pdiv.classList.remove('error');
    elem.classList.remove('error');
  }
}