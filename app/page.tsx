import { Activity } from "@/components/Activity";
import { buttonVariants } from "@/components/ui/button";
import { authOptions, getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Product } from "@prisma/client";
import { FileCheck, HistoryIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/login");
  }

  const invoices = await db.invoice.findMany({
    where: { creatorId: session?.user.id },
    include: {
      products: true,
    },
  });

  const receivedInvoices = await db.invoice.findMany({
    where: { recipientId: session?.user.id },
    include: {
      products: true,
    },
  });

  const getTotalPrice = (invoices: any[]) => {
    let total = 0;

    invoices.forEach((invoice) => {
      const { products } = invoice;
      products.forEach((product: Product) => {
        total += product.price * product.quantity * (product.vat / 100 + 1);
      });
    });

    return total;
  };

  const activites = [
    {
      type: "CREATE_INVOICE",
      issuedTo: "ktos tam",
      total: 5000,
      timestamp: new Date("2023-08-23"),
    },
    {
      type: "CREATE_INVOICE",
      issuedTo: "ktos tam",
      total: 5000,
      timestamp: new Date("2023-08-23"),
    },
    {
      type: "CREATE_INVOICE",
      issuedTo: "ktos tam",
      total: 5000,
      timestamp: new Date("2023-08-22"),
    },
    {
      type: "RECEIVED_INVOICE",
      issuedTo: "ktos tam",
      total: 5000,
      timestamp: new Date("2023-08-23"),
    },
  ] as const;

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Twój panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <FileCheck className="h-4 w-4" />
              Wystawione faktury
            </p>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">Ilość faktur: {invoices.length}</p>
              <p className="text-zinc-500">
                Łączna kwota: {getTotalPrice(invoices)} PLN
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-2">
              <Link
                className={buttonVariants({
                  className: "w-full mt-4 mb-6",
                })}
                href={`/invoice/create`}
              >
                Stwórz fakturę
              </Link>

              <Link
                className={buttonVariants({
                  className: "w-full mt-4 mb-6",
                })}
                href={`/invoice/history`}
              >
                Zobacz faktury
              </Link>
            </div>
          </dl>
        </div>
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-red-100 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <FileCheck className="h-4 w-4" />
              Otrzymane faktury
            </p>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Ilość faktur: {receivedInvoices.length}
              </p>
              <p className="text-zinc-500">
                Łączna kwota: {getTotalPrice(receivedInvoices)} PLN
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-2">
              <Link
                className={buttonVariants({
                  className: "w-full mt-4 mb-6",
                })}
                href={`/invoice/received`}
              >
                Zobacz faktury
              </Link>
            </div>
          </dl>
        </div>

        <div className="overflow-hidden h-fit row-span-2 rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-blue-100 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HistoryIcon className="h-4 w-4" />
              Historia aktywności
            </p>
          </div>
          <div className="flex flex-col gap-4 my-3">
            {activites.map((activity, index) => {
              if (index > 4) return;
              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 h-fit mx-4"
                >
                  <Activity
                    total={activity.total}
                    type={activity.type}
                    timestamp={activity.timestamp}
                    issuedTo={{
                      name: session.user.name || null,
                      image: session.user.image || null,
                    }}
                    issuedFrom={{
                      name: session.user.name || null,
                      image: session.user.image || null,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
