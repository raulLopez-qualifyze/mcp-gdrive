import { schema as gdriveSearchSchema, search } from './gdrive_search.js';
import { schema as gdriveReadFileSchema, readFile } from './gdrive_read_file.js';
import { schema as gdriveListSchema, list } from './gdrive_list.js';
import { schema as gsheetsUpdateCellSchema, updateCell } from './gsheets_update_cell.js';
import { schema as gsheetsReadSchema, readSheet } from './gsheets_read.js';
import {
  Tool,
  GDriveSearchInput,
  GDriveReadFileInput,
  GDriveListInput,
  GSheetsUpdateCellInput,
  GSheetsReadInput
} from './types.js';

export const tools: [
  Tool<GDriveSearchInput>,
  Tool<GDriveReadFileInput>,
  Tool<GDriveListInput>,
  Tool<GSheetsUpdateCellInput>,
  Tool<GSheetsReadInput>
] = [
  {
    ...gdriveSearchSchema,
    handler: search,
  },
  {
    ...gdriveReadFileSchema,
    handler: readFile,
  },
  {
    ...gdriveListSchema,
    handler: list,
  },
  {
    ...gsheetsUpdateCellSchema,
    handler: updateCell,
  },
  {
    ...gsheetsReadSchema,
    handler: readSheet,
  }
];