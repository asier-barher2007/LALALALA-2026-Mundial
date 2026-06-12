"""TTL in-memory cache for upstream data."""
import asyncio
import time
from typing import Any, Awaitable, Callable, Optional


class TTLCache:
    def __init__(self) -> None:
        self._data: dict[str, tuple[float, Any]] = {}
        self._locks: dict[str, asyncio.Lock] = {}

    def _lock(self, key: str) -> asyncio.Lock:
        if key not in self._locks:
            self._locks[key] = asyncio.Lock()
        return self._locks[key]

    async def get_or_fetch(
        self,
        key: str,
        ttl_seconds: float,
        fetcher: Callable[[], Awaitable[Any]],
        stale_seconds: Optional[float] = None,
    ) -> Any:
        """Return cached value if fresh; otherwise refetch.

        If stale_seconds is provided and the upstream fetch fails,
        a stale-but-acceptable value is returned to keep the UI alive.
        """
        now = time.time()
        cached = self._data.get(key)
        if cached and (now - cached[0]) < ttl_seconds:
            return cached[1]

        async with self._lock(key):
            cached = self._data.get(key)
            now = time.time()
            if cached and (now - cached[0]) < ttl_seconds:
                return cached[1]
            try:
                value = await fetcher()
                self._data[key] = (time.time(), value)
                return value
            except Exception:
                if cached and stale_seconds and (now - cached[0]) < stale_seconds:
                    return cached[1]
                raise

    def invalidate(self, key: str) -> None:
        self._data.pop(key, None)


cache = TTLCache()
