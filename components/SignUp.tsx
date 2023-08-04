import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Witaj!</h1>
        <p className="text-sm max-w-xs mx-auto">
          Stwórz swoje konto w naszej aplikacji i zacznij w prosty sposób
          tworzyć, edytować, pobierać oraz wysyłać faktury.
        </p>
        <p className="text-sm font-medium max-w-xs mx-auto">
          Poniżej wybierz jedną z dostępnych metod rejestracji.
        </p>
      </div>
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Masz już konto?{" "}
        <Link
          href="/sign-in"
          className="hover:text-brand text-sm underline underline-offset-4"
        >
          Zaloguj się
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
