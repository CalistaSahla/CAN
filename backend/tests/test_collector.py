import socket
import threading
import unittest
from unittest.mock import patch

from app.analysis.collector import ScanCollectionError, collect_initial_response
from app.security.url_safety import UnsafeUrlError


def public_resolver(host, port, type):
    return [(socket.AF_INET, type, socket.IPPROTO_TCP, "", ("93.184.216.34", port))]


class CollectorTests(unittest.TestCase):
    def serve_once(self, response_bytes):
        client, server = socket.socketpair()

        def respond():
            with server:
                stream = server.makefile("rb")
                while stream.readline().strip():
                    pass
                server.sendall(response_bytes)

        threading.Thread(target=respond, daemon=True).start()
        return client

    def test_pins_connection_to_validated_ip_and_collects_bounded_html_signals(self):
        body = (
            b"<html><a href='/privacy'>Privacy</a>"
            b"<form><input type='email' autocomplete='email'></form>"
            b"<script src='https://cdn.example.net/app.js'></script></html>"
        )
        response = (
            b"HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\n"
            b"X-Content-Type-Options: nosniff\r\nContent-Length: "
            + str(len(body)).encode()
            + b"\r\nConnection: close\r\n\r\n"
            + body
        )
        addresses = []

        def connector(address, timeout):
            addresses.append(address)
            return self.serve_once(response)

        result = collect_initial_response(
            "http://example.com/",
            resolver=public_resolver,
            connector=connector,
        )

        self.assertEqual(addresses, [("93.184.216.34", 80)])
        self.assertEqual(result.status_code, 200)
        self.assertTrue(result.html_signals["privacy_link_visible"])
        self.assertEqual(result.html_signals["data_categories"], ["email address"])
        self.assertEqual(result.html_signals["external_domains"], ["cdn.example.net"])

    def test_redirect_to_private_address_is_blocked_before_second_connection(self):
        redirect = (
            b"HTTP/1.1 302 Found\r\nLocation: http://127.0.0.1/admin\r\n"
            b"Content-Length: 0\r\nConnection: close\r\n\r\n"
        )
        connections = []

        def connector(address, timeout):
            connections.append(address)
            return self.serve_once(redirect)

        with self.assertRaises(UnsafeUrlError):
            collect_initial_response(
                "http://example.com/",
                resolver=public_resolver,
                connector=connector,
            )

        self.assertEqual(len(connections), 1)

    def test_response_size_is_bounded(self):
        body = b"x" * 32
        response = (
            b"HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: 32\r\n\r\n"
            + body
        )

        with self.assertRaises(ScanCollectionError) as error:
            collect_initial_response(
                "http://example.com/",
                max_response_bytes=16,
                resolver=public_resolver,
                connector=lambda address, timeout: self.serve_once(response),
            )

        self.assertEqual(error.exception.code, "response_too_large")


if __name__ == "__main__":
    unittest.main()