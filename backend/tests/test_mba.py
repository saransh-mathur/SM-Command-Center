import pytest

@pytest.mark.asyncio
async def test_get_mba_modules(client):
    response = await client.get("/api/mba/modules")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 6
    module_ids = [m["id"] for m in data]
    assert "financial_accounting" in module_ids
    assert "quantitative_methods" in module_ids

@pytest.mark.asyncio
async def test_get_mba_module_notes(client):
    response = await client.get("/api/mba/modules/financial_accounting/notes")
    assert response.status_code == 200
    data = response.json()
    assert "module_title" in data
    assert "units" in data
    assert len(data["units"]) > 0
