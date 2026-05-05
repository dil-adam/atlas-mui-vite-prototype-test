#!/bin/sh
# Adds or updates Atlas MCP in Claude Desktop (macOS). Prompts for your API token.
# From Finder: double-click setup-claude-desktop-atlas-mcp.command in the project root (opens Terminal).
# From a shell: sh scripts/setup-claude-desktop-atlas-mcp.sh
# Docs: ../MCP_SETUP.md — Atlas MCP setup for this template
# Success banner uses UTF-8 block characters (terminal should be UTF-8, e.g. macOS default).
# Banner gradient (purple → blue): Semantic.Color.AI.Default Gradient middle → Gradient end (Lens):
#   Core.Color.Purple.50 #ab48da → Core.Color.Indigo.50 #4069fe
#   packages/design-tokens/tokens/lens/semantic.colors.yaml (Semantic.Color.AI.Default)
# Color output:
#   • Default: truecolor CSI 38;2;r;g;b (iTerm, Kitty, WezTerm, most modern terminals).
#   • Apple_Terminal: 256-color cube (CSI 38;5;n) — stock Terminal mis-handles 38;2 (stripes).
#   • Override: ATLAS_MCP_BANNER_256=1 force cube; ATLAS_MCP_BANNER_TRUECOLOR=1 force 38;2 even in Terminal.app.

set -e

CLAUDE_CONFIG="${HOME}/Library/Application Support/Claude/claude_desktop_config.json"
WIKI_URL="https://diligentbrands.atlassian.net/wiki/spaces/ATLAS/pages/5813207384/Using+the+Atlas+MCP+server"

# --- Terminal styling (tput; disabled for pipes, NO_COLOR, or dumb terminals) ---
C_RESET=""
C_BOLD=""
C_DIM=""
C_TITLE=""
C_ACCENT=""
C_LINK=""
C_OK=""
C_WARN=""
C_ERR=""

if [ -z "${NO_COLOR:-}" ] && [ -t 1 ] && command -v tput >/dev/null 2>&1; then
  _tc=0
  _tc=$(tput colors 2>/dev/null) || _tc=0
  if [ "${_tc}" -ge 8 ] 2>/dev/null; then
    C_RESET=$(tput sgr0)
    C_BOLD=$(tput bold)
    C_DIM=$(tput dim 2>/dev/null) || C_DIM=""
    C_TITLE=$(tput setaf 6)
    C_ACCENT=$(tput setaf 4)
    C_LINK=$(tput setaf 5)
    C_OK=$(tput setaf 2)
    C_WARN=$(tput setaf 3)
    C_ERR=$(tput setaf 1)
  fi
fi

hr() {
  printf '%s' "${C_DIM}"
  printf '  '
  i=0
  while [ "$i" -lt 44 ]; do
    printf '─'
    i=$((i + 1))
  done
  printf '%s\n' "${C_RESET}"
}

title() {
  printf '\n'
  hr
  printf '  %s%s%s\n' "${C_BOLD}${C_TITLE}" "$1" "${C_RESET}"
  hr
}

info() {
  printf '  %s%s%s\n' "${C_DIM}" "$1" "${C_RESET}"
}

emph() {
  printf '  %s%s%s\n' "${C_BOLD}" "$1" "${C_RESET}"
}

path_line() {
  printf '  %s%s%s\n' "${C_ACCENT}" "$1" "${C_RESET}"
}

link_line() {
  printf '  %s%s%s\n' "${C_LINK}" "$1" "${C_RESET}"
}

# Truecolor vs 256: see header comment (Apple_Terminal + 38;2 = broken; 38:2:r:g:b = wrong in iTerm → green).
_ai_banner_use_256() {
  if [ -n "${ATLAS_MCP_BANNER_TRUECOLOR:-}" ]; then
    return 1
  fi
  if [ -n "${ATLAS_MCP_BANNER_256:-}" ]; then
    return 0
  fi
  case "${TERM_PROGRAM:-}" in
  Apple_Terminal) return 0 ;;
  esac
  return 1
}

_ai_banner_fg() {
  if [ -n "${NO_COLOR:-}" ]; then
    return 0
  fi
  if ! command -v awk >/dev/null 2>&1; then
    _s="$1"
    case $((_s % 2)) in
      0) printf '\033[95m' ;;
      *) printf '\033[94m' ;;
    esac
    return 0
  fi
  _step="$1"
  _max="$2"
  _use256=1
  if ! _ai_banner_use_256; then
    _use256=0
  fi
  awk -v step="${_step}" -v max="${_max}" -v use256="${_use256}" 'BEGIN {
    # Semantic.Color.AI.Default — Gradient middle / Gradient end (lens)
    r0 = 171; g0 = 72;  b0 = 218
    r1 = 64;  g1 = 105; b1 = 254
    if (max < 1) max = 1
    t = step / max
    if (t < 0) t = 0
    if (t > 1) t = 1
    r = int(r0 + (r1 - r0) * t + 0.5)
    g = int(g0 + (g1 - g0) * t + 0.5)
    b = int(b0 + (b1 - b0) * t + 0.5)
    if ((use256 + 0) == 1) {
      if (r == g && g == b && r >= 8 && r <= 238) {
        gs = int((r - 8) / 10 + 0.5)
        if (gs < 0) gs = 0
        if (gs > 23) gs = 23
        c = 232 + gs
      } else {
        ri = int((r + 25) / 51)
        if (ri < 0) ri = 0
        if (ri > 5) ri = 5
        gi = int((g + 25) / 51)
        if (gi < 0) gi = 0
        if (gi > 5) gi = 5
        bi = int((b + 25) / 51)
        if (bi < 0) bi = 0
        if (bi > 5) bi = 5
        c = 16 + 36 * ri + 6 * gi + bi
      }
      printf "\033[38;5;%dm", c
    } else {
      printf "\033[38;2;%d;%d;%dm", r, g, b
    }
  }'
}

# One line of the ASCII banner: gradient index 0..11, then text.
_banner_grad_line() {
  printf '  %s%s\033[0m\n' "$(_ai_banner_fg "$1" 11)" "$2"
}

# Subheadline: Core.Color.Indigo.50 #4069fe (Semantic.Color.AI.Default Gradient end).
_ai_subhead_fg() {
  if [ -n "${NO_COLOR:-}" ]; then
    printf '%s' "${C_OK}"
    return 0
  fi
  if ! command -v awk >/dev/null 2>&1; then
    printf '\033[94m'
    return 0
  fi
  _use256=1
  if ! _ai_banner_use_256; then
    _use256=0
  fi
  awk -v use256="${_use256}" 'BEGIN {
    r = 64; g = 105; b = 254
    if ((use256 + 0) == 1) {
      ri = int((r + 25) / 51)
      if (ri > 5) ri = 5
      gi = int((g + 25) / 51)
      if (gi > 5) gi = 5
      bi = int((b + 25) / 51)
      if (bi > 5) bi = 5
      c = 16 + 36 * ri + 6 * gi + bi
      printf "\033[38;5;%dm", c
    } else {
      printf "\033[38;2;%d;%d;%dm", r, g, b
    }
  }'
}

# Big colorful banner (UTF-8 box drawing). Shown at the end on success.
success_banner() {
  _detail="${1:-Done}"
  _hint="${2:-Quit and reopen Claude Desktop.}"

  printf '\n'
  printf '  %s%s%s %s%s%s\n' "${C_OK}" "${C_BOLD}" "✓" "${C_RESET}" "${C_DIM}" "${_detail}"
  printf '\n'

  _banner_grad_line 0 "   █████╗ ████████╗██╗      █████╗ ███████╗"
  _banner_grad_line 1 "  ██╔══██╗╚══██╔══╝██║     ██╔══██╗██╔════╝"
  _banner_grad_line 2 "  ███████║   ██║   ██║     ███████║███████╗"
  _banner_grad_line 3 "  ██╔══██║   ██║   ██║     ██╔══██║╚════██║"
  _banner_grad_line 4 "  ██║  ██║   ██║   ███████╗██║  ██║███████║"
  _banner_grad_line 5 "  ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝"
  printf '\n'
  _banner_grad_line 6 "   ███╗   ███╗ ██████╗██████╗ "
  _banner_grad_line 7 "   ████╗ ████║██╔════╝██╔══██╗"
  _banner_grad_line 8 "   ██╔████╔██║██║     ██████╔╝"
  _banner_grad_line 9 "   ██║╚██╔╝██║██║     ██╔═══╝ "
  _banner_grad_line 10 "   ██║ ╚═╝ ██║╚██████╗██║     "
  _banner_grad_line 11 "   ╚═╝     ╚═╝ ╚═════╝╚═╝     "
  printf '\n'
  printf '  %s%s\033[0m\n' "$(_ai_subhead_fg)" "  ─── Successfully configured ───"
  printf '\n'
  printf '  %s%s%s\n' "${C_DIM}" "${_hint}" "${C_RESET}"
  printf '\n'
}

error_box() {
  printf '\n'
  printf '  %s%s%s %s%s%s\n' "${C_ERR}" "${C_BOLD}" "✗" "${C_RESET}" "${C_ERR}" "$1" >&2
  printf '  %s%s%s\n' "${C_DIM}" "$2" "${C_RESET}" >&2
  printf '\n' >&2
}

# --- Welcome ---
title "Atlas MCP for Claude Desktop"

info "This helper configures Claude Desktop to use the Atlas design-system MCP server."
printf '\n'
emph "File to update"
path_line "$CLAUDE_CONFIG"
printf '\n'
info "• If Atlas MCP is already set up here, only your token is updated."
info "• Any other MCP servers in this file are left unchanged."
printf '\n'
emph "Get your API token"
info "Open Confluence (Diligent SSO) and follow the page below:"
link_line "$WIKI_URL"
printf '\n'
printf '  %s%s%s\n' "${C_BOLD}${C_WARN}" "▸ Paste your API token" "${C_RESET}"
printf '  %sCopy it from Confluence, paste below, then press Enter.%s\n' "${C_DIM}" "${C_RESET}"
printf '  %sReal tokens are long and start with %satlas_sk_%s.%s\n' "${C_DIM}" "${C_BOLD}" "${C_RESET}${C_DIM}${C_RESET}"
info "Your input is shown on screen — clear the terminal afterward if others can see it."
printf '\n'
printf '  %s❯%s ' "${C_ACCENT}${C_BOLD}" "${C_RESET}"
read -r ATLAS_MCP_TOKEN

# Trim common paste whitespace
ATLAS_MCP_TOKEN=$(printf '%s' "$ATLAS_MCP_TOKEN" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

# Placeholder PASTE_ATLAS_SK_TOKEN_HERE is 25 characters; real atlas_sk_ tokens are longer.
if [ "${#ATLAS_MCP_TOKEN}" -le 25 ]; then
  error_box "Token too short" "Copy the full secret from Confluence (must be longer than 25 characters, usually starting with atlas_sk_)."
  exit 1
fi

mkdir -p "$(dirname "$CLAUDE_CONFIG")" || exit 1
if [ ! -f "$CLAUDE_CONFIG" ]; then
  printf '%s\n' '{"mcpServers":{}}' > "$CLAUDE_CONFIG" || exit 1
fi

# Already have Atlas MCP URL: refresh Bearer token only.
# Handles both compact (single-line) and pretty-printed (multi-line) JSON.
if grep -q 'https://atlas\.diligent\.com/api/mcp' "$CLAUDE_CONFIG" 2>/dev/null; then
  printf '\r  %s%sUpdating bearer token…%s' "${C_DIM}" "${C_BOLD}" "${C_RESET}"

  # Use awk to handle multi-line JSON properly
  awk -v token="$ATLAS_MCP_TOKEN" '
    /https:\/\/atlas\.diligent\.com\/api\/mcp/ { in_atlas = 1 }
    in_atlas && /"Authorization"[[:space:]]*:[[:space:]]*"Bearer / {
      sub(/"Bearer [^"]*"/, "\"Bearer " token "\"")
      in_atlas = 0
    }
    { print }
  ' "$CLAUDE_CONFIG" > "${CLAUDE_CONFIG}.tmp" || exit 1

  mv "${CLAUDE_CONFIG}.tmp" "$CLAUDE_CONFIG" || exit 1

  if ! grep -Fq "Bearer ${ATLAS_MCP_TOKEN}" "$CLAUDE_CONFIG" 2>/dev/null; then
    printf '\033[2K\r'
    error_box "Could not update automatically" "Unable to find or update the Authorization field. Edit claude_desktop_config.json manually."
    exit 1
  fi
  printf '\033[2K\r'
  success_banner "Bearer token updated" "Quit and reopen Claude Desktop so MCP picks up the change."
  exit 0
fi

if grep -q '"Atlas"' "$CLAUDE_CONFIG" 2>/dev/null; then
  error_box "Conflicting \"Atlas\" entry" "An Atlas server block exists without the expected URL. Fix or remove it in claude_desktop_config.json, then run this script again."
  exit 1
fi

printf '\r  %s%sAdding Atlas MCP…%s' "${C_DIM}" "${C_BOLD}" "${C_RESET}"
ATLAS_JSON=$(printf '"Atlas":{"type":"http","url":"https://atlas.diligent.com/api/mcp","headers":{"Authorization":"Bearer %s"}}' "$ATLAS_MCP_TOKEN")

if grep -qE '"mcpServers"[[:space:]]*:[[:space:]]*\{[[:space:]]*\}' "$CLAUDE_CONFIG"; then
  sed -i '' -E "s#\"mcpServers\"[[:space:]]*:[[:space:]]*\{[[:space:]]*\}#\"mcpServers\": {${ATLAS_JSON}}#" "$CLAUDE_CONFIG" || exit 1
else
  sed -i '' -E "s#\"mcpServers\"[[:space:]]*:[[:space:]]*\{#\"mcpServers\": {${ATLAS_JSON},#" "$CLAUDE_CONFIG" || exit 1
fi

printf '\033[2K\r'
success_banner "Atlas MCP added" "Quit and reopen Claude Desktop so MCP loads."
