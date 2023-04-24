import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import axios from 'axios';

const products = (state = [], action) => {
  if (action.type === 'SET_PRODUCTS') {
    return action.products;
  }
  return state;
};

const notes = (state = [], action) => {
  if (action.type === 'SET_NOTES') {
    return action.notes;
  }
  if (action.type === 'REMOVE_NOTE') {
    return state.filter(note => note.id !== action.noteId);
  }
  if (action.type === 'CREATE_NOTE') {
    return [...state, action.note];
  }
  return state;
};

const auth = (state = {}, action) => {
  if (action.type === 'SET_AUTH') {
    return action.auth;
  }
  return state;
};

export const fetchProducts = () => {
  return async dispatch => {
    return dispatch({
      type: 'SET_PRODUCTS',
      products: (await axios.get('/api/products')).data,
    });
  };
};

const fetchNotes = userId => {
  return async dispatch => {
    return dispatch({
      type: 'SET_NOTES',
      notes: (await axios.get(`/api/notes/${userId}`)).data,
    });
  };
};

export const removeNote = _noteId => {
  return async dispatch => {
    await axios.delete(`/api/notes/${_noteId}`);
    return dispatch({ type: 'REMOVE_NOTE', noteId: _noteId });
  };
};

export const createNote = note => {
  return async dispatch => {
    return dispatch({
      type: 'CREATE_NOTE',
      note: (await axios.post(`/api/notes/`, note)).data,
    });
  };
};

export const loginWithToken = () => {
  return async dispatch => {
    const token = window.localStorage.getItem('token');
    if (token) {
      const response = await axios.get(`/api/auth/${token}`);
      dispatch({ type: 'SET_AUTH', auth: response.data });
      dispatch(fetchNotes(response.data.id));
    }
  };
};

export const logout = () => {
  return dispatch => {
    window.localStorage.removeItem('token');
    dispatch({ type: 'SET_AUTH', auth: {} });
    dispatch({ type: 'SET_NOTES', notes: [] });
  };
};

export const login = credentials => {
  return async dispatch => {
    const response = await axios.post('/api/auth', credentials);
    const token = response.data.token;
    window.localStorage.setItem('token', token);
    dispatch(loginWithToken());
    //dispatch({ type: 'SET_AUTH', auth: response.data });
  };
};

export const updateAuth = auth => {
  return async dispatch => {
    const token = window.localStorage.getItem('token');
    const response = await axios.put(`/api/auth/${token}`, auth);
    dispatch({ type: 'SET_AUTH', auth: response.data });
  };
};

export const register = credentials => {
  return async dispatch => {
    const response = await axios.post('/api/auth/register', credentials);
    const token = response.data.token;
    window.localStorage.setItem('token', token);
    dispatch(loginWithToken());
    //dispatch({ type: 'SET_AUTH', auth: response.data });
  };
};

const reducer = combineReducers({
  products,
  notes,
  auth,
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
