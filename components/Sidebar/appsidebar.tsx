"use client";
import { ChevronDown, Telescope } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import SidebarFooterComponent from "./sidebarFooter";
import { useUserChatStore } from "@/store/chat-store";
import { Button } from "../ui/button";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

export function AppSidebar() {
  const { userChats, fetchUserChats } = useUserChatStore();
  const session = useSession();
  const username = session.data?.user?.name;
  const email = session.data?.user?.email;
  const router = useRouter();
  const params = useParams<{ chatId: string }>();
  function addNewUserChat() {
    router.push("/");
  }

  useEffect(() => {
    if (email) {
      fetchUserChats();
    }
  }, [email, fetchUserChats]);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold text-black space-x-3">
            <Telescope className="w-12 h-12" /> <p>Generoid</p>
          </SidebarGroupLabel>
        </SidebarGroup>
        <div className="w-full flex justify-center">
          <Button
            variant="outline"
            onClick={addNewUserChat}
            className="w-full border bg-white rounded-lg mx-2"
          >
            <div>New chat</div>
          </Button>
        </div>

        {/* TODO: FIX THIS: Choose one of these two and use SidebarMenuSub from shadcn */}
        {/* https://ui.shadcn.com/blocks use this for inspiration */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <div className="text-sm">Recent Chats</div>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              {/* TODO: Improve UI => scrollbar only for this section and not the whole sidebar*/}
              <div className="space-y-2 flex flex-col">
                {userChats.length === 0 ? (
                  <div>Start adding new chats to continue!</div>
                ) : (
                  userChats.map((userchat, index) => (
                    <Button
                      key={index}
                      className={
                        userchat.id === params.chatId
                          ? "border bg-gray-200 rounded-lg px-1 text-black hover:text-black hover:bg-gray-200"
                          : "px-1 bg-transparent shadow-none text-black hover:text-black hover:bg-gray-200"
                      }
                      onClick={() => {
                        router.push(`/chat/${userchat.id}`);
                      }}
                    >
                      {userchat.name}
                    </Button>
                  ))
                )}
              </div>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      {!username ? (
        <Button
          className="mx-2"
          onClick={() => {
            signIn();
          }}
        >
          Login
        </Button>
      ) : (
        //TODO: BUG:
        // if i logout from one user from the route http://localhost:3000/chat/cm3tsg6ow00015he8u06r52fg, and signin to another => it takes me back to
        //http://localhost:3000/chat/cm3tsg6ow00015he8u06r52fg and i can see the previous user's chats
        <Button
          className="mx-2"
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </Button>
      )}
      <SidebarTrigger />
      <SidebarFooterComponent />
    </Sidebar>
  );
}
