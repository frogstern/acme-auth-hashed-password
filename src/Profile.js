import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAuth, removeNote, createNote } from './store';

const Profile = () => {
  const [luckyNumber, setLuckyNumber] = useState(7);
  const [text, setText] = useState('');
  const { auth, notes } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.id) {
      setLuckyNumber(auth.luckyNumber);
    }
  }, [auth]);

  const _update = async ev => {
    ev.preventDefault();
    dispatch(updateAuth({ luckyNumber }));
  };

  const create = async ev => {
    ev.preventDefault();
    dispatch(createNote({ text, userId: auth.id }));
    setText('');
  };

  return (
    <div>
      <form onSubmit={create}>
        <input
          placeholder='Enter text here'
          value={text}
          onChange={ev => setText(ev.target.value)}
        />
        <button>Create Note</button>
      </form>
      <ul>
        {notes.map((note, index) => {
          return (
            <li key={note.id}>
              Note {index + 1}:{` ${note.text}`}
              <button onClick={() => dispatch(removeNote(note.id))}>x</button>
            </li>
          );
        })}
      </ul>
      <form onSubmit={_update}>
        <input
          placeholder='luckyNumber'
          value={luckyNumber}
          onChange={ev => setLuckyNumber(ev.target.value)}
        />
        <button disabled={luckyNumber === auth.luckyNumber}>Update</button>
      </form>
    </div>
  );
};

export default Profile;
