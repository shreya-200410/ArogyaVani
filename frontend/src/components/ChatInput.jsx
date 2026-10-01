import React from "react";

import {
    Mic,
    Send
} from "lucide-react";

export default function ChatInput({
    value,
    setValue,
    onSend,
    onVoice,
    recording,
    disabled
}) {

    function handleKeyDown(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            onSend();
        }
    }


    return (
        <div className="chat-input-area">

            <textarea
                value={value}
                onChange={(event) =>
                    setValue(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask a health question..."
                disabled={disabled}
            />


            <div className="input-actions">

                <button
                    className={
                        recording
                            ? "voice-button recording"
                            : "voice-button"
                    }
                    onClick={onVoice}
                    disabled={disabled}
                    title="Voice input"
                >

                    <Mic size={20} />

                </button>


                <button
                    className="send-button"
                    onClick={onSend}
                    disabled={
                        disabled ||
                        !value.trim()
                    }
                >

                    <Send size={19} />

                </button>

            </div>

        </div>
    );
}