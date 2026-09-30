// Original file: proto/emulator_controller.proto

export const DisplayModeValue = {
  PHONE: 'PHONE',
  FOLDABLE: 'FOLDABLE',
  TABLET: 'TABLET',
  DESKTOP: 'DESKTOP',
} as const;

export type DisplayModeValue =
  | 'PHONE'
  | 0
  | 'FOLDABLE'
  | 1
  | 'TABLET'
  | 2
  | 'DESKTOP'
  | 3

export type DisplayModeValue__Output = typeof DisplayModeValue[keyof typeof DisplayModeValue]
