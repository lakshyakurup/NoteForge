#!/usr/bin/env node
/** Writes a sample notes file for local demos */
import { writeFileSync, mkdirSync } from "fs";

mkdirSync("samples", { recursive: true });

const notes = `Photosynthesis is the process by which green plants convert light energy into chemical energy.
Chlorophyll absorbs light mainly in the blue and red wavelengths.
The light-dependent reactions occur in the thylakoid membrane and produce ATP and NADPH.
The Calvin cycle (light-independent) fixes CO2 into glucose in the stroma.
Equation: 6CO2 + 6H2O + light → C6H12O6 + 6O2.
`;

writeFileSync("samples/photosynthesis.txt", notes);
console.log("Wrote samples/photosynthesis.txt");
