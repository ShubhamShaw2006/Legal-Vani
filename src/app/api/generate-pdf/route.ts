import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: Request) {
  try {
    const result = await req.json();

    if (!result || !result.issue_category) {
      return NextResponse.json({ error: "Invalid legal data provided" }, { status: 400 });
    }

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    
    // Embed the standard font
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Add a blank page
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
    const { width, height } = page.getSize();
    
    // Helper to draw text
    let yPos = height - 50;
    
    const drawLine = (text: string, font = timesRomanFont, size = 12) => {
      // Very basic text wrapping
      const maxChars = 80;
      let remaining = text;
      
      while(remaining.length > 0) {
        const chunk = remaining.substring(0, maxChars);
        remaining = remaining.substring(maxChars);
        
        page.drawText(chunk, {
          x: 50,
          y: yPos,
          size,
          font,
          color: rgb(0, 0, 0),
        });
        yPos -= size + 5;
      }
    };

    // Construct the document
    drawLine("OFFICIAL COMPLAINT DRAFT", timesRomanBoldFont, 16);
    yPos -= 20;
    
    drawLine(`Date: ${new Date().toLocaleDateString()}`);
    yPos -= 20;

    drawLine("To,", timesRomanBoldFont);
    drawLine(result.authority_to_approach?.name || "Concerned Authority");
    drawLine(result.authority_to_approach?.address || "");
    yPos -= 20;

    drawLine(`Subject: Formal Complaint regarding ${result.issue_category}`, timesRomanBoldFont);
    yPos -= 20;

    drawLine("Respectfully,", timesRomanFont);
    yPos -= 10;
    drawLine("I wish to formally register a complaint regarding the aforementioned subject.");
    yPos -= 20;
    
    drawLine("Legal Basis & Rights applicable:", timesRomanBoldFont);
    drawLine(result.rights_explanation);
    yPos -= 20;

    drawLine("Action Expected:", timesRomanBoldFont);
    result.step_by_step_actions.forEach((step: string, i: number) => {
      drawLine(`${i + 1}. ${step}`);
    });
    
    yPos -= 40;
    drawLine("Signature: __________________________");
    drawLine("Name: _______________________________");

    // Process PDF and send
    const pdfBytes = await pdfDoc.save();
    
    // Convert to base64 to send via JSON
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');
    
    return NextResponse.json({ 
      success: true, 
      pdfBase64: base64Pdf,
      filename: `Complaint_${result.issue_category.replace(/[^a-zA-Z0-9]/g, '')}.pdf`
    });

  } catch (error) {
    console.error("PDF Generate Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
