/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  getFirestore,
  getDoc,
  snapshotEqual,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
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
  const [teste, setTeste] = useState({});

  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  const userCollectionRef = collection(db, "users");

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
      </div>
    );
  };

  const showUsers = () => {
    return users.map((e) => (
      <div key={e.id}>
        <div>
          Usuario: {e?.user.apelido}{" "}
          <button onClick={() => deleteUser(e.id)}>X</button>
        </div>
        <div>Email: {e?.user.email}</div>
        <div>Sheets</div>
        <div>{e?.sheets?.apelido}</div>
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
          <div>Usu??rio: </div>
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
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const updateUser = async () => {
    const docRef = doc(db, "users", "adYM8ULHHbandLgIb4MB");
    await updateDoc(docRef, {
      name: "anderson",
      email: "rafa",
      sheets,
    });
  };

  // Receber Informa????es do Usu??rio do Firebase Store
  const getOneUser = async (setUser, id) => {
    const user = doc(db, "users", id);
    try {
      const data = await getDoc(user);
      setUser(data.data());
    } catch (error) {
      console.log(error);
    }
  };

  const [imgURL, setImgUrl] = useState("");
  const [progress, setProgress] = useState(0);

  function handleUpload(e) {
    e.preventDefault();

    const file = e.target[0]?.files[0];
    if (!file) return;

    const storageRef = ref(storage, `Fichas/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
      },
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        setImgUrl(url);
      })
    );
  }

  useEffect(() => {
    console.log("Get!");
    getUsers();
    getOneUser(setTeste, "Al3SEj4en9MMmUtmuwjOS8iT7G43");
  }, []);

  return (
    <div className="App">
      {/* <div className="Tabela">
        <h1>Usu??rios</h1>
        <div>{teste.user?.apelido}</div>
      </div> */}
      <div className="Tabela">
        <form onSubmit={handleUpload}>
          <input type="file" />
          <button type="submit">Enviar</button>
        </form>
        <br />
        {!imgURL && <progress value={progress} max={100} width="300" />}
        {imgURL && <img src={imgURL} alt="Imagem" />}
      </div>

      {/* <div className="Tabela">
        <h1>Usu??rios</h1>
        <div>{showUsers()}</div>
      </div>
      <div className="Tabela">
        <h1>Registrar Usu??rios</h1>
        <div>{registerUser()}</div>
      </div>
      <div className="Tabela">
        <h1>Registrar Ficha de Usu??rio</h1>
        <div>{SheetCreator()}</div>
      </div>
      <div className="Tabela">
        <h1>Alterar Usu??rio</h1>
        <div>
          <button
            onClick={() => {
              updateUser();
            }}
          >
            Update
          </button>
        </div>
      </div> */}
    </div>
  );
}

export default App;
