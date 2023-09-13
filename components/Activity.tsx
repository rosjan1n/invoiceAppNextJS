import { User } from "@prisma/client";
import moment from "moment";
import "moment/locale/pl";
import { UserAvatar } from "./UserAvatar";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
moment.locale("pl");

type Props = {
  total: number;
  timestamp: Date;
} & (
  | { type: "CREATE_INVOICE"; issuedTo: Pick<User, "name" | "image"> }
  | {
      type: "RECEIVED_INVOICE";
      issuedFrom: Pick<User, "name" | "image">;
    }
);

export const Activity = (props: Props) => {
  return (
    <div className="p-4">
      {props.type === "CREATE_INVOICE" ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <UserAvatar
              user={{
                name: props.issuedTo.name || null,
                image: props.issuedTo.image || null,
              }}
            />
            <span>
              Wystawiono fakturę na kwotę{" "}
              <span className="font-semibold text-blue-500">
                {props.total.toFixed(2)}
              </span>{" "}
              PLN dla{" "}
              <span className="font-semibold text-blue-500">
                {props.issuedTo.name}
              </span>
            </span>
          </div>
          <Link href={"/"} className={buttonVariants({ variant: "outline" })}>
            Zobacz fakturę
          </Link>
          <span className="text-zinc-500 text-sm">
            {moment(props.timestamp).fromNow()}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <UserAvatar user={props.issuedFrom} />
            <span>
              Otrzymano fakturę na kwotę{" "}
              <span className="font-semibold text-blue-500">
                {props.total.toFixed(2)}
              </span>{" "}
              PLN od{" "}
              <span className="font-semibold text-blue-500">
                {props.issuedFrom.name}
              </span>
            </span>
          </div>
          <Link href={"/"} className={buttonVariants({ variant: "outline" })}>
            Zobacz fakturę
          </Link>
          <span className="text-zinc-500 text-sm">
            {moment(props.timestamp).fromNow()}
          </span>
        </div>
      )}
    </div>
  );
};
