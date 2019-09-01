export const addItem = (node, item) => {
  const li = document.createElement('li');
  const textNode = document.createTextNode(item);
  li.appendChild(textNode);
  node.appendChild(li);
};
