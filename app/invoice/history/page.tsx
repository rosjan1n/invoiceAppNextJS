import History from "@/components/History";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className="container flex items-center h-full max-w-7xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <Link
          href={"/"}
          className={cn(buttonVariants({ variant: "ghost" }), "self-start")}
        >
          <ChevronLeft className="mr-2 w-4 h-4" /> Twój panel
        </Link>
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">
            Historia wystawionych faktur
          </h1>
        </div>

        <hr className="bg-red-500 h-px" />

        {/* <History /> */}
      </div>
    </div>
  );
};

export default page;
