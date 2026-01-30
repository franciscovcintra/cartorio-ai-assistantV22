import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// --- READ (Upload) ---
export const extractTextFromDocx = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target?.result as ArrayBuffer;
                if (!arrayBuffer) {
                    reject('Falha ao ler arquivo');
                    return;
                }

                const result = await mammoth.extractRawText({ arrayBuffer });
                resolve(result.value);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};

// --- WRITE (Download) ---
export const saveAsDocx = async (content: string, filename: string = 'Minuta.docx') => {
    // Simple parser to handle paragraphs and basic structure from Markdown-like text
    const lines = content.split('\n');
    const children: Paragraph[] = [];

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) {
            // Add empty spacing paragraph
            children.push(new Paragraph({ spacing: { after: 200 } }));
            return;
        }

        if (trimmed.startsWith('# ')) {
            children.push(new Paragraph({
                text: trimmed.replace('# ', ''),
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
            }));
        } else if (trimmed.startsWith('## ')) {
            children.push(new Paragraph({
                text: trimmed.replace('## ', ''),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 150 }
            }));
        } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
            // Bold line
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: trimmed.replace(/\*\*/g, ''),
                        bold: true,
                        size: 24 // 12pt
                    })
                ],
                spacing: { after: 120 }
            }));
        } else {
            // Normal text
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: trimmed,
                        size: 24 // 12pt
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 120 }
            }));
        }
    });

    const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};
