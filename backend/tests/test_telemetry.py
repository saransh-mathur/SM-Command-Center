import pytest

@pytest.mark.asyncio
async def test_telemetry_endpoint(client):
    response = await client.get("/api/telemetry")
    assert response.status_code == 200
    data = response.json()
    
    # Contract validation: ensure all required telemetry keys exist and are numeric
    assert "cpu_temp" in data
    assert "cpu_usage_pct" in data
    assert "ram_usage_pct" in data
    assert "ram_used_gb" in data
    assert "ram_total_gb" in data
    assert "fan_rpm" in data
    assert "battery_pct" in data
    assert isinstance(data["cpu_temp"], (int, float))
    assert isinstance(data["ram_usage_pct"], (int, float))

@pytest.mark.asyncio
async def test_telemetry_thermals_endpoint(client):
    response = await client.get("/api/telemetry/thermals")
    assert response.status_code == 200
    data = response.json()
    assert "cpu_temp" in data
    assert "gpu_temp" in data
