import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const cropImageToSquare = async (src) => {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.src = src;
		img.onload = () => {
			const size = Math.min(img.width, img.height); // cuadrado
			const offsetX = (img.width - size) / 2;
			const offsetY = (img.height - size) / 2;

			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;

			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

			const croppedDataUrl = canvas.toDataURL("image/png");
			resolve(croppedDataUrl);
		};
	});
};

const header = async (doc,x,y, albumData) => {
	// Title configuration
	
	doc.line(x, y + 30, 200, y + 30);
	//const logo = await toBase64("/logo.png");
	doc.addImage("/logo.png", "PNG", x + 10, y, 30, 30);
	doc.setFontSize(20);
	doc.setFont("helvetica", "bold");
	doc.text("Album Report", x + 50, y + 10);
	doc.setFont("helvetica", "italic"); // Reset to normal font after
	doc.setFontSize(12);
	doc.text(`${albumData.title}`, x + 50, y + 15);
	doc.setFontSize(8);
	doc.setTextColor(80);
	// Requested the + date (current date DD/MM/YYYY HH:MM:SS)
	const date = new Date();
	const formattedDate = date.toLocaleString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
	doc.text(`Generated the ${formattedDate}`, x + 50, y + 20);
	doc.setTextColor(0,0,0);
	y += 40;
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
}

const footer = (doc, pageCount) => {
	doc.setFontSize(6);
	
	doc.line(10, 285, 200, 285);
	doc.text(pageCount.toString(), 195, 290);
	doc.setFont("helvetica", "italic");
	doc.text("Derm'IA. Tous droits réservés. Ce service a pour but de sensibiliser les utilisateurs à la vigilance dermatologique. Il ne s’agit pas d’un diagnostic médical.", 12, 290, { maxWidth: 190 });
}


export const generatePDF = async (userData, albumData, chartSelector) => {

	const doc = new jsPDF();
	let pageCount = 1;
	let y = 10;
	let x = 10;

	// Header
	header(doc, x, y, albumData);
	y += 40;

	// User metadata
	doc.setFontSize(12);
	doc.setFont("helvetica", "bold");
	doc.text("User", x, y);
	doc.text(":", x + 15, y);
	doc.setFont("helvetica", "normal");
	doc.text(`${userData.userName}`, x + 20, y);
	y += 5;

	doc.setFont("helvetica", "bold");
	doc.text(`Email`, x, y);
	doc.text(":", x + 15, y);
	doc.setFont("helvetica", "normal");
	doc.text(`${userData.email}`, x + 20, y);
	y += 5;

	if (userData.medecinTraitant) {
	doc.setFont("helvetica", "bold");
	doc.text(`Doctor`, x, y);
	doc.text(":", x + 15, y);
	doc.setFont("helvetica", "normal");
	doc.text(`${userData.medecinTraitant}`, x + 20, y);
	y += 5;
	}

	y -= 10;
	x += 80;

	// Album metadata
	doc.setFont("helvetica", "bold");
	doc.text("Album", x, y);
	doc.text(":", x + 30, y);
	doc.setFont("helvetica", "normal");
	doc.text(`${albumData.title}`, x + 35, y);
	y += 5;

	doc.setFont("helvetica", "bold");
	doc.text("Creation Date", x, y);
	doc.text(":", x + 30, y);
	doc.setFont("helvetica", "normal");
	doc.text(`${albumData.creationDate}`, x + 35, y);
	y += 5;

	doc.setFont("helvetica", "bold");
	doc.text("Last Modified", x, y);
	doc.text(":", x + 30, y);
	doc.setFont("helvetica", "normal");
	doc.text(`${albumData.lastModified}`, x + 35, y);
	
	y += 6;

	x -= 80;

	doc.line(x, y, 200, y);
	y += 8;

	const chartElement = document.querySelector(chartSelector);
	let imgHeight = 0;
	if (chartElement) {
		const canvas = await html2canvas(chartElement, {
			useCORS: true,
			allowTaint: false
		});
		const chartDataUrl = canvas.toDataURL("image/png");

		const imgWidth = 190;
		imgHeight = (canvas.height * imgWidth) / canvas.width;
		doc.addImage(chartDataUrl, "PNG", x, y, imgWidth, imgHeight);
	} else {
		doc.text("No chart available", x, y);
	}
	y += imgHeight + 8;
	doc.line(x, y, 200, y);
	y += 10;

	doc.setFontSize(14);
	doc.setFont("helvetica", "bold");

	doc.text("Images", 105, y, { align: "center" });

	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	y += 8;

	let i = 1;
	for (const image of albumData.images) {
		if (y > 240) {
			footer(doc, pageCount);
			doc.addPage();
			pageCount++;
			y = 10;
			header(doc, x, y, albumData);
			y += 35;
			doc.setFontSize(10);
			doc.setFont("helvetica", "normal");
		}

		doc.line(x, y, x + 46.5, y);
		doc.line(x, y, x, y + 56);
		doc.line(x + 46.5, y, x + 46.5, y + 56);
		doc.line(x, y + 56, x + 46.5, y + 56);


		const cropped = await cropImageToSquare(image.image);
		doc.addImage(cropped, "PNG", x + 1, y + 1, 44, 44);
		doc.text(`${image.date}`, x + 2, y + 49.5);
		doc.text(`${image.dangerosite} %`, x + 2, y + 54);

		if (i % 4 === 0) {
			x = 10;
			y += 57.25;
		} else {
			x += 47.75;
		}
		i++;
	}
	footer(doc, pageCount);

	
	// doc save format album_YYYYMMDD_HHMMSS.pdf
	const date = new Date();
	const formattedDate = date.toISOString().replace(/[-:]/g, "").split(".")[0];
	const formattedDateParts = formattedDate.split("T");
	const datePart = formattedDateParts[0];
	const timePart = formattedDateParts[1].replace(/:/g, "");
	const fileName = `album_${datePart}_${timePart}.pdf`;
	doc.save(fileName);
};