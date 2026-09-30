import socket
import unittest
from types import SimpleNamespace
from unittest.mock import patch

from app.security.url_safety import (
    UnsafeUrlError,
    _resolve_dns,
    parse_web_url,
    redact_url,
    resolve_public_target,
    validate_public_url,
)


def resolver_for(*addresses):
    def resolve(host, port, type):
        return [
            (socket.AF_INET, type, socket.IPPROTO_TCP, "", (address, port))
            for address in addresses
        ]

    return resolve


class UrlSafetyTests(unittest.TestCase):
    def test_normalizes_public_https_url_and_discards_fragment(self):
        target = parse_web_url("EXAMPLE.com/results?q=1#section")

        self.assertEqual(target.url, "https://example.com/results?q=1")
        self.assertEqual(target.request_target, "/results?q=1")
        self.assertEqual(target.port, 443)

    def test_rejects_non_http_schemes_credentials_and_nonstandard_ports(self):
        for url in (
            "file:///etc/passwd",
            "https://user:secret@example.com/",
            "https://example.com:8443/",
        ):
            with self.subTest(url=url), self.assertRaises(UnsafeUrlError):
                parse_web_url(url)

    def test_rejects_local_and_private_addresses_before_resolution(self):
        for url in (
            "http://localhost/",
            "http://service.internal/",
            "http://127.0.0.1/",
            "http://10.0.0.8/",
            "http://[::1]/",
        ):
            with self.subTest(url=url), self.assertRaises(UnsafeUrlError):
                parse_web_url(url)

    def test_pins_only_public_dns_addresses(self):
        target = validate_public_url(
            "https://example.com/",
            resolver=resolver_for("93.184.216.34"),
        )

        self.assertEqual(target.addresses, ("93.184.216.34",))

    def test_rejects_mixed_public_and_private_dns_answers(self):
        with self.assertRaises(UnsafeUrlError) as error:
            validate_public_url(
                "https://example.com/",
                resolver=resolver_for("93.184.216.34", "10.0.0.8"),
            )

        self.assertEqual(error.exception.code, "blocked_address")

    def test_redacts_query_and_fragment_before_persistence(self):
        safe_url = redact_url("https://example.com/account?token=secret#details")

        self.assertEqual(safe_url, "https://example.com/account")

    def test_dns_queries_have_finite_lifetime_and_keep_public_addresses(self):
        class Answer:
            def __init__(self, addresses):
                self.rrset = addresses or None
                self.addresses = addresses

            def __iter__(self):
                return iter(SimpleNamespace(address=value) for value in self.addresses)

        with patch(
            "app.security.url_safety.dns.resolver.Resolver.resolve",
            side_effect=[Answer(["93.184.216.34"]), Answer([])],
        ) as resolve:
            results = _resolve_dns("example.com", 443)

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0][4][0], "93.184.216.34")
        self.assertEqual(resolve.call_count, 2)
        self.assertTrue(all(call.kwargs["lifetime"] <= 1.5 for call in resolve.call_args_list))


if __name__ == "__main__":
    unittest.main()