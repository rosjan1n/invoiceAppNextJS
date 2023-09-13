import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { getAuthSession } from "@/lib/auth";
import { UserAccountNav } from "./UserAccountNav";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed top-0 inset-x-0 h-10 md:h-fit bg-zinc-100 border-b border-gray-200 py-2 z-[10]">
      <div className="container max-w-[100rem] h-full mx-auto flex items-center justify-between gap-2">
        <Link
          href={"/"}
          className="font-bold text-lg bg-clip-text text-transparent from-purple-500 to-indigo-500 bg-gradient-to-r"
        >
          Generator faktur
        </Link>

        {session?.user ? (
          <UserAccountNav user={session?.user} />
        ) : (
          <Link href={"/sign-in"} className={buttonVariants()}>
            Zaloguj się
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
