import os
import re
import pymupdf
from typing import List, Dict, Any, Optional

NMIMS_ROOT = "/home/saransh/Downloads/NMIMS"

MODULE_MAPPINGS = {
    "financial_accounting": {
        "id": "financial_accounting",
        "title": "Financial Accounting",
        "code": "RETFINACC1",
        "folder_name": "Financial Accounting",
        "icon": "Calculator",
        "color": "emerald",
        "units": [
            {"num": 1, "title": "Introduction to Financial Accounting"},
            {"num": 2, "title": "Accounting Process & Double-Entry Rules"},
            {"num": 3, "title": "Financial Statements & Core Equations"},
            {"num": 4, "title": "Preparation of Financial Statements & Schedule III"},
            {"num": 5, "title": "Financial Reporting Standards I (GAAP & Ind-AS)"},
            {"num": 6, "title": "Financial Reporting Standards II (Revenue & Leases)"},
            {"num": 7, "title": "Corporate Financial Statements & Share Capital"},
            {"num": 8, "title": "Statement of Cash Flows (AS-3 / Ind-AS 7)"},
            {"num": 9, "title": "Analysis of Financial Statements I (Liquidity & Solvency)"},
            {"num": 10, "title": "Analysis of Financial Statements II (DuPont & Profitability)"},
            {"num": 11, "title": "Ethics in Accounting & Corporate Governance"},
            {"num": 12, "title": "Emerging Trends in Accounting (Forensic & ESG)"}
        ]
    },
    "quantitative_methods": {
        "id": "quantitative_methods",
        "title": "Quantitative Methods - I",
        "code": "RETQUAMET1",
        "folder_name": "Quantative Methods - 1",
        "icon": "TrendingUp",
        "color": "cyan",
        "units": [
            {"num": 1, "title": "Probability & Probability Concepts"},
            {"num": 2, "title": "Discrete Probability Distributions (Binomial & Poisson)"},
            {"num": 3, "title": "Continuous Probability Distribution (Normal Curve & Z-Score)"},
            {"num": 4, "title": "Sampling & Sampling Distributions"},
            {"num": 5, "title": "Central Limit Theorem & Standard Error Estimation"},
            {"num": 6, "title": "Estimation Theory & Confidence Intervals"},
            {"num": 7, "title": "Hypothesis Testing Fundamentals (Z-Test & t-Test)"},
            {"num": 8, "title": "Two-Sample Hypothesis Testing & ANOVA"},
            {"num": 9, "title": "Chi-Square Test & Goodness of Fit"},
            {"num": 10, "title": "Simple Linear Regression & Correlation Analysis"},
            {"num": 11, "title": "Multiple Regression & Model Diagnostic Statistics"},
            {"num": 12, "title": "Time Series Analysis & Forecasting Methods"}
        ]
    },
    "business_communication": {
        "id": "business_communication",
        "title": "Business Communication",
        "code": "RETBUSCOM1",
        "folder_name": "Business Communication",
        "icon": "MessageSquare",
        "color": "violet",
        "units": [
            {"num": 1, "title": "Professional Communication in a Digital, Social, and AI-Enabled World"},
            {"num": 2, "title": "Writing Business Messages"},
            {"num": 3, "title": "Completing Business Messages"},
            {"num": 4, "title": "Digital Media and Hybrid Communication Workflows"},
            {"num": 5, "title": "Social Media and Digital Reputation Management"},
            {"num": 6, "title": "Writing Routine and Positive Messages"},
            {"num": 7, "title": "Writing Negative Messages"},
            {"num": 8, "title": "Writing Persuasive Messages"},
            {"num": 9, "title": "Writing and Completing Reports and Proposals"},
            {"num": 10, "title": "Developing Presentations in Hybrid Environments"},
            {"num": 11, "title": "Building Careers and Developing AI-Ready Resumes"},
            {"num": 12, "title": "Applying and Interviewing in a Digital and AI-Enabled Environment"}
        ]
    },
    "micro_macro_economics": {
        "id": "micro_macro_economics",
        "title": "Micro & Macro Economics",
        "code": "RETMICMAC1",
        "folder_name": "Micro and Macro Economics",
        "icon": "PieChart",
        "color": "amber",
        "units": [
            {"num": 1, "title": "Introduction to Microeconomics, Scarcity & Opportunity Cost"},
            {"num": 2, "title": "Demand, Supply & Market Price Equilibrium"},
            {"num": 3, "title": "Price Elasticity of Demand & Revenue Maximization"},
            {"num": 4, "title": "Consumer Behavior: Cardinal & Ordinal Utility Theory"},
            {"num": 5, "title": "Production Functions, Isoquants & Returns to Scale"},
            {"num": 6, "title": "Cost Curves: Short-Run vs Long-Run Cost Analysis"},
            {"num": 7, "title": "Market Structures: Perfect Competition & Monopoly"},
            {"num": 8, "title": "Monopolistic Competition & Oligopoly Game Theory"},
            {"num": 9, "title": "Macroeconomic Aggregates: National Income (GDP, GNP, NNP)"},
            {"num": 10, "title": "Inflation: CPI, WPI, Demand-Pull vs Cost-Push & Phillips Curve"},
            {"num": 11, "title": "Monetary Policy & Fiscal Policy Interventions"},
            {"num": 12, "title": "Open Economy: Balance of Payments & Exchange Rates"}
        ]
    },
    "marketing_management": {
        "id": "marketing_management",
        "title": "Marketing Management",
        "code": "RETMARMAN1",
        "folder_name": "Marketing Managment",
        "icon": "Target",
        "color": "rose",
        "units": [
            {"num": 1, "title": "Marketing: Creating Customer Value & Engagement"},
            {"num": 2, "title": "Analyzing the Marketing Environment (PESTLE & Micro)"},
            {"num": 3, "title": "Consumer Markets & Buyer Decision Behavior"},
            {"num": 4, "title": "Business Markets & B2B Buying Process"},
            {"num": 5, "title": "Customer Value-Driven Marketing: STP Framework"},
            {"num": 6, "title": "Product, Service & Brand Equity Strategy"},
            {"num": 7, "title": "New Product Development & Product Life Cycle (PLC)"},
            {"num": 8, "title": "Pricing Strategies: Understanding & Capturing Customer Value"},
            {"num": 9, "title": "Pricing Applications, Discounting & Revenue Management"},
            {"num": 10, "title": "Marketing Channels & Omnichannel Supply Distribution"},
            {"num": 11, "title": "Integrated Marketing Communications (IMC) Strategy"},
            {"num": 12, "title": "Direct, Online, Social Media & Digital Performance Marketing"}
        ]
    },
    "organizational_behavior": {
        "id": "organizational_behavior",
        "title": "Organizational Behavior",
        "code": "RETORGBEH1",
        "folder_name": "Organisational Behaviour ",
        "icon": "Users",
        "color": "blue",
        "units": [
            {"num": 1, "title": "Introduction to Organizational Behavior & Disciplines"},
            {"num": 2, "title": "Evolution & Classical / Modern Approaches to OB"},
            {"num": 3, "title": "Opportunities & Challenges in Modern OB"},
            {"num": 4, "title": "Individual Differences, Personality (Big 5) & Values"},
            {"num": 5, "title": "Perception, Attribution Theory & Individual Decision-Making"},
            {"num": 6, "title": "Workplace Motivation Theories (Maslow, Herzberg, Vroom)"},
            {"num": 7, "title": "Applied Motivation: Job Design, Goal Setting & Rewards"},
            {"num": 8, "title": "Group Dynamics, Team Effectiveness & Tuckman's Model"},
            {"num": 9, "title": "Conflict Management & Negotiation in Organizations"},
            {"num": 10, "title": "Workplace Stress Management & Psychological Safety"},
            {"num": 11, "title": "Leadership Theories, Power & Organizational Politics"},
            {"num": 12, "title": "Organizational Culture, Kotter's Change Model & Future of Work"}
        ]
    }
}

class MBAIndexer:
    def __init__(self, root_dir: str = NMIMS_ROOT):
        self.root_dir = root_dir
        self.modules_meta = MODULE_MAPPINGS

    def get_all_modules(self) -> List[Dict[str, Any]]:
        """Returns all 6 modules with scanned PDF counts, total pages, and file metadata."""
        result = []
        for mod_id, meta in self.modules_meta.items():
            folder_path = os.path.join(self.root_dir, meta["folder_name"])
            files_info = []
            total_pages = 0

            if os.path.exists(folder_path):
                for f in sorted(os.listdir(folder_path)):
                    if f.endswith(".pdf"):
                        f_path = os.path.join(folder_path, f)
                        size_mb = round(os.path.getsize(f_path) / (1024 * 1024), 1)
                        try:
                            doc = pymupdf.open(f_path)
                            pages = len(doc)
                            doc.close()
                        except Exception:
                            pages = 0
                        total_pages += pages

                        # Categorize file type based on names
                        f_lower = f.lower()
                        if "model_answer" in f_lower:
                            doc_type = "📝 Model Answer"
                        elif "textbook" in f_lower or "textbooks" in f_lower:
                            doc_type = "📘 Textbook (Primary Notes Source)"
                        elif "teaching material" in f_lower:
                            doc_type = "📑 Teacher's Lecture Slide Deck"
                        else:
                            doc_type = "📘 Textbook" if pages > 350 else "📑 Lecture Slides"

                        files_info.append({
                            "filename": f,
                            "path": f_path,
                            "type": doc_type,
                            "pages": pages,
                            "size_mb": size_mb
                        })

            result.append({
                "id": mod_id,
                "title": meta["title"],
                "code": meta["code"],
                "icon": meta["icon"],
                "color": meta["color"],
                "total_pages": total_pages,
                "files_count": len(files_info),
                "files": files_info,
                "units": meta["units"],
                "progress_pct": 50 if "accounting" in mod_id else 65 if "quant" in mod_id else 35
            })
        return result

    def get_module_text_snippet(self, module_id: str, max_pages: int = 15) -> str:
        """Extracts text snippets from module textbook and slides for Q&A grounding."""
        if module_id not in self.modules_meta:
            return ""
        
        folder_path = os.path.join(self.root_dir, self.modules_meta[module_id]["folder_name"])
        if not os.path.exists(folder_path):
            return ""

        extracted_text = []
        for f in os.listdir(folder_path):
            if f.endswith(".pdf"):
                f_path = os.path.join(folder_path, f)
                try:
                    doc = pymupdf.open(f_path)
                    pages_to_read = min(len(doc), max_pages)
                    for i in range(pages_to_read):
                        t = doc[i].get_text("text").strip()
                        if len(t) > 60:
                            extracted_text.append(f"[{f} - Page {i+1}]:\n{t[:800]}")
                    doc.close()
                except Exception:
                    pass

        return "\n\n".join(extracted_text[:12])

mba_indexer = MBAIndexer()
