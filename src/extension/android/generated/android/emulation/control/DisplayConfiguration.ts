// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_DisplayConfiguration_DisplayFlags = {
  DISPLAYFLAGS_UNSPECIFIED: 'DISPLAYFLAGS_UNSPECIFIED',
  VIRTUAL_DISPLAY_FLAG_PUBLIC: 'VIRTUAL_DISPLAY_FLAG_PUBLIC',
  VIRTUAL_DISPLAY_FLAG_PRESENTATION: 'VIRTUAL_DISPLAY_FLAG_PRESENTATION',
  VIRTUAL_DISPLAY_FLAG_SECURE: 'VIRTUAL_DISPLAY_FLAG_SECURE',
  VIRTUAL_DISPLAY_FLAG_OWN_CONTENT_ONLY: 'VIRTUAL_DISPLAY_FLAG_OWN_CONTENT_ONLY',
  VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR: 'VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR',
} as const;

export type _android_emulation_control_DisplayConfiguration_DisplayFlags =
  | 'DISPLAYFLAGS_UNSPECIFIED'
  | 0
  | 'VIRTUAL_DISPLAY_FLAG_PUBLIC'
  | 1
  | 'VIRTUAL_DISPLAY_FLAG_PRESENTATION'
  | 2
  | 'VIRTUAL_DISPLAY_FLAG_SECURE'
  | 4
  | 'VIRTUAL_DISPLAY_FLAG_OWN_CONTENT_ONLY'
  | 8
  | 'VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR'
  | 16

export type _android_emulation_control_DisplayConfiguration_DisplayFlags__Output = typeof _android_emulation_control_DisplayConfiguration_DisplayFlags[keyof typeof _android_emulation_control_DisplayConfiguration_DisplayFlags]

export interface DisplayConfiguration {
  'width'?: (number);
  'height'?: (number);
  'dpi'?: (number);
  'flags'?: (number);
  'display'?: (number);
}

export interface DisplayConfiguration__Output {
  'width': (number);
  'height': (number);
  'dpi': (number);
  'flags': (number);
  'display': (number);
}
