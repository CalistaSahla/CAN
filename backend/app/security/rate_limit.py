from collections import OrderedDict, deque
from threading import Lock
import time


class InMemoryScanRateLimiter:
    """Single-process rolling window. Use an edge or shared store when scaling out."""

    def __init__(self, maximum_clients: int = 2048) -> None:
        self.maximum_clients = maximum_clients
        self._requests: OrderedDict[str, deque[float]] = OrderedDict()
        self._lock = Lock()

    def allow(
        self,
        client_key: str,
        limit: int,
        window_seconds: int,
        now: float | None = None,
    ) -> tuple[bool, int]:
        now = time.monotonic() if now is None else now
        with self._lock:
            requests = self._requests.pop(client_key, deque())
            cutoff = now - window_seconds
            while requests and requests[0] <= cutoff:
                requests.popleft()

            if len(requests) >= limit:
                retry_after = max(1, int(requests[0] + window_seconds - now))
                self._requests[client_key] = requests
                return False, retry_after

            requests.append(now)
            self._requests[client_key] = requests
            while len(self._requests) > self.maximum_clients:
                self._requests.popitem(last=False)
            return True, 0