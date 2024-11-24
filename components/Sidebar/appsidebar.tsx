"use client";
import { ChevronDown, History, Telescope } from "lucide-react";
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
  const { userChats, addNewChat, fetchUserChats } = useUserChatStore();
  const session = useSession();
  const username = session.data?.user?.name;
  const email = session.data?.user?.email;
  const router = useRouter();
  const params = useParams<{ chatId: string }>();
  function addNewUserChat() {
    addNewChat(`Chat ${userChats.length + 1}`);
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
                <History /> Recent Chats{" "}
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              {/* TODO: Improve UI => scrollbar only for this section and not the whole sidebar*/}
              <div className="space-y-4 flex flex-col">
                {userChats.length === 0 ? (
                  <div>Start adding new chats to continue!</div>
                ) : (
                  userChats.map((userchat, index) => (
                    <Button
                      key={index}
                      className={
                        userchat.id === params.chatId
                          ? "border bg-gray-200 rounded-lg px-1 text-black"
                          : "px-1 bg-white text-black"
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
