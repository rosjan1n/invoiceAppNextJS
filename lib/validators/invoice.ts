import { z } from "zod";

export const InvoiceValidator = z.object({
    soldAt: z.coerce.date({
      required_error: "Data sprzedaży jest wymagana.",
    }),
    issuedAt: z.coerce.date({
      required_error: "Data wystawienia jest wymagana.",
    }),
    paymentMethod: z.enum(["CARD"], { required_error: "Metoda płatności jest wymagana." }),
    discount: z.coerce.number().gte(0, "Zniżka musi być większa lub równa 0.").lte(100, "Zniżka musi być mniejsza lub równa 100."),
    recipientEmail: z.string({ required_error: "Email odbiorcy jest wymagany." }).email("Wprowadź poprawny email."),
    products: z.object({
      name: z.string({ required_error: "Nazwa produktu jest wymagana." }).min(1, "Nazwa nie może być krótsza niż 1 znak.").max(50, "Nazwa nie może być dłuższa niż 50 znaków."),
      description: z.string({ required_error: "Opis produktu jest wymagany." }).min(1, "Opis nie może być krótszy niż 1 znak.").max(50, "Opis nie może być dłuższy niż 50 znaków."),
      price: z.coerce.number({ required_error: "Cena produktu jest wymagana." }).gte(1, "Cena musi być większa niż 0.").lte(1000000, "Cena musi być mniejsza niż 1,000,000."),
      quantity: z.coerce.number({ required_error: "Ilość produktu jest wymagana." }).gte(1, "Ilość musi być większa niż 0.").lte(10000, "Ilość musi być mniejsza niż 10,000."),
      vat: z.number({ required_error: "VAT jest wymagany." }),
      priceVat: z.coerce.number(),
      priceNetto: z.coerce.number(),
      priceBrutto: z.coerce.number()
    }).array()
  });

  export type InvoiceCreationRequest = z.infer<typeof InvoiceValidator>