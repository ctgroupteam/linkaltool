export interface ReceiptData {
  orderId: string;
  invoiceNo: string;
  siteId?: string;
  siteSlug: string;
  siteName: string;
  planName: string;
  amount: string | number;
  subtotal?: string | number;
  gst?: string | number;
  date: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod?: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  subscriptionEndsAt?: string;
}

function cleanAscii(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/[\u20B9₹]/g, 'Rs. ')
    .replace(/[—–]/g, '-')
    .replace(/[•●]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .trim();
}

function loadJsPdf(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window not defined'));
    const win = window as any;
    if (win.jspdf && win.jspdf.jsPDF) {
      return resolve(win.jspdf.jsPDF);
    }
    const existing = document.getElementById('linkal-jspdf-script');
    if (existing) {
      existing.addEventListener('load', () => {
        if (win.jspdf?.jsPDF) resolve(win.jspdf.jsPDF);
        else reject(new Error('jsPDF not found after script load'));
      });
      return;
    }
    const script = document.createElement('script');
    script.id = 'linkal-jspdf-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      if (win.jspdf && win.jspdf.jsPDF) {
        resolve(win.jspdf.jsPDF);
      } else {
        reject(new Error('jsPDF object not found on window'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load jsPDF library from CDN'));
    document.head.appendChild(script);
  });
}

export async function downloadReceiptPdf(receipt: ReceiptData) {
  try {
    const jsPDF = await loadJsPdf();
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const amtNum = Number(String(receipt.amount).replace(/[^0-9.]/g, '')) || 99;
    const invoiceNo = cleanAscii(receipt.invoiceNo || `INV-2026-${receipt.orderId.slice(-5)}`);
    const dateStr = new Date(receipt.date || Date.now()).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const validUntilStr = receipt.subscriptionEndsAt
      ? new Date(receipt.subscriptionEndsAt).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '30 Days from Payment';

    const customerName = cleanAscii(receipt.customerName || 'Website Owner');
    const customerEmail = cleanAscii(receipt.customerEmail || '-');
    const customerPhone = cleanAscii(receipt.customerPhone ? `+${receipt.customerPhone.replace(/[^0-9]/g, '')}` : '-');
    const siteSlug = cleanAscii(receipt.siteSlug || 'site');
    const siteUrl = `https://${siteSlug}.linkal.in`;
    const orderId = cleanAscii(receipt.orderId || `ord_${Date.now()}`);
    const paymentMethod = cleanAscii(receipt.paymentMethod || 'Cashfree Production (UPI / Cards)');

    // Clean plan title without raw symbols and capped in length to never overlap PERIOD column
    let cleanPlanTitle = cleanAscii(receipt.planName || 'Digital Menu Website Monthly Subscription');
    if (cleanPlanTitle.length > 45) {
      cleanPlanTitle = cleanPlanTitle.slice(0, 42) + '...';
    }

    // ─── HEADER BAR (Navy) ───
    doc.setFillColor(13, 27, 62); // #0D1B3E
    doc.rect(0, 0, 210, 26, 'F');

    // Linkal AI Brand Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('LINKAL AI', 15, 12);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(147, 197, 253); // #93C5FD
    doc.text("India's 1-Minute Website Generator | https://linkal.in", 15, 19);

    // Right Header
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('PAYMENT RECEIPT', 195, 12, { align: 'right' });

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225); // #CBD5E1
    doc.text('CUSTOMER OFFICIAL COPY', 195, 19, { align: 'right' });

    // ─── STATUS BADGE (Green Pill) ───
    doc.setFillColor(236, 253, 245); // #ECFDF5
    doc.setDrawColor(16, 185, 129); // #10B981
    doc.roundedRect(15, 33, 56, 7.5, 2, 2, 'FD');
    doc.setTextColor(5, 150, 105); // #059669
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('[PAID] PAYMENT COMPLETED', 17, 38);

    // ─── RECEIPT & CUSTOMER DETAILS (2 Columns) ───
    // Left Column: Receipt Metadata
    doc.setTextColor(15, 23, 42); // #0F172A
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Receipt Details:', 15, 48);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8.5);
    doc.text(`Receipt Number: ${invoiceNo}`, 15, 54);
    doc.text(`Order ID: ${orderId}`, 15, 59.5);
    doc.text(`Date of Issue: ${dateStr}`, 15, 65);
    doc.text(`Payment Gateway: ${paymentMethod}`, 15, 70.5);

    // Right Column: Customer Info
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.text('Billed To (Customer):', 115, 48);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8.5);
    doc.text(`Name: ${customerName}`, 115, 54);
    doc.text(`Email: ${customerEmail}`, 115, 59.5);
    doc.text(`Phone: ${customerPhone}`, 115, 65);
    doc.text(`Live Website: ${siteUrl}`, 115, 70.5);

    // ─── DIVIDER LINE ───
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 77, 195, 77);

    // ─── TABLE HEADER ───
    doc.setFillColor(241, 245, 249); // #F1F5F9
    doc.rect(15, 82, 180, 8, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('SL', 18, 87.5);
    doc.text('DESCRIPTION / SERVICES', 30, 87.5);
    doc.text('PERIOD', 130, 87.5);
    doc.text('AMOUNT (INR)', 190, 87.5, { align: 'right' });

    // ─── TABLE ROWS ───
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    // Row 1: Plan
    doc.text('1', 18, 96);
    doc.setFont('helvetica', 'bold');
    doc.text(cleanPlanTitle, 30, 96);
    doc.setFont('helvetica', 'normal');
    doc.text(`Until ${validUntilStr}`, 130, 96);
    doc.text(`Rs. ${amtNum}.00`, 190, 96, { align: 'right' });

    // Row 2: Features
    doc.text('2', 18, 104);
    doc.text('Unlimited WhatsApp Ordering & Live Menu', 30, 104);
    doc.text('Active', 130, 104);
    doc.text('Included', 190, 104, { align: 'right' });

    // Row 3: Domain & SSL
    doc.text('3', 18, 112);
    doc.text(`Custom Subdomain (${siteSlug}.linkal.in) + Instant SSL`, 30, 112);
    doc.text('Active', 130, 112);
    doc.text('Included', 190, 112, { align: 'right' });

    // Table bottom line
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 119, 195, 119);

    // ─── TOTALS SECTION (NO GST) ───
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(9);
    doc.text('Plan Amount:', 135, 127);
    doc.text(`Rs. ${amtNum}.00`, 190, 127, { align: 'right' });

    doc.text('Discount:', 135, 133);
    doc.text('Rs. 0.00', 190, 133, { align: 'right' });

    // Total Highlight Box
    doc.setFillColor(248, 250, 252);
    doc.rect(130, 138, 65, 10, 'F');
    doc.setDrawColor(13, 27, 62);
    doc.setLineWidth(0.4);
    doc.rect(130, 138, 65, 10, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(13, 27, 62);
    doc.text('Total Paid:', 135, 144.5);
    doc.text(`Rs. ${amtNum}.00`, 190, 144.5, { align: 'right' });

    // ─── VERIFICATION FOOTER ───
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('PAYMENT VERIFICATION & TERMS:', 15, 165);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('1. Payment processed securely via Cashfree Payments India Private Limited.', 15, 171);
    doc.text('2. Your live website and digital menu remain active throughout the subscription period.', 15, 176);
    doc.text('3. For subscription renewals, billing queries, or support: support@linkal.in | WhatsApp: +91 8766882442.', 15, 181);
    doc.text('4. This is a computer-generated official receipt issued by Linkal AI and requires no physical signature.', 15, 186);

    // Bottom brand bar
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.text('Linkal AI Technologies - Registered SaaS Platform - https://linkal.in', 105, 292, { align: 'center' });

    // Trigger browser download
    doc.save(`Receipt_${invoiceNo}.pdf`);
  } catch (err) {
    console.error('[Receipt PDF Error]', err);
    downloadReceiptImage(receipt);
  }
}

export function downloadReceiptImage(receipt: ReceiptData) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const amtNum = Number(String(receipt.amount).replace(/[^0-9.]/g, '')) || 99;
  const invoiceNo = cleanAscii(receipt.invoiceNo || `INV-2026-${receipt.orderId.slice(-5)}`);
  const dateStr = new Date(receipt.date || Date.now()).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);

  // Header Box
  ctx.fillStyle = '#0D1B3E';
  ctx.fillRect(14, 14, canvas.width - 28, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('LINKAL AI', 36, 52);

  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#93c5fd';
  ctx.fillText('Official Payment & Subscription Receipt', 36, 74);

  // Paid Status Pill
  ctx.fillStyle = '#ecfdf5';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(canvas.width - 165, 38, 135, 32, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('[PAID] COMPLETED', canvas.width - 150, 58);

  // Meta details
  ctx.fillStyle = '#475569';
  ctx.font = '13px sans-serif';
  ctx.fillText(`Receipt No: ${invoiceNo}`, 36, 130);
  ctx.fillText(`Order ID: ${receipt.orderId}`, 36, 152);
  ctx.fillText(`Date: ${dateStr}`, 36, 174);
  ctx.fillText(`Customer: ${receipt.customerName || 'Website Owner'}`, 36, 196);
  ctx.fillText(`Website: https://${receipt.siteSlug}.linkal.in`, 36, 218);

  // Divider
  ctx.strokeStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(36, 240);
  ctx.lineTo(canvas.width - 36, 240);
  ctx.stroke();

  // Table Header
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Description', 36, 270);
  ctx.fillText('Amount', canvas.width - 120, 270);

  // Table rows
  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText(cleanAscii(receipt.planName || 'Digital Menu Monthly Subscription'), 36, 310);
  ctx.fillText(`Rs. ${amtNum}.00`, canvas.width - 120, 310);

  ctx.fillText('Unlimited WhatsApp Online Ordering', 36, 345);
  ctx.fillText('Included', canvas.width - 120, 345);

  ctx.fillText('Instant Custom Subdomain & Verified SSL', 36, 380);
  ctx.fillText('Included', canvas.width - 120, 380);

  // Divider
  ctx.beginPath();
  ctx.moveTo(36, 415);
  ctx.lineTo(canvas.width - 36, 415);
  ctx.stroke();

  // Calculation (NO GST)
  ctx.fillStyle = '#475569';
  ctx.fillText('Plan Amount:', canvas.width - 250, 450);
  ctx.fillText(`Rs. ${amtNum}.00`, canvas.width - 120, 450);

  ctx.fillText('Discount:', canvas.width - 250, 480);
  ctx.fillText('Rs. 0.00', canvas.width - 120, 480);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Total Paid:', canvas.width - 250, 525);
  ctx.fillText(`Rs. ${amtNum}.00`, canvas.width - 120, 525);

  // Verification
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.fillText('Payment Verified & Processed by Cashfree Payments India', 36, 620);
  ctx.fillText('Official computer-generated receipt issued by Linkal AI.', 36, 645);
  ctx.fillText('Linkal SaaS Platform - support@linkal.in - https://linkal.in', 36, 670);

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `Receipt_${invoiceNo}.png`;
  a.click();
}
