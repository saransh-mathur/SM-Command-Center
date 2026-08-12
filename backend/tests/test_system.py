import pytest

@pytest.mark.asyncio
async def test_clean_dev_mode(client):
    response = await client.post("/api/system/clean-dev")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "freed_ram_mb" in data
    assert isinstance(data["freed_ram_mb"], (int, float))

@pytest.mark.asyncio
async def test_fan_mode_switching(client):
    response = await client.post("/api/system/fan-mode", json={"mode": "Performance"})
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "Performance"
    assert data["status"] in ("success", "updated")

@pytest.mark.asyncio
async def test_agy_status_check(client):
    response = await client.get("/api/system/agy-status")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "agy_dashboard"
    assert data["status"] in ("active", "disabled")
