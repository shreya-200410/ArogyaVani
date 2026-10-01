import os

from dotenv import load_dotenv
from pinecone import Pinecone


# Load environment variables
load_dotenv(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        ".env"
    )
)

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

EMBEDDING_MODEL = "multilingual-e5-large"


# Connect to Pinecone
pc = Pinecone(
    api_key=PINECONE_API_KEY
)

index = pc.Index(
    PINECONE_INDEX_NAME
)


def retrieve_context(
    query: str,
    top_k: int = 3
):
    """
    Retrieve the most relevant medical chunks
    from Pinecone.
    """

    # Create query embedding
    embedding_result = pc.inference.embed(
        model=EMBEDDING_MODEL,
        inputs=[query],
        parameters={
            "input_type": "query"
        }
    )

    query_vector = (
        embedding_result.data[0].values
    )

    # Search Pinecone
    results = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True
    )

    retrieved_chunks = []

    for match in results.matches:

        metadata = match.metadata

        retrieved_chunks.append({
            "id": match.id,
            "score": match.score,
            "section": metadata.get(
                "section",
                ""
            ),
            "source": metadata.get(
                "source",
                ""
            ),
            "text": metadata.get(
                "text",
                ""
            )
        })

    return retrieved_chunks