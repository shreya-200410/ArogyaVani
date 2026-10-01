import os
from dotenv import load_dotenv
from pinecone import Pinecone

# Load environment variables
load_dotenv(".env")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

# Connect to Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

# User question
query = "What are the common symptoms of diabetes?"

print(f"\nQuestion: {query}")
print("Creating query embedding...")

# Create query embedding
embedding_result = pc.inference.embed(
    model="multilingual-e5-large",
    inputs=[query],
    parameters={
        "input_type": "query"
    }
)

query_vector = embedding_result.data[0].values

# Search Pinecone
results = index.query(
    vector=query_vector,
    top_k=3,
    include_metadata=True
)

print("\n===================================")
print("RETRIEVAL RESULTS")
print("===================================")

for i, match in enumerate(results.matches, start=1):

    metadata = match.metadata
    retrieved_text = metadata.get("text", "")

    # Show only a short preview
    preview = retrieved_text.replace("\n", " ")[:300]

    print(f"\nResult {i}")
    print(f"ID: {match.id}")
    print(f"Score: {match.score:.4f}")
    print(f"Topic: {metadata.get('topic')}")
    print(f"Source: {metadata.get('source')}")
    print(f"Preview: {preview}...")

print("\n===================================")
print("RETRIEVAL TEST COMPLETE")
print("===================================")