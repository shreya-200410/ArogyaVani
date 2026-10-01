import React from "react";

export default function LanguageSelector({
    language,
    setLanguage
}) {

    return (
        <select
            className="language-selector"
            value={language}
            onChange={(event) =>
                setLanguage(event.target.value)
            }
        >

            <option value="en">
                English
            </option>

            <option value="hi">
                हिन्दी
            </option>

            <option value="mr">
                मराठी
            </option>

        </select>
    );
}

