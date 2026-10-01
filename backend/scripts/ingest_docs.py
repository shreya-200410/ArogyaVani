import os
import re
from pathlib import Path

from dotenv import load_dotenv
from pinecone import Pinecone


# ============================================================
# 1. PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

ENV_FILE = PROJECT_ROOT / "backend" / ".env"
DATA_DIR = PROJECT_ROOT / "data" / "medical"

load_dotenv(ENV_FILE)


# ============================================================
# 2. ENVIRONMENT VARIABLES
# ============================================================

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

if not PINECONE_API_KEY:
    raise ValueError(
        "PINECONE_API_KEY is missing from backend/.env"
    )

if not PINECONE_INDEX_NAME:
    raise ValueError(
        "PINECONE_INDEX_NAME is missing from backend/.env"
    )


# ============================================================
# 3. CONNECT TO PINECONE
# ============================================================

print("Connecting to Pinecone...")

pc = Pinecone(
    api_key=PINECONE_API_KEY
)

index = pc.Index(
    PINECONE_INDEX_NAME
)

print(
    f"Connected to index: {PINECONE_INDEX_NAME}"
)


# ============================================================
# 4. GET ALL MEDICAL DOCUMENTS
# ============================================================

medical_files = sorted(
    DATA_DIR.glob("*.txt")
)

if not medical_files:
    raise FileNotFoundError(
        f"No .txt medical documents found in: {DATA_DIR}"
    )

print(
    f"\nFound {len(medical_files)} medical documents."
)

for file in medical_files:
    print(f"  - {file.name}")


# ============================================================
# 5. EXTRACT DOCUMENT METADATA
# ============================================================

def get_metadata(text, filename):
    """
    Extract metadata from the beginning of a medical document.
    """

    # Default title from filename
    default_title = Path(filename).stem.replace(
        "_", " "
    ).replace("-", " ").title()

    metadata = {
        "title": default_title,
        "source": "Unknown",
        "source_date": "",
    }

    for line in text.splitlines():

        line = line.strip()

        if line.startswith("TITLE:"):

            metadata["title"] = line.replace(
                "TITLE:", ""
            ).strip()

        elif line.startswith("SOURCE:"):

            metadata["source"] = line.replace(
                "SOURCE:", ""
            ).strip()

        elif line.startswith("SOURCE_DATE:"):

            metadata["source_date"] = line.replace(
                "SOURCE_DATE:", ""
            ).strip()

    return metadata


# ============================================================
# 6. CREATE TOPIC NAME
# ============================================================

def create_topic(filename, metadata):
    """
    Creates a clean topic identifier for Pinecone.
    """

    title = metadata["title"]

    topic = title.lower()

    topic = re.sub(
        r"[^a-z0-9]+",
        "_",
        topic
    )

    topic = topic.strip("_")

    return topic


# ============================================================
# 7. SECTION-AWARE CHUNKING
# ============================================================

def create_sections(text):
    """
    Splits a medical document according to known headings.
    """

    lines = text.splitlines()

    sections = []

    current_heading = None
    current_content = []

    # Common headings used in medical files
    heading_patterns = [
    # General
    "SUMMARY",
    "KEY FACTS",
    "OVERVIEW",
    "MAIN TYPES",

    # Symptoms / causes / risks
    "COMMON SYMPTOMS",
    "SYMPTOMS",
    "CAUSES",
    "CAUSES AND RISK FACTORS",
    "RISK FACTORS",
    "RISKS AND PROTECTIVE FACTORS",
    "COMMON HEALTH CONSEQUENCES",

    # Diagnosis / treatment
    "DIAGNOSIS",
    "DIAGNOSIS AND CARE",
    "DIAGNOSIS AND TREATMENT",
    "TREATMENT",
    "MENTAL HEALTH CARE AND TREATMENT",

    # Prevention / management
    "PREVENTION",
    "PREVENTION AND MANAGEMENT",
    "MENTAL HEALTH PROMOTION AND PREVENTION",
    "HOW TO PROMOTE HEALTHY DIETS",

    # Diabetes
    "TYPE 1 DIABETES",
    "TYPE 2 DIABETES",
    "GESTATIONAL DIABETES",

    # Healthy diet
    "WHO GUIDANCE ON HEALTHY DIETS",
    "CARBOHYDRATES",
    "SUGARS",
    "FATS",
    "PROTEIN",
    "SALT/SODIUM AND POTASSIUM",
    "VITAMINS AND MINERALS (MICRONUTRIENTS)",
    "FOODS",
    "FOR INFANTS AND YOUNG CHILDREN",
    "WHO RESPONSE",

    # Obesity
    "DEFINITION OF OVERWEIGHT AND OBESITY",
    "ADULTS",
    "CHILDREN",
    "CHILDREN AGED BETWEEN 5–19 YEARS",
    "CHILDREN UNDER 5 YEARS OF AGE",
    "PREVALENCE OF OVERWEIGHT AND OBESITY",
    "FACING A DOUBLE BURDEN OF MALNUTRITION",

    # Safety / additional
    "SAFETY",
    "WHEN TO SEEK HELP",
    "WARNING SIGNS",
]

    for line in lines:

        clean_line = line.strip()

        if not clean_line:
            continue

        heading = (
            clean_line
            .rstrip(":")
            .strip()
            .upper()
        )

        # Detect section heading
        if heading in heading_patterns:

            # Save previous section
            if current_heading and current_content:

                sections.append({
                    "heading": current_heading,
                    "content": "\n".join(
                        current_content
                    ).strip()
                })

            current_heading = heading
            current_content = []

        else:

            # Ignore metadata before first section
            if current_heading:
                current_content.append(
                    clean_line
                )

    # Save final section
    if current_heading and current_content:

        sections.append({
            "heading": current_heading,
            "content": "\n".join(
                current_content
            ).strip()
        })

    return sections


# ============================================================
# 8. CREATE CONTEXTUAL CHUNKS
# ============================================================

def create_contextual_chunks(
    sections,
    metadata
):
    """
    Creates chunks containing:

    1. Original medical information
    2. Document context
    3. Section context
    """

    chunks = []

    for section in sections:

        heading = section["heading"]
        content = section["content"]

        # Dynamic topic description
        topic_description = (
            metadata["title"]
            + " health information"
        )

        context = (
            f"Medical document: "
            f"{metadata['title']}\n"
            f"Source: "
            f"{metadata['source']}\n"
            f"Section: {heading}\n"
            f"Topic: {topic_description}\n"
            f"Context: This section provides "
            f"information about {heading.lower()} "
            f"related to {metadata['title'].lower()}."
        )

        contextual_text = (
            context
            + "\n\n"
            + content
        )

        chunks.append({
            "heading": heading,
            "original_text": content,
            "contextual_text": contextual_text
        })

    return chunks


# ============================================================
# 9. PROCESS ALL DOCUMENTS
# ============================================================

all_records = []

total_sections = 0
total_chunks = 0


for file_path in medical_files:

    print("\n")
    print("===================================")
    print(
        f"PROCESSING: {file_path.name}"
    )
    print("===================================")

    # --------------------------------------------------------
    # Read document
    # --------------------------------------------------------

    document = file_path.read_text(
        encoding="utf-8"
    ).strip()

    print(
        f"Characters: {len(document)}"
    )

    # --------------------------------------------------------
    # Metadata
    # --------------------------------------------------------

    doc_metadata = get_metadata(
        document,
        file_path.name
    )

    topic = create_topic(
        file_path.name,
        doc_metadata
    )

    print("\nDocument information:")
    print(
        f"Title: {doc_metadata['title']}"
    )
    print(
        f"Source: {doc_metadata['source']}"
    )
    print(
        f"Source date: "
        f"{doc_metadata['source_date']}"
    )
    print(
        f"Topic: {topic}"
    )

    # --------------------------------------------------------
    # Create sections
    # --------------------------------------------------------

    sections = create_sections(
        document
    )

    print(
        f"\nCreated {len(sections)} sections."
    )

    for i, section in enumerate(sections):

        print(
            f"  {i}: "
            f"{section['heading']}"
        )

    # --------------------------------------------------------
    # Create contextual chunks
    # --------------------------------------------------------

    chunks = create_contextual_chunks(
        sections,
        doc_metadata
    )

    print(
        f"\nCreated {len(chunks)} "
        f"contextual chunks."
    )

    # --------------------------------------------------------
    # Remove old vectors for this topic
    # --------------------------------------------------------

    print(
        f"\nRemoving old vectors "
        f"for topic: {topic}"
    )

    try:

        index.delete(
            filter={
                "topic": topic
            }
        )

        print(
            "Old vectors removed."
        )

    except Exception as e:

        print(
            f"Warning while deleting "
            f"old vectors: {e}"
        )

    # --------------------------------------------------------
    # Create embeddings
    # --------------------------------------------------------

    if not chunks:

        print(
            "\nWARNING: No sections detected."
        )

        print(
            "Skipping this document."
        )

        continue

    print(
        "\nCreating embeddings using "
        "multilingual-e5-large..."
    )

    embedding_result = pc.inference.embed(
        model="multilingual-e5-large",
        inputs=[
            chunk["contextual_text"]
            for chunk in chunks
        ],
        parameters={
            "input_type": "passage"
        }
    )

    print(
        f"Created "
        f"{len(embedding_result.data)} embeddings."
    )

    # --------------------------------------------------------
    # Create Pinecone records
    # --------------------------------------------------------

    records = []

    for i, embedding in enumerate(
        embedding_result.data
    ):

        chunk = chunks[i]

        record = {
            "id": f"{topic}-{i}",

            "values": embedding.values,

            "metadata": {
                "topic": topic,
                "title": doc_metadata["title"],
                "source": doc_metadata["source"],
                "source_date": (
                    doc_metadata["source_date"]
                ),
                "language": "English",
                "section": chunk["heading"],
                "file": file_path.name,

                # Original clean medical text
                "text": chunk["original_text"],

                # Contextual embedding text
                "contextual_text": (
                    chunk["contextual_text"]
                ),
            }
        }

        records.append(record)

    all_records.extend(records)

    total_sections += len(sections)
    total_chunks += len(chunks)

    print(
        f"Prepared {len(records)} "
        f"Pinecone records."


    )


# ============================================================
# 10. UPLOAD ALL RECORDS
# ============================================================

if not all_records:

    raise RuntimeError(
        "No records were created. "
        "Check your medical .txt files "
        "and section headings."
    )


print("\n")
print("===================================")
print("UPLOADING TO PINECONE")
print("===================================")

print(
    f"Total records: {len(all_records)}"
)

# Upload in batches
batch_size = 50

for start in range(
    0,
    len(all_records),
    batch_size
):

    batch = all_records[
        start:start + batch_size
    ]

    index.upsert(
        vectors=batch
    )

    print(
        f"Uploaded records "
        f"{start + 1} - "
        f"{start + len(batch)}"
    )


# ============================================================
# 11. FINAL SUCCESS MESSAGE
# ============================================================

print("\n")
print("===================================")
print("MULTI-DOCUMENT INGESTION SUCCESSFUL")
print("===================================")

print(
    f"Documents processed: "
    f"{len(medical_files)}"
)

print(
    f"Total sections: "
    f"{total_sections}"
)

print(
    f"Total vectors uploaded: "
    f"{len(all_records)}"
)

print(
    "Embedding model: "
    "multilingual-e5-large"
)

print(
    f"Pinecone index: "
    f"{PINECONE_INDEX_NAME}"
)

print("===================================")