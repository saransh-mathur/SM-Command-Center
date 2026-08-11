from fastapi import APIRouter
from schemas import ContainerListResponse, ContainerInfo
from services.docker_client import get_docker_containers, toggle_docker_container

router = APIRouter(prefix="/containers", tags=["Docker Containers"])

@router.get("", response_model=ContainerListResponse)
async def list_containers():
    """Lists all active and registered Docker containers."""
    containers = get_docker_containers()
    running_count = sum(1 for c in containers if c['status'] == 'running')
    return ContainerListResponse(
        total=len(containers),
        running=running_count,
        containers=[ContainerInfo(**c) for c in containers]
    )

@router.post("/{name}/toggle")
async def toggle_container(name: str):
    """Starts or stops a specific Docker container."""
    result = toggle_docker_container(name)
    return result
