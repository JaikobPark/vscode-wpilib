'use strict';

import { sendMessage, checkResize } from '../script/implscript';
import { IPrintMessage, IErrorMessage, MessageType } from './message';
import { ReceiveTypes, IIPCSendMessage, SendTypes } from './interfaces';

let paused = false;
export function onPause() {
  const pauseElement = document.getElementById('pause');
  if (pauseElement === null) {
    return;
  }
  if (paused === true) {
    paused = false;
    pauseElement.innerHTML = 'Pause';
    sendMessage({
      type: ReceiveTypes.Pause,
      message: false
    });
  } else {
    paused = true;
    pauseElement.innerHTML = 'Paused: 0';
    sendMessage({
      type: ReceiveTypes.Pause,
      message: true
    });
  }
}

let discard = false;
export function onDiscard() {
  const dButton = document.getElementById('discard');
  if (dButton === null) {
    return;
  }
  if (discard === true) {
    discard = false;
    dButton.innerHTML = 'Discard';
    sendMessage({
      type: ReceiveTypes.Discard,
      message: false
    });
  } else {
    discard = true;
    dButton.innerHTML = 'Resume';
    sendMessage({
      type: ReceiveTypes.Discard,
      message: true
    });
  }
}

export function onClear() {
  const list = document.getElementById('list');
  if (list === null) {
    return;
  }
  list.innerHTML = '';
}

let showWarnings = true;
export function onShowWarnings() {
  const warningsButton = document.getElementById('showwarnings');
  if (warningsButton === null) {
    return;
  }
  if (showWarnings === true) {
    showWarnings = false;
    warningsButton.innerHTML = 'Show Warnings';
  } else {
    showWarnings = true;
    warningsButton.innerHTML = 'Don\'t Show Warnings';
  }
  const ul = document.getElementById('list');
  if (ul === null) {
    return;
  }
  const items = ul.getElementsByTagName('li');
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < items.length; ++i) {
    if (items[i].dataset.type === 'warning') {
      if (showWarnings === true) {
        items[i].style.display = 'inline';
      } else {
        items[i].style.display = 'none';
      }
    }
  }
  checkResize();
}

let showPrints = true;
export function onShowPrints() {
  const printButton = document.getElementById('showprints');
  if (printButton === null) {
    return;
  }
  if (showPrints === true) {
    showPrints = false;
    printButton.innerHTML = 'Show Prints';
  } else {
    showPrints = true;
    printButton.innerHTML = 'Don\'t Show Prints';
  }
  const ul = document.getElementById('list');
  if (ul === null) {
    return;
  }
  const items = ul.getElementsByTagName('li');
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < items.length; ++i) {
    if (items[i].dataset.type === 'print') {
      if (showPrints === true) {
        items[i].style.display = 'inline';
      } else {
        items[i].style.display = 'none';
      }
    }
  }
  checkResize();
}

let autoReconnect = true;
export function onAutoReconnect() {
  if (autoReconnect === true) {
    autoReconnect = false;
    // send a disconnect
    sendMessage({
      type: ReceiveTypes.Reconnect,
      message: false
    });
  } else {
    autoReconnect = true;
    sendMessage({
      type: ReceiveTypes.Reconnect,
      message: true
    });
  }
  const arButton = document.getElementById('autoreconnect');
  if (arButton === null) {
    return;
  }
  if (autoReconnect === true) {
    arButton.innerHTML = 'Reconnect';
  } else {
    arButton.innerHTML = 'Disconnect';
  }

}

let showTimestamps = false;
export function onShowTimestamps() {
  const tsButton = document.getElementById('timestamps');
  if (tsButton === null) {
    return;
  }
  if (showTimestamps === true) {
    showTimestamps = false;
    tsButton.innerHTML = 'Show Timestamps';
  } else {
    showTimestamps = true;
    tsButton.innerHTML = 'Don\'t Show Timestamps';
  }
  const ul = document.getElementById('list');
  if (ul === null) {
    return;
  }
  const items = ul.getElementsByTagName('li');
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < items.length; ++i) {
    const spans = items[i].getElementsByTagName('span');
    if (spans === undefined) {
      continue;
    }
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < spans.length; j++) {
      const span = spans[j];
      if (span.hasAttribute('data-timestamp')) {
        if (showTimestamps === true) {
          span.style.display = 'inline';
        } else {
          span.style.display = 'none';
        }
      }
    }
  }
  checkResize();
}

export function onSaveLog() {
  const ul = document.getElementById('list');
  if (ul === null) {
    return;
  }
  const items = ul.getElementsByTagName('li');
  const logs: string[] = [];

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < items.length; ++i) {
    const m = items[i].dataset.message;
    if (m === undefined) {
      return;
    }
    logs.push(m);
  }

  sendMessage({
    type: ReceiveTypes.Save,
    message: logs
  });
}

export function onConnect() {
  const button = document.getElementById('autoreconnect');
  if (button === null) {
    return;
  }
  button.style.backgroundColor = 'Green';
}

export function onDisconnect() {
  const button = document.getElementById('autoreconnect');
  if (button === null) {
    return;
  }
  button.style.backgroundColor = 'Red';
}

function insertMessage(ts: number, line: string, li: HTMLLIElement, color?: string) {
  const div = document.createElement('div');
  const tsSpan = document.createElement('span');
  tsSpan.appendChild(document.createTextNode(ts.toFixed(3) + ': '));
  tsSpan.dataset.timestamp = 'true';
  if (showTimestamps === true) {
    tsSpan.style.display = 'inline';
  } else {
    tsSpan.style.display = 'none';
  }
  div.appendChild(tsSpan);
  const span = document.createElement('span');
  const split = line.split('\n');
  let first = true;
  for (const item of split) {
    if (item.trim() === '') {
      continue;
    }
    if (first === false) {
      span.appendChild(document.createElement('br'));
    }
    first = false;
    const tNode = document.createTextNode(item);
    span.appendChild(tNode);
  }
  if (color !== undefined) {
    span.style.color = color;
  }
  div.appendChild(span);
  li.appendChild(div);
}

function insertStackTrace(st: string, li: HTMLLIElement, color?: string) {
  const div = document.createElement('div');
  const split = st.split('\n');
  let first = true;
  for (const item of split) {
    if (item.trim() === '') {
      continue;
    }
    if (first === false) {
      div.appendChild(document.createElement('br'));
    }
    first = false;
    const tNode = document.createTextNode('\u00a0\u00a0\u00a0\u00a0 at: ' + item);
    div.appendChild(tNode);
  }
  if (color !== undefined) {
    div.style.color = color;
  }
  li.appendChild(div);
}

function insertLocation(loc: string, li: HTMLLIElement, color?: string) {
  const div = document.createElement('div');
  const split = loc.split('\n');
  let first = true;
  for (const item of split) {
    if (item.trim() === '') {
      continue;
    }
    if (first === false) {
      li.appendChild(document.createElement('br'));
    }
    first = false;
    const tNode = document.createTextNode('\u00a0\u00a0 from: ' + item);
    li.appendChild(tNode);
  }
  if (color !== undefined) {
    div.style.color = color;
  }
  li.appendChild(div);
}

export function addMessage(message: IPrintMessage | IErrorMessage) {
  if (message.messageType === MessageType.Print) {
    addPrint(<IPrintMessage>message);
  } else {
    addError(<IErrorMessage>message);
  }
}

export function addPrint(message: IPrintMessage) {
  const ul = document.getElementById('list');
  if (ul === null) {
    return;
  }
  const li = document.createElement('li');
  li.style.fontFamily = 'Consolas, "Courier New", monospace';
  insertMessage(message.timestamp, message.line, li);
  const str = JSON.stringify(message);
  li.dataset.message = str;
  li.dataset.type = 'print';
  if (showPrints === true) {
    li.style.display = 'inline';
  } else {
    li.style.display = 'none';
  }
  ul.appendChild(li);
}

export function expandError(message: IErrorMessage, li: HTMLLIElement, color?: string) {
  // First append the message
  insertMessage(message.timestamp, message.details, li, color);
  // Then append location, tabbed in once
  insertLocation(message.location, li);
  // Then append stack trace, tabbed in twice
  insertStackTrace(message.callStack, li);
  li.appendChild(document.createElement('br'));
}

export function addError(message: IErrorMessage) {
  const ul = document.getElementById('list');
  if (ul === null) {
    return;
  }
  const li = document.createElement('li');
  li.style.fontFamily = 'Consolas, "Courier New", monospace';
  const str = JSON.stringify(message);
  li.dataset.expanded = 'false';
  li.dataset.message = str;
  if (message.messageType === MessageType.Warning) {
    li.dataset.type = 'warning';
    insertMessage(message.timestamp, message.details, li, 'Yellow');
    if (showWarnings === true) {
      li.style.display = 'inline';
    } else {
      li.style.display = 'none';
    }
  } else {
    li.dataset.type = 'error';
    insertMessage(message.timestamp, message.details, li, 'Red');
  }
  li.onclick = () => {
    if (li.dataset.expanded === 'true') {
      // shrink
      li.dataset.expanded = 'false';
      if (li.dataset.message === undefined) {
        return;
      }
      const parsed = JSON.parse(li.dataset.message);
      li.innerHTML = '';
      if (li.dataset.type === 'warning') {
        insertMessage(parsed.timestamp, parsed.details, li, 'Yellow');
      } else {
        insertMessage(parsed.timestamp, parsed.details, li, 'Red');
      }
    } else {
      // expand
      li.dataset.expanded = 'true';
      if (li.dataset.message === undefined) {
        return;
      }
      const parsed = JSON.parse(li.dataset.message);
      li.innerHTML = '';
      if (li.dataset.type === 'warning') {
        expandError(parsed, li, 'Yellow');
      } else {
        expandError(parsed, li, 'Red');
      }
    }
    checkResize();
  };
  ul.appendChild(li);
}

window.addEventListener('resize', () => {
  checkResize();
});

// tslint:disable-next-line:no-any
function handleFileSelect(evt: any) {
  const files: FileList = evt.target.files; // filelist
  const firstFile = files[0];
  const reader = new FileReader();
  reader.onload = (loaded: Event) => {
    const target: FileReader = <FileReader>loaded.target;
    const parsed = JSON.parse(target.result);
    for (const p of parsed) {
      addMessage(p);
    }
    checkResize();
  };
  reader.readAsText(firstFile);
}

let currentScreenHeight = 100;

export function checkResizeImpl(element: HTMLElement) {
  const allowedHeight = element.clientHeight - currentScreenHeight;
  const ul = document.getElementById('list');
  if (ul === null) {
    return;
  }
  const listHeight = ul.clientHeight;
  if (listHeight < allowedHeight) {
    ul.style.position = 'fixed';
    ul.style.bottom = currentScreenHeight + 'px';
  } else {
    ul.style.position = 'static';
    ul.style.bottom = 'auto';
  }
}

export function handleMessage(data: IIPCSendMessage): void {
  switch (data.type) {
    case SendTypes.New:
      addMessage(<IPrintMessage | IErrorMessage>data.message);
      document.body.scrollTop = document.body.scrollHeight;
      break;
    case SendTypes.Batch:
      for (const message of <(IPrintMessage | IErrorMessage)[]>data.message) {
        addMessage(message);
      }
      document.body.scrollTop = document.body.scrollHeight;
      break;
    case SendTypes.PauseUpdate:
      const pause = document.getElementById('pause');
      if (pause !== null) {
        pause.innerHTML = 'Paused: ' + <number>data.message;
      }
      break;
    case SendTypes.ConnectionChanged:
      const bMessage: boolean = <boolean>data.message;
      if (bMessage === true) {
        onConnect();
      } else {
        onDisconnect();
      }
      break;
    default:
      break;
  }
  checkResize();
}
//position:fixed;bottom: 0px;left:0px;list-style-type:none;padding-bottom:0;padding-left:0;padding-top:0;padding-right:0;width: 49.8%; margin-bottom: 1px"
//position:fixed;bottom: 0px;right:0px;list-style-type:none;padding-bottom:0;padding-left:0;padding-top:0;padding-right:0;width: 49.8%;margin-bottom: 1px"
function createSplitUl(left: boolean): HTMLUListElement {
  const splitDiv = document.createElement('ul');
  splitDiv.style.position = 'fixed';
  splitDiv.style.bottom = '0px';
  if (left) {
    splitDiv.style.left = '0px';
  } else {
    splitDiv.style.right = '0px';
  }
  splitDiv.style.listStyleType = 'none';
  splitDiv.style.padding = '0';
  splitDiv.style.width = '49.8%';
  splitDiv.style.marginBottom = '1px';
  return splitDiv;
}

function createButton(id: string, text: string, callback: () => void): HTMLLIElement {
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.id = id;
  button.style.width = '100%';
  button.appendChild(document.createTextNode(text));
  button.addEventListener('click', callback);
  li.appendChild(button);
  return li;
}

function onChangeTeamNumber() {
  const newNumber = document.getElementById('teamNumber');
  console.log('finding team number');
  if (newNumber === null) {
    return;
  }
  console.log('sending message');
  sendMessage({
    type: ReceiveTypes.ChangeNumber,
    message: parseInt((<HTMLInputElement>newNumber).value)
  });
  console.log('sent message');
}

function setLivePage() {
  const mdv = document.getElementById('mainDiv');
  if (mdv === undefined) {
    return;
  }
  const mainDiv: HTMLDivElement = <HTMLDivElement>mdv;
  currentScreenHeight = 100;
  mainDiv.innerHTML = '';
  const ul = document.createElement('ul');
  ul.id = 'list';
  ul.style.listStyleType = 'none';
  ul.style.padding = '0';
  mainDiv.appendChild(ul);
  const splitDiv = document.createElement('div');
  splitDiv.style.height = '100px';
  mainDiv.appendChild(splitDiv);
  const leftList = createSplitUl(true);
  leftList.appendChild(createButton('pause', 'Pause', onPause));
  leftList.appendChild(createButton('discard', 'Discard', onDiscard));
  leftList.appendChild(createButton('clear', 'Clear', onClear));
  leftList.appendChild(createButton('showprints', 'Don\'t Show Prints', onShowPrints));
  leftList.appendChild(createButton('switchPage', 'Switch to Viewer', () => {
    setViewerPage();
  }));
  mainDiv.appendChild(leftList);

  const rightList = createSplitUl(false);
  rightList.appendChild(createButton('showwarnings', 'Don\'t Show Warnings', onShowWarnings));
  rightList.appendChild(createButton('autoreconnect', 'Disconnect', onAutoReconnect));
  rightList.appendChild(createButton('timestamps', 'Show Timestamps', onShowTimestamps));
  rightList.appendChild(createButton('savelot', 'Save Log', onSaveLog));
  const teamNumberUl = document.createElement('li');
  const teamNumberI = document.createElement('input');
  teamNumberI.id = 'teamNumber';
  teamNumberI.type = 'number';
  teamNumberI.style.width = '50%';
  const teamNumberB = document.createElement('button');
  teamNumberB.id = 'changeTeamNumber';
  teamNumberB.style.width = '24.9%';
  teamNumberB.style.right = '0';
  teamNumberB.style.position = 'fixed';
  teamNumberB.addEventListener('click', onChangeTeamNumber);
  teamNumberB.appendChild(document.createTextNode('Set Team Number'));
  teamNumberUl.appendChild(teamNumberI);
  teamNumberUl.appendChild(teamNumberB);
  rightList.appendChild(teamNumberUl);
  mainDiv.appendChild(rightList);
  if (autoReconnect !== true) {
    onAutoReconnect();
  }
}

export function setViewerPage() {
  const mdv = document.getElementById('mainDiv');
  if (mdv === undefined) {
    return;
  }
  if (autoReconnect === true) {
    onAutoReconnect();
  }
  const mainDiv: HTMLDivElement = <HTMLDivElement>mdv;
  currentScreenHeight = 60;
  mainDiv.innerHTML = '';
  const ul = document.createElement('ul');
  ul.id = 'list';
  ul.style.listStyleType = 'none';
  ul.style.padding = '0';
  mainDiv.appendChild(ul);
  const splitDiv = document.createElement('div');
  splitDiv.style.height = '60px';
  mainDiv.appendChild(splitDiv);

  const leftList = createSplitUl(true);
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'openFile';
  fileInput.name = 'files[]';
  fileInput.style.width = '100%';
  fileInput.addEventListener('change', handleFileSelect, false);
  leftList.appendChild(fileInput);
  leftList.appendChild(createButton('showprints', 'Don\'t Show Prints', onShowPrints));
  leftList.appendChild(createButton('switchPage', 'Switch to Live', () => {
    setLivePage();
  }));
  mainDiv.appendChild(leftList);


  const rightList = createSplitUl(false);
  rightList.appendChild(createButton('showwarnings', 'Don\'t Show Warnings', onShowWarnings));
  rightList.appendChild(createButton('timestamps', 'Show Timestamps', onShowTimestamps));

  mainDiv.appendChild(rightList);
}

window.addEventListener('load', (_: Event) => {
  setLivePage();
});