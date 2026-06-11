import math
from typing import Dict, Any

def calculate_risk(disaster_type: str, population: int, severity: str, budget: float) -> Dict[str, Any]:
    # 1. Population Score (Max 30)
    # Scaled logarithmically
    if population <= 0:
        pop_score = 0
    else:
        pop_score = min(30, int(math.log10(max(10, population)) * 5))
    
    # 2. Severity Score (Max 40)
    sev = severity.lower().strip()
    if sev == "low":
        sev_score = 10
        sev_class = "Low"
    elif sev == "moderate":
        sev_score = 20
        sev_class = "Moderate"
    elif sev == "high":
        sev_score = 30
        sev_class = "High"
    elif sev == "critical":
        sev_score = 40
        sev_class = "Critical"
    else:
        sev_score = 20
        sev_class = "Moderate"

    # 3. Disaster Base Threat Score (Max 20)
    dis = disaster_type.lower().strip()
    if "pandemic" in dis:
        dis_score = 20
    elif "earthquake" in dis:
        dis_score = 20
    elif "cyclone" in dis:
        dis_score = 18
    elif "wildfire" in dis:
        dis_score = 16
    elif "flood" in dis:
        dis_score = 14
    else:
        dis_score = 10

    # 4. Budget Adequacy Offset (Max -15 to +10)
    # High budget per capita reduces risk, low budget increases it
    budget_per_capita = budget / max(1, population)
    if budget_per_capita >= 1000:
        budget_offset = -15
    elif budget_per_capita >= 500:
        budget_offset = -10
    elif budget_per_capita >= 150:
        budget_offset = -5
    elif budget_per_capita < 20:
        budget_offset = 10
    else:
        budget_offset = 0

    # Calculate final score
    score = max(0, min(100, pop_score + sev_score + dis_score + budget_offset))

    # Categorize Risk
    if score <= 30:
        classification = "Low"
        urgency = "Standard Response"
        impact = "Local emergency resources are fully adequate. Minor infrastructure disruption expected."
    elif score <= 60:
        classification = "Moderate"
        urgency = "High Priority"
        impact = "Moderate population displacement and localized power grid failure. Mutual aid assets deployed."
    elif score <= 80:
        classification = "High"
        urgency = "Immediate Deployment"
        impact = "Significant structure damage, widespread power outages, and medical surge capacity challenged."
    else:
        classification = "Critical"
        urgency = "State of Emergency"
        impact = "Catastrophic damage, severe immediate threat to life, food/water infrastructure disabled. International deployment required."

    return {
        "score": score,
        "classification": classification,
        "urgency": urgency,
        "predictedImpact": impact,
        "metrics": {
            "populationScore": pop_score,
            "severityScore": sev_score,
            "disasterScore": dis_score,
            "budgetOffset": budget_offset
        }
    }
