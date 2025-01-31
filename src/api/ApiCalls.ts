import { secret } from "../constants";
import axios from "axios";

//decryption
export const decryption = async (
    fileName: any,
    fileContent: any,
    password: any
) => {
    try {
        const response = await axios.post(`https://v2.convertapi.com/convert/pdf/to/unprotect?Secret=${secret}`, {
            Parameters: [
                {
                    Name: 'File',
                    FileValue: {
                        Name: fileName,
                        Data: fileContent,
                    },
                },
                {
                    "Name": "StoreFile",
                    "Value": true
                },
                {
                    Name: 'FileName',
                    Value: `${fileName}_pdfgo_decryption.pdf`,
                },
                {
                    Name: 'Password',
                    Value: password,
                },
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;

    } catch (error) {
        console.log(error);
        return null;
    }
};

//encryption
export const encryption = async (
    fileName: any,
    fileContent: any,
    password: any
) => {
    try {
        const response = await axios.post(`https://v2.convertapi.com/convert/pdf/to/protect?Secret=${secret}`, {
            Parameters: [
                {
                    Name: 'File',
                    FileValue: {
                        Name: fileName,
                        Data: fileContent,
                    },
                },
                {
                    "Name": "StoreFile",
                    "Value": true
                },
                {
                    Name: 'FileName',
                    Value: `${fileName}_pdfgo_protected.pdf`,
                },
                {
                    Name: 'UserPassword',
                    Value: password,
                },
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;

    } catch (error) {
        console.log(error);
        return null;
    }
};


//excel to pdf
export const exceltopdf = async (
    fileName: any,
    fileContent: any,
) => {
    try {
        const response = await axios.post(`https://v2.convertapi.com/convert/xls/to/pdf?Secret=${secret}`, {
            Parameters: [
                {
                    Name: 'File',
                    FileValue: {
                        Name: fileName,
                        Data: fileContent,
                    },
                },
                {
                    "Name": "StoreFile",
                    "Value": true
                },
                {
                    "Name": "FileName",
                    "Value": `${fileName}_pdfgo_converted.pdf`,
                }
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;

    } catch (error) {
        console.log(error);
        return null;
    }
};

//merge pdfs
export const mergepdf = async (
    filteredFileContents: any [],
) => {
    try {
        console.log(filteredFileContents)
        const response = await axios.post(`https://v2.convertapi.com/convert/pdf/to/merge?Secret=${secret}`, {
            Parameters: [
                {
                    Name: 'Files',
                    FileValues: filteredFileContents,
                },
                {
                    "Name": "StoreFile",
                    "Value": true
                },
                {
                    Name: 'FileName',
                    Value: `merged_pdf.pdf`,
                },
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response;

    } catch (error) {
        console.log(error);
        return null;
    }
};

//compression pdf
export const compresspdf = async (
    fileName: any,
    fileContent: any,
    currentPickerValue: any,
) => {
    try {
        const response = await axios.post(`https://v2.convertapi.com/convert/pdf/to/compress?Secret=${secret}`, {
            Parameters: [
                {
                    Name: 'File',
                    FileValue: {
                        Name: fileName,
                        Data: fileContent,
                    },
                },
                {
                    Name: 'StoreFile',
                    Value: true
                },
                {
                    Name: 'FileName',
                    Value: `${fileName}_pdfgo_compressed.pdf`,
                },
                {
                    Name: 'Presets',
                    Value: currentPickerValue,
                },
                {
                    Name: 'RemoveBookmarks',
                    Value: true
                },
                {
                    Name: 'RemoveAnnotations',
                    Value: true
                },
                {
                    Name: 'RemoveNamedDestinations',
                    Value: true
                },
                {
                    Name: 'SubsetEmbeddedFonts',
                    Value: true
                }
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;

    } catch (error) {
        console.log(error);
        return null;
    }
};

//pdf to image
export const pdftoimage = async (
    fileName: any,
    fileContent: any,
) => {
    try {
        const response = await axios.post(`https://v2.convertapi.com/convert/pdf/to/jpg?Secret=${secret}`, {
            Parameters: [
                {
                    Name: 'File',
                    FileValue: {
                        Name: fileName,
                        Data: fileContent,
                    },
                },
                {
                    Name: "StoreFile",
                    Value: true
                },
                {
                    Name: "FileName",
                    Value: `${fileName}_pdfgo_converted.pdf`
                }
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;

    } catch (error) {
        console.log(error);
        return null;
    }
};

//ppt to pdf
export const ppttopdf = async (
    fileName: any,
    fileContent: any,
) => {
    try {
        const response = await axios.post(`https://v2.convertapi.com/convert/ppt/to/pdf?Secret=${secret}`, {
            Parameters: [
                {
                    Name: 'File',
                    FileValue: {
                        Name: fileName,
                        Data: fileContent,
                    },
                },
                {
                    "Name": "StoreFile",
                    "Value": true
                },
                {
                    "Name": "FileName",
                    "Value": `${fileName}_pdfgo_converted.pdf`,
                }
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;

    } catch (error) {
        console.log(error);
        return null;
    }
};

//split pdf
export const splitpdf = async (
    fileContent: any,
    pageRange: any,
) => {
    try {
        const response = await axios.post(`https://v2.convertapi.com/convert/pdf/to/split?Secret=${secret}`, {
            Parameters: [
                {
                    Name: 'File',
                    FileValue: {
                        Name: 'file.pdf',
                        Data: fileContent,
                    },
                },
                {
                    Name: 'StoreFile',
                    Value: true,
                },
                {
                    Name: 'SplitByCustomRange',
                    Value: pageRange,
                },
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;

    } catch (error) {
        console.log(error);
        return null;
    }
};

//watermark to pdf
export const watermarkpdf = async (
    fileName: any,
    fileContent: any,
    watermarkText: any,
    fontStyle: any,
    fontSize: any,
    fontColor: any,
    strokeColor: any,
    strokeWidth: any,
    opacity: any,
    horizontalAlignment: any,
    verticalAlignment: any,
) => {
    try {
        const response = await axios.post(`https://v2.convertapi.com/convert/pdf/to/watermark?Secret=${secret}`, {
            Parameters: [
                {
                    Name: 'File',
                    FileValue: {
                        Name: fileName,
                        Data: fileContent,
                    },
                },
                {
                    Name: 'StoreFile',
                    Value: true
                },
                {
                    Name: 'FileName',
                    Value: `${fileName}_pdfgo_watermark.pdf`
                },
                {
                    Name: 'Text',
                    Value: watermarkText
                },
                {
                    Name: 'FontName',
                    Value: fontStyle
                },
                {
                    Name: 'FontSize',
                    Value: fontSize
                },
                {
                    Name: 'FontColor',
                    Value: fontColor
                },
                {
                    Name: 'StrokeColor',
                    Value: strokeColor
                },
                {
                    Name: 'StrokeWidth',
                    Value: strokeWidth
                },
                {
                    Name: 'Opacity',
                    Value: opacity
                },
                {
                    Name: 'HorizontalAlignment',
                    Value: horizontalAlignment.toLowerCase()
                },
                {
                    Name: 'VerticalAlignment',
                    Value: verticalAlignment.toLowerCase()
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;

    } catch (error) {
        console.log(error);
        return null;
    }
};

//word to pdf
export const wordtopdf = async (
    fileName: any,
    fileContent: any,
) => {
    try {
        const response = await axios.post(`https://v2.convertapi.com/convert/docx/to/pdf?Secret=${secret}`, {
            Parameters: [
                {
                    Name: 'File',
                    FileValue: {
                        Name: fileName,
                        Data: fileContent,
                    },
                },
                {
                    "Name": "StoreFile",
                    "Value": true
                },
                {
                    "Name": "FileName",
                    "Value": `${fileName}_pdfgo_converted.pdf`
                }
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;

    } catch (error) {
        console.log(error);
        return null;
    }
};