// Original file: proto/emulator_controller.proto


export interface Translation {
  'deltaX'?: (number | string);
  'deltaY'?: (number | string);
  'deltaZ'?: (number | string);
}

export interface Translation__Output {
  'deltaX': (number);
  'deltaY': (number);
  'deltaZ': (number);
}
