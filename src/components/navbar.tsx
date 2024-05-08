import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bot, Menu } from "lucide-react";
import Link from "next/link";
import Chat from "./chat-button";
const navRoutes = [
  {
    label: "Projects",
    href: "https://github.com/WaelTarabishi", // Updated href to GitHub repository URL
  },
] as const;

const Navbar = () => {
  return (
    <>
      <div className="w-full bg-[#141c27] sticky z-[10000]  shadow-md items-center justify-between h-16 px-36  md:flex  hidden  text-white ">
        <div className="flex gap-9">
          {navRoutes.map((route) => (
            <Link
              href={route.href}
              key={route.label}
              className="nav-link font-primary">
              {route.label}
            </Link>
          ))}
        </div>
        <div className="lg:pr-32">
          <Chat />
        </div>
      </div>
      {/* Mobile Nav */}
      <div className="w-full bg-[#141c27]  sticky z-[10000] text-white  shadow-md items-center justify-between h-16 px-14  md:hidden  flex ">
        <div className="flex  gap-2">
          <Chat />
        </div>
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <div className="w-full h-full flex gap-9   flex-col items-center justify-center text-[28px]">
              {navRoutes.map((route) => (
                <Link
                  href={route.href}
                  key={route.label}
                  className="nav-link-mobile text-white font-primary">
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Navbar;
