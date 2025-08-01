const LOAD_EXECUTABLE = "hyprland-load-layout";
const SAVE_EXECUTABLE = "hyprland-save-layout";

const LOAD_LAYOUT_HELP_TEXT = `
Usage: ${LOAD_EXECUTABLE} [options]
       ${LOAD_EXECUTABLE} <configuration> [workspaceId] [options]

Arguments (optional):
  configuration    Name of the layout configuration to load
  workspaceId      Target workspace number (1-10). Defaults to current workspace if not provided.

  If not provided, interactive prompts will guide you through the selection.

Options:
  -h, --help       Show this help message
  -v, --verbose    Enable verbose logging

Examples:
  ${LOAD_EXECUTABLE}                    # Interactive mode
  ${LOAD_EXECUTABLE} dev                # Load 'dev' config to current workspace
  ${LOAD_EXECUTABLE} dev 2              # Load 'dev' config to workspace 2
  ${LOAD_EXECUTABLE} dev 2 --verbose    # With detailed logging
`;

const SAVE_LAYOUT_HELP_TEXT = `
Usage: ${SAVE_EXECUTABLE} [options]
       ${SAVE_EXECUTABLE} <name> [options]

Arguments (optional):
  name             Name of the layout configuration.
 
Options:
  -h, --help       Show this help message
  -v, --verbose    Enable verbose logging
  `;

export { LOAD_LAYOUT_HELP_TEXT, LOAD_EXECUTABLE, SAVE_LAYOUT_HELP_TEXT };
