import math
from typing import Dict, Any

def get_severity_multiplier(severity: str) -> float:
    severity = severity.lower()
    if severity == "low":
        return 0.25
    elif severity == "moderate":
        return 0.50
    elif severity == "high":
        return 0.75
    elif severity == "critical":
        return 1.00
    return 0.50

def calculate_resources(disaster_type: str, population: int, severity: str, budget: float) -> Dict[str, Any]:
    multiplier = get_severity_multiplier(severity)
    
    # Defaults
    food_kits = 0
    medical_teams = 0
    shelters = 0
    ambulances = 0
    water_supply_liters = 0
    volunteers = 0
    budget_distribution = {}

    disaster = disaster_type.lower().strip()

    if "flood" in disaster:
        food_kits = math.ceil(population * 1.2 * multiplier)
        medical_teams = max(1, round(population / 2500 * multiplier))
        shelters = max(1, round((population * 0.25 * multiplier) / 50))
        ambulances = max(1, round(population / 5000 * multiplier) + 2)
        water_supply_liters = math.ceil(population * 15 * multiplier)
        volunteers = max(5, round(population / 200 * multiplier))
        budget_distribution = {
            "Food & Clean Water": 0.30,
            "Shelter & Logistics": 0.30,
            "Medical Response": 0.20,
            "Rescue Operations": 0.15,
            "Ops & Comms": 0.05
        }
    elif "earthquake" in disaster:
        food_kits = math.ceil(population * 1.0 * multiplier)
        medical_teams = max(2, round(population / 1000 * multiplier))
        shelters = max(1, round((population * 0.40 * multiplier) / 40))
        ambulances = max(2, round(population / 2000 * multiplier) + 4)
        water_supply_liters = math.ceil(population * 20 * multiplier)
        volunteers = max(10, round(population / 100 * multiplier))
        budget_distribution = {
            "Shelter & Infrastructure": 0.35,
            "Medical Response": 0.25,
            "Search & Rescue": 0.20,
            "Food & Clean Water": 0.15,
            "Ops & Comms": 0.05
        }
    elif "pandemic" in disaster:
        food_kits = math.ceil(population * 0.5 * multiplier)
        medical_teams = max(3, round(population / 500 * multiplier))
        shelters = max(1, round((population * 0.05 * multiplier) / 20))  # Isolation centres
        ambulances = max(3, round(population / 1500 * multiplier) + 6)
        water_supply_liters = math.ceil(population * 5 * multiplier)
        volunteers = max(5, round(population / 300 * multiplier))
        budget_distribution = {
            "Medical Support & Testing": 0.50,
            "Isolation Centers": 0.20,
            "Public Awareness & Comms": 0.15,
            "Food Distribution": 0.10,
            "Logistics": 0.05
        }
    elif "cyclone" in disaster:
        food_kits = math.ceil(population * 1.5 * multiplier)
        medical_teams = max(1, round(population / 2000 * multiplier))
        shelters = max(1, round((population * 0.50 * multiplier) / 60))
        ambulances = max(1, round(population / 4000 * multiplier) + 3)
        water_supply_liters = math.ceil(population * 18 * multiplier)
        volunteers = max(8, round(population / 150 * multiplier))
        budget_distribution = {
            "Shelter & Evacuation": 0.35,
            "Food & Clean Water": 0.25,
            "Debris & Reconstruction": 0.20,
            "Medical Care": 0.15,
            "Ops & Comms": 0.05
        }
    elif "wildfire" in disaster:
        food_kits = math.ceil(population * 0.8 * multiplier)
        medical_teams = max(2, round(population / 1500 * multiplier))
        shelters = max(1, round((population * 0.35 * multiplier) / 50))
        ambulances = max(2, round(population / 3000 * multiplier) + 4)
        water_supply_liters = math.ceil(population * 25 * multiplier)
        volunteers = max(10, round(population / 120 * multiplier))
        budget_distribution = {
            "Fire Containment & Rescue": 0.40,
            "Evacuation & Shelters": 0.25,
            "Medical Support": 0.15,
            "Food & Clean Water": 0.15,
            "Ops & Comms": 0.05
        }
    else:  # Generic fallback
        food_kits = math.ceil(population * 1.0 * multiplier)
        medical_teams = max(1, round(population / 2000 * multiplier))
        shelters = max(1, round((population * 0.30 * multiplier) / 50))
        ambulances = max(1, round(population / 4000 * multiplier) + 2)
        water_supply_liters = math.ceil(population * 15 * multiplier)
        volunteers = max(5, round(population / 150 * multiplier))
        budget_distribution = {
            "Immediate Relief": 0.40,
            "Infrastructure & Logistics": 0.30,
            "Medical Care": 0.20,
            "Ops & Comms": 0.10
        }

    # Format budget details
    allocated_budget = {}
    for key, percentage in budget_distribution.items():
        allocated_budget[key] = {
            "percentage": percentage * 100,
            "amount": round(budget * percentage, 2)
        }

    return {
        "foodKits": food_kits,
        "medicalTeams": medical_teams,
        "shelters": shelters,
        "ambulances": ambulances,
        "waterSupplyLiters": water_supply_liters,
        "volunteers": volunteers,
        "budgetDistribution": allocated_budget
    }
