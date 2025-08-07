# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hyprland layout manager that allows users to save and restore window layouts with specific applications and dimensions. The tool works exclusively with Hyprland's dwindle layout and currently supports single monitor setups.

## Commands

### Development

- `npm run test` - Run tests using Vitest
- `npm run lint` - Lint code with ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier

### Application Usage

- `npm run load-layout` - Load a saved layout (alias for main binary)
- `npm run save-layout` - Save current layout (alias for main binary)

### Binary Commands (after npm install -g)

- `hyprland-load-layout [configuration] [workspaceId]` - Load a saved layout
- `hyprland-save-layout [configurationName]` - Save current layout
- `--version` or `-V` - Show version number (available on both commands)
- `--help` or `-h` - Show help text (available on both commands)
- `--verbose` or `-v` - Enable verbose logging (available on both commands)

## Architecture

### Core Components

**Entry Points:**

- `load-layout.js` - Main CLI entry for loading layouts
- `save-layout.js` - Main CLI entry for saving layouts

**Layout System:**

- `layout/registry.js` - Central registry of all available layout definitions
- `layout/definitions/` - Individual layout definitions (1-full.js, 2-columns.js, etc.)
- `layout/save.js` - Logic for saving current window arrangements
- `layout/restore.js` - Logic for restoring saved layouts
- `layout/detectionHelpers.js` - Automatic layout detection algorithms

**Hyprland Integration:**

- `utils/hyprctl.js` - Wrapper around hyprctl command for all Hyprland interactions
- Executes hyprctl commands with JSON output (`-j` flag)
- Handles workspace switching, window management, and layout detection

**User Interface:**

- `prompts/` - Interactive prompts using @inquirer/prompts
- `prompts/pick-layout.js` - Layout selection interface
- `prompts/assign-clients.js` - Application assignment interface
- `prompts/set-dimensions.js` - Dimension configuration interface

**Utilities:**

- `utils/config.js` - Configuration file management (~/.config/hypr/layouts/)
- `utils/logger.js` - Logging with verbose mode support
- `utils/validations.js` - Input validation functions
- `utils/launcher.js` - Application launching utilities

### Layout System Design

The layout system is built around:

1. **Layout Definitions** - Each layout defines client count, detection rules, and restoration logic
2. **Auto-Detection** - Analyzes current window arrangements to match against known layouts
3. **Configuration Storage** - JSON files in ~/.config/hypr/layouts/ containing app commands and positions
4. **Restoration Process** - Closes existing windows, launches applications, and arranges them according to saved layout

### Key Requirements

- Requires `hyprctl` command in PATH
- Only works with Hyprland's dwindle layout (`general:layout = dwindle`)
- Single monitor setup only
- Applications must be launchable via command line

### Supported Layout Categories

- **1 Client:** Full screen (1-full)
- **2 Clients:** Columns, rows (2-columns, 2-rows)
- **3 Clients:** Columns, rows, main+stack variations (3-columns, 3-rows, 3-main-left-stack, 3-main-right-stack)
- **4 Clients:** Columns, quadrants, main+stack variations (4-columns, 4-quadrants, 4-main-right-stack, 4-main-left-right-stack)
- **5 Clients:** Columns, split arrangements (5-columns, 5-split-main-split)

### Testing Strategy

- Tests located in `test/` directory using Vitest
- Registry tests verify layout definitions and client count validation
- Run individual tests: `npx vitest test/registry.test.js`
