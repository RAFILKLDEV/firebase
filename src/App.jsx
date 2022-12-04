import "./App.css";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  Firestore,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useEffect, useState } from "react";

function App() {
  const firebaseApp = initializeApp({
    apiKey: "AIzaSyBPap_2XBwhRNU7ejE4ZRbcxyMotEN7xGI",
    authDomain: "tormenta-3582c.firebaseapp.com",
    projectId: "tormenta-3582c",
    storageBucket: "tormenta-3582c.appspot.com",
    messagingSenderId: "508691522674",
    appId: "1:508691522674:web:b3b6f251c8cffed9130eeb",
    measurementId: "G-YL6K5SZXRP",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sheets, setSheets] = useState([]);
  const [users, setUsers] = useState([]);

  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, "users");

  const registerSheet = async (name, nd, image) => {
    const object = new Object();
    object.name = name;
    object.nd = nd;
    object.image = image;
    console.log(object);
    setSheets([object]);
  };

  const SheetCreator = () => {
    const [name, setName] = useState("");
    const [nd, setNd] = useState(0);
    const [image, setImage] = useState("");
    return (
      <div>
        <div>
          <div>Nome do Npc: </div>
          <input value={name} onChange={(e) => setName(e.target.value)}></input>
        </div>
        <div>
          <div>Nd: </div>
          <input
            value={nd}
            onChange={(e) => setNd(e.target.value)}
            type="number"
          ></input>
        </div>
        <div>
          <div>Image: </div>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            type="text"
          ></input>
          <img src={image} width={"100%"} alt={image} />
        </div>
        <button
          onClick={() => {
            registerSheet(name, nd, image);
          }}
        >
          Registrar Sheet!
        </button>
      </div>
    );
  };

  const showUsers = () => {
    return users.map((e) => (
      <div key={e.id}>
        <div>
          Usuario: {e.name} <button onClick={() => deleteUser(e.id)}>X</button>
        </div>
        <div>Email: {e.email}</div>
        <div>Sheets</div>
        <div>{e.sheets.name}</div>
      </div>
    ));
  };

  const registerUser = () => {
    const register = async () => {
      await addDoc(userCollectionRef, {
        name,
        email,
        sheets,
      });
    };
    return (
      <div>
        <div>
          <div>Usuário: </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div>Email: </div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            register();
            getUsers();
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
    getUsers();
  };

  const getUsers = async () => {
    const data = await getDocs(userCollectionRef);
    await setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    console.log(data.docs[0].data());
  };

  const updateUser = async () => {
    const docRef = doc(db, "users", "adYM8ULHHbandLgIb4MB");
    await updateDoc(docRef, {
      name: "anderson",
      email: "rafa",
      sheets,
    });
  };

  useEffect(() => {
    console.log("Get!");
    getUsers();
  }, []);

  return (
    <div className="App">
      <div className="Tabela">
        <h1>Usuários</h1>
        <div>{showUsers()}</div>
      </div>
      <div className="Tabela">
        <h1>Registrar Usuários</h1>
        <div>{registerUser()}</div>
      </div>
      <div className="Tabela">
        <h1>Registrar Ficha de Usuário</h1>
        <div>{SheetCreator()}</div>
      </div>
      <div className="Tabela">
        <h1>Alterar Usuário</h1>
        <div>
          <button
            onClick={() => {
              updateUser();
            }}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
