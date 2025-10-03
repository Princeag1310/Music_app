import axios from "axios";
const Api = axios.create({
  baseURL: "https://saavn.dev",
});
export default Api;

import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { app, db } from "./Auth/firebase";
export const fetchFireStore = (setPlaylist, setLikedSongs) => {
  let auth = getAuth(app);
  onAuthStateChanged(auth, async (user) => {
    if (user?.uid) {
      const docRef = collection(db, "users", user?.uid, "playlists");
      const docSnap = await getDocs(docRef);
      docSnap.forEach((e) => {
        setPlaylist({ id: e.id, data: e.data() });
      });

      try {
        const userDocRef = doc(db, "users", user?.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const likedSongs = userData.likedSongs || [];
          setLikedSongs(likedSongs);
        } else {
          await setDoc(userDocRef, {
            likedSongs: [],
            createdAt: new Date().toISOString(),
          });
          setLikedSongs([]);
        }
      } catch (error) {
        console.error("Error fetching liked songs:", error);
        setLikedSongs([]);
      }
    }
  });
};

export function pushInDb(playlistId, musicId) {
  const auth = getAuth(app);
  onAuthStateChanged(auth, (user) => {
    const collectionRef = doc(db, "users", user?.uid, "playlists", playlistId);
    updateDoc(collectionRef, {
      songs: arrayUnion(musicId),
    });
  });
}

export function deletePlaylist(playlistId,playlists,setPlaylist,emptyPlaylist) {
  const auth = getAuth(app);
  const user = auth?.currentUser;
  if (user?.uid) {
    const docRef = doc(db, "users", user?.uid, "playlists", playlistId);
    deleteDoc(docRef);
    emptyPlaylist()
  }
  playlists.forEach((e)=>{
    if(e.id!==playlistId){
        setPlaylist(e)
    }
  })
}

export function addToLikedSongs(songId) {
  const auth = getAuth(app);
  const user = auth?.currentUser;
  
  if (!user) {
    return;
  }
  
  if (user?.uid) {
    const userDocRef = doc(db, "users", user?.uid);
    setDoc(userDocRef, {
      likedSongs: arrayUnion(songId),
    }, { merge: true }).catch((error) => {
      console.error("Error adding to liked songs:", error);
    });
  }
}

export function removeFromLikedSongs(songId) {
  const auth = getAuth(app);
  const user = auth?.currentUser;
  
  if (!user) {
    return;
  }
  
  if (user?.uid) {
    const userDocRef = doc(db, "users", user?.uid);
    setDoc(userDocRef, {
      likedSongs: arrayRemove(songId),
    }, { merge: true }).catch((error) => {
      console.error("Error removing from liked songs:", error);
    });
  }
}

export async function fetchLikedSongs() {
  const auth = getAuth(app);
  const user = auth?.currentUser;
  if (user?.uid) {
    try {
      const userDocRef = doc(db, "users", user?.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data().likedSongs || [];
      }
    } catch (error) {
      console.error("Error fetching liked songs:", error);
    }
  }
  return [];
}

export async function fetchSongsByIds(songIds) {
  try {
    const idsString = songIds.join(',');
    const response = await Api(`/api/songs?ids=${idsString}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching songs by IDs:", error);
    return { success: false, data: [] };
  }
}
