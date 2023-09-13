"use client";

import { cn } from "@/lib/utils";
import { CalendarIcon, Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  InvoiceCreationRequest,
  InvoiceValidator,
} from "@/lib/validators/invoice";
import axios from "axios";
import moment from "moment";
import "moment/locale/pl";
import { Input } from "@/components/ui/input";
moment.locale("pl");

interface ProductType {
  name: string;
  description: string;
  price: number;
  quantity: number;
  vat: any;
  priceVat: number;
}

const Page = () => {
  const form = useForm<InvoiceCreationRequest>({
    resolver: zodResolver(InvoiceValidator),
    defaultValues: {
      soldAt: new Date(),
      issuedAt: new Date(),
      discount: 0,
      recipientEmail: "",
      products: [
        {
          name: "",
          description: "",
          price: 0,
          quantity: 0,
          vat: 23,
        },
      ],
    },
  });

  const {
    fields: products,
    append,
    remove,
  } = useFieldArray({ control: form.control, name: "products" });

  const { mutate: createInvoice, isLoading } = useMutation({
    mutationFn: async ({
      soldAt,
      issuedAt,
      paymentMethod,
      discount,
      recipientEmail,
      products,
    }: InvoiceCreationRequest) => {
      const payload: InvoiceCreationRequest = {
        soldAt,
        issuedAt,
        paymentMethod,
        discount,
        recipientEmail,
        products,
      };
      const { data } = await axios.post("/api/invoice/create", payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Wystąpił błąd.",
        description: "Faktura nie została wystawiona. Spróbuj ponownie.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      return toast({
        description: "Faktura została pomyślnie wystawiona.",
      });
    },
  });

  function onSubmit(data: InvoiceCreationRequest) {
    const payload: InvoiceCreationRequest = {
      soldAt: data.soldAt,
      paymentMethod: data.paymentMethod,
      issuedAt: data.issuedAt,
      discount: data.discount,
      recipientEmail: data.recipientEmail,
      products: data.products,
    };

    createInvoice(payload);
  }

  const calculateProductVat = (product: ProductType) => {
    const { price, vat } = product;
    if (isNaN(price) || isNaN(vat)) return 0;

    return price * (vat / 100 + 1);
  };

  const calculateProductBrutto = (product: ProductType) => {
    const { price, quantity, vat } = product;
    if (isNaN(price) || isNaN(quantity) || isNaN(vat)) return 0;

    return price * quantity * (vat / 100 + 1);
  };

  const calculateProductNetto = (product: ProductType) => {
    const { price, vat } = product;
    if (isNaN(price) || isNaN(vat)) return 0;

    return calculateProductBrutto(product) / (vat / 100 + 1);
  };

  return (
    <div className="container flex items-center h-full max-w-7xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Tworzenie faktury</h1>
        </div>
        {/*         <Link
          href={"/"}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "self-start -mt-20 mb-4"
          )}
        >
          <ChevronLeft className="mr-2 w-4 h-4" /> Strona główna
        </Link> */}

        <hr className="bg-red-500 h-px" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="soldAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data sprzedaży</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              moment(field.value).format("LL")
                            ) : (
                              <span>Wybierz datę</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issuedAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data wystawienia</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              moment(field.value).format("LL")
                            ) : (
                              <span>Wybierz datę</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Metoda płatności</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz metodę płatności" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CARD">Karta debetowa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Zniżka (%)</FormLabel>
                    <Input {...field} />
                    <FormDescription>Zniżka nie jest wymagana.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Email odbiorcy</FormLabel>
                    <Input {...field} />
                    <FormDescription>
                      Email odbiorcy musi być powiązany z kontem w Naszej
                      aplikacji.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-1 md:col-span-3">
                <hr className="bg-red-500 h-px my-3" />

                <h2 className="font-semibold text-xl">Lista produktów</h2>
                <Table>
                  <TableCaption>Lista produktów</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nazwa produktu</TableHead>
                      <TableHead>Opis produktu</TableHead>
                      <TableHead>Cena jednostkowa</TableHead>
                      <TableHead>Ilość</TableHead>
                      <TableHead>VAT</TableHead>
                      <TableHead>Kwota VAT</TableHead>
                      <TableHead>Cena netto</TableHead>
                      <TableHead>Cena brutto</TableHead>
                      <TableHead>Akcja</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, index) => {
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`products.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <Input {...field} placeholder="Nazwa" />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="w-[200px]">
                            <FormField
                              control={form.control}
                              name={`products.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <Input {...field} placeholder="Opis" />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`products.${index}.price`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <Input
                                    {...field}
                                    placeholder="Cena jednostkowa"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`products.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <Input {...field} placeholder="Ilość" />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`products.${index}.vat`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Wybierz metodę płatności" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="23">23%</SelectItem>
                                      <SelectItem value="8">8%</SelectItem>
                                      <SelectItem value="5">5%</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Kwota VAT"
                              value={calculateProductVat(product).toFixed(2)}
                              disabled
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Cena netto"
                              value={calculateProductNetto(product).toFixed(2)}
                              disabled
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Cena brutto"
                              value={calculateProductBrutto(product).toFixed(2)}
                              disabled
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant={"destructive"}
                              onClick={() => remove(index)}
                              disabled={products.length === 1}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="flex md:justify-end">
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() =>
                      append({
                        name: "",
                        description: "",
                        price: 0,
                        quantity: 0,
                        vat: "23",
                        priceVat: 0,
                        priceBrutto: 0,
                        priceNetto: 0,
                      })
                    }
                  >
                    Dodaj produkt
                  </Button>
                </div>
              </div>
            </div>
            <Button type="submit" isLoading={isLoading}>
              Stwórz fakturę
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
