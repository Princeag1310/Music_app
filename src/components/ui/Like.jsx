import React from "react";
import { Heart } from "lucide-react";
import { cn } from "../../lib/utils.ts";
import { addToLikedSongs, removeFromLikedSongs } from "../../Api";
import { useStore } from "../../zustand/store";
import { getAuth } from "firebase/auth";
import { app } from "../../Auth/firebase";

const Like = ({ songId }) => {
  const { isLiked, addLikedSong, removeLikedSong, isUser } = useStore();
  const songIsLiked = isLiked(songId);

  const handleClick = (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    const auth = getAuth(app);
    const user = auth?.currentUser;
    
    if (!user || !isUser) {
      alert('Please log in to like songs');
      return;
    }
    
    if (songIsLiked) {
      removeLikedSong(songId);
      removeFromLikedSongs(songId);
    } else {
      addLikedSong(songId);
      addToLikedSongs(songId);
    }
  };

  // Check if user is authenticated for visual feedback
  const auth = getAuth(app);
  const user = auth?.currentUser;
  const isAuthenticated = user && isUser;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center transition-all duration-200",
        isAuthenticated ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed opacity-60"
      )}
      aria-label={
        !isAuthenticated 
          ? "Login to like songs" 
          : songIsLiked 
            ? "Unlike this song" 
            : "Like this song"
      }
      disabled={!isAuthenticated}
    >
      <Heart
        className={cn(
          "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200",
          !isAuthenticated
            ? "fill-transparent stroke-muted-foreground/50"
            : songIsLiked 
              ? "fill-red-500 stroke-red-500" 
              : "fill-transparent stroke-muted-foreground hover:fill-red-500 hover:stroke-red-500"
        )}
      />
    </button>
  );
};

export default Like;