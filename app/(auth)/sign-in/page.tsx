import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FC } from "react";
import SignIn from "@/components/SignIn";

const page: FC = () => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <div className="py-10 px-2 rounded-lg border border-gray-200">
          <Link
            href={"/"}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "self-start -mt-20 mb-4"
            )}
          >
            <ChevronLeft className="mr-2 w-4 h-4" /> Strona główna
          </Link>

          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default page;
