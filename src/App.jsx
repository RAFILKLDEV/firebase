import "./App.css";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useEffect, useState } from "react";

function App() {
  const firebaseApp = initializeApp({
    apiKey: "AIzaSyDANRLrZ_DEVDebPo3OmCCZ0lg5i1ev6WU",
    authDomain: "biblioteca-t20.firebaseapp.com",
    projectId: "biblioteca-t20",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, "users");

  const showUsers = () => {
    return users.map((e) => (
      <div key={e.id}>
        <div>
          Usuario: {e.name} <button onClick={() => deleteUser(e.id)}>X</button>
        </div>
        <div>Email: {e.email}</div>
      </div>
    ));
  };

  const registerUser = () => {
    const register = async () => {
      const user = await addDoc(userCollectionRef, {
        name,
        email,
      });
      console.log(user);
    };
    return (
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={() => {
            register();
          }}
        >
          Registrar
        </button>
      </div>
    );
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, [users]);

  return (
    <div className="App">
      <div>{showUsers()}</div>
      <div>{registerUser()}</div>
    </div>
  );
}

export default App;
