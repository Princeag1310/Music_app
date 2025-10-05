import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "../../Api";
import { getImageColors } from "../color/ColorGenrator";
import { ScrollArea } from "../ui/scroll-area";
import { useStore } from "../../zustand/store";
import { Play, Pause, Share2, Shuffle, ArrowLeft, Music2 } from "lucide-react";
import Menu from "../Menu";
import Like from "../ui/Like";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function Artist() {
  const [data, setData] = useState();
  const [bgColor, setBgColor] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  let url = useLocation();
  const { setMusicId, musicId, isPlaying, setIsPlaying, setQueue } = useStore();
  const artistId = url.search.split("=")[1];

  useEffect(() => {
    const fetching = async () => {
      try {
        setIsLoading(true);
        const res = await Api(`/api/artists/${artistId}`);
        setData(res.data.data);
        setQueue(res.data.data.topSongs);

        getImageColors(res.data.data.image[2].url).then(
          ({ averageColor, dominantColor }) => {
            setBgColor({ bg1: averageColor, bg2: dominantColor });
          }
        );
      } catch (error) {
        toast.error("Failed to load artist data.");
        console.error("Error fetching artist data:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetching();
  }, [artistId]);

  function handleSongClick(song, e) {
    if (e) {
      e.stopPropagation();
    }
    if (song.id !== musicId) {
      setMusicId(song.id);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  }

  function handlePlayAll(e) {
    e.stopPropagation();
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (data?.topSongs?.length > 0 && musicId == null) {
        setMusicId(data.topSongs[0].id);
        setIsPlaying(true);
      } else {
        setIsPlaying(true);
      }
    }
  }

  function handleShuffle(e) {
    e.stopPropagation();
    if (data?.topSongs?.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.topSongs.length);
      setMusicId(data.topSongs[randomIndex].id);
      setIsPlaying(true);
    }
  }

  function handleTogglePlayPause(e) {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading artist...</p>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Music2 className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold">Artist not found</p>
            <p className="text-muted-foreground">The artist you're looking for doesn't exist</p>
          </div>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[100dvh]">
      <div className="min-h-screen pb-32">
        {/* Enhanced Hero Section */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            background: bgColor
              ? `linear-gradient(180deg, ${bgColor.bg1} 0%, ${bgColor.bg2} 45%, rgba(0,0,0,0.4) 100%)`
              : "linear-gradient(180deg, hsl(var(--muted)) 0%, rgba(0,0,0,0.4) 100%)",
          }}
        >
          {/* Animated Background Blur Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
              style={{ background: bgColor?.bg1 || 'hsl(var(--primary))' }}
            />
            <div 
              className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse [animation-delay:1s]"
              style={{ background: bgColor?.bg2 || 'hsl(var(--primary))' }}
            />
          </div>

          {/* Back Button */}
          <div className="absolute top-4 left-4 z-20 animate-in fade-in slide-in-from-left duration-500">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full bg-background/10 backdrop-blur-xl",
                "hover:bg-background/30 transition-all duration-300",
                "border border-white/10 hover:border-white/30",
                "hover:scale-110 active:scale-95",
                "shadow-lg hover:shadow-2xl"
              )}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="container mx-auto px-4 py-12 lg:py-16 pt-20 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
              {/* Premium Artist Image */}
              <div className="relative group animate-in fade-in zoom-in duration-700">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-all duration-500"></div>
                <div
                  className={cn(
                    "relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72",
                    "rounded-2xl overflow-hidden",
                    "shadow-2xl ring-4 ring-white/10",
                    "transition-all duration-500",
                    "group-hover:ring-white/30 group-hover:shadow-[0_25px_60px_-12px_rgba(8,112,184,0.8)]",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                >
                  <img
                    src={data.image[2].url}
                    alt={data.name}
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onLoad={() => setImageLoaded(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                {!imageLoaded && (
                  <div className="absolute inset-0 w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-2xl bg-muted animate-pulse"></div>
                )}
              </div>

              {/* Premium Artist Info */}
              <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
                <div className="space-y-4 animate-in fade-in slide-in-from-right duration-700">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium uppercase tracking-widest">
                      Artist
                    </span>
                  </div>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
                    {data.name}
                  </h1>
                </div>

                {/* Premium Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-right duration-700 delay-150">
                  <Button
                    onClick={handlePlayAll}
                    size="lg"
                    className={cn(
                      "gap-3 rounded-full px-8 h-14 text-base font-semibold",
                      "bg-primary hover:bg-primary/90",
                      "shadow-[0_8px_30px_rgb(8,112,184,0.5)]",
                      "hover:shadow-[0_12px_40px_rgb(8,112,184,0.7)]",
                      "hover:scale-105 active:scale-95",
                      "transition-all duration-300",
                      "group"
                    )}
                  >
                    {!isPlaying ? (
                      <>
                        <Play className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
                        <span>Play All</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
                        <span>Pause</span>
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleShuffle}
                    variant="secondary"
                    size="lg"
                    className={cn(
                      "gap-3 rounded-full px-8 h-14 text-base font-semibold",
                      "bg-white/10 hover:bg-white/20 backdrop-blur-sm",
                      "border border-white/20 hover:border-white/40",
                      "hover:scale-105 active:scale-95",
                      "transition-all duration-300"
                    )}
                  >
                    <Shuffle className="w-5 h-5" />
                    <span className="hidden sm:inline">Shuffle</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                      "gap-3 rounded-full px-8 h-14 text-base font-semibold",
                      "bg-white/10 hover:bg-white/20 backdrop-blur-sm",
                      "border border-white/20 hover:border-white/40",
                      "hover:scale-105 active:scale-95",
                      "transition-all duration-300"
                    )}
                  >
                    <Share2 className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Songs Section */}
        <div className="container mx-auto px-4 py-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Popular Tracks</h2>
                <p className="text-sm text-muted-foreground">{data.topSongs?.length} songs</p>
              </div>
            </div>

            {/* Premium Songs Grid */}
            <div className="space-y-2">
              {data.topSongs.map((song, index) => (
                <div
                  key={song.id || index}
                  className={cn(
                    "group rounded-xl transition-all duration-300",
                    "hover:bg-gradient-to-r hover:from-muted/50 hover:to-transparent",
                    "cursor-pointer relative overflow-hidden",
                    song.id === musicId && "bg-gradient-to-r from-muted to-transparent"
                  )}
                  onClick={(e) => handleSongClick(song, e)}
                >
                  {/* Animated hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

                  {/* Mobile Layout */}
                  <div className="sm:hidden relative">
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <span
                          className={cn(
                            "text-sm font-medium text-muted-foreground",
                            "group-hover:hidden transition-all",
                            song.id === musicId && "hidden"
                          )}
                        >
                          {index + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (song.id === musicId) {
                              handleTogglePlayPause(e);
                            } else {
                              handleSongClick(song, e);
                            }
                          }}
                          className={cn(
                            "w-10 h-10 flex items-center justify-center",
                            "rounded-full bg-primary/10 hover:bg-primary/20",
                            "transition-all duration-200",
                            song.id === musicId ? "flex" : "hidden group-hover:flex"
                          )}
                        >
                          {isPlaying && song.id === musicId ? (
                            <Pause className="w-5 h-5 text-primary" fill="currentColor" />
                          ) : (
                            <Play className="w-5 h-5 text-primary" fill="currentColor" />
                          )}
                        </button>
                      </div>

                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                        <img
                          src={song.image[1].url}
                          alt={song.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={cn(
                            "font-semibold text-sm leading-tight mb-1",
                            song.id === musicId ? "text-primary" : "text-foreground"
                          )}
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {song.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div onClick={(e) => e.stopPropagation()}>
                          <Like songId={song.id} />
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Menu song={song} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block relative">
                    <div className="flex items-center gap-6 p-4 lg:p-5">
                      <div className="w-8 flex items-center justify-center flex-shrink-0">
                        <span
                          className={cn(
                            "text-sm font-medium text-muted-foreground",
                            "group-hover:hidden transition-all",
                            song.id === musicId && "hidden"
                          )}
                        >
                          {index + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (song.id === musicId) {
                              handleTogglePlayPause(e);
                            } else {
                              handleSongClick(song, e);
                            }
                          }}
                          className={cn(
                            "w-8 h-8 flex items-center justify-center",
                            "rounded-full bg-primary/10 hover:bg-primary/20",
                            "transition-all duration-200",
                            song.id === musicId ? "flex" : "hidden group-hover:flex"
                          )}
                        >
                          {isPlaying && song.id === musicId ? (
                            <Pause className="w-4 h-4 text-primary" fill="currentColor" />
                          ) : (
                            <Play className="w-4 h-4 text-primary" fill="currentColor" />
                          )}
                        </button>
                      </div>

                      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300">
                        <img
                          src={song.image[1].url}
                          alt={song.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={cn(
                            "font-semibold text-base mb-1 truncate",
                            song.id === musicId ? "text-primary" : "text-foreground"
                          )}
                        >
                          {song.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{data.name}</p>
                      </div>

                      <div className="text-sm text-muted-foreground font-mono tabular-nums">
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
                      </div>

                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div onClick={(e) => e.stopPropagation()}>
                          <Like songId={song.id} />
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Menu song={song} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default Artist;