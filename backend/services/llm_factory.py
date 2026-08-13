import logging
from typing import List, Dict, Any, Optional, AsyncIterator
import httpx
from config import settings

logger = logging.getLogger("command_center.services.llm_factory")


class LLMProvider:
    """Base class for LLM providers."""
    
    async def list_models(self) -> List[Dict[str, Any]]:
        raise NotImplementedError
    
    async def generate(self, model: str, prompt: str, system: str = "", temperature: float = 0.7) -> str:
        raise NotImplementedError
        
    async def chat(self, model: str, messages: List[Dict[str, Any]], tools: Optional[List[Dict[str, Any]]] = None, temperature: float = 0.7) -> Dict[str, Any]:
        raise NotImplementedError
    
    async def generate_stream(self, model: str, messages: List[Dict[str, Any]], tools: Optional[List[Dict[str, Any]]] = None, temperature: float = 0.7) -> AsyncIterator[Any]:
        raise NotImplementedError
        yield  # make it a generator
    
    async def embed(self, model: str, text: str) -> List[float]:
        raise NotImplementedError
    
    async def health_check(self) -> bool:
        raise NotImplementedError


class OllamaProvider(LLMProvider):
    """Ollama local LLM provider via HTTP API."""
    
    def __init__(self, base_url: str = None):
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self._client = httpx.AsyncClient(base_url=self.base_url, timeout=120.0)
    
    async def health_check(self) -> bool:
        try:
            resp = await self._client.get("/api/tags", timeout=5.0)
            return resp.status_code == 200
        except Exception as e:
            logger.warning(f"Ollama health check failed: {e}")
            return False
    
    async def list_models(self) -> List[Dict[str, Any]]:
        try:
            resp = await self._client.get("/api/tags")
            resp.raise_for_status()
            data = resp.json()
            models = []
            for m in data.get("models", []):
                models.append({
                    "name": m.get("name", ""),
                    "size": m.get("size", 0),
                    "digest": m.get("digest", "")[:12],
                    "modified_at": m.get("modified_at", ""),
                    "parameter_size": m.get("details", {}).get("parameter_size", "unknown"),
                    "quantization": m.get("details", {}).get("quantization_level", "unknown"),
                    "family": m.get("details", {}).get("family", "unknown"),
                })
            return models
        except httpx.ConnectError:
            logger.error("Cannot connect to Ollama. Is it running?")
            return []
        except Exception as e:
            logger.error(f"Failed to list Ollama models: {e}")
            return []
    
    async def generate(self, model: str, prompt: str, system: str = "", temperature: float = 0.7) -> str:
        payload = {
            "model": model,
            "prompt": prompt,
            "system": system,
            "stream": False,
            "options": {"temperature": temperature}
        }
        try:
            resp = await self._client.post("/api/generate", json=payload)
            resp.raise_for_status()
            return resp.json().get("response", "")
        except httpx.ConnectError:
            raise ConnectionError("Ollama service is not available. Start it with 'ollama serve'.")
        except Exception as e:
            logger.error(f"Ollama generate failed: {e}")
            raise
            
    async def chat(self, model: str, messages: List[Dict[str, Any]], tools: Optional[List[Dict[str, Any]]] = None, temperature: float = 0.7) -> Dict[str, Any]:
        payload = {
            "model": model,
            "messages": messages,
            "stream": False,
            "options": {"temperature": temperature}
        }
        if tools:
            payload["tools"] = tools
            
        try:
            resp = await self._client.post("/api/chat", json=payload, timeout=120.0)
            resp.raise_for_status()
            return resp.json()
        except httpx.ConnectError:
            raise ConnectionError("Ollama service is not available. Start it with 'ollama serve'.")
        except Exception as e:
            logger.error(f"Ollama chat failed: {e}")
            raise
    
    async def generate_stream(self, model: str, messages: List[Dict[str, Any]], tools: Optional[List[Dict[str, Any]]] = None, temperature: float = 0.7) -> AsyncIterator[Any]:
        payload = {
            "model": model,
            "messages": messages,
            "stream": True,
            "options": {"temperature": temperature}
        }
        if tools:
            payload["tools"] = tools
            
        try:
            async with self._client.stream("POST", "/api/chat", json=payload, timeout=180.0) as resp:
                resp.raise_for_status()
                import json
                async for line in resp.aiter_lines():
                    if line.strip():
                        try:
                            chunk = json.loads(line)
                            yield chunk
                            if chunk.get("done", False):
                                return
                        except json.JSONDecodeError:
                            continue
        except httpx.ConnectError:
            yield {"error": "Ollama service is not available. Start it with 'ollama serve'."}
        except Exception as e:
            logger.error(f"Ollama stream failed: {repr(e)}")
            yield {"error": str(e)}
    
    async def embed(self, model: str, text: str) -> List[float]:
        payload = {"model": model, "input": text}
        try:
            resp = await self._client.post("/api/embed", json=payload)
            resp.raise_for_status()
            data = resp.json()
            embeddings = data.get("embeddings", [])
            if embeddings and len(embeddings) > 0:
                return embeddings[0]
            return []
        except httpx.ConnectError:
            raise ConnectionError("Ollama service is not available for embedding.")
        except Exception as e:
            logger.error(f"Ollama embed failed: {e}")
            raise
    
    async def close(self):
        await self._client.aclose()


# --- Singleton Factory ---
_providers: Dict[str, LLMProvider] = {}

def get_llm_provider(provider_name: str = "ollama") -> LLMProvider:
    if provider_name not in _providers:
        if provider_name == "ollama":
            _providers[provider_name] = OllamaProvider()
        else:
            raise ValueError(f"Unsupported LLM provider: {provider_name}")
    return _providers[provider_name]
