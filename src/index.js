import { of, fromEvent } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  switchMap,
  catchError,
  tap,
  map,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';

import { addItem, clearItems, handleWrongQueries } from './helpers';
import { API_URL } from './constants';

const token = process.env.GITHUB_TOKEN;


const root = document.getElementById('root');
const searchInput = document.getElementById('searchInput');

const fetchData = (query) => {
  handleWrongQueries(query, root);
  return fromFetch(`${API_URL}/search/users?q=${query}+in:login&access_token=${token}`)
    .pipe(
      switchMap((response) => {
        if (response.ok) {
          return response.json();
        }
        return of({ error: true, message: `Error ${response.status}` });
      }),
      catchError((err) => of({ error: true, message: err.message })),
    );
};


const stream$ = fromEvent(searchInput, 'input')
  .pipe(
    tap(() => clearItems(root)),
    debounceTime(200),
    map((event) => event.target.value),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(fetchData),
    catchError((err) => of({ error: true, message: err.message })),
    tap(({ items = [] }) => {
      items.map(({ login, id }) => addItem(root, `login: ${login}, id: ${id}`));
    }),
  );


stream$.subscribe();
