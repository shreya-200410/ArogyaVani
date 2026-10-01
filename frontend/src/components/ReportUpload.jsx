import React, {
    useRef,
    useState
} from "react";

import {
    FileImage
} from "lucide-react";

import { uploadReport } from "../api";


export default function ReportUpload({
    onExtracted
}) {

    const inputRef = useRef(null);

    const [loading, setLoading] =
        useState(false);


    async function handleFile(
        event
    ) {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        try {

            setLoading(true);

            const result =
                await uploadReport(file);

            onExtracted(
                result.extracted_text,
                file.name
            );

        } catch (error) {

            alert(
                "Could not process the report."
            );

        } finally {

            setLoading(false);
        }
    }


    return (
        <div className="report-upload">

            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFile}
                hidden
            />


            <button
                className="secondary-button"
                onClick={() =>
                    inputRef.current?.click()
                }
                disabled={loading}
            >

                {loading
                    ? "Reading report..."
                    : (
                        <>
                            <FileImage size={18} />
                            Upload Report
                        </>
                    )}

            </button>

        </div>
    );
}
