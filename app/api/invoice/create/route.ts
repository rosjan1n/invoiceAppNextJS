import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { InvoiceValidator } from '@/lib/validators/invoice'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }
    const body = await req.json()

    const { soldAt, paymentMethod, issuedAt, discount, recipientEmail, products } = InvoiceValidator.parse(body)
    const recipient = await db.user.findFirst({
      where: {
        email: recipientEmail
      }
    })

    if(!recipient) {
      return new Response("No account found.", { status: 406 })
    }

    const invoice = await db.invoice.create({
      data: {
        status: "NOT_PAID",
        soldAt,
        paymentMethod,
        issuedAt,
        discount,
        creatorId: session.user.id,
        recipientId: session.user.id
      },
    })

    products.forEach(async (product) => {
      await db.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          vat: product.vat,
          invoiceId: invoice.id
        }
      })
    });

    return new Response('OK')
  } catch (error) {
    console.log(error);
    
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Nie można było wystawić faktury. Spróbuj ponownie później.',
      { status: 500 }
    )
  }
}