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

const projects = [
  {
    name: "chat 1",
    url: "#",
    icon: History,
  },
  {
    name: "chat 2",
    url: "#",
    icon: History,
  },
  {
    name: "chat 3",
    url: "#",
    icon: History,
  },
];

export function AppSidebar() {
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

        {/* TODO: FIX THIS: Choose one of these two and use SidebarMenuSub from shadcn */}
        {/* https://ui.shadcn.com/blocks use this for inspiration */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <History /> History
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <div>chat 1</div>
              <div>chat 2</div>
              <div>chat 3</div>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton asChild isActive>
                    <a href={project.url}>
                      <project.icon />
                      <span>{project.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarTrigger />
      <SidebarFooterComponent />
    </Sidebar>
  );
}
