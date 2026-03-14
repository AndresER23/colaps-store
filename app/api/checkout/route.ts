import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;

interface LineItem {
  variantId: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { lineItems }: { lineItems: LineItem[] } = await request.json();

    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: "No line items provided" },
        { status: 400 }
      );
    }

    // Crear checkout en Shopify
    const checkoutCreateMutation = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
            totalPriceV2 {
              amount
              currencyCode
            }
            lineItems(first: 250) {
              edges {
                node {
                  id
                  title
                  quantity
                }
              }
            }
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        lineItems: lineItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    };

    const response = await fetch(
      `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: checkoutCreateMutation,
          variables,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      console.error("GraphQL errors:", errors);
      return NextResponse.json(
        { error: "GraphQL errors", details: errors },
        { status: 500 }
      );
    }

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      console.error("Checkout errors:", data.checkoutCreate.checkoutUserErrors);
      return NextResponse.json(
        {
          error: "Checkout creation failed",
          details: data.checkoutCreate.checkoutUserErrors,
        },
        { status: 400 }
      );
    }

    const checkout = data.checkoutCreate.checkout;

    return NextResponse.json({
      id: checkout.id,
      webUrl: checkout.webUrl,
      totalPrice: checkout.totalPriceV2.amount,
      currency: checkout.totalPriceV2.currencyCode,
    });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
