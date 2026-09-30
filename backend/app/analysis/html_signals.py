from __future__ import annotations

from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit


class _SignalParser(HTMLParser):
    def __init__(self, page_url: str) -> None:
        super().__init__(convert_charrefs=True)
        self.page_url = page_url
        self.form_count = 0
        self.input_types: list[str] = []
        self.data_categories: set[str] = set()
        self.external_domains: set[str] = set()
        self.contact_link = False
        self.privacy_link = False
        self._anchor_text = ""
        self._anchor_href = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == "form":
            self.form_count += 1
        elif tag == "input":
            input_type = (attributes.get("type") or "text").lower()
            self.input_types.append(input_type)
            self._record_data_category(input_type, (attributes.get("autocomplete") or "").lower())
        elif tag == "textarea":
            self.input_types.append("textarea")
            self._record_data_category("textarea", (attributes.get("autocomplete") or "").lower())
        elif tag == "select":
            self.input_types.append("select")
        elif tag == "a":
            self._anchor_href = attributes.get("href") or ""
            self._anchor_text = ""

        if tag in {"script", "iframe", "img", "link"}:
            attribute_name = "href" if tag == "link" else "src"
            resource = attributes.get(attribute_name)
            if resource:
                self._record_external_domain(resource)

    def handle_data(self, data: str) -> None:
        if self._anchor_href:
            self._anchor_text += f" {data}"

    def handle_endtag(self, tag: str) -> None:
        if tag != "a" or not self._anchor_href:
            return
        descriptor = f"{self._anchor_href} {self._anchor_text}".lower()
        self.contact_link |= any(word in descriptor for word in ("contact", "support", "about"))
        self.privacy_link |= any(word in descriptor for word in ("privacy", "data-protection"))
        self._anchor_href = ""
        self._anchor_text = ""

    def _record_external_domain(self, resource: str) -> None:
        absolute_url = urljoin(self.page_url, resource)
        host = urlsplit(absolute_url).hostname
        if host and host.lower() != (urlsplit(self.page_url).hostname or "").lower():
            self.external_domains.add(host.lower())

    def _record_data_category(self, input_type: str, autocomplete: str) -> None:
        if input_type == "email" or "email" in autocomplete:
            self.data_categories.add("email address")
        if input_type == "password" or "password" in autocomplete:
            self.data_categories.add("password")
        if input_type == "tel" or "tel" in autocomplete:
            self.data_categories.add("phone number")
        if "name" in autocomplete:
            self.data_categories.add("name")
        if any(part in autocomplete for part in ("address", "postal-code", "country")):
            self.data_categories.add("address details")
        if any(part in autocomplete for part in ("cc-", "transaction-currency")):
            self.data_categories.add("payment details")


def inspect_initial_html(page_url: str, html: str) -> dict[str, object]:
    parser = _SignalParser(page_url)
    parser.feed(html)
    parser.close()
    return {
        "form_count": parser.form_count,
        "input_types": parser.input_types[:100],
        "data_categories": sorted(parser.data_categories),
        "external_domains": sorted(parser.external_domains)[:100],
        "contact_link_visible": parser.contact_link,
        "privacy_link_visible": parser.privacy_link,
    }