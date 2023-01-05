# IoC Generator

An [Obsidian](https://obsidian.md/) plugin that queries the [ThreatFox Abuse API](https://threatfox.abuse.ch/) and generates appropriate notes for analysis.

## Known Issues

Due to a strict cross-origin set policy, a proxy was needed to be configured to allow this to function. Please run the `ThreatFox-Proxy.py` to start a local web server on your endpoint. This will query the ThreatFox API and allow Obsidian to grab the appropriate JSON documents.