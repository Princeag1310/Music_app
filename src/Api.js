import axios from "axios";
import { toast } from "sonner";

const Api = axios.create({
  baseURL: "https://saavn.dev",
});

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      toast.error(
        `Error: ${error.response.status} - ${error.response.statusText}`
      );
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      toast.error(
        "Error: No response from server. Please check your internet connection."
      );
      console.error("API Error: No response received", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error("Error: Something went wrong with the request.");
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

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
} from "firebase/firestore";
import { app, db } from "./Auth/firebase";
export const fetchFireStore = (setPlaylist) => {
  let auth = getAuth(app);
  onAuthStateChanged(auth, async (user) => {
    if (user?.uid) {
      try {
        const docRef = collection(db, "users", user?.uid, "playlists");
        const docSnap = await getDocs(docRef);
        docSnap.forEach((e) => {
          setPlaylist({ id: e.id, data: e.data() });
        });
      } catch (error) {
        toast.error("Failed to fetch playlists.");
        console.error("Firestore fetch error:", error);
      }
    }
  });
};

export function pushInDb(playlistId, musicId) {
  const auth = getAuth(app);
  onAuthStateChanged(auth, async (user) => {
    if (user?.uid) {
      try {
        const collectionRef = doc(
          db,
          "users",
          user?.uid,
          "playlists",
          playlistId
        );
        await updateDoc(collectionRef, {
          songs: arrayUnion(musicId),
        });
        toast.success("Song added to playlist!");
      } catch (error) {
        toast.error("Failed to add song to playlist.");
        console.error("Firestore push error:", error);
      }
    }
  });
}

export async function deletePlaylist(
  playlistId,
  playlists,
  setPlaylist,
  emptyPlaylist
) {
  const auth = getAuth(app);
  const user = auth?.currentUser;
  if (user?.uid) {
    try {
      const docRef = doc(db, "users", user?.uid, "playlists", playlistId);
      await deleteDoc(docRef);
      // Only update the UI after successful deletion
      emptyPlaylist();
      // pick the next available playlist (first one that's not the deleted playlist)
      const next = playlists.find((e) => e.id !== playlistId);
      if (next) setPlaylist(next);
      toast.success("Playlist deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete playlist.");
      console.error("Firestore delete error:", error);
    }
  }
}
