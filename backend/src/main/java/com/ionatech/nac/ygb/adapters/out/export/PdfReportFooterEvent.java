package com.ionatech.nac.ygb.adapters.out.export;

import com.lowagie.text.Document;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;

final class PdfReportFooterEvent extends PdfPageEventHelper {

    private static final String FOOTER_TEXT = "Youth Go Budget App — confidential programme report";

    @Override
    public void onEndPage(PdfWriter writer, Document document) {
        PdfContentByte canvas = writer.getDirectContent();
        canvas.beginText();
        try {
            canvas.setFontAndSize(BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED), 8);
        } catch (Exception ex) {
            return;
        }
        canvas.setColorFill(PdfReportTheme.MUTED_TEXT);
        canvas.showTextAligned(PdfContentByte.ALIGN_LEFT, FOOTER_TEXT, document.leftMargin(), 24, 0);
        canvas.showTextAligned(
                PdfContentByte.ALIGN_RIGHT,
                "Page " + writer.getPageNumber(),
                document.right(),
                24,
                0
        );
        canvas.endText();
    }
}
