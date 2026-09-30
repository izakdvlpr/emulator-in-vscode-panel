// Original file: proto/emulator_controller.proto


export interface GpsState {
  'passiveUpdate'?: (boolean);
  'latitude'?: (number | string);
  'longitude'?: (number | string);
  'speed'?: (number | string);
  'bearing'?: (number | string);
  'altitude'?: (number | string);
  'satellites'?: (number);
}

export interface GpsState__Output {
  'passiveUpdate': (boolean);
  'latitude': (number);
  'longitude': (number);
  'speed': (number);
  'bearing': (number);
  'altitude': (number);
  'satellites': (number);
}
