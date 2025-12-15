import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, price } = body

    // Get the auth token from the request headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: { message: 'Unauthorized - please log in' } },
        { status: 401 }
      )
    }

    // Call the backend checkout endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    const response = await fetch(`${backendUrl}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        productName,
        price,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: { message: errorData.error?.message || 'Failed to create checkout session' } },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[checkout-route] Backend response:', data)
    const responseData = data.data || data
    console.log('[checkout-route] Returning to client:', responseData)
    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('[checkout] Error:', error)
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
