# Hyprland Layout Manager

A simple layout manager for Hyprland that allows you to define and restore window layouts with specific applications and dimensions.

## Requirements

The manager assumes you are using a dwindle layout. Also, it currently only supports single monitor setup.

## Installation

Install globally:

```bash
npm install -g .
```

## Usage

```bash
hyprland-load-layout [configuration] [workspaceId]
```

- `configuration`: Name of the configuration file (without .json extension)
- `workspaceId` (optional): Target workspace number (1-10). Defaults to current workspace if not provided.

If no params are provided, interactive prompts will guide you through the selection.

Example:

```bash
hyprland-load-layout dev
```

Or run interactively:

```bash
hyprland-load-layout
```

For development, you can also run directly:

```bash
node load-layout.js dev 2
```

## Configuration

Create configuration files in `~/.config/hypr/layouts/` with the following structure:

```json
{
  "layout": "main-left-stack-right",
  "clients": [
    { "cmd": "code" },
    { "cmd": "alacritty" },
    { "cmd": "alacritty" }
  ],
  "dimensions": [{ "width": 0.75 }, { "height": 0.75 }]
}
```

### Configuration Fields

- `layout`: Name of the layout definition to use
- `clients`: Array of applications to launch
  - `cmd`: Command to execute
  - `webapp`: Web application URL (alternative to cmd)
- `dimensions`: Array of dimension overrides for the layout

## Available Layouts

- `main-left-stack-right`: Main window on left, stack of windows on right
- `2-columns`: Two equal columns

## Requirements

- Hyprland window manager
- `hyprctl` command available in PATH
