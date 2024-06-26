import fs from 'fs/promises';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { NextResponse } from 'next/server';

export const revalidate = 0; 
export async function POST(req) {
  try {
    const chunks = [];
    for await (const chunk of req.body) { 
      chunks.push(chunk);
    }
    const data = JSON.parse(Buffer.concat(chunks).toString());
    console.log("Received data for document generation:", data);

    const fileUrl = 'https://docs.google.com/document/d/1MhjHSAdaNOTvX09xGG1A2PvCAuSEGOD9/export?format=docx';
    console.log("Attempting to read file at:", fileUrl);

    const response = await fetch(fileUrl);
    const content = await response.arrayBuffer();

    console.log(`File read successfully. Content length: ${content.length}`);

    const zip = new PizZip(content);
    console.log("ZIP library instantiated.");

    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    console.log("Docxtemplater instantiated.");

    // Render the document using the data
    doc.render(data);
    console.log("Template rendered with data.");

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    console.log(`Buffer generated. Buffer length: ${buffer.length}`);

    const responseHeaders = {
      'Content-Disposition': 'attachment; filename=SVS_COC.docx',
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    return new NextResponse(Buffer.from(buffer), { status: 200, headers: responseHeaders });
  } catch (error) {
    console.error('Error generating document:', error);
    return new NextResponse('Error generating document', { status: 500 });
  }
}



