import React from "react";


export default function ChatMessage({
    message
}) {

    const isUser =
        message.role === "user";


    return (
        <div
            className={
                isUser
                    ? "message-row user"
                    : "message-row assistant"
            }
        >

            <div className="message-bubble">

                <div className="message-role">

                    {isUser
                        ? "You"
                        : "ArogyaVani AI"}

                </div>


                <div className="message-content">

                    {message.content}

                </div>


                {!isUser &&
                    message.sources?.length > 0 && (

                    <div className="sources">

                        <strong>
                            Sources
                        </strong>

                        {message.sources.map(
                            (source, index) => (

                            <div
                                key={index}
                                className="source-item"
                            >

                                {source.title}

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

