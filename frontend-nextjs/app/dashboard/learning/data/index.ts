import { LearningTrack } from "../data";
import { masterJavascript } from "./master-javascript";
import { masterPython } from "./master-python";
import { masterGo } from "./master-go";
import { algorithmPatterns } from "./algorithm-patterns";
import { dataStructures } from "./data-structures";
import { systemDesign } from "./system-design";
import { sqlDatabases } from "./sql-databases";

export const LEARNING_TRACKS: LearningTrack[] = [
  masterJavascript,
  masterPython,
  masterGo,
];

export const ADDITIONAL_TRACKS: LearningTrack[] = [
  algorithmPatterns,
  dataStructures,
  systemDesign,
  sqlDatabases,
];
