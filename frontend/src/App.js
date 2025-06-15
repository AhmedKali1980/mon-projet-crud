import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/users';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(API_URL);
    setUsers(res.data);
  };

  const addUser = async () => {
    if (!name || !email) return alert('Remplis tous les champs');
    await axios.post(API_URL, { name, email });
    setName('');
    setEmail('');
    fetchUsers();
  };

  const startEdit = (user) => {
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  const updateUser = async () => {
    await axios.put(`${API_URL}/${editId}`, { name, email });
    setName('');
    setEmail('');
    setEditId(null);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchUsers();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestion Utilisateurs</h2>
      <input
        placeholder="Nom"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      {editId ? (
        <button onClick={updateUser}>Modifier</button>
      ) : (
        <button onClick={addUser}>Ajouter</button>
      )}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email}){' '}
            <button onClick={() => startEdit(user)}>Editer</button>{' '}
            <button onClick={() => deleteUser(user.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
