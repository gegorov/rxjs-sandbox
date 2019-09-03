import { of, fromEvent, zip } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
    switchMap,
    catchError,
    tap,
    map,
    debounceTime,
    distinctUntilChanged,
} from 'rxjs/operators';

import {
    addItem,
    clearItems,
    handleWrongQueries,
    handleEmptyQuery,
    urlBuilder,
    urlBuilderRepo,
} from './helpers';
import { DEBOUNCING_TIME } from './constants';

import './styles/styles.css';

const root = document.getElementById('root');
const searchInput = document.getElementById('searchInput');

const fetchData = (query) => {
    if (!query) {
        return handleEmptyQuery(root);
    }
    handleWrongQueries(query, root);
    return fromFetch(urlBuilder(query))
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

const fetchUserData = (login) => {
    if (!login) {
        return handleEmptyQuery(root);
    }
    handleWrongQueries(login, root);
    return fromFetch(urlBuilderRepo(login))
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

const processUsers = (users) => {
    const userReposArray = users.map(({ login }) => fetchUserData(login));
    return zip(...userReposArray);
};


const stream$ = fromEvent(searchInput, 'input')
    .pipe(
        tap(() => clearItems(root)),
        debounceTime(DEBOUNCING_TIME),
        map((event) => event.target.value),
        distinctUntilChanged(),
        switchMap(fetchData),
        switchMap(({ items: users }) => processUsers(users)),
        catchError((err) => of({ error: true, message: err.message })),
        tap((items) => items.map(
            ({ login, public_repos: reposCount }) => {
                const item =  `GitHub login: ${login}, repos count: ${reposCount}`;
                addItem(root, item);
            },
        )),
    );

stream$.subscribe();
