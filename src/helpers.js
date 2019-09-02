import { of } from 'rxjs';

export const addItem = (node, item, error) => {
  const li = document.createElement('li');
  const textNode = document.createTextNode(item);
  li.appendChild(textNode);

  if (error) {
    li.setAttribute('style', 'color:red');
  }

  node.appendChild(li);
};

export const clearItems = (root) => {
  while (root.hasChildNodes()) {
    root.removeChild(root.lastChild);
  }
};

export const handleWrongQueries = (query, root) => {
  if (!query) {
    addItem(root, 'Try to type in somenthing.', true);
    return of({ error: true, message: 'empty input' });
  }
  if (query.length > 255) {
    addItem(root, 'Query is too long:( Try something shorter.', true);
    return of({ error: true, message: 'empty input' });
  }
  return null;
};
