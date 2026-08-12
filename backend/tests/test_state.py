import pytest

@pytest.mark.asyncio
async def test_get_daily_inputs(client):
    response = await client.get("/api/state/daily-inputs")
    assert response.status_code == 200
    data = response.json()
    assert "applications_sent" in data
    assert "deep_coding_solved" in data
    assert "deep_dev_blocks" in data

@pytest.mark.asyncio
async def test_update_daily_inputs(client):
    payload = {
        "applications_sent": 2,
        "deep_coding_solved": 1,
        "deep_dev_blocks": 2
    }
    response = await client.post("/api/state/daily-inputs", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["applications_sent"] == 2
    assert data["deep_coding_solved"] == 1
    assert data["deep_dev_blocks"] == 2
