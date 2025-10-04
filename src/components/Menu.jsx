import { pushInDb } from "../Api";
import { useStore } from "../zustand/store";
import { EllipsisVertical } from "lucide-react";
import {
  Menubar,
  MenubarMenu,
  MenubarContent,
  MenubarTrigger,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarItem,
} from "../components/ui/menubar";
import { Toaster } from "../components/ui/sonner";

export default function Menu({ song }) {
  const { playlist } = useStore();
  return (
    <>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <EllipsisVertical />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Add to Queue</MenubarSubTrigger>
            </MenubarSub>
            <MenubarSub>
              <MenubarSubTrigger>Add to Playlist</MenubarSubTrigger>
              <MenubarSubContent className="w-52 mr-2 ">
                {playlist.map((list) => (
                  <MenubarItem
                    key={list.id}
                    className="p-2 rounded-lg  w-full hover:bg-secondary"
                    onClick={() => pushInDb(list.id, song.id)}
                  >
                    {list.data.name}
                  </MenubarItem>
                ))}
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Toaster />
    </>
  );
}
