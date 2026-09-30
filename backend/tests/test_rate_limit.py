import unittest

from app.security.rate_limit import InMemoryScanRateLimiter


class ScanRateLimiterTests(unittest.TestCase):
    def test_enforces_rolling_window_and_reports_retry_after(self):
        limiter = InMemoryScanRateLimiter()

        self.assertEqual(limiter.allow("client-a", limit=2, window_seconds=10, now=0), (True, 0))
        self.assertEqual(limiter.allow("client-a", limit=2, window_seconds=10, now=1), (True, 0))
        self.assertEqual(limiter.allow("client-a", limit=2, window_seconds=10, now=2), (False, 8))
        self.assertEqual(limiter.allow("client-a", limit=2, window_seconds=10, now=10), (True, 0))

    def test_bounds_client_state(self):
        limiter = InMemoryScanRateLimiter(maximum_clients=2)

        limiter.allow("client-a", limit=1, window_seconds=60, now=0)
        limiter.allow("client-b", limit=1, window_seconds=60, now=0)
        limiter.allow("client-c", limit=1, window_seconds=60, now=0)

        self.assertEqual(len(limiter._requests), 2)


if __name__ == "__main__":
    unittest.main()