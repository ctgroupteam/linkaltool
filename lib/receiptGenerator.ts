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

    const amtStr = String(receipt.amount).replace('₹', '').trim();
    const amtNum = Number(amtStr) || 99;
    const subtotal = (amtNum / 1.18).toFixed(2);
    const gst = (amtNum - Number(subtotal)).toFixed(2);
    const invoiceNo = receipt.invoiceNo || `INV-2026-${receipt.orderId.slice(-5)}`;
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

    // ─── HEADER BAR ───
    doc.setFillColor(13, 27, 62); // #0D1B3E
    doc.rect(0, 0, 210, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('LINKAL AI', 15, 14);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text("India's 1-Minute Website Generator • https://linkal.in", 15, 21);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE / RECEIPT', 195, 14, { align: 'right' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('ORIGINAL FOR RECIPIENT', 195, 21, { align: 'right' });

    // ─── STATUS BADGE ───
    doc.setFillColor(236, 253, 245); // #ECFDF5
    doc.setDrawColor(16, 185, 129); // #10B981
    doc.roundedRect(15, 34, 48, 8, 2, 2, 'FD');
    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('● PAYMENT COMPLETED (PAID)', 17, 39.5);

    // ─── INVOICE & ORDER METADATA ───
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Details:', 15, 50);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Invoice Number: ${invoiceNo}`, 15, 56);
    doc.text(`Order ID: ${receipt.orderId}`, 15, 61);
    doc.text(`Date of Issue: ${dateStr}`, 15, 66);
    doc.text(`Payment Gateway: ${receipt.paymentMethod || 'Cashfree Production (UPI / Cards)'}`, 15, 71);

    // Billed To
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Billed To (Customer):', 120, 50);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Name: ${receipt.customerName || 'Website Owner'}`, 120, 56);
    doc.text(`Email: ${receipt.customerEmail || '—'}`, 120, 61);
    if (receipt.customerPhone) {
      doc.text(`Phone: +${receipt.customerPhone}`, 120, 66);
    }
    doc.text(`Live Website: https://${receipt.siteSlug}.linkal.in`, 120, 71);

    // ─── DIVIDER LINE ───
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 78, 195, 78);

    // ─── TABLE HEADER ───
    doc.setFillColor(241, 245, 249);
    doc.rect(15, 83, 180, 8, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('SL', 18, 88.5);
    doc.text('DESCRIPTION / SERVICES', 32, 88.5);
    doc.text('PERIOD', 135, 88.5);
    doc.text('AMOUNT (INR)', 190, 88.5, { align: 'right' });

    // ─── TABLE ROWS ───
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    // Row 1: Plan
    doc.text('1', 18, 97);
    doc.setFont('helvetica', 'bold');
    doc.text(receipt.planName || 'Digital Menu Website Monthly Subscription', 32, 97);
    doc.setFont('helvetica', 'normal');
    doc.text(`Valid until ${validUntilStr}`, 135, 97);
    doc.text(`₹${subtotal}`, 190, 97, { align: 'right' });

    // Row 2: Features
    doc.text('2', 18, 105);
    doc.text('Unlimited WhatsApp Online Ordering & Menu Catalog', 32, 105);
    doc.text('Active', 135, 105);
    doc.text('Included', 190, 105, { align: 'right' });

    // Row 3: Domain & SSL
    doc.text('3', 18, 113);
    doc.text(`Dedicated Subdomain (https://${receipt.siteSlug}.linkal.in) + Instant SSL`, 32, 113);
    doc.text('Active', 135, 113);
    doc.text('Included', 190, 113, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 120, 195, 120);

    // ─── TOTALS CALCULATION BOX ───
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Taxable Value (Subtotal):', 140, 128);
    doc.text(`₹${subtotal}`, 190, 128, { align: 'right' });

    doc.text('CGST (9%):', 140, 134);
    doc.text(`₹${(Number(gst) / 2).toFixed(2)}`, 190, 134, { align: 'right' });

    doc.text('SGST (9%):', 140, 140);
    doc.text(`₹${(Number(gst) / 2).toFixed(2)}`, 190, 140, { align: 'right' });

    doc.setFillColor(248, 250, 252);
    doc.rect(135, 145, 60, 10, 'F');
    doc.setDrawColor(13, 27, 62);
    doc.setLineWidth(0.4);
    doc.rect(135, 145, 60, 10, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(13, 27, 62);
    doc.text('Total Paid:', 140, 151.5);
    doc.text(`₹${amtNum}.00`, 190, 151.5, { align: 'right' });

    // ─── VERIFICATION FOOTER ───
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('PAYMENT VERIFICATION & TERMS:', 15, 175);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('1. Payment processed securely via Cashfree Payments India Private Limited.', 15, 180);
    doc.text('2. Your live website and digital menu remain active throughout the paid billing period.', 15, 184);
    doc.text('3. For subscription renewals, billing queries, or support: support@linkal.in | WhatsApp: +91 8766882442.', 15, 188);
    doc.text('4. This is a computer-generated tax invoice and requires no physical signature.', 15, 192);

    // Bottom brand bar
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.text('Linkal AI Technologies • Registered SaaS Platform • www.linkal.in', 105, 292, { align: 'center' });

    // Trigger browser download
    doc.save(`Invoice_${invoiceNo}.pdf`);
  } catch (err) {
    console.error('[Receipt PDF Error]', err);
    // Fallback to high-res image download
    downloadReceiptImage(receipt);
  }
}

export function downloadReceiptImage(receipt: ReceiptData) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 760;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const amtStr = String(receipt.amount).replace('₹', '').trim();
  const amtNum = Number(amtStr) || 99;
  const subtotal = (amtNum / 1.18).toFixed(2);
  const gst = (amtNum - Number(subtotal)).toFixed(2);
  const invoiceNo = receipt.invoiceNo || `INV-2026-${receipt.orderId.slice(-5)}`;
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
  ctx.fillText('Official Tax Invoice & Payment Receipt', 36, 74);

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
  ctx.fillText('✓ PAYMENT PAID', canvas.width - 150, 58);

  // Meta details
  ctx.fillStyle = '#475569';
  ctx.font = '13px sans-serif';
  ctx.fillText(`Invoice No: ${invoiceNo}`, 36, 130);
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
  ctx.fillText(receipt.planName || 'Digital Menu Monthly Subscription', 36, 310);
  ctx.fillText(`₹${subtotal}`, canvas.width - 120, 310);

  ctx.fillText('Unlimited WhatsApp Online Ordering', 36, 345);
  ctx.fillText('Included', canvas.width - 120, 345);

  ctx.fillText('Instant Custom Subdomain & Verified SSL', 36, 380);
  ctx.fillText('Included', canvas.width - 120, 380);

  // Divider
  ctx.beginPath();
  ctx.moveTo(36, 415);
  ctx.lineTo(canvas.width - 36, 415);
  ctx.stroke();

  // Calculation
  ctx.fillStyle = '#475569';
  ctx.fillText('Subtotal (Taxable):', canvas.width - 250, 450);
  ctx.fillText(`₹${subtotal}`, canvas.width - 120, 450);

  ctx.fillText('GST (18%):', canvas.width - 250, 480);
  ctx.fillText(`₹${gst}`, canvas.width - 120, 480);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Total Paid:', canvas.width - 250, 525);
  ctx.fillText(`₹${amtNum}.00`, canvas.width - 120, 525);

  // Verification
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.fillText('Payment Verified & Processed by Cashfree Payments India', 36, 640);
  ctx.fillText('Computer-generated tax receipt. Valid for business accounting.', 36, 665);
  ctx.fillText('Linkal SaaS Platform • support@linkal.in • https://linkal.in', 36, 690);

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `Receipt_${invoiceNo}.png`;
  a.click();
}
