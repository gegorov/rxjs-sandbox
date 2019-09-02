import { of } from 'rxjs';

import { API_URL, ERROR_CSS_CLASS } from './constants';

const token = process.env.GITHUB_TOKEN;


export const addItem = (node, item, error) => {
    const li = document.createElement('li');
    const textNode = document.createTextNode(item);
    li.appendChild(textNode);

    if (error) {
        li.classList.add(ERROR_CSS_CLASS);
    }

    node.appendChild(li);
};

export const clearItems = (root) => {
    while (root.hasChildNodes()) {
        root.removeChild(root.lastChild);
    }
};

export const handleWrongQueries = (query, root) => {
    if (query.length > 255) {
        addItem(root, 'Query is too long:( Try something shorter.', true);
        return of({ error: true, message: 'empty input' });
    }
    return null;
};

export const handleEmptyQuery = (root) => {
    addItem(root, 'Try to type in somenthing.', true);
    return of({ error: true, message: 'empty input' });
};

export const urlBuilder = (query) => `${API_URL}/search/users?q=${query}+in:login&access_token=${token}`;

export const urlBulderRepo = (login) => `${API_URL}/users/${login}`;
