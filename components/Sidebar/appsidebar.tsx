"use client";
import {
  ChevronDown,
  History,
  MessageSquare,
  Search,
  Settings,
  Telescope,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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

// Menu items.
const items = [
  {
    title: "New Chat",
    url: "#",
    icon: MessageSquare,
  },

  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { userChats, addNewChat } = useUserChatStore();
  const router = useRouter();
  const params = useParams<{ chatId: string }>();
  function addNewUserChat() {
    const id = randomIdGenerator();
    addNewChat({ chatId: id, chatName: `Chat ${userChats.length + 1}` });
    //TODO:when new chat is clicked, initially the user is on / page , and when he enters text and submits, he gets redirected to /chat/chatid
    //better approach: when new chat is clicked => redirect to / page, and when the user submits his query, send it to the BE, and from the backend,
    //return a random chat id along with ai response, and then the user will be redirected to /chat/chatid
    router.push("/");
    //now how to go to /chat/chatid using backend??
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold text-black space-x-3">
            <Telescope className="w-12 h-12" /> <p>Generoid</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
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
