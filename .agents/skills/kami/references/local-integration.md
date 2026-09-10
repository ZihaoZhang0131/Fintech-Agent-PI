# Local integration boundary

- Upstream: `tw93/Kami`
- Version: `v1.15.0`
- Commit: `4dab24cc4c527dbb35aa8fae09e02822992dfbe2`
- License: MIT; see `../LICENSE`.
- The original upstream workflow is preserved in `upstream-workflow.md`.
- This app exposes Kami only through `render_kami_artifact`. Upstream scripts and MCP code are vendored for reproducibility and review, not as Agent-executable capabilities.
- TsangerJinKai02 is not bundled or downloaded because its license is separate. The local renderer uses system/open-source serif fallbacks.

