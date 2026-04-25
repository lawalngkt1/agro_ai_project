import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const apiKey = process.env.PLANTNET_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'PlantNet API key is not configured' }, { status: 500 });
    }

    const project = 'all';
    const apiUrl = `https://my-api.plantnet.org/v2/identify/${project}?api-key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || `PlantNet API responded with ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Identification error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
