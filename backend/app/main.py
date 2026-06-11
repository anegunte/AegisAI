from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Dict, Any, List

from app.engines.resources import calculate_resources
from app.engines.risk import calculate_risk
from app.services.gemini import generate_crisis_briefing
from app.reports.pdf_generator import generate_pdf_report

app = FastAPI(
    title="AegisAI API",
    description="Emergency Disaster Intelligence & Crisis Planning Engine",
    version="1.0.0"
)

# Enable CORS for the local frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PlanRequest(BaseModel):
    disaster_type: str = Field(..., description="Type of disaster (e.g. Flood, Earthquake, Pandemic, Cyclone, Wildfire)")
    location: str = Field(..., description="Geographic location of the event")
    population: int = Field(..., gt=0, description="Affected population size")
    severity: str = Field(..., description="Severity classification (Low, Moderate, High, Critical)")
    budget: float = Field(..., gt=0, description="Total available financial resources in INR")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "AegisAI Crisis Intelligence Core",
        "version": "1.0.0"
    }

@app.get("/api/scenarios")
def get_sample_scenarios():
    return [
        {
            "id": "bangalore-flood",
            "name": "Bangalore Urban Flood",
            "disaster_type": "Flood",
            "location": "Bangalore, India",
            "population": 45000,
            "severity": "High",
            "budget": 1200000,
            "latitude": 12.9716,
            "longitude": 77.5946,
            "description": "Severe monsoon inundation in Tech Corridor and low-lying sectors."
        },
        {
            "id": "chennai-cyclone",
            "name": "Chennai Coastal Cyclone",
            "disaster_type": "Cyclone",
            "location": "Chennai, India",
            "population": 120000,
            "severity": "Critical",
            "budget": 3500000,
            "latitude": 13.0827,
            "longitude": 80.2707,
            "description": "Category 4 storm surge impacting coastline, residential grids and ports."
        },
        {
            "id": "delhi-pandemic",
            "name": "Delhi Influenza Outbreak",
            "disaster_type": "Pandemic",
            "location": "Delhi, India",
            "population": 850000,
            "severity": "Critical",
            "budget": 15000000,
            "latitude": 28.6139,
            "longitude": 77.2090,
            "description": "Rapid viral spread straining urban tertiary care hospital networks."
        },
        {
            "id": "nepal-earthquake",
            "name": "Nepal Seismic Event",
            "disaster_type": "Earthquake",
            "location": "Kathmandu, Nepal",
            "population": 65000,
            "severity": "Critical",
            "budget": 2500000,
            "latitude": 27.7172,
            "longitude": 85.3240,
            "description": "7.2 Magnitude earthquake causing infrastructure collapse in valley regions."
        },
        {
            "id": "california-wildfire",
            "name": "California Wildfire",
            "disaster_type": "Wildfire",
            "location": "California, USA",
            "population": 15000,
            "severity": "High",
            "budget": 5000000,
            "latitude": 37.7749,
            "longitude": -122.4194,
            "description": "Wildland-urban interface fire threatening residential developments."
        }
    ]

@app.post("/api/plan")
def generate_plan(req: PlanRequest):
    try:
        resources = calculate_resources(req.disaster_type, req.population, req.severity, req.budget)
        risk = calculate_risk(req.disaster_type, req.population, req.severity, req.budget)
        briefing = generate_crisis_briefing(req.disaster_type, req.location, req.population, req.severity, req.budget)
        
        return {
            "request": {
                "disaster_type": req.disaster_type,
                "location": req.location,
                "population": req.population,
                "severity": req.severity,
                "budget": req.budget
            },
            "resources": resources,
            "risk": risk,
            "briefing": briefing
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile response plan: {str(e)}"
        )

@app.post("/api/export-pdf")
def export_pdf_report(req: PlanRequest):
    try:
        # Re-calculate parameters for generation
        resources = calculate_resources(req.disaster_type, req.population, req.severity, req.budget)
        risk = calculate_risk(req.disaster_type, req.population, req.severity, req.budget)
        briefing = generate_crisis_briefing(req.disaster_type, req.location, req.population, req.severity, req.budget)
        
        # Build PDF stream
        pdf_buffer = generate_pdf_report(
            req.disaster_type,
            req.location,
            req.population,
            req.severity,
            req.budget,
            risk,
            resources,
            briefing
        )
        
        filename = f"aegis_report_{req.location.lower().replace(' ', '_').replace(',', '')}.pdf"
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile PDF briefing: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
