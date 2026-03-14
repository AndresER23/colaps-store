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

    // Crear carrito en Shopify usando la nueva API
    const cartCreateMutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 250) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        lines: lineItems.map((item) => ({
          merchandiseId: item.variantId,
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
          query: cartCreateMutation,
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

    if (data.cartCreate.userErrors.length > 0) {
      console.error("Cart errors:", data.cartCreate.userErrors);
      return NextResponse.json(
        {
          error: "Cart creation failed",
          details: data.cartCreate.userErrors,
        },
        { status: 400 }
      );
    }

    const cart = data.cartCreate.cart;

    return NextResponse.json({
      id: cart.id,
      webUrl: cart.checkoutUrl,
      totalPrice: cart.cost.totalAmount.amount,
      currency: cart.cost.totalAmount.currencyCode,
    });
  } catch (error) {
    console.error("Cart creation error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: (error as Error).message },
      { status: 500 }
    );
  }
}