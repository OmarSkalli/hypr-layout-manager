import { expect, test } from "vitest";
import { readdir } from "fs/promises";
import { availableLayouts, getLayoutDefinition } from "../layout/registry.js";
import { SEQUENCE_STEPS } from "../layout/restore.js";

test("All layouts are properly registered", async () => {
  // Get all layout definition files from filesystem
  const definitionFiles = await readdir("./layout/definitions");
  const layoutFiles = definitionFiles.filter((file) => file.endsWith(".js"));
  const filesystemLayoutNames = layoutFiles.map((file) =>
    file.replace(".js", "")
  );

  // Get registered layout names
  const registeredLayoutNames = availableLayouts.map((layout) => layout.name);

  // Check that filesystem and registry match
  expect(
    registeredLayoutNames.sort(),
    "Registry should include all layout files from definitions folder"
  ).toEqual(filesystemLayoutNames.sort());

  // Check each available layout is properly registered
  for (const layout of availableLayouts) {
    const definition = getLayoutDefinition(layout.name);

    expect(
      definition,
      `Layout "${layout.name}" should be registered in registry.js`
    ).toBeDefined();
    expect(
      definition.name,
      `Layout "${layout.name}" should have correct name property`
    ).toBe(layout.name);
  }

  // Verify we found some layouts (test would be meaningless with 0 layouts)
  expect(availableLayouts.length).toBeGreaterThan(0);
});

test("All layout definitions have required properties", () => {
  const requiredProperties = ["name", "clientCount", "ascii", "applySequence"];

  for (const definition of availableLayouts) {
    for (const property of requiredProperties) {
      expect(
        definition[property],
        `Layout "${definition.name}" should have "${property}" property`
      ).toBeDefined();
    }

    // Additional type checks
    expect(
      typeof definition.name,
      `Layout "${definition.name}" name should be a string`
    ).toBe("string");

    expect(
      typeof definition.clientCount,
      `Layout "${definition.name}" clientCount should be a number`
    ).toBe("number");

    expect(
      Array.isArray(definition.applySequence),
      `Layout "${definition.name}" applySequence should be an array`
    ).toBe(true);

    // Validate all applySequence actions are valid
    for (const step of definition.applySequence) {
      expect(
        SEQUENCE_STEPS.includes(step.action),
        `Layout "${definition.name}" has invalid action "${
          step.action
        }". Valid actions: ${SEQUENCE_STEPS.join(", ")}`
      ).toBe(true);
    }
  }
});
