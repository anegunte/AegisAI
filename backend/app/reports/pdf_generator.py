import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

def generate_pdf_report(
    disaster_type: str, 
    location: str, 
    population: int, 
    severity: str, 
    budget: float,
    risk: Dict[str, Any],
    resources: Dict[str, Any],
    briefing: Dict[str, Any]
) -> io.BytesIO:
    buffer = io.BytesIO()
    
    # Page setup
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom colors
    PRIMARY = colors.HexColor('#111827')
    SECONDARY = colors.HexColor('#6B7280')
    ACCENT = colors.HexColor('#2563EB')
    LIGHT_BG = colors.HexColor('#F5F5F7')
    BORDER_COLOR = colors.HexColor('#E5E7EB')
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=30,
        textColor=PRIMARY
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=SECONDARY
    )
    
    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=PRIMARY,
        spaceBefore=15,
        spaceAfter=10
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=PRIMARY
    )
    
    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=PRIMARY,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=5
    )
    
    th_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=colors.white
    )
    
    td_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=11,
        textColor=PRIMARY
    )
    
    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=11,
        leading=15,
        textColor=PRIMARY
    )

    story = []
    
    # Header Section
    story.append(Paragraph("AEGIS AI", ParagraphStyle('Logo', fontName='Helvetica-Bold', fontSize=10, leading=10, textColor=ACCENT)))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Crisis Response Intelligence Platform", subtitle_style))
    story.append(Spacer(1, 5))
    story.append(Paragraph(f"Crisis Response Plan: {disaster_type} — {location}", title_style))
    story.append(Spacer(1, 15))
    
    # Scenario Summary Info Table
    info_data = [
        [Paragraph("<b>Location:</b>", td_style), Paragraph(location, td_style), Paragraph("<b>Severity Classification:</b>", td_style), Paragraph(severity.upper(), td_style)],
        [Paragraph("<b>Population Affected:</b>", td_style), Paragraph(f"{population:,}", td_style), Paragraph("<b>Risk Score:</b>", td_style), Paragraph(f"{risk['score']}/100 ({risk['classification']})", td_style)],
        [Paragraph("<b>Operational Budget:</b>", td_style), Paragraph(f"Rs. {budget:,.2f}", td_style), Paragraph("<b>Urgency Level:</b>", td_style), Paragraph(risk['urgency'], td_style)]
    ]
    info_table = Table(info_data, colWidths=[1.5*inch, 1.7*inch, 1.8*inch, 1.8*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR)
    ]))
    story.append(info_table)
    story.append(Spacer(1, 20))
    
    # Executive Brief Block (McKinsey Callout Style)
    brief_data = [[
        Paragraph(f"<b>Executive Brief:</b> {briefing['executiveBrief']}", callout_style)
    ]]
    brief_table = Table(brief_data, colWidths=[6.8*inch])
    brief_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EFF6FF')),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LINELEFT', (0,0), (0,0), 4, ACCENT),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#DBEAFE'))
    ]))
    story.append(brief_table)
    story.append(Spacer(1, 20))
    
    # Situation & Risks
    story.append(Paragraph("Situation Assessment", section_title))
    story.append(Paragraph(briefing['situationSummary'], body_style))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Key Secondary Risks", section_title))
    for r in briefing['keyRisks']:
        story.append(Paragraph(f"• {r}", bullet_style))
    story.append(Spacer(1, 15))
    
    # Page break to maintain professional page segmentation
    story.append(PageBreak())
    
    # Resource Allocation Table
    story.append(Paragraph("Resource Allocation Plan", section_title))
    story.append(Paragraph("Estimated tactical and survival resources calculated for immediate deployment:", body_style))
    story.append(Spacer(1, 10))
    
    res_data = [
        [Paragraph("Resource Class", th_style), Paragraph("Calculated Requirement", th_style), Paragraph("Primary Operational Focus", th_style)]
    ]
    
    # Row mapping
    res_rows = [
        ("Food & Survival Kits", f"{resources['foodKits']:,} kits", "Immediate calorie and meal support for 7 days."),
        ("Medical Triage Teams", f"{resources['medicalTeams']:,} teams", "First aid, minor surgeries, and infectious risk mitigation."),
        ("Temporary Shelters", f"{resources['shelters']:,} units", "Tethered structures, hydration points, and clean power sockets."),
        ("Active Ambulances", f"{resources['ambulances']:,} units", "Critical trauma transport and urgent patient extraction."),
        ("Potable Water Supply", f"{resources['waterSupplyLiters']:,} liters/day", "15-20L daily clean water supply per capita."),
        ("Registered Volunteers", f"{resources['volunteers']:,} staff", "Logistical support, queue control, and debris cleanup.")
    ]
    
    for label, val, desc in res_rows:
        res_data.append([
            Paragraph(f"<b>{label}</b>", td_style),
            Paragraph(val, td_style),
            Paragraph(desc, td_style)
        ])
        
    res_table = Table(res_data, colWidths=[2.0*inch, 1.8*inch, 3.0*inch])
    res_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6)
    ]))
    story.append(res_table)
    story.append(Spacer(1, 20))
    
    # Budget Allocation Table
    story.append(Paragraph("Financial Allocation Overview", section_title))
    story.append(Paragraph(f"Budget distribution framework for the total available funding (Rs. {budget:,.2f}):", body_style))
    story.append(Spacer(1, 10))
    
    budget_data = [
        [Paragraph("Budget Category", th_style), Paragraph("Percentage (%)", th_style), Paragraph("Allocated Fund (INR)", th_style)]
    ]
    
    for category, detail in resources['budgetDistribution'].items():
        budget_data.append([
            Paragraph(f"<b>{category}</b>", td_style),
            Paragraph(f"{detail['percentage']}%", td_style),
            Paragraph(f"Rs. {detail['amount']:,.2f}", td_style)
        ])
        
    budget_table = Table(budget_data, colWidths=[2.8*inch, 1.8*inch, 2.2*inch])
    budget_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6)
    ]))
    story.append(budget_table)
    story.append(Spacer(1, 20))
    
    story.append(PageBreak())
    
    # Immediate & Recovery Strategy
    story.append(Paragraph("Immediate Response Strategy", section_title))
    for step in briefing['recommendedResponse']:
        story.append(Paragraph(f"• {step}", bullet_style))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Stakeholder Coordination Plan", section_title))
    for coordination in briefing['stakeholderCoordination']:
        story.append(Paragraph(f"• {coordination}", bullet_style))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Recovery & Long-Term Resilience", section_title))
    story.append(Paragraph(briefing['recoveryStrategy'], body_style))
    story.append(Spacer(1, 10))
    for rec in briefing['longTermResilience']:
        story.append(Paragraph(f"• {rec}", bullet_style))
        
    doc.build(story)
    buffer.seek(0)
    return buffer
