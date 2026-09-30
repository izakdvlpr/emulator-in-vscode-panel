import { z } from 'zod';
import manifestJson from '../../../package.json';

const settingSchema = z.object({
  type: z.enum(['string', 'number', 'boolean']),
  default: z.union([z.string(), z.number(), z.boolean()]),
  enum: z.array(z.string()).optional(),
  minimum: z.number().optional(),
  maximum: z.number().optional(),
});

const commandSchema = z.object({
  command: z.string(),
  title: z.string(),
  category: z.string(),
});

const manifestSchema = z.object({
  name: z.string(),
  publisher: z.string(),
  version: z.string(),
  engines: z.object({ vscode: z.string() }),
  contributes: z.object({
    commands: z.array(commandSchema),
    configuration: z.object({ properties: z.record(z.string(), settingSchema) }),
  }),
});

// O manifesto da extensão é a fonte da verdade: chave, tipo, default e título vêm dele.
export const manifest = manifestSchema.parse(manifestJson);

export type SettingKey = keyof typeof manifestJson.contributes.configuration.properties;
export type CommandId = (typeof manifestJson.contributes.commands)[number]['command'];
