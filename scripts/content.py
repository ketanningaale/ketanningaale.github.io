#!/usr/bin/env python3
"""
content.py — Portfolio content definitions for Ketann Ingaale.
Run this script to regenerate content.json for the website.

Usage:
    python3 scripts/content.py
    python3 scripts/content.py --output content.json
"""

import json
import argparse
from pathlib import Path

# ============================================================
# PERSONAL INFO
# ============================================================

PERSONAL = {
    "name": "Ketann Ingaale",
    "email": "ketanningaale@gmail.com",
    "tagline": "Full-Stack Engineer × AI/ML × Data Science",
    "location": "Southampton, UK",
    "website": "https://ketanningaale.github.io",
    "linkedin": "https://linkedin.com/in/ketanningaale",
    "github": "https://github.com/ketanningaale",
}

# ============================================================
# ABOUT
# ============================================================

ABOUT = {
    "headline": "Building at the intersection of software, data, and human experience.",
    "paragraphs": [
        "I'm a full-stack engineer and AI/ML specialist currently completing my MSc in Computer Science at the University of Southampton. I build software that bridges cutting-edge research and real-world impact.",
        "With experience at companies like Healf, IBM, and Zeta Global, I've shipped products used by thousands of people — from health-tech mobile apps to enterprise ML pipelines to Web3 developer tooling.",
        "I'm particularly interested in the intersection of large language models, systems design, and product engineering.",
    ],
    "stats": [
        {"label": "Years Experience", "value": 3, "suffix": "+"},
        {"label": "Companies", "value": 4, "suffix": ""},
        {"label": "Projects Shipped", "value": 12, "suffix": "+"},
        {"label": "GitHub Contributions", "value": 500, "suffix": "+"},
    ],
}

# ============================================================
# EXPERIENCE
# ============================================================

EXPERIENCE = [
    {
        "company": "Healf",
        "role": "Software Engineer",
        "period": "2024",
        "location": "London, UK",
        "description": "Built core features for a health-tech platform used by thousands of users. Worked across mobile (React Native) and web (Next.js), implemented real-time data synchronisation, and improved app performance by 40%.",
        "tags": ["React Native", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
        "url": "https://healf.com",
    },
    {
        "company": "IBM",
        "role": "Data Science Intern",
        "period": "2023",
        "location": "Remote",
        "description": "Developed machine learning pipelines for enterprise clients using Python and IBM Watson. Built data visualisation dashboards, automated ETL workflows, and presented insights to senior stakeholders.",
        "tags": ["Python", "IBM Watson", "TensorFlow", "SQL", "Tableau"],
        "url": "https://ibm.com",
    },
    {
        "company": "Zeta Global",
        "role": "Software Engineer Intern",
        "period": "2022",
        "location": "New York, USA",
        "description": "Contributed to full-stack development of marketing technology products. Built React components, REST APIs with Node.js, and improved CI/CD pipelines reducing deployment time by 30%.",
        "tags": ["React", "Node.js", "TypeScript", "AWS", "Docker"],
        "url": "https://zetaglobal.com",
    },
    {
        "company": "Solana Foundation",
        "role": "Developer Relations",
        "period": "2022",
        "location": "Remote",
        "description": "Supported the Web3 developer ecosystem on Solana. Created technical tutorials, contributed to open-source SDKs, and engaged with 500+ developers in the community.",
        "tags": ["Solidity", "Rust", "Web3.js", "Anchor", "TypeScript"],
        "url": "https://solana.com",
    },
]

# ============================================================
# PROJECTS
# ============================================================

PROJECTS = [
    {
        "title": "LiDAR Semantic Segmentation",
        "subtitle": "MSc Dissertation",
        "description": "Real-time 3D point cloud processing pipeline using deep learning for semantic segmentation of autonomous driving scenes. Achieved state-of-the-art accuracy on SemanticKITTI benchmark.",
        "tags": ["Python", "PyTorch", "ROS", "LiDAR", "Deep Learning"],
        "url": None,
        "github": None,
        "featured": True,
    },
    {
        "title": "Health Analytics Platform",
        "subtitle": "Full-Stack Project",
        "description": "End-to-end health data platform with personalised insights, streak tracking, and integration with wearable devices. Built with Next.js, Supabase, and an ML recommendation engine.",
        "tags": ["Next.js", "TypeScript", "Supabase", "Python", "ML"],
        "url": None,
        "github": "https://github.com/ketanningaale",
        "featured": True,
    },
    {
        "title": "Solana dApp Boilerplate",
        "subtitle": "Open Source",
        "description": "Production-ready Web3 boilerplate for building decentralised applications on Solana. Includes wallet connection, NFT minting, token swap UI, and Anchor program templates.",
        "tags": ["TypeScript", "React", "Solana", "Anchor", "Web3.js"],
        "url": None,
        "github": "https://github.com/ketanningaale",
        "featured": True,
    },
    {
        "title": "ML Pipeline Orchestrator",
        "subtitle": "Side Project",
        "description": "Lightweight Python framework for building and deploying ML pipelines. Supports DAG-based execution, automatic versioning, and experiment tracking without heavy dependencies.",
        "tags": ["Python", "Docker", "PostgreSQL", "FastAPI"],
        "url": None,
        "github": "https://github.com/ketanningaale",
        "featured": False,
    },
]

# ============================================================
# SKILLS
# ============================================================

SKILLS = {
    "Languages": ["Python", "TypeScript", "JavaScript", "SQL", "Rust", "Solidity"],
    "Frontend": ["React", "Next.js", "React Native", "HTML/CSS", "Tailwind CSS"],
    "Backend": ["Node.js", "FastAPI", "Express", "GraphQL", "REST APIs"],
    "AI/ML": ["PyTorch", "TensorFlow", "scikit-learn", "Hugging Face", "LangChain"],
    "Infrastructure": ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Supabase"],
    "Tools": ["Git", "Figma", "Linear", "Notion", "PostgreSQL", "Redis"],
}

# ============================================================
# EDUCATION
# ============================================================

EDUCATION = [
    {
        "degree": "MSc Computer Science",
        "school": "University of Southampton",
        "period": "2024 – 2025",
        "location": "Southampton, UK",
        "notes": "Dissertation: Real-time LiDAR Semantic Segmentation for Autonomous Vehicles",
        "badge": "Postgraduate",
    },
    {
        "degree": "BSc Computer Science",
        "school": "Undergraduate Studies",
        "period": "2020 – 2023",
        "location": "India",
        "notes": "Focus: Software Engineering, Data Structures, Algorithms",
        "badge": "Undergraduate",
    },
]

# ============================================================
# EXPORT FUNCTION
# ============================================================

def build_content():
    return {
        "personal": PERSONAL,
        "about": ABOUT,
        "experience": EXPERIENCE,
        "projects": PROJECTS,
        "skills": SKILLS,
        "education": EDUCATION,
    }


def main():
    parser = argparse.ArgumentParser(description="Generate portfolio content JSON")
    parser.add_argument(
        "--output",
        default="content.json",
        help="Output JSON file path (default: content.json)"
    )
    args = parser.parse_args()

    content = build_content()
    output_path = Path(args.output)
    output_path.write_text(json.dumps(content, indent=2, ensure_ascii=False))
    print(f"Content written to {output_path} ({output_path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
