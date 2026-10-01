import sys
from pathlib import Path

# Add the backend folder to Python's import path
BACKEND_DIR = Path(__file__).resolve().parents[1]

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


from services.rag import retrieve_context
from services.llm import generate_answer


# --------------------------------------------------
# Test question
# --------------------------------------------------

question = "What are the common symptoms of diabetes?"
language = "English"


print("\n===================================")
print("AROGYAVANI RAG TEST")
print("===================================")

print(f"\nQuestion: {question}")
print(f"Language: {language}")


# --------------------------------------------------
# Retrieve top 3 chunks
# --------------------------------------------------

print("\nRetrieving medical context...")

results = retrieve_context(
    question,
    top_k=3
)


print("\nRetrieved chunks:")

for i, result in enumerate(results, start=1):

    print(
        f"\n{i}. "
        f"{result['section']} "
        f"(score: {result['score']:.4f})"
    )


# --------------------------------------------------
# Combine top 3 chunks
# --------------------------------------------------

context_parts = []

for result in results:

    context_parts.append(
        f"""
Section: {result['section']}
Source: {result['source']}

{result['text']}
"""
    )


context = "\n".join(context_parts)


# --------------------------------------------------
# Generate answer using Groq
# --------------------------------------------------

print("\nGenerating answer with Groq...")

answer = generate_answer(
    question=question,
    context=context,
    language=language
)


# --------------------------------------------------
# Display final answer
# --------------------------------------------------

print("\n===================================")
print("AROGYAVANI ANSWER")
print("===================================")

print(answer)

print("\n===================================")
print("RAG TEST COMPLETE")
print("===================================")