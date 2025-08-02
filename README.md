# Hyprland Layout Manager

A simple layout manager for Hyprland that allows you to define and restore window layouts with specific applications and dimensions.

## Requirements

The manager assumes you are using a dwindle layout. It currently only supports single monitor setup.

## Installation

Install globally from GitHub:

```bash
npm install -g https://github.com/OmarSkalli/hypr-layout-manager.git
```

Or clone and install locally:

```bash
git clone https://github.com/OmarSkalli/hypr-layout-manager.git
cd hypr-layout-manager
npm install -g .
```

## Usage

### Save a Layout

```bash
hyprland-save-layout [configurationName]
```

This command will attempt to automatically detect the current layout if it matches one of the supported layouts. If successful, it will save the layout configuration with the current applications and their positions.

If no params are provided, interactive prompts will guide you through the process.

### Load a Layout

```bash
hyprland-load-layout [configuration] [workspaceId]
```

- `configuration`: Name of the configuration file (without .json extension)
- `workspaceId` (optional): Target workspace number (1-10). Defaults to current workspace if not provided.

If no params are provided, interactive prompts will guide you through the selection. Loading a layout will close all applications in the workspace, before re-opening everything.

Example:

```bash
hyprland-load-layout dev
```

Or run interactively:

```bash
hyprland-load-layout
```

## Configuration

Configuration files are stored in `~/.config/hypr/layouts/` and can be edited for editing commands for launching applications.

## Supported Layouts

### 1 Client

```
┌─────────────────┐
│                 │
│        A        │
│                 │
└─────────────────┘
```

- `1-full`: Single window taking full screen

### 2 Clients

```
┌────────┬────────┐    ┌─────────────────┐
│        │        │    │        A        │
│   A    │   B    │    ├─────────────────┤
│        │        │    │        B        │
└────────┴────────┘    └─────────────────┘
```

- `2-columns`: Two equal columns
- `2-rows`: Two equal rows

### 3 Clients

```
┌─────┬─────┬─────┐    ┌───┬─────────────┐    ┌─────────────┬───┐    ┌─────────────────┐
│     │     │     │    │ B │             │    │             │ B │    │        A        │
│  A  │  B  │  C  │    ├───┤      A      │    │      A      ├───┤    ├─────────────────┤
│     │     │     │    │ C │             │    │             │ C │    │        B        │
└─────┴─────┴─────┘    └───┴─────────────┘    └─────────────┴───┘    ├─────────────────┤
                                                                     │        C        │
                                                                     └─────────────────┘
```

- `3-columns`: Three equal columns
- `3-main-left-stack`: Main window on right, stack on left
- `3-main-right-stack`: Main window on left, stack on right
- `3-rows`: Three equal rows

### 4 Clients

```
┌───┬───┬───┬───┐    ┌───┬─────────┬───┐    ┌─────────────┬───┐    ┌────────────┬──────┐
│   │   │   │   │    │   │         │ C │    │             │ B │    │    A       │  B   │
│ A │ B │ C │ D │    │ A │    B    ├───┤    │      A      ├───┤    ├───────┌────┘──────┤
│   │   │   │   │    │   │         │ D │    │             │ C │    │    C  │     D     │
└───┴───┴───┴───┘    └───┴─────────┴───┘    │             ├───┤    └───────┴───────────┘
                                            │             │ D │
                                            └─────────────┴───┘
```

- `4-columns`: Four equal columns
- `4-main-left-right-stack`: Main window in center, stacks on both sides
- `4-main-right-stack`: Main window on left, stack on right
- `4-quadrants`: Four windows in quadrant arrangement

### 5 Clients

```
┌──┬──┬──┬──┬──┐    ┌───┬─────────┬───┐
│  │  │  │  │  │    │ A │         │ D │
│A │B │C │D │E │    ├───┤    C    ├───┤
│  │  │  │  │  │    │ B │         │ E │
└──┴──┴──┴──┴──┘    └───┴─────────┴───┘
```

- `5-columns`: Five equal columns
- `5-split-main-split`: Main window in center with vertical splits on both sides

## Requirements

- Hyprland window manager
- `hyprctl` command available in PATH
