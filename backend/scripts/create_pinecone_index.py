import os
import time

from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec


load_dotenv()


API_KEY = os.getenv(
    "PINECONE_API_KEY"
)

INDEX_NAME = os.getenv(
    "PINECONE_INDEX_NAME",
    "multilingual-health-assistant"
)

CLOUD = os.getenv(
    "PINECONE_CLOUD",
    "aws"
)

REGION = os.getenv(
    "PINECONE_REGION",
    "us-east-1"
)


if not API_KEY:

    raise RuntimeError(
        "Add your new PINECONE_API_KEY to .env"
    )


pc = Pinecone(
    api_key=API_KEY
)


existing_indexes = [
    item["name"]
    for item in pc.list_indexes()
]


if INDEX_NAME not in existing_indexes:

    print(
        f"Creating new Pinecone index: {INDEX_NAME}"
    )

    pc.create_index(
        name=INDEX_NAME,
        # Pinecone's multilingual-e5-large model returns 1024-dimensional vectors.
        dimension=1024,
        metric="cosine",
        spec=ServerlessSpec(
            cloud=CLOUD,
            region=REGION
        )
    )

    print("Waiting for index...")

    while not pc.describe_index(
        INDEX_NAME
    ).status["ready"]:

        time.sleep(2)

    print("Index created successfully.")

else:
    index_description = pc.describe_index(INDEX_NAME)

    if index_description.dimension != 1024:
        raise RuntimeError(
            f"Index {INDEX_NAME!r} has dimension "
            f"{index_description.dimension}; multilingual-e5-large "
            "requires 1024. Set PINECONE_INDEX_NAME to a new index name."
        )

    print(
        f"Index already exists with the required dimension: {INDEX_NAME}"
    )
