"use client";
import { ChevronDown, History, Telescope } from "lucide-react";

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
import { randomIdGenerator } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter, useParams } from "next/navigation";

export function AppSidebar() {
  const { userChats, addNewChat } = useUserChatStore();
  const router = useRouter();
  const params = useParams<{ chatId: string }>();
  function addNewUserChat() {
    const id = randomIdGenerator();
    addNewChat({ chatId: id, chatName: `Chat ${userChats.length + 1}` });
    router.push("/");
  }

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
                <History /> History{" "}
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              {/* TODO: Improve UI => scrollbar only for this section and not the whole sidebar*/}
              <div className="space-y-4 ">
                {userChats.length === 0 ? (
                  <div>Start adding new chats to continue!</div>
                ) : (
                  userChats.map((userchat, index) => (
                    <div
                      key={index}
                      className={
                        userchat.chatId === params.chatId
                          ? "border bg-gray-200 rounded-lg px-1"
                          : "px-1"
                      }
                    >
                      {userchat.chatName}
                    </div>
                  ))
                )}
              </div>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarTrigger />
      <SidebarFooterComponent />
    </Sidebar>
  );
}
