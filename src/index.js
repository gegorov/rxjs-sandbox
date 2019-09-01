import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError } from 'rxjs/operators';

import { addItem } from './helpers';
import { API_URL } from './constants';

const token = process.env.GITHUB_TOKEN;


const root = document.getElementById('root');
const query = 'geg';

const data$ = fromFetch(`${API_URL}/search/users?q=${query}+in:login&access_token=${token}`)
  .pipe(
    switchMap((response) => {
      if (response.ok) {
        // OK return data
        return response.json();
      }
      // Server is returning a status requiring the client to try something else.
      return of({ error: true, message: `Error ${response.status}` });
    }),
    catchError((err) => {
      // Network or other error, handle appropriately
      console.error(err);
      return of({ error: true, message: err.message });
    }),
  );

data$.subscribe({
  next: (result) => result.items.map(
    ({ login, id, score }) => addItem(root, `username: ${login}, id: ${id}, score: ${score}`),
  ),
  complete: () => console.log('done'),
});
