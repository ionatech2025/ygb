package com.ionatech.nac.ygb.adapters.out.export;

import java.awt.Color;
import java.awt.Font;

final class PdfReportTheme {

    static final Color BRAND_GREEN = new Color(53, 150, 97);
    static final Color BRAND_BLUE = new Color(30, 58, 138);
    static final Color BRAND_ORANGE = new Color(234, 88, 12);
    static final Color HEADER_TEXT = Color.WHITE;
    static final Color BODY_TEXT = new Color(31, 41, 55);
    static final Color MUTED_TEXT = new Color(100, 116, 139);
    static final Color TABLE_STRIPE = new Color(248, 250, 252);
    static final Color TABLE_BORDER = new Color(226, 232, 240);

    static final Font COVER_TITLE = new Font(Font.SANS_SERIF, Font.BOLD, 28);
    static final Font SECTION_TITLE = new Font(Font.SANS_SERIF, Font.BOLD, 16);
    static final Font BODY = new Font(Font.SANS_SERIF, Font.PLAIN, 10);
    static final Font BODY_BOLD = new Font(Font.SANS_SERIF, Font.BOLD, 10);
    static final Font KPI_VALUE = new Font(Font.SANS_SERIF, Font.BOLD, 18);

    private PdfReportTheme() {
    }
}
