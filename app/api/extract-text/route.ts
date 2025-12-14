import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfParser = new PDFParser();

    const text = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (err) => {
        reject(err.parserError);
      });

      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });

      pdfParser.parseBuffer(buffer);
    });

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("PDF Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
